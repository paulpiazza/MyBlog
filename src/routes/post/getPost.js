const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}:
   *     get:
   *       summary: Get one post by slugg.
   *       tags: [Posts]
   *       parameters:
   *         - in: path
   *           name: slugg
   *           schema:
   *             type: string
   *           required: true
   *           description: title of the post sluggified (the_post_title).
   *       responses:
   *         "200":
   *           description: Get one post by slugg.
   *           contents: 
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Post'
   *         "400":
   *           $ref: '#/components/responses/400'
   *         "401":
   *           $ref: '#/components/responses/401'
   *         "500":
   *           $ref: '#/components/responses/500'
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
      logger.error(`Client tries to get ${slugg}. Error:${message}`)
      return res.status(500).json({ message: message, data: err })

    })

  })
}