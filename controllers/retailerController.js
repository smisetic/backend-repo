const RetailerSubscription = require('../models/RetailerSubscription');
const InventorySync = require('../models/InventorySync');
const winston = require('winston');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const cron = require('node-cron');

exports.manageSubscription = async (req, res) => {
  try {
    const { vendorId, subscriptionPlan, price } = req.body;
    const existingSubscription = await RetailerSubscription.findOne({ where: { vendorId } });

    if (existingSubscription) {
      existingSubscription.subscriptionPlan = subscriptionPlan;
      existingSubscription.price = price;
      existingSubscription.status = 'active';
      existingSubscription.renewalDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
      await existingSubscription.save();
      return res.json({ message: 'Subscription updated successfully', subscription: existingSubscription });
    }

    const subscription = await RetailerSubscription.create({
      vendorId,
      subscriptionPlan,
      price,
      status: 'active',
      renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    res.json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error managing subscription', details: error.message });
  }
};

exports.syncInventory = async (req, res) => {
  try {
    const { vendorId, inventory } = req.body;

    for (const item of inventory) {
      await InventorySync.upsert({
        vendorId,
        locationId: item.locationId,
        productName: item.productName,
        stockCount: item.stockCount,
        lastUpdated: new Date()
      });
    }

    res.json({ message: 'Inventory synced successfully' });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error syncing inventory', details: error.message });
  }
};
