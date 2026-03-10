// models/index.js
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Reciclaje = require('./Reciclaje');
const Recompensa = require('./Recompensa');
const Canje = require('./Canje');

// Relaciones
User.hasMany(Reciclaje, { foreignKey: 'userId', as: 'reciclajes' });
Reciclaje.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

User.hasMany(Canje, { foreignKey: 'userId', as: 'canjes' });
Canje.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

Recompensa.hasMany(Canje, { foreignKey: 'recompensaId', as: 'canjes' });
Canje.belongsTo(Recompensa, { foreignKey: 'recompensaId', as: 'recompensa' });

module.exports = {
  sequelize,
  User,
  Reciclaje,
  Recompensa,
  Canje
};