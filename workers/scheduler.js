const cron = require('node-cron');
const { syncVulnerabilities } = require('./vulnerability');
const { syncNotifications } = require('./notification');
const { logger } = require('../utils');

const startScheduler = () => {
    cron.schedule('0 3,15 * * *', async () => {
        try {
            logger.info('Starting vulnerability synchronization...');
            await syncVulnerabilities();

            logger.info('Starting notification synchronization...');
            const result = await syncNotifications();

            logger.info('Notification synchronization completed.', result);
        } catch (error) {
            logger.error('Scheduled synchronization failed:', error);
        }
    });
};

module.exports = { startScheduler };