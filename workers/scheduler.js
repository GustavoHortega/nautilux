const cron = require('node-cron');

const { syncVulnerabilities } = require('./vulnerability');
const { logger } = require('../utils');

const startScheduler = () => {
	
    // Vulnerability Synchronization
    cron.schedule('0 3,15 * * *', async () => {
        try {
            await syncVulnerabilities();
        } catch (error) {
            logger.error(`Vulnerability synchronization error: ${error.message}`);
        }
    });

    // Other scheduled tasks
    // cron.schedule(...);

    logger.info('Scheduler started');
};

module.exports = { startScheduler };