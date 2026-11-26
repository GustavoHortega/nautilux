const express = require('express');
const { checkVulnerability } = require('../../services');

const router = express.Router();

router.get('/', async (req, res) => {
	const payload = req.body;

	try {
		const vulneranilities = await checkVulnerability(payload);

		res.json({
			success: true,
			vulnerabilities: vulneranilities
		});

	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: true,
			error: error.message
		});
	}

});

module.exports = router;