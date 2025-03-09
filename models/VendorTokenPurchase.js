const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VendorTokenPurchase = sequelize.define('VendorTokenPurchase', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  tokensPurchased: { type: DataTypes.INTEGER, allowNull: false },
  stripeTransactionId: { type: DataTypes.STRING, allowNull: false }
});

module.exports = VendorTokenPurchase;
