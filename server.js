
// server.js
// 🚀 CleanHeroes Backend - API REST con Express + MariaDB

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ← ← ← IMPORTS DE SERVICIOS (solo una vez cada uno)
const cacheService = require('./Utils/cache'); // ← minúscula 'utils'
const { createLoaders } = require('./loaders'); // ← DataLoader

// 📦 Importar rutas
const airQualityRoutes = require('./routes/airQuality');
const reciclajeRoutes = require('./routes/reciclaje');

// ============================================
// 🚀 CONFIGURACIÓN EXPRESS
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Middleware de seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:8100", "https://api.openweathermap.org"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// 🌐 CORS
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:8100',
  'http://localhost:8101',
  'capacitor://localhost',
  'ionic://localhost',
  'http://192.168.1.*',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(orig => {
      if (orig.includes('*')) {
        const regex = new RegExp(orig.replace(/\*/g, '.*'));
        return regex.test(origin);
      }
      return origin === orig;
    })) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 📊 Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🛡️ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ← ← ← MIDDLEWARE PARA INYECTAR DATALOADER (una sola vez)
app.use((req, res, next) => {
  req.loaders = createLoaders();
  next();
});

// ============================================
// 🛣️ RUTAS DE LA API
// ============================================
app.use('/api/calidad-aire', airQualityRoutes);
app.use('/api/reciclaje', reciclajeRoutes);

// ============================================
// 🏥 HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CleanHeroes Backend',
    version: '1.0.0',
    database: 'MariaDB',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// 🏠 Ruta Raíz
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: '🌍♻️ Bienvenido a CleanHeroes API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      calidadAire: 'GET /api/calidad-aire?ciudad=Yantzaza',
      materiales: 'GET /api/reciclaje/materiales',
      registrar: 'POST /api/reciclaje/registrar',
      historial: 'GET /api/reciclaje/historial/:userId',
      estadisticas: 'GET /api/reciclaje/estadisticas/:userId',
      cacheStats: 'GET /api/cache/stats',
      cacheClear: 'DELETE /api/cache/clear'
    },
    documentation: 'https://github.com/tu-usuario/cleanheroes'
  });
});

// ============================================
// 🗑️ ENDPOINTS DE ADMINISTRACIÓN DE CACHÉ
// ============================================
app.delete('/api/cache/clear', (req, res) => {
  try {
    cacheService.flush();
    console.log('🗑️ Caché limpiado completamente');
    res.json({ success: true, message: 'Caché limpiado exitosamente' });
  } catch (error) {
    console.error('❌ Error al limpiar caché:', error);
    res.status(500).json({ success: false, error: 'Error al limpiar caché' });
  }
});

app.get('/api/cache/stats', (req, res) => {
  try {
    const stats = cacheService.stats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('❌ Error al obtener stats:', error);
    res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
  }
});

// ============================================
// ❌ MANEJO DE ERRORES 404 (AL FINAL)
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado', 
    path: req.path,
    method: req.method,
    suggestion: 'Verifica la URL y el método HTTP'
  });
});

// ============================================
// ❌ MANEJO DE ERRORES GLOBALES
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ 
      error: 'Error de referencia',
      message: 'El usuario o recurso referenciado no existe'
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Error de validación',
      message: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado'
  });
});

// ============================================
// ▶️ INICIAR SERVIDOR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '═'.repeat(50));
  console.log('🚀 CleanHeroes Backend - INICIADO');
  console.log('═'.repeat(50));
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Info API: http://localhost:${PORT}/`);
  console.log(`🌤️  Calidad Aire: http://localhost:${PORT}/api/calidad-aire?ciudad=Yantzaza`);
  console.log(`♻️  Materiales: http://localhost:${PORT}/api/reciclaje/materiales`);
  console.log(`📝 Registrar: POST http://localhost:${PORT}/api/reciclaje/registrar`);
  console.log(`🗄️  MariaDB: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  console.log(`🌐 CORS permitido: ${allowedOrigins.join(', ')}`);
  console.log(`💾 Caché: node-cache (TTL: 300-600s)`);
  console.log(`📦 DataLoader: Activado para prevenir N+1 queries`);
  console.log('═'.repeat(50) + '\n');
});

// ============================================
// 📦 EXPORTAR PARA TESTS
// ============================================
module.exports = { app };