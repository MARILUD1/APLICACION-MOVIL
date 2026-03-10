// loaders/reciclajeLoader.js
const DataLoader = require('dataloader');
const { Reciclaje } = require('../models');

// Función que carga reciclajes para múltiples usuarios en UNA sola consulta
async function batchReciclajes(userIds) {
  console.log(`📦 DataLoader: Cargando reciclajes para ${userIds.length} usuarios en 1 consulta`);
  
  // UNA sola consulta para TODOS los userIds (evita N+1)
  const reciclajes = await Reciclaje.findAll({
    where: {
      userId: userIds
    },
    order: [['fecha', 'DESC']]
  });

  // Agrupar reciclajes por userId
  const reciclajesPorUsuario = {};
  
  // Inicializar array vacío para cada userId
  userIds.forEach(id => {
    reciclajesPorUsuario[id] = [];
  });

  // Asignar cada reciclaje a su usuario correspondiente
  reciclajes.forEach(reciclaje => {
    if (reciclajesPorUsuario[reciclaje.userId]) {
      reciclajesPorUsuario[reciclaje.userId].push(reciclaje);
    }
  });

  // Retornar en el mismo orden que los userIds recibidos
  return userIds.map(id => reciclajesPorUsuario[id] || []);
}

// Crear instancia del DataLoader
const createReciclajeLoader = () => new DataLoader(batchReciclajes);

module.exports = { createReciclajeLoader };