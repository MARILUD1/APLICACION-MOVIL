// routes/reciclaje.js
const express = require('express');
const router = express.Router();
const { Reciclaje, User } = require('../models/index');
const cacheService = require('../Utils/cache');
const { sendEmailJob } = require('../queues');

// ============================================
// 📊 TABLA DE PUNTOS Y CO2 POR MATERIAL
// ============================================
const MATERIALES_CONFIG = {
  'botella_pet': { puntosPorKg: 10, co2PorKg: 0.02, descripcion: 'Botellas PET' },
  'lata_aluminio': { puntosPorKg: 15, co2PorKg: 0.03, descripcion: 'Latas de Aluminio' },
  'carton': { puntosPorKg: 5, co2PorKg: 0.01, descripcion: 'Cartón' },
  'papel': { puntosPorKg: 3, co2PorKg: 0.005, descripcion: 'Papel' },
  'plastico': { puntosPorKg: 8, co2PorKg: 0.015, descripcion: 'Plástico' },
  'vidrio': { puntosPorKg: 12, co2PorKg: 0.02, descripcion: 'Vidrio' },
  'hierro': { puntosPorKg: 20, co2PorKg: 0.05, descripcion: 'Hierro/Metal' },
  'electronico': { puntosPorKg: 50, co2PorKg: 0.1, descripcion: 'Residuos Electrónicos' },
  'organico': { puntosPorKg: 2, co2PorKg: 0.001, descripcion: 'Residuos Orgánicos' }
};

// ============================================
// ♻️ REGISTRAR RECICLAJE CON PESO - CON EMAIL QUEUE
// ============================================
router.post('/registrar', async (req, res) => {
  try {
    const { userId, materiales, ubicacion } = req.body;

    if (!materiales || materiales.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un material' });
    }

    let pesoTotal = 0;
    let puntosTotales = 0;
    let co2Total = 0;
    const materialesProcesados = [];

    for (const material of materiales) {
      const { tipo, cantidad, unidad } = material;
      const config = MATERIALES_CONFIG[tipo.toLowerCase()];
      
      if (!config) {
        return res.status(400).json({ 
          error: `Material no reconocido: ${tipo}`,
          materialesDisponibles: Object.keys(MATERIALES_CONFIG)
        });
      }

      let pesoKg = cantidad;
      if (unidad === 'g' || unidad === 'gramos') pesoKg = cantidad / 1000;
      else if (unidad === 'lb' || unidad === 'libras') pesoKg = cantidad * 0.453592;

      const puntosMaterial = config.puntosPorKg * pesoKg;
      const co2Material = config.co2PorKg * pesoKg;

      pesoTotal += pesoKg;
      puntosTotales += puntosMaterial;
      co2Total += co2Material;

      materialesProcesados.push({
        tipo, descripcion: config.descripcion, cantidad, unidad,
        pesoKg: parseFloat(pesoKg.toFixed(3)), puntos: Math.round(puntosMaterial)
      });
    }

    const reciclaje = await Reciclaje.create({
      userId, materiales: materialesProcesados,
      pesoTotal: parseFloat(pesoTotal.toFixed(3)),
      puntosTotales: Math.round(puntosTotales),
      co2Ahorrado: parseFloat(co2Total.toFixed(4)),
      lat: ubicacion?.lat || null, lon: ubicacion?.lon || null
    });

    const user = await User.findByPk(userId);
    if (user) {
      user.puntos += Math.round(puntosTotales);
      user.reciclajesTotales += 1;
      user.co2Reducido += parseFloat(co2Total.toFixed(4));
      await user.save();
    }

    // Encolar email de confirmación (async - no bloquea)
    try {
      await sendEmailJob({
        type: 'confirmacion_reciclaje',
        email: 'usuario@example.com',
        subject: '♻️ ¡Reciclaje Registrado Exitosamente!',
        reciclajeId: reciclaje.id,
        puntosGanados: Math.round(puntosTotales),
        co2Ahorrado: parseFloat(co2Total.toFixed(4)),
      });
      console.log('📧 Email de confirmación encolado');
    } catch (error) {
      console.error('⚠️ Error encolando email (no crítico):', error.message);
    }

    res.json({
      success: true,
      message: '♻️ ¡Reciclaje registrado exitosamente!',
      reciclaje: {
        id: reciclaje.id, fecha: reciclaje.fecha, materiales: materialesProcesados,
        pesoTotal: `${reciclaje.pesoTotal} kg`,
        puntosGanados: Math.round(puntosTotales),
        co2Ahorrado: `${parseFloat(co2Total.toFixed(4))} kg`
      },
      usuario: user ? {
        puntosTotales: user.puntos,
        reciclajesTotales: user.reciclajesTotales,
        co2Reducido: `${user.co2Reducido} kg`
      } : null
    });

  } catch (error) {
    console.error('❌ Error registrando reciclaje:', error);
    res.status(500).json({ error: 'Error al registrar reciclaje', message: error.message });
  }
});

