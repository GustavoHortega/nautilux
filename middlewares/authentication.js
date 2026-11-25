const { verifyToken } = require('../auth');

const authenticate = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if(!authHeader || !authHeader.startsWith('Bearer ')) { // Verify if Bearer header exists
		return res.status(401).json({
			success: false,
			error: 'Authentication is required.'
		});
	}

	const token = authHeader.split(' ')[1]; // extracts token from header

	try {
		req.user = verifyToken(token);
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			error: 'Invalid or expired token.'
		});
	}

};

module.exports = {
	authenticate
};