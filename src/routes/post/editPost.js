module.exports = (app) => {
  app.put('/posts/:slugg', (req, res) => {
    const Post = require('../../models/Post.js')

    const slugg = req.params.slugg

    const newPost = req.body
    
    return Post.findOneAndUpdate({slugg}, newPost).then((post) => {

      return Post.findOne({slugg}).then((post) => {
        const msg = `update ${post.title}`
        
        res.json({message: msg, data: post})
      })
    
    }).catch(err => {
      const message = `No posts found. Please try later.`
      
      res.status(500).json({ message: message, data: err })
      
    })
    
  })
}