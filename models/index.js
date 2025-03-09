const User = require('./User');
const Vendor = require('./Vendor');
const Inventory = require('./Inventory');

User.hasOne(Vendor, { foreignKey: 'userId' });
Vendor.belongsTo(User, { foreignKey: 'userId' });
Vendor.hasMany(Inventory, { foreignKey: 'vendorId' });
Inventory.belongsTo(Vendor, { foreignKey: 'vendorId' });

module.exports = { User, Vendor, Inventory };
