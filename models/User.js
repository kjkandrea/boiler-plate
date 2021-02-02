const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
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
		minlength: 5
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

userSchema.methods.comparePassword = function (plainPassword, callback) {
	// plainPassword
	bcrypt.compare(plainPassword, this.password, function(error, isMatch) {
		if (error) return callback(error)
		callback(null, isMatch)
	})
}

userSchema.methods.generateToken = function (callback) {
	// jwt 이용해서 토큰 생성
	const user = this;
	user.token = jwt.sign(user._id.toHexString(), 'secretToken') // toHexString == mongoose 메서드
	user.save(function(error, user) {
		if (error) return callback(error)
		callback(null, user)
	})
}

userSchema.statics.findByToken = function (token, callback) {
	const user = this;

	// 토큰을 Decode 한다.
	jwt.verify(token, 'secretToken', function(error, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 다음
		// 클라이언트에서 가져온 token 과 DB 에 보관된 토큰이 일치하는지 확인
		user.findOne({'id': decoded, 'token': token}, function(error, user) {
			if (error) return callback(error)
			callback(null, user)
		})
	})
}

const User = mongoose.model('User', userSchema)

module.exports = { User }