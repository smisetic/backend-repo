const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sequelize = require('./config/db');
const routes = require('./routes');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe API
const winston = require('winston');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

sequelize.sync({ force: true }) // WARNING: This will reset the database in testing!
  .then(() => {                 // REMOVE force:true IN PRODUCTION
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Database synchronization error:", err);
  });

// Mock Payment API for Testing
app.post('/api/payment/charge', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).json({ message: '✅ Mock Payment Successful' });
  }
  
  // Actual Stripe Payment Logic
  stripe.charges.create({
    amount: req.body.amount,
    currency: req.body.currency,
    source: req.body.source
  })
  .then(charge => res.status(200).json({ message: 'Payment successful', charge }))
  .catch(error => {
    winston.error(error);
    res.status(500).json({ error: 'Payment failed' });
  });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  winston.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start the server only if NOT in test mode
const PORT = process.env.PORT || 5000;
let server;

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true }).then(() => {
    server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  });
}

// Export app for Jest testing
module.exports = app;

