const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recompensa = sequelize.define('Recompensa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: DataTypes.TEXT,
  puntosRequeridos: { type: DataTypes.INTEGER, allowNull: false },
  categoria: { type: DataTypes.STRING, defaultValue: 'Otro' },
  proveedor: DataTypes.STRING,
  stock: { type: DataTypes.INTEGER, defaultValue: 1 },
  activa: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'recompensas',
  timestamps: true
});

module.exports = Recompensa;