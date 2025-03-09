const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  lastUpdatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  qrCode: { type: DataTypes.TEXT, allowNull: true },
  isSavedCart: { type: DataTypes.BOOLEAN, defaultValue: false },
  bestDiscountApplied: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Cart;
