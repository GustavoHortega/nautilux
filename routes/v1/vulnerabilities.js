
const express = require('express');
const { checkVulnerability } = require('../../services');

const router = express.Router();

/**
 * @swagger
 * /v1/vulnerabilities:
 *   post:
 *     summary: Check vulnerabilities for a software package
 *     tags: [Vulnerabilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VulnerabilityPackage'
 *     responses:
 *       200:
 *         description: Vulnerability check completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 vulnerabilities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vulnerability'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', async (req, res) => {
	const payload = req.body;

	try {
		const vulneranilities = await checkVulnerability(payload);

		res.json({
			success: true,
			vulnerabilities: vulneranilities
		});

	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message
		});
	}
});

module.exports = router;
