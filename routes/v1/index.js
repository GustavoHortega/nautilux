const express = require('express');

const router = express.Router();

// Routers
const statusRouter = require('./status');

// Routes
router.use('/status', statusRouter);

module.exports = router;