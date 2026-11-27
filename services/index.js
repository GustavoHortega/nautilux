const { addTechnology } = require('./user');

module.exports ={
	createUser: require('./user').createUser,
	loginUser: require('./user').loginUser,
	addTechnology: require('./user').addTechnology,
	updateTechnology: require('./user').updateTechnology,
	deleteTechnology: require('./user').deleteTechnology,
	checkServiceStatus: require('./status').checkServiceStatus,
	checkVulnerability: require('./vulnerability').checkVulnerability,
	createVulnerability: require('./vulnerability').createVulnerability,
};