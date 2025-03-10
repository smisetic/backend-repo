const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Vendor = require('./Vendor');

const RetailerSubscription = sequelize.define('RetailerSubscription', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  vendorId: { type: DataTypes.UUID, allowNull: false, references: { model: Vendor, key: 'id' } },
  subscriptionPlan: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Basic', 'Premium'
  price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'inactive' },
  renewalDate: { type: DataTypes.DATE, allowNull: false }
});

module.exports = RetailerSubscription;
