const Post = require('../../models/Post.js')
const auth = require('../../auth/auth')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')


module.exports = (app) => {

  /**
   * @swagger
   *   /posts/new:
   *     post:
   *       summary: Creates one slugg.
   *       tags: [Posts]
   *       requestBody:
   *         description: Data for creating new post.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Create one post.
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
  app.post(

    '/posts/new',

    body('slugg').escape().trim(),

    body('body').escape().trim(),

    auth,

    async (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: `${errMsg} Checks your inputs.` })
      }

      const newPost = {
        author: req.body.id,
        body: req.body.body,
        slugg: req.body.slugg
      }

      try {

        const post = await Post.create(newPost)

        if (!post) {
          const message = `The post has not been created. Please try later.`
          return res.status(400).json({ message: `${message}` })
        }

        return res.json({ message: 'new post created', data: post })

      } catch (error) {
        const message = `The post has not been created. Please try later.`
        logger.error(`Client tries to create a post and fails. ${newPost.slugg}, ${newPost.body} .Error: ${message}`)
        return res.status(500).json({ message, data: error.message })
      }

    })
}