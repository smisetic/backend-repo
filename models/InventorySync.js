const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const VendorLocation = require('./VendorLocation');

const InventorySync = sequelize.define('InventorySync', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  locationId: { type: DataTypes.UUID, allowNull: false, references: { model: VendorLocation, key: 'id' } },
  productName: { type: DataTypes.STRING, allowNull: false },
  stockCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = InventorySync;
