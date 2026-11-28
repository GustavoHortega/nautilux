
const express = require('express');

const { checkServiceStatus } = require('../../services');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: API and external service health checks
 */

/**
 * @swagger
 * /v1/status/nautilux:
 *   get:
 *     summary: Check Nautilux API status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Nautilux API is operational
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NautiluxStatus'
 */
router.get('/nautilux', (req, res) => {
    res.json({
        success: true,
        message: 'Nautilux is on!'
    });
});

/**
 * @swagger
 * /v1/status/{service}:
 *   get:
 *     summary: Check external service status
 *     tags: [Status]
 *     parameters:
 *       - name: service
 *         in: path
 *         required: true
 *         description: External service name
 *         schema:
 *           type: string
 *         example: osv
 *     responses:
 *       200:
 *         description: External service status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExternalServiceStatus'
 *       500:
 *         description: Failed to check external service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:service', async (req, res) => {
    const service = req.params.service;

    try {
        const serviceInfo = await checkServiceStatus(service);

        res.json({
            success: true,
            service: serviceInfo
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
