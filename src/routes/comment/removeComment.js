const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')

module.exports = (app) => {

    /**
 * DELETE /posts/{slugg}/comments/{id}
 * @summary delete a comment in a post
 * @tags comments
 * @param {slugg} request.params.slugg - Title of the post
 * @param {id} request.params.id - id of the comment
 * @return 200 - success response - application/json
 * @return 400 - client error - application/json
 * @return 500 - internal error - application/json
 */
  app.delete('/posts/:slugg/comments/:id', auth, (req, res) => {

    const slugg = req.params.slugg
    const idComment = req.params.id
    
    Post.findOne({ slugg }).then((post) => {

      post.comments = post.comments.filter(c => c._id != idComment && c.author === req.body.id)
      
      post.save().then((postUpdated) => {
        const message = `The comment ${idComment} has been deleted.`
        return res.json({message, data: postUpdated})
        
      }).catch(err => {
         const message = `The comment has not been deleted. Please try later.`
         return res.status(500).json({ message, data: err })
      })
    })
  })
}