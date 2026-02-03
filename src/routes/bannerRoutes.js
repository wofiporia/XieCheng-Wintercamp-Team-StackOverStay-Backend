const express = require('express');
const router = express.Router();

const bannerController = require('../controllers/bannerController');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management
 */

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Get list of banners
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           default: mobile
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: List of banners
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
 *                           title:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *                           jump:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                               payload:
 *                                 type: object
 */
router.get('/', asyncHandler(bannerController.list));

module.exports = router;
