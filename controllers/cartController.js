const Cart = require('../models/Cart');
const Inventory = require('../models/Inventory');
const QRCode = require('qrcode');
const twilio = require('twilio');
const { Sequelize } = require('sequelize');
const cron = require('node-cron');

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
    res.status(500).json({ error: 'Error updating cart', details: error.message });
  }
};

// Generate QR Code for cart retrieval
exports.getCartQRCode = async (req, res) => {
  try {
    const { cartId } = req.params;
    const qrCode = await QRCode.toDataURL(cartId);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Error generating QR Code' });
  }
};

// Automatic Cart Cleanup (Removes carts inactive for 24 hours)
cron.schedule('0 0 * * *', async () => {
  const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Cart.destroy({ where: { lastUpdatedAt: { [Sequelize.Op.lt]: expirationTime } } });
  console.log('Old carts cleaned up');
});

// Twilio SMS Notifications (utils/notifications.js)
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

exports.sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};
