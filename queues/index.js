// queues/index.js
// Índice de colas - exporta funciones con nombres específicos

const { addJob, getStats, clearQueue } = require('./simpleQueue');

module.exports = {
  // Email Queue (nombres específicos para compatibilidad)
  sendEmailJob: (data) => addJob('email', data),
  getEmailQueueStats: getStats,
  clearEmailQueue: clearQueue,
  
  // Report Queue
  generateReportJob: (userId, type = 'mensual') => addJob('report', { userId, type }),
  getReportQueueStats: getStats,
  
  // Exportar cola interna para debugging (opcional)
  _queue: require('./simpleQueue')
};