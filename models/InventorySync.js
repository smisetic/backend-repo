// models/InventorySync.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Vendor = require('./Vendor');
const VendorLocation = require('./VendorLocation');

const InventorySync = sequelize.define('InventorySync', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false, references: { model: Vendor, key: 'id' } },
  locationId: { type: DataTypes.UUID, allowNull: false, references: { model: VendorLocation, key: 'id' } },
  productName: { type: DataTypes.STRING, allowNull: false },
  stockCount: { type: DataTypes.INTEGER, allowNull: false },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

InventorySync.belongsTo(Vendor, { foreignKey: 'vendorId' });
InventorySync.belongsTo(VendorLocation, { foreignKey: 'locationId' });

module.exports = InventorySync;