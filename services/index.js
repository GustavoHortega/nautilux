module.exports ={
	createUser: require('./user').createUser,
	loginUser: require('./user').loginUser,
	checkServiceStatus: require('./status').checkServiceStatus,
	checkVulnerability: require('./vulnerability').checkVulnerability,
	createVulnerability: require('./vulnerability').createVulnerability,
};