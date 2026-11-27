const { Notification } = require('../models');
const { matchUserVulnerabilities } = require('./vulnerabilityMatcher');

const findPendingNotifications = async (userId) => {
    const matches = await matchUserVulnerabilities(userId);

    const notifications = await Notification.find({
        user: userId
    }).select('vulnerability');

    const notifiedVulnerabilities = new Set(
        notifications.map(notification => notification.vulnerability)
    );

    const pendingNotifications = matches.filter(match =>
        !notifiedVulnerabilities.has(match.vulnerability.osvId)
    );

    return pendingNotifications;
};

module.exports = {
    findPendingNotifications
};