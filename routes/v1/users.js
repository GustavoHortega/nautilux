const express = require('express');

const { User } = require('../../models');

const { createUser, loginUser, addTechnology, deleteTechnology, updateTechnology } = require('../../services');
const { authenticate } = require('../../middlewares/authentication');

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
		const loginData = req.body;
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

router.get('/me', authenticate, async (req, res) => { // User info route
	try {
		const user = await User.findOne({ _id: req.user.userId });

		res.json({
			success: true,
			user: user
		});

	} catch (error) {
		res.json({
			success: false,
			error: error.message
		});

	}
});

router.post('/me/technologies', authenticate, async (req, res) => {
	const technology = req.body;
	const user = req.user;

	try {
		if (!technology.name || !technology.ecosystem || !technology.version) {
			const error = new Error('Technology name, ecosystem and version are required!');
			error.statusCode = 400;
			throw error;
		}

		const createdTechnology = await addTechnology(user.userId, technology);

		res.json({
			success: true,
			technology: createdTechnology
		});

	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message
		});
	}
});

router.patch('/me/technologies/:id', authenticate, async (req, res) => {
	try {
		const technology = await updateTechnology(
			req.user.userId,
			req.params.id,
			req.body
		);

		res.json({
			success: true,
			technology
		});
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message
		});
	}
});

router.delete('/me/technologies/:id', authenticate, async (req, res) => {
	try {
		await deleteTechnology(req.user.userId, req.params.id);

		res.json({
			success: true,
			message: 'Technology deleted successfully.'
		});
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message
		});
	}
});

module.exports = router;