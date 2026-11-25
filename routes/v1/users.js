const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../../models');

const { createUser, loginUser } = require('../../services');

const router = express.Router();

router.post('/create', async (req, res) => { // User creation route
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

router.post('/login', async (req, res) => { // User login route
	try {
		loginData = req.body
		const token = await loginUser(loginData.email, loginData.password);

		res.json({
			success: true,
			token: token
		});

	} catch (error) {
		res.status(401).json({
			sucesso: false,
			error: error.message
		});
	}
});

module.exports = router;