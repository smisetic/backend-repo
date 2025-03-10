const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SchoolSupportSelection = sequelize.define('SchoolSupportSelection', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  primarySchoolId: { type: DataTypes.UUID, allowNull: true },
  secondarySchoolId: { type: DataTypes.UUID, allowNull: true },
  county: { type: DataTypes.STRING, allowNull: false },
  generalFund: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = SchoolSupportSelection;
