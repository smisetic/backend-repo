const VendorTokenPurchase = require('../models/VendorTokenPurchase');
const SchoolAllocationFund = require('../models/SchoolAllocationFund');
const TokenAllocationFund = require('../models/TokenAllocationFund');
const SchoolSupportSelection = require('../models/SchoolSupportSelection');
const School = require('../models/School');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');

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

    // Allocate funds at the county level
    await TokenAllocationFund.create({ county, amount, source: 'vendor_token' });

    // Distribute county revenue to schools
    const selections = await SchoolSupportSelection.findAll({ where: { county } });
    const totalUsers = selections.length;
    const generalFundUsers = selections.filter(s => s.generalFund).length;

    if (totalUsers > 0) {
      const allocationPerUser = amount / totalUsers;
      for (const selection of selections) {
        if (selection.generalFund) {
          await SchoolAllocationFund.create({ county, amount: allocationPerUser / generalFundUsers, source: 'vendor_token' });
        } else {
          const primarySchool = await School.findByPk(selection.primarySchoolId);
          let secondarySchool = await School.findByPk(selection.secondarySchoolId);
          
          // If no secondary school is selected or it's not low-income, auto-assign one
          if (!secondarySchool or not secondarySchool.lowIncome) {
            secondarySchool = await School.findOne({ where: { county: selection.county, lowIncome: true } });
          }
          
          if (primarySchool) {
            await SchoolAllocationFund.create({ schoolId: primarySchool.id, county, amount: allocationPerUser / 2, source: 'vendor_token' });
          }
          
          if (secondarySchool) {
            await SchoolAllocationFund.create({ schoolId: secondarySchool.id, county, amount: allocationPerUser / 2, source: 'vendor_token' });
          } else {
            await SchoolAllocationFund.create({ county, amount: allocationPerUser / 2, source: 'vendor_token' });
          }
        }
      }
    }

    res.json({ clientSecret: paymentIntent.client_secret, purchaseId: tokenPurchase.id });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error processing vendor token purchase', details: error.message });
  }
};
