const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    // ✅ Sin espacios + .trim() por seguridad
    this.baseURL = (process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org').trim();
  }

  // ← ← ← MAPEO DE CIUDADES DE ECUADOR A COORDENADAS
  getCiudadCoords(ciudad) {
    const coords = {
      'yantzaza': { lat: -4.0667, lon: -78.1167 },
      'zamora': { lat: -4.0667, lon: -78.9500 },
      'quito': { lat: -0.1807, lon: -78.4678 },
      'guayaquil': { lat: -2.1709, lon: -79.9224 },
      'cuenca': { lat: -2.9001, lon: -79.0059 },
      'loja': { lat: -3.9931, lon: -79.2042 }
    };
    return coords[ciudad.toLowerCase().trim()];
  }

  async getAirQualityByCity(city) {
    try {
      // ✅ Intentar con coordenadas primero (más preciso)
      const coords = this.getCiudadCoords(city);
      
      let url, params;
      
      if (coords) {
        // Usar coordenadas
        url = `${this.baseURL}/data/2.5/weather`;
        params = {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey,
          units: 'metric'  // Temperatura en Celsius
        };
      } else {
        // Fallback: nombre de ciudad + código de país
        url = `${this.baseURL}/data/2.5/weather`;
        params = {
          q: `${city},EC`,
          appid: this.apiKey,
          units: 'metric'
        };
      }

      const response = await axios.get(url, { params, timeout: 10000 });
      return this.transformWeatherData(response.data, city);
      
    } catch (error) {
      return this.handleError(error, `ciudad: ${city}`);
    }
  }

  async getAirQualityByCoords(lat, lon) {
    try {
      const url = `${this.baseURL}/data/2.5/weather`;
      const params = {
        lat: lat,
        lon: lon,
        appid: this.apiKey,
        units: 'metric'
      };

      const response = await axios.get(url, { params, timeout: 10000 });
      return this.transformWeatherData(response.data, `coords: ${lat}, ${lon}`);
      
    } catch (error) {
      return this.handleError(error, `coords: ${lat}, ${lon}`);
    }
  }

  transformWeatherData(data, location) {
    // ✅ Devolver datos de clima (disponibles en free tier)
    return {
      success: true,
      location: location,
      timestamp: new Date().toISOString(),
      data: {
        ciudad: data.name,
        pais: data.sys.country,
        temperatura: data.main.temp,
        sensacion: data.main.feels_like,
        humedad: data.main.humidity,
        presion: data.main.pressure,
        descripcion: data.weather[0].description,
        icono: data.weather[0].icon,
        viento: data.wind.speed,
        coordenadas: data.coord,
        // ✅ Recomendaciones basadas en clima
        recomendaciones: this.getWeatherRecommendations(data.main.temp, data.weather[0].id, data.wind?.speed)
      }
    };
  }

  getWeatherRecommendations(temp, weatherId, windSpeed) {
    const recs = [];
    
    // Temperatura
    if (temp < 15) {
      recs.push('🧥 Llevar abrigo, hace frío');
    } else if (temp > 30) {
      recs.push('☀️ Usar protector solar y mantenerse hidratado');
    } else {
      recs.push('🌤️ Clima agradable para actividades al aire libre');
    }
    
    // Lluvia (weatherId 2xx-5xx = lluvia/tormenta)
    if (weatherId >= 200 && weatherId < 600) {
      recs.push('☔ Llevar paraguas o impermeable');
      recs.push('⚠️ Considerar posponer actividades exteriores');
    }
    
    // Viento fuerte (> 5 m/s)
    if (windSpeed && windSpeed > 5) {
      recs.push('💨 Hay viento fuerte, asegurar objetos sueltos');
    }
    
    return recs.length > 0 ? recs : ['¡Condiciones ideales para CleanHeroes! ♻️'];
  }

  handleError(error, context) {
    console.error(`❌ Error en WeatherService (${context}):`, error.message);
    
    if (error.response) {
      return {
        success: false,
        error: `Error API externa (${context}): ${error.response.status} - ${error.response.data?.message || ''}`,
        statusCode: error.response.status
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Timeout: API externa no respondió en 10 segundos',
        statusCode: 504
      };
    } else {
      return {
        success: false,
        error: `Error interno: ${error.message}`,
        statusCode: 500
      };
    }
  }
}

module.exports = new WeatherService();