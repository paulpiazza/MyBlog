const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')

module.exports = (app) => {

    /**
 * DELETE /posts/{slugg}/comments/{id}
 * @summary delete a comment in a post
 * @tags comments
 * @param {body} request.body.body - Body of the comment
 * @param {slugg} request.body.slugg - Title of the post
 * @param {id} id - id of the post
 * @return 200 - success response - application/json
 * @return 400 - no user found - application/json
 * @return 500 - internal error - application/json
 */
  app.delete('/posts/:slugg/comments/:id', auth, (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const msg = errors.array().map(err => err.param).join(', ')
      const errMsg = `Errors on ${msg}.`
      return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request. Your password should have a minimum of 8 characters. It should contain lowercase, uppercase, numbers, and special characters.` })
    }
    
    const slugg = req.params.slugg
    const idComment = req.params.id
    
    Post.findOne({ slugg }).then((post) => {
      const comments = post.comments.filter(c => c._id != idComment && c.author == req.body.id)
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