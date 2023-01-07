module.exports = (app) => {
  app.post('/posts/:slugg/comments/new', (req, res) => {
    const Post = require('../../models/Post.js')
    
    const slugg = req.params.slugg
    
    const comment = {
      author: req.body.author,
      body: req.body.body,
      createdAt: req.body.date ? Date.parse(req.date) : Date.now()
    }
  
    Post.findOne({slugg}).then((post) => {
        post.comments.push(comment)
      
        post.save().then((post) => {
          const message = `The comment has been created.`

          res.json({message, data: post})
          
        }).catch(err => {
           const message = `The comment has not been created. Please try later.`
      
           res.status(500).json({ message, data: err })
        })
    })
  })
}