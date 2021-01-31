const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const config = require('./config/key')

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
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})