const express = require('express');

const  { checkServiceStatus } = require('../../services');

const router = express.Router();

router.get('/nautilux', (req, res) => {
	res.json({
	    success: true,
	    message: 'Nautilux is on!'
	});
});

router.get('/:service', async (req, res) => {
	const service = req.params.service;

	try {
		const serviceInfo = await checkServiceStatus(service);

		res.json({
			success: true,
			service: serviceInfo
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}


});
    
module.exports = router;