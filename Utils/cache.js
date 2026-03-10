// utils/cache.js
const NodeCache = require('node-cache');

// Configuración del caché
const cache = new NodeCache({
  stdTTL: 300, // Tiempo de vida por defecto: 5 minutos (300 segundos)
  checkperiod: 60, // Verificar claves expiradas cada 60 segundos
  useClones: true, // Retornar copias para evitar mutaciones
});

// Métodos utilitarios
const cacheService = {
  // Guardar en caché
  set: (key, value, ttl = null) => {
    if (ttl) {
      return cache.set(key, value, ttl);
    }
    return cache.set(key, value);
  },

  // Obtener de caché
  get: (key) => {
    return cache.get(key);
  },

  // Eliminar de caché
  del: (key) => {
    return cache.del(key);
  },

  // Limpiar todo el caché
  flush: () => {
    return cache.flushAll();
  },

  // Verificar si existe en caché
  has: (key) => {
    return cache.has(key);
  },

  // Estadísticas del caché
  stats: () => {
    return cache.getStats();
  }
};

// Eventos del caché (opcional - para debugging)
cache.on('expired', (key, value) => {
  console.log(`⏰ Clave expirada: ${key}`);
});

cache.on('del', (key, value) => {
  console.log(`🗑️ Clave eliminada: ${key}`);
});

module.exports = cacheService;