// ============================================
// 📜 HISTORIAL DE RECICLAJES CON PAGINACIÓN ✅
// ============================================
router.get('/historial/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // ← ← ← PARÁMETROS DE PAGINACIÓN
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // ← ← ← INCLUSIÓN CONDICIONAL (lazy-loading)
    const includeMateriales = req.query.include === 'materiales';

    const findOptions = {
      where: { userId },
      order: [['fecha', 'DESC']],
      limit: limit,
      offset: offset,
      attributes: includeMateriales ? undefined : ['id', 'fecha', 'pesoTotal', 'puntosTotales', 'co2Ahorrado']
    };

    const reciclajes = await Reciclaje.findAll(findOptions);
    const totalReciclajes = await Reciclaje.count({ where: { userId } });
    const totalPages = Math.ceil(totalReciclajes / limit);

    const respuesta = {
      success: true,
      paginacion: {
        paginaActual: page,
        limitePorPagina: limit,
        totalRegistros: totalReciclajes,
        totalPaginas: totalPages,
        tienePaginaSiguiente: page < totalPages,
        tienePaginaAnterior: page > 1
      },
      count: reciclajes.length,
      reciclajes: reciclajes.map(r => ({
        id: r.id,
        fecha: r.fecha,
        pesoTotal: r.pesoTotal,
        puntosTotales: r.puntosTotales,
        co2Ahorrado: r.co2Ahorrado,
        ...(includeMateriales && { materiales: r.materiales })
      }))
    };

    // Metadata de payload size
    const payloadSize = Buffer.byteLength(JSON.stringify(respuesta), 'utf8');
    respuesta._meta = {
      payloadSize: `${(payloadSize / 1024).toFixed(2)} KB`,
      lazyLoading: { materialesIncluidos: includeMateriales },
      timestamp: new Date().toISOString()
    };

    res.json(respuesta);

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error al obtener historial', message: error.message });
  }
});

// ============================================
// 📦 MATERIALES DETALLADOS DE UN RECICLAJE (Lazy-loading) ✅
// ============================================
router.get('/:id/materiales', async (req, res) => {
  try {
    const { id } = req.params;
    
    const reciclaje = await Reciclaje.findByPk(id);
    
    if (!reciclaje) {
      return res.status(404).json({ error: 'Reciclaje no encontrado' });
    }

    const respuesta = {
      success: true,
      reciclajeId: id,
      materiales: reciclaje.materiales,
      totalMateriales: reciclaje.materiales?.length || 0
    };

    const payloadSize = Buffer.byteLength(JSON.stringify(respuesta), 'utf8');
    respuesta._meta = {
      payloadSize: `${(payloadSize / 1024).toFixed(2)} KB`,
      timestamp: new Date().toISOString()
    };

    res.json(respuesta);

  } catch (error) {
    console.error('Error obteniendo materiales:', error);
    res.status(500).json({ error: 'Error al obtener materiales', message: error.message });
  }
});

