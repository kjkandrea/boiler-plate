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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})