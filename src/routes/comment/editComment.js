module.exports = (app) => {
  app.put('/posts/:slugg/comments/:id', (req, res) => {
    const Post = require('../../models/Post.js')
    const slugg = req.params.slugg
    const idComment = req.params.id
    const newComment = {
      author: req.body.author,
      body: req.body.body,
      date: req.body.date ? Date.parse(req.date) : Date.now()
    }
    Post.findOne({ slugg }).then((post) => {
      const comments = post.comments.map(c => {
        if(c._id == idComment) {
          return {
            author: req.body.author || c.author,
            body: req.body.body || c.body,
            createdAt: Date.now()
          }
        } else {
          return c
        }
      })
      post.comments = comments

      post.save().then((post) => {
        const message = `The comment ${idComment} has been updated.`

        res.json({message, data: post})
        
      }).catch(err => {
         const message = `The comment has not been updated. Please try later.`
    
         res.status(500).json({ message, data: err })
      })
    })
  })
}