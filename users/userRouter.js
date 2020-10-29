const express = require('express');

const router = express.Router();

const Users = require('./userDb')
const Posts = require('../posts/postDb')
//import User extra functions

router.post('/', (req, res) => {
  // do your magic!
  const { name } = req.body

  if(!name){
    res.status(400).json({
      errorMessage: 'Please provide name for the user.'
    })
  } else {
    Users.insert(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(error => {
        res.status(500).json({
          messsage: "There was an error while adding new user."
        })
      })
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!

  const addPost = req.body

    Posts.insert(addPost)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the post in that user.'
        })
      })
});

router.get('/', validateUser, (req, res) => {
  // do your magic!
  res.status(201).json(req.users)
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params

    Users.getById(id)
      .then(user => {
        console.log('Im here')
        res.status(201).json(user)
      })
      .catch(error => {
        console.log('jail')
        res.status(500).json({
          message: 'System Error'
        })
      })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params

    Users.getUserPosts(id)
      .then(posts => {
        res.status(200).json(posts)
      })
      .catch(error => {
        res.status(500).json({
          message: 'The posts could not be retrieved.'
        })
      })

});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params

    Users.remove(id)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(error => {
        errorMessage: 'Cannot delete the user'
      })

});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params
  const { name } = req.body
  const updateUser = req.body

  if(!name){
    res.status(404).json({
      message: "Please provide correct name"
    })
  } else {
    Users.update(id, updateUser)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(error => {
        message: 'Please provide correct user info.'
      })
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params

  Users.getById(id)
    .then(user => { 

      if(user){
        console.log('user is exist: ', user)
        req.user = user

        next()
      } else {
        console.log('user is undefined')
        next({ code: 400, message: 'There is no post with id ' + id })
      }
    })
    .catch(error => {

      next({ code: 500, message: 'Something crashed and burned' })
    })
}

function validateUser(req, res, next) {
  // do your magic!
  Users.get()
    .then(users => {
      if(users.length > 0){
        console.log('users are exist: ', users)
        req.users = users
        next()
      } else {
        console.log('users aren\'t exist')
        next({ code: 500, message: 'Something crashed and burned' })
      }
    })
    .catch(error => {
      next({ code: 500, message: 'Something crashed and burned' })
    })
}

function validatePost(req, res, next) {
  // do your magic!
  const { text, user_id } = req.body

  if(!text || !user_id){
    res.status(404).json({
      message: 'Please provide correct text or user_id format'
    })
  } else {
    next()
  }
  
}

module.exports = router;

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