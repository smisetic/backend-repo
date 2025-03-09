const Cart = require('../models/Cart');
const Inventory = require('../models/Inventory');
const QRCode = require('qrcode');
const winston = require('winston');
const nodemailer = require('nodemailer');

// Auto-Apply Best Discount
exports.applyBestDiscount = async (req, res) => {
  try {
    const { userId } = req.body;
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.bestDiscountApplied = cart.totalAmount * 0.10; // Auto-apply 10% discount
    cart.totalAmount -= cart.bestDiscountApplied;
    await cart.save();

    res.json(cart);
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error applying best discount', details: error.message });
  }
};

// Abandoned Cart Reminder via Email
exports.sendCartReminder = async (req, res) => {
  try {
    const { userEmail } = req.body;
    let cart = await Cart.findOne({ where: { userEmail, isSavedCart: true } });
    if (!cart) return res.status(404).json({ error: 'No saved cart found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Your cart is waiting!',
      text: 'Come back and complete your order before items run out!'
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Cart reminder email sent' });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error sending cart reminder', details: error.message });
  }
};

// Generate Shareable Cart Link
exports.getCartShareableLink = async (req, res) => {
  try {
    const { cartId } = req.params;
    res.json({ shareableLink: `${process.env.BASE_URL}/cart/${cartId}` });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error generating shareable cart link' });
  }
};
