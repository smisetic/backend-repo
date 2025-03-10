const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const School = sequelize.define('School', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  county: { type: DataTypes.STRING, allowNull: false },
  lowIncome: { type: DataTypes.BOOLEAN, defaultValue: false } // New flag for low-income schools
});

module.exports = School;
