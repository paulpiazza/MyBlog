const logger = require('../../../logs/logger')
const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts:
   *     get:
   *       summary: Get all posts.
   *       tags: [Posts]
   *       responses:
   *         "200":
   *           description: Get all posts.
   *           contents: 
   *             application/json:
   *         "400":
   *           $ref: '#/components/responses/400'
   *         "401":
   *           $ref: '#/components/responses/401'
   *         "500":
   *           $ref: '#/components/responses/500'
  */
  app.get('/posts', (req, res) => {

    return Post.find().then((posts) => {

      if (posts.length === 0) {
        const message = `No posts found.`
        return res.status(400).json({ message })
      }

      const msg = `find ${posts.length} posts`
      return res.json({ message: msg, data: posts })

    }).catch(err => {
      const message = `No posts found. Please try later.`
      logger.error(message)
      return res.status(500).json({ message: message, data: err })

    })

  })
}