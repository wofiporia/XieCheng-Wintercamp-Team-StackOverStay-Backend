const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

router.get('/health', healthController.ping);

router.use('/hotels', require('./hotels'));

module.exports = router;
