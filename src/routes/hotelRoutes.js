const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotelController');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel search and details
 */

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Search hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: integer
 *         required: false
 *         description: City ID (required if no keyword)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: checkIn
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-in date (YYYY-MM-DD)
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-out date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of hotels
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
 *                           starRating:
 *                             type: number
 *                           minPrice:
 *                             type: number
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 */
router.get('/', asyncHandler(hotelController.list));

/**
 * @swagger
 * /hotels/{hotelId}:
 *   get:
 *     summary: Get hotel details
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hotel details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StandardResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         photos:
 *                           type: array
 *                           items:
 *                             type: object
 *       404:
 *         description: Hotel not found
 */
router.get('/:hotelId', asyncHandler(hotelController.getById));

/**
 * @swagger
 * /hotels/{hotelId}/rooms:
 *   get:
 *     summary: Get hotel rooms and rates
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: checkIn
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of rooms with pricing
 */
router.get('/:hotelId/rooms', asyncHandler(hotelController.getRooms));

module.exports = router;
