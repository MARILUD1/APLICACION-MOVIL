// routes/airQuality.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cacheService = require('../Utils/cache'); // ← ← ← CORREGIDO: minúscula 'utils'

// ============================================
// 🌤️ GET /api/calidad-aire - CON CACHÉ ✅
// ============================================
router.get('/', async (req, res) => {
  const { ciudad = 'Yantzaza' } = req.query;
  const cacheKey = `clima_${ciudad.toLowerCase().replace(/\s/g, '_')}`;
  
  try {
    // 1. Intentar obtener de caché
    const cachedWeather = cacheService.get(cacheKey);
    
    if (cachedWeather) {
      console.log(`💾 Clima de ${ciudad} servido desde CACHÉ ⚡`);
      return res.json({
        success: true,
        source: 'cache',
        timestamp: new Date().toISOString(),
        data: cachedWeather
      });
    }

    // 2. Si no está en caché, consultar a OpenWeatherMap
    console.log(`🌐 Clima de ${ciudad} consultado desde OpenWeatherMap API`);
    
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    
    // ← ← ← DEBUG: Verificar API Key
    console.log('🔑 API Key:', apiKey ? '✅ Configurada' : '❌ NO CONFIGURADA');
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API Key de OpenWeatherMap no configurada',
        solution: 'Agrega OPENWEATHERMAP_API_KEY al archivo .env'
      });
    }

    // ✅ URL corregida (SIN espacios después de q=)
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
    );

    const weatherData = {
      ciudad: response.data.name,
      temperatura: response.data.main.temp,
      sensacionTermica: response.data.main.feels_like,
      humedad: response.data.main.humidity,
      descripcion: response.data.weather[0].description,
      icono: response.data.weather[0].icon
    };

    // 3. Guardar en caché por 10 minutos (600 segundos)
    cacheService.set(cacheKey, weatherData, 600);
    console.log(`💾 Clima de ${ciudad} guardado en caché (TTL: 600s)`);

    res.json({
      success: true,
      source: 'database',
      timestamp: new Date().toISOString(),
      data: weatherData
    });

  } catch (error) {
    console.error('❌ Error al obtener clima:', error.message);
    console.error('❌ Detalles:', error.response?.data || error.code);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener datos del clima',
      message: error.message 
    });
  }
});

module.exports = router;