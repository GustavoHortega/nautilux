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

	const { password, ...savedUser } = (await User.create(user))._doc;

	return savedUser;
};


const loginUser = async (email, password) => {
	if (!email || !password) {
		throw new Error('Email and password is required.');
	}

	const user = await User.findOne({ email: email}).select('password');

	const validPassword = await bcrypt.compare(password, user.password);


	if(!user || !validPassword) {
		throw new Error('User not found, please verify email adress.');
	}

	if(validPassword) {
		return generateToken({ userId: user._id });
	}


};

module.exports = {
	createUser,
	loginUser,

};