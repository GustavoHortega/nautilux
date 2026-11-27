const bcrypt = require('bcrypt');
const { generateToken } = require('../auth');

const { User } = require('../models');


const createUser = async (user) => {
	if (!user.password) {
		throw new Error('Password is required!');
	}

	if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(user.password)) {
		throw new Error('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.');
	}

	if (!user.nickname) {
		throw new Error('Nickname is required!');
	}

	if (await User.findOne({ nickname: user.nickname })) {
		throw new Error('This nickname already exists.');
	}

	if (!user.email) {
		throw new Error('E-mail is required!');
	}

	if (await User.findOne({ email: user.email })) {
		throw new Error('This user already exists, please sign in.');
	}

	const hashedPassword = await bcrypt.hash(user.password, 10);
	user.password = hashedPassword;

	const savedUser = (await User.create(user)).toObject();
	delete savedUser.password;

	return savedUser;
};

const loginUser = async (email, password) => {
	if (!email || !password) {
		throw new Error('Email and password are required.');
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		throw new Error('Invalid email or password.');
	}

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		throw new Error('Invalid email or password.');
	}

	return generateToken({ userId: user._id });
};

const addTechnology = async (userId, technology) => {
	try {
		const user = await User.findById(userId);

		if (!user) {
			throw new Error('User not found.')
		}

		const exists = user.technologies.some(tech =>
			tech.name === technology.name &&
			tech.ecosystem === technology.ecosystem
		);

		if (exists) {
			const error = new Error('This technology is already saved.');
			error.statusCode = 409;
			throw error;
		}

		user.technologies.push(technology);

		await user.save();

		return user.technologies[user.technologies.length - 1];

	} catch (error) {
		throw error
	}
}

const updateTechnology = async (userId, technologyId, updates) => {
	const user = await User.findById(userId);

	if (!user) {
		throw new Error('User not found.');
	}

	const technology = user.technologies.id(technologyId);

	if (!technology) {
		const error = new Error('Technology not found.');
		error.statusCode = 404;
		throw error;
	}

	const allowedFields = ['name', 'ecosystem', 'version'];

	for (const field of allowedFields) {
		if (updates[field] !== undefined) {
			technology[field] = updates[field];
		}
	}

	await user.save();

	return technology;
};

const deleteTechnology = async (userId, technologyId) => {
	const user = await User.findById(userId);

	if (!user) {
		throw new Error('User not found.');
	}

	const technology = user.technologies.id(technologyId);

	if (!technology) {
		const error = new Error('Technology not found.');
		error.statusCode = 404;
		throw error;
	}

	technology.deleteOne();

	await user.save();

	return technology;
};

module.exports = {
	createUser,
	loginUser,
	addTechnology,
	updateTechnology,
	deleteTechnology,

};