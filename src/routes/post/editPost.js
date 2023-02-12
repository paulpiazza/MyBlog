const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult, param } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}:
   *     put:
   *       summary: Update one post by slugg.
   *       tags: [Posts]
   *       requestBody:
   *         description: Data for updating a post.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *               required:
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
   *           description: Update one post.
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
  app.put(

    '/posts/:slugg',

    param('slugg').not().isEmpty().trim().escape(),

    body('slugg').escape().trim().optional(),

    body('body').escape().trim().optional(),

    auth,

    async (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: `${errMsg} Checks your inputs.` })
      }

      const slugg = req.params.slugg

      const newPost = {}

      if ('body' in req.body) {
        newPost['body'] = req.body.body
      }

      if ('slugg' in req.body) {
        newPost['slugg'] = req.body.slugg
      }

      try {
        console.log(slugg)
        const post = await Post.findOneAndUpdate({ slugg }, newPost, { new: true })

        if (!post) {
          const message = `update fails.`
          return res.json({ message })
        }

        const msg = `update ${post.slugg}`
        return res.json({ message: msg, data: post })

      } catch (error) {
        const message = `No posts found. Please try later.`
        res.status(500).json({ message: message, data: error.message })
      }

    })
}