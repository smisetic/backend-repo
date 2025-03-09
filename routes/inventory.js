const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/', inventoryController.createInventory);
router.get('/:id', inventoryController.getInventoryById);
router.put('/:id/status', inventoryController.updateInventoryStatus);

module.exports = router;
