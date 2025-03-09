const Cart = require('../models/Cart');
const Inventory = require('../models/Inventory');
const QRCode = require('qrcode');
const twilio = require('twilio');
const { Sequelize } = require('sequelize');
const cron = require('node-cron');
const winston = require('winston');

// Add item to cart with stock validation
exports.addItemToCart = async (req, res) => {
  try {
    const { userId, inventoryId, quantity } = req.body;
    const inventoryItem = await Inventory.findByPk(inventoryId);
    if (!inventoryItem || inventoryItem.stockCount < quantity) {
      return res.status(400).json({ error: 'Item not available' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });

    cart.totalAmount += inventoryItem.price * quantity;
    await cart.save();

    inventoryItem.stockCount -= quantity;
    await inventoryItem.save();

    res.json(cart);
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error updating cart', details: error.message });
  }
};

// Allow Users to Remove Items from Cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId, inventoryId } = req.body;
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const inventoryItem = await Inventory.findByPk(inventoryId);
    if (!inventoryItem) return res.status(404).json({ error: 'Item not found in inventory' });

    cart.totalAmount -= inventoryItem.price;
    await cart.save();

    inventoryItem.stockCount += 1;
    await inventoryItem.save();

    res.json(cart);
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error removing item from cart', details: error.message });
  }
};

// Coupon / Discount System
exports.applyCoupon = async (req, res) => {
  try {
    const { userId, couponCode } = req.body;
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    if (couponCode === 'DISCOUNT10') {
      cart.totalAmount *= 0.9;
    } else {
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error applying coupon', details: error.message });
  }
};

// Store QR Code in Database
exports.getCartQRCode = async (req, res) => {
  try {
    const { cartId } = req.params;
    let cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    if (!cart.qrCode) {
      cart.qrCode = await QRCode.toDataURL(cartId);
      await cart.save();
    }

    res.json({ qrCode: cart.qrCode });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error generating QR Code' });
  }
};
