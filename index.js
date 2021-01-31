const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const config = require('./config/key')
const bodyParser = require('body-parser')
const { User } = require('./models/User')

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json())

mongoose.connect(config.mongoURI, {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
	.then(() => {
		console.log('MongoDB connected...')
	})
	.catch(console.log)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/register', (req, res) => {
	// 회원가입 할때 필요한 정보들을 client 에서 가져오면 데이터 베이스에 넣어준다.

	const user = new User(req.body)
	user.save((error, userInfo) => {
		if(error) return res.json({ success: false, error})
		return res.status(200).json ({
			success: true
		})
	})
})

app.post('/login', (req, res) => {
	// 요청된 이메일이 데이터베이스에 있는지 판별
	User.findOne({ email: req.body.email }, (error, user) => {
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "존재하지 않는 이메일입니다."
			})
		}

		// 요청된 이메일이 데이터 베이스에 있다면
		// 패스워드가 일치하는지 판별
		user.comparePassword(req.body.password, (error, isMatch) => {
			if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

			// 패스워드가 일치하면 토큰 생성
			user.generateToken((error, user) => {
				if (error) return res.status(400).send(error)

				// 토큰을 저장한다. 쿠키/로컬 스토리지

			})
		})
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})