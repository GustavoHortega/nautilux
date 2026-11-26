const mongoose = require('mongoose');
const { logger } = require('../utils');

// Schema import
const UserSchema = require('./user');
const VulnerabilitySchema = require('./vulnerability');

// Models
const User = mongoose.model('User', UserSchema);
const Vulnerability = mongoose.model('Vulnerability', VulnerabilitySchema);

const connectDb = async (retries = 5, delay = 5000) => {
	while (retries > 0) {
		try {
			await mongoose.connect(process.env.MONGO_URI);
			logger.info('Database connected');
			return; // Allows the application to continue booting
		} catch (error) {
			retries -= 1;
			logger.error(`Database connection error: ${error.message}. Remaining attempts: ${retries}`);
			
			if (retries === 0) {
				logger.fatal('It was not possible to connect to database - The application will be closed.');
				process.exit(1); // Stops application boot
			}

			// Awaits new try
			await new Promise((res) => setTimeout(res, delay));
		}
	}
};

module.exports = {
	connectDb,
	User,
	Vulnerability,

};