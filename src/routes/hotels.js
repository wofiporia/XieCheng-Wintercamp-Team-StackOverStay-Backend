const express = require('express');
const router = express.Router();

// GET /api/hotels
router.get('/', (req, res) => {
  res.json({ data: [], total: 0 });
});

// GET /api/hotels/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: '示例酒店' });
});

module.exports = router;
