
// Imports
const { connectDb } = require('./models');
const { logger } = require('./utils');
const { startScheduler } = require('./workers/scheduler');

// Dotenv Config
require('dotenv').config({ quiet: true });

const app = require('./app');

// Server Configuration
const port = process.env.PORT || 3000;

// Application Startup
const startServer = async () => {
	try {
		// Connect to Database
		await connectDb();

		// Start HTTP Server
		app.listen(port, () => {
			logger.info(`Server listening on port ${port}`);
		});

		// Start scheduler
		startScheduler();

	} catch (error) {
		logger.error(`Application startup error: ${error.message}`);
		process.exit(1);
	}
};

startServer();
