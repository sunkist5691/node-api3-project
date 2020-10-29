const express = require('express');

const router = express.Router();

const Posts = require('./postDb')
// import Post extra functions

router.get('/', (req, res) => {
  // do your magic!
  Posts.get(req.query)
    .then(posts => {
      res.status(200).json({
        query: req.query, posts: posts
      })
    })
    .catch(error => {
      res.status(500).json({
        error: "The posts information could not be retrieved." 
      })
    })
});

router.get('/:id', validatePostId, (req, res) => {

  if(!req.post){
    console.log('req.post', req.post)
    res.status(404).json({
      message: 'your id is not validated'
    })
  } else {
    console.log('sending a post to client')
    res.status(200).json(req.post)
  }

})

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!

  const { id } = req.params

  console.log('delete id log', id)

  Posts.remove(id)
    .then(post => {
      res.status(201).json({
        message: 'Successfully Deleted'
      })
    })
    .catch(error => {
      res.status(500).json({
        error: 'The post could not be removed'
      })
    })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  console.log(req.params)
  console.log(req.body)
  
  const { id } = req.params
  const { text } = req.body
  const updatedPost = req.body

  if(!text){
      res.status(404).json({
        errorMessage: "Please provide text for the post that you like to update."
      })
  } else {
    Posts.update(id, updatedPost)
      .then(count => {

        console.log(count)

        Posts.getById(id)
          .then(post => {
            console.log(post)
            res.status(201).json(post)
          })
          .catch(error => {
            res.status(500).json({
              message: 'Something went wrong!, cannot find the post'
            })
          })
      })
      .catch(error => {
        res.status(500).json({
          error: 'The post information could not be modified'
        })
      })
  }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params

  Posts.getById(id)
    .then(data => { 

      if(data){
        console.log('data is exist: ', data)
        req.post = data

        next()
      } else {
        console.log('data is undefined')
        next({ code: 400, message: 'There is no post with id ' + id })
      }
    })
    .catch(error => {

      next({ code: 500, message: 'Something crashed and burned' })
    })
  
}

module.exports = router;

/*

POST
   {
      id: 41,
      text: 'Hello',
      user_id: 23
   }

*/