const express = require('express');
const router = express.Router();

const metaController = require('../controllers/metaController');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @swagger
 * tags:
 *   name: Meta
 *   description: Metadata and configuration endpoints
 */

/**
 * @swagger
 * /meta/cities:
 *   get:
 *     summary: Get list of cities
 *     tags: [Meta]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by city name
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country code
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StandardResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           countryCode:
 *                             type: string
 *                           lat:
 *                             type: number
 *                           lng:
 *                             type: number
 */
router.get('/cities', asyncHandler(metaController.getCities));

/**
 * @swagger
 * /meta/quick-filters:
 *   get:
 *     summary: Get quick filters configuration
 *     tags: [Meta]
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           default: mobile
 *         description: Platform identifier
 *     responses:
 *       200:
 *         description: List of quick filters
 */
router.get('/quick-filters', asyncHandler(metaController.getQuickFilters));

/**
 * @swagger
 * /meta/hotel-filters:
 *   get:
 *     summary: Get hotel filter options
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: Hotel filter options
 */
router.get('/hotel-filters', metaController.getHotelFilters);

module.exports = router;
