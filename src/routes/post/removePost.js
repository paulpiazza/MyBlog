const Post = require('../../models/Post.js')
const auth = require('../../auth/auth')
const { param, validationResult } = require('express-validator')


module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}:
   *     delete:
   *       summary: Remove one post by slugg.
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
  app.delete(

    '/posts/:slugg',

    param('slugg').not().isEmpty().trim().escape(),

    auth,

    async (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: errMsg })
      }

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