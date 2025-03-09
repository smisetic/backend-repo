const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addItemToCart);
router.get('/qrcode/:cartId', cartController.getCartQRCode);

module.exports = router;
