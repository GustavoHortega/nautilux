// Imports
const { connectDb } = require('./models');
const { logger } = require('./utils');

// Dotenv Config
require('dotenv').config({quiet: true});

const app = require('./app');

// Inicialize server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	connectDb();

	logger.info(`Server listening on port ${port}`);
});