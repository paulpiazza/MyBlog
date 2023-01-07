module.exports = (app) => {
    app.get('/posts', (req, res) => {
    const Post = require('../../models/Post.js')
    
    return Post.find().then((posts) => {
      const msg = `find ${posts.length} posts`
      
      res.json({message: msg, data: posts})
      
    }).catch(err => {
      const message = `No posts found. Please try later.`
      
      res.status(500).json({ message: message, data: err })
      
    })
    
  })
}