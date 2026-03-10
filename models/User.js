const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // ← ¡Debe ser destructuring!

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  direccion: DataTypes.STRING,
  rol: { type: DataTypes.STRING, defaultValue: 'Ciudadano' },
  puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
  reciclajesTotales: { type: DataTypes.INTEGER, defaultValue: 0 },
  co2Reducido: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;