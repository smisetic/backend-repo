const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

router.use('/auth', require('./auth'));
router.use('/vendor', require('./vendor'));
router.use('/payment', require('./payment'));

module.exports = router;