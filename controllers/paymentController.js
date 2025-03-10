const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
  try {
    const { amount, currency, source } = req.body;

    if (!amount || !currency || !source) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description: 'Vendor token purchase'
    });

    res.status(200).json({ message: 'Payment successful', charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
};









