const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

router.use('/auth', require('./auth'));
router.use('/vendor', require('./vendor'));
router.use('/payment', require('./payment'));
router.use('/orders', require('./order'));
router.use('/cart', require('./cart'));
router.use('/inventory', require('./inventory'));

module.exports = router;
router.use('/payments', require('./payment'));