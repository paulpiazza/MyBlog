const Post = require('../../models/Post.js')
const auth = require('../../auth/auth')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}:
   *     delete:
   *       summary: Remove one slugg.
   *       tags: [Posts]
   *       parameters:
   *         - in: path
   *           name: slugg
   *           schema:
   *             type: string
   *           required: true
   *           description: title of the post sluggified (the_post_title).
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Delete one post.
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
  app.delete('/posts/:slugg', auth, async (req, res) => {

    const slugg = req.params.slugg

    try {

      const post = await Post.findOne({ slugg })

      const count = await Post.deleteOne({ slugg })

      if (count === 0) {
        const message = 'No post found.'
        return res.status(400).json({ message })
      }

      return res.json({ message: `${count.deletedCount} post(s) deleted`, data: post })

    } catch (error) {
      const message = `The post has not been deleted. Please try later.`
      res.status(500).json({ message, data: error.message })

    }

  })
}