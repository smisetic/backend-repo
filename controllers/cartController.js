const Cart = require('../models/Cart');
const Inventory = require('../models/Inventory');
const QRCode = require('qrcode');
const winston = require('winston');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const io = require('../server').io;

const redisClient = redis.createClient();

// Verify Cart Prices at Checkout (Prevent Cart Tampering)
exports.verifyCartPrices = async (req, res) => {
  try {
    const { userId } = req.body;
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    let totalVerifiedPrice = 0;
    const cartItems = await Inventory.findAll({ where: { id: cart.inventoryId } });

    cartItems.forEach(item => {
      totalVerifiedPrice += item.price;
    });

    cart.verifiedPrice = totalVerifiedPrice;
    await cart.save();

    res.json({ verifiedTotal: totalVerifiedPrice, cartTotal: cart.totalAmount });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error verifying cart prices', details: error.message });
  }
};

// Rate-Limiting for Cart API (Prevent Bots)
const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

// WebSockets for Real-Time Cart Updates
exports.updateCartLive = async (cartId) => {
  try {
    const cart = await Cart.findByPk(cartId);
    if (cart) {
      io.emit(`cart-update-${cartId}`, cart);
    }
  } catch (error) {
    winston.error('Error updating cart live:', error.message);
  }
};
