// models/Cart.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = require('./User')(sequelize, DataTypes);
  const Inventory = require('./Inventory')(sequelize, DataTypes);

  const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    inventoryId: { type: DataTypes.UUID, allowNull: false, references: { model: Inventory, key: 'id' } },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    verifiedPrice: { type: DataTypes.FLOAT, allowNull: true },
  });

  Cart.belongsTo(User, { foreignKey: 'userId' });
  Cart.belongsTo(Inventory, { foreignKey: 'inventoryId' });

  return Cart;
};
