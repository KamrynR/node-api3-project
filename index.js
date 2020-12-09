const express = require('express');

const server = express();
const port = 8080;

const userRouter = require("./users/userRouter")

server.use(express.json())

server.use((req, res, next) => {
	const time = new Date().toISOString()
	console.log(`\n*** New Request *** \n Time: [${time}]\n IP address: ${req.ip}\n Method: ${req.method}\n URL: ${req.url}`)
    next()
})

server.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the server.'
    })
})

server.use('/users/', userRouter)

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong, please try again later.",
	})
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})