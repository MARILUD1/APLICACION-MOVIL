const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Canje = sequelize.define('Canje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  recompensaId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  puntosCanjeados: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  estado: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'Aprobado', 'Entregado', 'Cancelado']]
    }
  },
  codigoCanje: { 
    type: DataTypes.STRING, 
    allowNull: true,
    unique: true
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'canjes',
  timestamps: true,
  createdAt: 'fechaCanje',
  updatedAt: false
});

module.exports = Canje;  // 