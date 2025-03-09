const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TokenAllocationFund = sequelize.define('TokenAllocationFund', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  county: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  source: { type: DataTypes.STRING, defaultValue: 'vendor_token' }
});

module.exports = TokenAllocationFund;
