const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const VendorLocation = require('./VendorLocation');

const VendorDeal = sequelize.define('VendorDeal', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  locationId: { type: DataTypes.UUID, allowNull: false, references: { model: VendorLocation, key: 'id' } },
  description: { type: DataTypes.TEXT, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: false },
  tokensUsed: { type: DataTypes.INTEGER, defaultValue: 1 },
  qrCodeRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
  qrCodeExpiration: { type: DataTypes.DATE, allowNull: true },
  validLocations: { type: DataTypes.ARRAY(DataTypes.UUID), allowNull: false } // List of valid locations
});

module.exports = VendorDeal;
