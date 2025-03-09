const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.GEOGRAPHY('POINT'), allowNull: true },
  county: { type: DataTypes.STRING, allowNull: true },
  tokenBalance: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Vendor;
