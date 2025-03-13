// models/VendorLocation.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Vendor = require('./Vendor')(sequelize, DataTypes);

  const VendorLocation = sequelize.define('VendorLocation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vendorId: { type: DataTypes.UUID, allowNull: false, references: { model: Vendor, key: 'id' } },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
  });

  VendorLocation.belongsTo(Vendor, { foreignKey: 'vendorId' });

  return VendorLocation;
};
