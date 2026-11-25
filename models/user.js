const { Schema } = require('mongoose');

const UserSchema = new Schema({
	nickname: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: {
			validator: function (v) {
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
			},
			message: props => `${props.value} is not a valid e-mail adress`
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	}
});

module.exports = UserSchema;