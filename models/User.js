const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		maxlength: 20
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},
	tokenExp: {
		type: Number
	}
})

userSchema.pre('save', function (next) {
	const saltRounds = 10
	const user = this

	if (!user.isModified('password')) next();
	// password 를 bcrypt 로 암호화 한다.
	bcrypt.genSalt(saltRounds, (error, salt) => {
		if (error) return next(error)

		bcrypt.hash(user.password, salt, (error, hash) => {
			if (error) return next(error)
			user.password = hash
			next()
		})
	});
})

const User = mongoose.model('User', userSchema)

module.exports = { User }