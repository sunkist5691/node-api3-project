const express = require('express')
// import express
const morgan = require('morgan')
// import morgan

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')
// import routers

const server = express()
// create server

server.use(express.json())
// use a json parsing every time request we get
server.use(morgan('dev'))
server.use(logger)
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)
// routers

//custom middleware

function logger(req, res, next) {
   console.log(req.method, req.url, new Date(new Date().toUTCString().slice(0, -3)))
   morgan('dev')
   next()
}

server.listen(5000, () => {
   console.log('\n*** Server Running on http://localhost:5000 ***\n');
})
// able to run server at port 5000

/*

USER
   { 
      id: 23,
      name: Joshua
   }

POST
   {
      id: 41,
      text: 'Hello',
      user_id: 23
   }

*/