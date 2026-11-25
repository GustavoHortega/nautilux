const express = require('express');

const router = express.Router();

// Routers
const statusRouter = require('./status');
const usersRouter = require('./users');

// Routes
router.use('/status', statusRouter);
router.use('/users', usersRouter);

module.exports = router;