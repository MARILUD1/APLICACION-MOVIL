const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reciclaje = sequelize.define('Reciclaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  materiales: { 
    type: DataTypes.JSON, 
    allowNull: false,
    comment: 'Array de materiales: [{tipo, cantidad, unidad, pesoKg, puntos}]'
  },
  pesoTotal: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    comment: 'Peso total en kg de todos los materiales'
  },
  puntosTotales: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  co2Ahorrado: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0,
    comment: 'CO2 ahorrado en kg'
  },
  lat: DataTypes.FLOAT,
  lon: DataTypes.FLOAT
}, {
  tableName: 'reciclajes',
  timestamps: true,
  createdAt: 'fecha',
  updatedAt: false
});

module.exports = Reciclaje;