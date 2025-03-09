const VendorTokenPurchase = require('../models/VendorTokenPurchase');
const TokenAllocationFund = require('../models/TokenAllocationFund');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');

exports.purchaseTokens = async (req, res) => {
  try {
    const { vendorId, amount, tokensPurchased, county } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card']
    });

    const tokenPurchase = await VendorTokenPurchase.create({
      vendorId,
      amount,
      tokensPurchased,
      stripeTransactionId: paymentIntent.id
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