// ============================================
// 📊 ESTADÍSTICAS CON DATALOADER
// ============================================
router.get('/estadisticas/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reciclajes = await req.loaders.reciclajeLoader.load(parseInt(userId));

    const materialesCount = {};
    let pesoTotalPorMaterial = {};

    reciclajes.forEach(r => {
      r.materiales.forEach(m => {
        if (!materialesCount[m.tipo]) {
          materialesCount[m.tipo] = 0;
          pesoTotalPorMaterial[m.tipo] = 0;
        }
        materialesCount[m.tipo] += 1;
        pesoTotalPorMaterial[m.tipo] += m.pesoKg;
      });
    });

    const user = await User.findByPk(userId);

    res.json({
      success: true,
      estadisticas: {
        usuario: user ? {
          nombre: user.nombre, puntos: user.puntos,
          reciclajesTotales: user.reciclajesTotales,
          co2Reducido: user.co2Reducido
        } : null,
        totalReciclajes: reciclajes.length,
        pesoTotalReciclado: `${parseFloat(reciclajes.reduce((sum, r) => sum + r.pesoTotal, 0).toFixed(2))} kg`,
        materialesMasReciclados: materialesCount,
        pesoPorMaterial: Object.fromEntries(
          Object.entries(pesoTotalPorMaterial).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
        )
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas', message: error.message });
  }
});

// ============================================
// 📊 ESTADÍSTICAS DETALLADAS CON LAZY-LOADING ✅
// ============================================
router.get('/usuario/:userId/estadisticas-detalladas', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // ← ← ← INCLUSIÓN CONDICIONAL DE DATOS PESADOS
    const includeHistorial = req.query.include === 'historial';
    const includeMateriales = req.query.include === 'materiales';

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const estadisticas = {
      usuario: {
        nombre: user.nombre,
        email: user.email,
        puntos: user.puntos,
        reciclajesTotales: user.reciclajesTotales,
        co2Reducido: user.co2Reducido
      },
      resumen: {
        puntos: user.puntos,
        reciclajes: user.reciclajesTotales,
        co2Ahorrado: user.co2Reducido
      }
    };

    // ← ← ← DATOS PESADOS SOLO SI SE SOLICITAN
    if (includeHistorial || includeMateriales) {
      const reciclajes = await Reciclaje.findAll({
        where: { userId },
        order: [['fecha', 'DESC']],
        limit: includeHistorial ? 50 : 0
      });

      if (includeHistorial) {
        estadisticas.historial = reciclajes.map(r => ({
          id: r.id,
          fecha: r.fecha,
          pesoTotal: r.pesoTotal,
          puntosTotales: r.puntosTotales,
          ...(includeMateriales && { materiales: r.materiales })
        }));
      }

      if (includeMateriales) {
        const materialesCount = {};
        reciclajes.forEach(r => {
          r.materiales?.forEach(m => {
            materialesCount[m.tipo] = (materialesCount[m.tipo] || 0) + 1;
          });
        });
        estadisticas.materialesMasReciclados = materialesCount;
      }
    }

    const respuesta = {
      success: true,
      lazyLoading: {
        includeHistorial,
        includeMateriales
      },
      estadisticas
    };

    const payloadSize = Buffer.byteLength(JSON.stringify(respuesta), 'utf8');
    respuesta._meta = {
      payloadSize: `${(payloadSize / 1024).toFixed(2)} KB`,
      timestamp: new Date().toISOString()
    };

    res.json(respuesta);

  } catch (error) {
    console.error('Error obteniendo estadísticas detalladas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas detalladas', message: error.message });
  }
});

// ============================================
// 📋 MATERIALES CON CACHÉ
// ============================================
router.get('/materiales', async (req, res) => {
  const cacheKey = 'materiales_list';
  
  try {
    const cachedMaterials = cacheService.get(cacheKey);
    
    if (cachedMaterials) {
      console.log('💾 Materiales servidos desde CACHÉ ⚡');
      return res.json({
        success: true, source: 'cache',
        timestamp: new Date().toISOString(),
        materiales: cachedMaterials
      });
    }

    console.log('🗄️  Materiales consultados desde CONFIGURACIÓN');
    
    const materialesLista = Object.entries(MATERIALES_CONFIG).map(([key, value]) => ({
      tipo: key, descripcion: value.descripcion,
      puntosPorKg: value.puntosPorKg, co2PorKg: value.co2PorKg
    }));

    cacheService.set(cacheKey, materialesLista, 300);
    console.log('💾 Materiales guardados en caché (TTL: 300s)');

    res.json({
      success: true, source: 'database',
      timestamp: new Date().toISOString(),
      count: materialesLista.length,
      materiales: materialesLista
    });
  } catch (error) {
    console.error('❌ Error al obtener materiales:', error);
    res.status(500).json({ success: false, error: 'Error al obtener materiales', message: error.message });
  }
});

module.exports = router;