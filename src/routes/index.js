const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

router.use('/hotels', require('./hotels'));

module.exports = router;
