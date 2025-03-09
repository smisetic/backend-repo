const VendorTokenPurchase = require('../models/VendorTokenPurchase');
const TokenAllocationFund = require('../models/TokenAllocationFund');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');

// Ensure Unique Vendor Token Purchases
exports.purchaseTokens = async (req, res) => {
  try {
    const { vendorId, amount, tokensPurchased, county, transactionId } = req.body;
    
    const existingTransaction = await VendorTokenPurchase.findOne({ where: { stripeTransactionId: transactionId } });
    if (existingTransaction) {
      return res.status(400).json({ error: 'Duplicate transaction detected' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card']
    });

    const tokenPurchase = await VendorTokenPurchase.create({
      vendorId,
      amount,
      tokensPurchased,
      stripeTransactionId: transactionId,
      status: 'pending'
    });

    await TokenAllocationFund.create({
      county,
      amount,
      source: 'vendor_token'
    });

    res.json({ clientSecret: paymentIntent.client_secret, purchaseId: tokenPurchase.id });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error processing vendor token purchase', details: error.message });
  }
};

// Soft Delete Token Allocations
exports.deleteTokenAllocation = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const allocation = await TokenAllocationFund.findByPk(allocationId);
    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });
    allocation.deletedAt = new Date();
    await allocation.save();
    res.json({ message: 'Token allocation successfully deleted' });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error deleting token allocation', details: error.message });
  }
};
