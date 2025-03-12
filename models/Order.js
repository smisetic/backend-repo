const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Vendor = require('./Vendor');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled'),
    defaultValue: 'pending' 
  }
});

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Vendor, { foreignKey: 'vendorId' });

module.exports = Order;
