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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})