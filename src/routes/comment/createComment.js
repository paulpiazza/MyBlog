const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}/comments/new:
   *     post:
   *       summary: Creates one comment in one post.
   *       tags: [Comments]
   *       requestBody:
   *         description: Data for creating new comment.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       parameters:
   *         - in: path
   *           name: post
   *           schema:
   *             type: string
   *           required: true
   *           description: title of the post sluggified (the_post_title).
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Create one comment.
   *           contents: 
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Comment'
   *         "400":
   *           $ref: '#/components/responses/400'
   *         "401":
   *           $ref: '#/components/responses/401'
   *         "500":
   *           $ref: '#/components/responses/500'
  */
  app.post(

    '/posts/:slugg/comments/new',

    body('body').escape().trim(),

    auth,

    (req, res) => {


      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: errMsg })
      }

      const slugg = req.params.slugg

      const comment = {
        author: req.body.id,
        body: req.body.body
      }

      Post.findOne({ slugg }).then((post) => {
        if (!post) {
          const message = `No post found.`
          return res.status(400).json({ message })
        }

        post.comments.push(comment)

        post.save().then((post) => {
          const message = `The comment has been created.`
          return res.json({ message, data: post })

        }).catch(err => {
          const message = `The comment has not been created. Please try later.`
          return res.status(500).json({ message, data: err })
        })
      })
    })
}