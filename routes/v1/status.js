const express = require('express');

const  { checkServiceStatus } = require('../../services');

const router = express.Router();

router.get('/nautilux', (req, res) => { // Nautilux health ckeck
	res.json({
	    success: true,
	    message: 'Nautilux is on!'
	});
});

router.get('/:service', async (req, res) => { // External service health check
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