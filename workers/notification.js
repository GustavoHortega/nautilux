const { User } = require('../models');
const { sendPendingNotifications } = require('../services/notificationSender');
const { logger } = require('../utils');

const syncNotifications = async () => {
    const users = await User.find({}, '_id').lean();

    let processed = 0;
    let failed = 0;
    let notificationsSent = 0;

    for (const user of users) {
        try {
            const sent = await sendPendingNotifications(user._id);

            notificationsSent += sent;
            processed++;

        } catch (error) {
            failed++;

            logger.error(
                `Failed to process notifications for user ${user._id}:`,
                error.message
            );
        }
    }

    return {
        totalUsers: users.length,
        processed,
        failed,
        notificationsSent
    };
};

module.exports = { syncNotifications };