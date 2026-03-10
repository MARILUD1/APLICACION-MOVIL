// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cleanheroes',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',  // ← Leerá 'Lupe1986.' de tu .env
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mariadb',  // ← Correcto para MariaDB 11.7
    port: process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // ← ← ← CONFIGURACIÓN CORRECTA PARA MARIADB:
    dialectOptions: {
      authPlugin: 'mysql_native_password'
    }
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ MariaDB conectado desde config/database.js'))
  .catch(err => console.error('❌ Error MariaDB:', err.message));

// Sincronizar modelos
sequelize.sync({ force: false })
  .then(() => console.log('✅ Tablas sincronizadas desde config/database.js'))
  .catch(err => console.error('❌ Error sincronizando:', err.message));

module.exports = sequelize;