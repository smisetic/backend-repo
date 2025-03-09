const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/inventory', require('./inventory'));

module.exports = router;
