const Inventory = require('../models/Inventory');

exports.createInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Error creating inventory item', details: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory item', details: error.message });
  }
};

exports.updateInventoryStatus = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    
    inventory.availabilityStatus = req.body.availabilityStatus;
    await inventory.save();
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Error updating inventory status', details: error.message });
  }
};
