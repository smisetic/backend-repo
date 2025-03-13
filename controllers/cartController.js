// controllers/cartController.js
const db = require('../models');
const Cart = db.Cart;
const Inventory = db.Inventory;
const QRCode = require('qrcode');
const winston = require('winston');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const { io } = require('../server');

const redisClient = redis.createClient();

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

// controllers/cartController.js (partial update)
exports.addItemToCart = async (req, res) => {
  try {
    const { userId, inventoryId, quantity } = req.body;
    const inventory = await Inventory.findByPk(inventoryId);
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

    let cartItem = await Cart.findOne({ where: { userId, inventoryId } });
    const totalAmount = inventory.price * quantity;

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalAmount += totalAmount;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ 
        userId, 
        inventoryId, 
        quantity, 
        totalAmount 
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
};

exports.getCartQRCode = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findByPk(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const qrCode = await QRCode.toDataURL(JSON.stringify(cart));
    res.json({ qrCode });
  } catch (error) {
    winston.error('Error generating QR Code:', error.message);
    res.status(500).json({ error: 'Failed to generate QR Code', details: error.message });
  }
};

const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});

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

module.exports = exports;