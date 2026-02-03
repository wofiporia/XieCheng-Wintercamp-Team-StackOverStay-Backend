const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const metaController = require('../controllers/metaController');
const metaRoutes = require('./metaRoutes');
const bannerRoutes = require('./bannerRoutes');
const hotelRoutes = require('./hotelRoutes');

router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', healthController.ping);
router.get('/geo/reverse', require('../utils/asyncHandler')(metaController.reverseGeocode));

router.use('/meta', metaRoutes);
router.use('/banners', bannerRoutes);
router.use('/hotels', hotelRoutes);

module.exports = router;
