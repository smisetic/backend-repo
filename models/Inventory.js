// models/Inventory.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Vendor = require('./Vendor')(sequelize, DataTypes);

  const Inventory = sequelize.define('Inventory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vendorId: { type: DataTypes.UUID, allowNull: false, references: { model: Vendor, key: 'id' } },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    stockCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    availabilityStatus: { type: DataTypes.ENUM('in stock', 'out of stock'), defaultValue: 'out of stock' },
    pickupEstimate: { type: DataTypes.STRING, allowNull: true },
    deliveryEstimate: { type: DataTypes.STRING, allowNull: true },
  });

  Inventory.belongsTo(Vendor, { foreignKey: 'vendorId' });

  return Inventory;
};
