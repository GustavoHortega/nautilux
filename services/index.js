module.exports ={
	createUser: require('./user').createUser,
	loginUser: require('./user').loginUser,
	addTechnology: require('./user').addTechnology,
	updateTechnology: require('./user').updateTechnology,
	deleteTechnology: require('./user').deleteTechnology,
	checkServiceStatus: require('./status').checkServiceStatus,
	checkVulnerability: require('./vulnerability').checkVulnerability,
	createVulnerability: require('./vulnerability').createVulnerability,
	matchUserVulnerabilities: require('./vulnerabilityMatcher').isVersionAffected,
	isVersionAffected: require('./vulnerabilityMatcher').isVersionAffected,
	findPendingNotifications: require('./notificationMatcher').findPendingNotifications,
	sendPendingNotifications:require('./notificationSender').sendPendingNotifications,
	
};