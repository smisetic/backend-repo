const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/', vendorController.createVendor);
router.get('/:id', vendorController.getVendorById);
router.post('/claim', vendorController.submitClaim);
router.post('/approve-claim', vendorController.approveClaim);

module.exports = router;
