const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventory = sequelize.define('Inventory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  location: { type: DataTypes.GEOGRAPHY('POINT'), allowNull: false },
  stockCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  availabilityStatus: { type: DataTypes.ENUM('in stock', 'out of stock'), defaultValue: 'out of stock' },
  pickupEstimate: { type: DataTypes.STRING, allowNull: true },
  deliveryEstimate: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Inventory;
