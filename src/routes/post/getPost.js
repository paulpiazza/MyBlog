const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')

module.exports = (app) => {

  /**
  * GET /posts/:slugg
  * @summary get a post by slugg
  * @tags posts
  * @return 200 - success response - application/json
  * @return 400 - no user found - application/json
  * @return 500 - internal error - application/json
  */
  app.get('/posts/:slugg', (req, res) => {

    const slugg = req.params.slugg

    return Post.findOne({ slugg }).then((post) => {
      const msg = `Find ${post.slugg}.`

      if (!post) {
        const message = `No post found.`
        return res.status(400).json({ message })
      }

      return res.json({ message: msg, data: post })

    }).catch(err => {
      const message = `No posts found. Please try later.`
      return res.status(500).json({ message: message, data: err })

    })

  })
}