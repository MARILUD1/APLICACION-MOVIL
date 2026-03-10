// loaders/index.js
const { createReciclajeLoader } = require('./reciclajeLoader');

// Crear todos los loaders para un request
// (Importante: un loader nuevo por cada request para evitar caché incorrecto)
const createLoaders = () => {
  return {
    reciclajeLoader: createReciclajeLoader()
  };
};

module.exports = { createLoaders };