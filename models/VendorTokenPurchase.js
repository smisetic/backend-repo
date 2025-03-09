const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VendorTokenPurchase = sequelize.define('VendorTokenPurchase', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  tokensPurchased: { type: DataTypes.INTEGER, allowNull: false },
  stripeTransactionId: { type: DataTypes.STRING, unique: true, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' }
});

module.exports = VendorTokenPurchase;
