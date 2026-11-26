const express = require('express');

const router = express.Router();

// Routers
const statusRouter = require('./status');
const usersRouter = require('./users');
const vulnerabilitiesRouter = require('./vulnerabilities');

// Routes
router.use('/status', statusRouter);
router.use('/users', usersRouter);
router.use('/vulnerabilities', vulnerabilitiesRouter);

module.exports = router;