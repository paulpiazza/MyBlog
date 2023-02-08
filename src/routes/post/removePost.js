const Post = require('../../models/Post.js')
const auth = require('../../auth/auth')

module.exports = (app) => {

  /**
  * DELETE /posts/{slugg}
  * @summary delete a post by slugg
  * @tags posts
  * @param {slugg} request.body.slugg - Title of the post
  * @return 200 - success response - application/json
  * @return 400 - no user found - application/json
  * @return 500 - internal error - application/json
  */
  app.delete('/posts/:slugg', auth, async (req, res) => {

    const slugg = req.params.slugg

    try {

      const count = Post.deleteOne({ slugg })

      if (count === 0) {
        const message = 'No post found.'
        return res.status(400).json({ message })
      }

      return res.json({ message: `${deletedCount} post(s) deleted`, data: post })

    } catch (error) {
      const message = `The post has not been deleted. Please try later.`
      res.status(500).json({ message, data: error.message })

    }

  })
}