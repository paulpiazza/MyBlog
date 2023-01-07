module.exports = (app) => {
  app.delete('/posts/:slugg/comments/:id', (req, res) => {
    const Post = require('../../models/Post.js')
    const slugg = req.params.slugg
    const idComment = req.params.id
    
    Post.findOne({ slugg }).then((post) => {
      const comments = post.comments.filter(c => c._id != idComment)
      post.comments = comments

      post.save().then((postUpdated) => {
        const message = `The comment ${idComment} has been deleted.`

        res.json({message, data: postUpdated})
        
      }).catch(err => {
         const message = `The comment has not been deleted. Please try later.`
    
         res.status(500).json({ message, data: err })
      })
    })
  })
}