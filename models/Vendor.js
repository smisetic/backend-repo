// models/Vendor.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    latitude: { 
      type: DataTypes.FLOAT, 
      allowNull: true 
    },
    longitude: { 
      type: DataTypes.FLOAT, 
      allowNull: true 
    },
    county: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    tokenBalance: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    },
    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    updatedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  });

  return Vendor;
};

