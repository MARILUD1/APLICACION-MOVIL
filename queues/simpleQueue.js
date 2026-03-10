// queues/simpleQueue.js
// Cola de trabajos en memoria (sin Redis - ideal para desarrollo/taller)

const queue = [];
let jobId = 0;

// Encolar un nuevo trabajo
const addJob = async (type, data) => {
  const job = {
    id: ++jobId,
    type,           // 'email' o 'report'
    data,           // Datos del trabajo
    createdAt: new Date(),
    status: 'pending'
  };
  
  queue.push(job);
  console.log(`📬 Job encolado: #${job.id} | Tipo: ${type}`);
  
  // Procesar asíncronamente (simulado)
  setTimeout(() => processJob(job), 100);
  
  return job;
};

// Procesar un trabajo
const processJob = async (job) => {
  job.status = 'processing';
  console.log(`⚙️ Procesando job #${job.id}: ${job.type}`);
  
  // Simular tiempo de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // "Procesar" según el tipo
  if (job.type === 'email') {
    console.log(`📧 Email enviado a ${job.data.email}: ${job.data.subject}`);
  } else if (job.type === 'report') {
    console.log(`📊 Reporte generado para usuario ID: ${job.data.userId}`);
  }
  
  job.status = 'completed';
  job.completedAt = new Date();
  console.log(`✅ Job completado: #${job.id}`);
  
  return job;
};

// Obtener estadísticas de la cola
const getStats = () => {
  return {
    total: queue.length,
    pending: queue.filter(j => j.status === 'pending').length,
    processing: queue.filter(j => j.status === 'processing').length,
    completed: queue.filter(j => j.status === 'completed').length,
    failed: queue.filter(j => j.status === 'failed').length
  };
};

// Limpiar la cola (para testing)
const clearQueue = () => {
  queue.length = 0;
  console.log('🗑️ Cola limpiada');
};

module.exports = {
  addJob,
  getStats,
  clearQueue
};