const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')

module.exports = (app) => {

  /**
  * GET /posts
  * @summary get a post by slugg
  * @tags posts
  * @return 200 - success response - application/json
  * @return 400 - no user found - application/json
  * @return 500 - internal error - application/json
  */
  app.get('/posts', (req, res) => {

    return Post.find().then((posts) => {
      
      if(posts.length === 0) {
        const message = `No posts found.`
        return res.status(400).json({ message })
      }
      
      const msg = `find ${posts.length} posts`
      return res.json({ message: msg, data: posts })

    }).catch(err => {
      const message = `No posts found. Please try later.`
      return res.status(500).json({ message: message, data: err })

    })

  })
}