const { User } = require('../models');
const { findPendingNotifications } = require('./notificationMatcher');
const { sendVulnerabilityNotification } = require('./email/vulnerability');
const { Notification } = require('../models');

const sendPendingNotifications = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }

    const pendingNotifications = await findPendingNotifications(userId);

    for (const match of pendingNotifications) {
        await sendVulnerabilityNotification(user.email, match);

        await Notification.create({
            user: userId,
            vulnerability: match.vulnerability.osvId,
            technology: match.technology.name,
            version: match.technology.version
        });
    }

    return pendingNotifications.length;
};

module.exports = { sendPendingNotifications };