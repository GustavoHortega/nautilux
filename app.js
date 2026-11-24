// Imports
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const app = express();

// Express Config
app.use(express.json()); // Parses incoming JSON request bodies

// Helmet config
app.use(helmet());

// Rate Limiter Config
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

app.use(limiter);

// Routers
const appRouter = require('./routes');

//routes
app.use('/', appRouter);

module.exports = app;