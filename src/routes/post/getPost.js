module.exports = (app) => {
    app.get('/posts/:slugg', (req, res) => {
    const Post = require('../../models/Post.js')

    const slugg = req.params.slugg;
    
    return Post.findOne({slugg}).then((post) => {
      const msg = `find the ${post.slugg}`
      
      res.json({message: msg, data: post})
      
    }).catch(err => {
      const message = `No posts found. Please try later.`
      
      res.status(500).json({ message: message, data: err })
      
    })
    
  })
}