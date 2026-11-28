
const express = require('express');

const { User } = require('../../models');

const {
	createUser,
	loginUser,
	addTechnology,
	deleteTechnology,
	updateTechnology
} = require('../../services');

const { authenticate } = require('../../middlewares/authentication');

const router = express.Router();

/**
 * @swagger
 * /v1/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user]
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
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

/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
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
			success: false,
			error: error.message
		});
	}
});

/**
 * @swagger
 * /v1/users/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/me', authenticate, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
			.select('-password');

		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'User not found.'
			});
		}

		res.json({
			success: true,
			user
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});

/**
 * @swagger
 * /v1/users/me/technologies:
 *   post:
 *     summary: Register a technology for the authenticated user
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnologyCreate'
 *     responses:
 *       200:
 *         description: Technology registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 technology:
 *                   $ref: '#/components/schemas/Technology'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /v1/users/me/technologies/{id}:
 *   patch:
 *     summary: Update a registered technology
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Technology ID
 *         schema:
 *           type: string
 *         example: 674a1234567890abcdef1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechnologyCreate'
 *     responses:
 *       200:
 *         description: Technology updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 technology:
 *                   $ref: '#/components/schemas/Technology'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /v1/users/me/technologies/{id}:
 *   delete:
 *     summary: Remove a registered technology
 *     tags: [Technologies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Technology ID
 *         schema:
 *           type: string
 *         example: 674a1234567890abcdef1234
 *     responses:
 *       200:
 *         description: Technology deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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
