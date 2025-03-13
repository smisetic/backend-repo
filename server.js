// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sequelize = require('./config/db');
const routes = require('./routes');
require('dotenv').config();
const stripeLib = require('stripe');
const winston = require('winston');
const http = require('http');
const { Server } = require('socket.io');

winston.add(new winston.transports.Console());

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', routes);

app.post('/api/payment/charge', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).json({ message: '✅ Mock Payment Successful' });
  }
  const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
  stripe.charges.create({
    amount: req.body.amount,
    currency: req.body.currency,
    source: req.body.source,
  })
    .then(charge => res.status(200).json({ message: 'Payment successful', charge }))
    .catch(error => {
      winston.error(error);
      res.status(500).json({ error: 'Payment failed' });
    });
});

app.use((err, req, res, next) => {
  winston.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true })
    .then(() => {
      server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch(err => winston.error('Database sync failed:', err));
}

module.exports = { app, io };