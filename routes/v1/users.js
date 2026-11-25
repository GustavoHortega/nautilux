const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../../models');

const { createUser } = require('../../services');

const router = express.Router();

router.post('/create', async (req, res) => { //Create user
	const userData = req.body.user;

	try {
		const user = await createUser(userData);

		res.json({
			success: true,
			user: user
		});

	} catch (error) {
		res.status(422).json({
			success: false,
			error: error.message
		});
	}


});

module.exports = router;