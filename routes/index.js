const express = require('express');

const router = express.Router();

// Routers
const v1Router = require('./v1');

// Routes
router.use('/v1', v1Router);

module.exports = router;