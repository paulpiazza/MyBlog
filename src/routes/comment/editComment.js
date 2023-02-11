const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}/comments/{id}:
   *     put:
   *       summary: Update one comment by comment id present in one post.
   *       tags: [Comments]
   *       requestBody:
   *         description: Data for updating a comment.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *               required:
   *       parameters:
   *         - in: path
   *           name: slugg
   *           schema:
   *             type: string
   *           required: true
   *           description: title of the post sluggified (the_post_title).
   *         - in: path
   *           name: id
   *           schema:
   *             type: string
   *           required: true
   *           description: id of comment in the post.
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Update one comment.
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

    '/posts/:slugg/comments/:id',

    body('body').escape().trim(),

    auth,

    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request. Your password should have a minimum of 8 characters. It should contain lowercase, uppercase, numbers, and special characters.` })
      }

      const slugg = req.params.slugg
      const idComment = req.params.id

      Post.findOne({ slugg }).then((post) => {
        const comments = post.comments.map(c => {
          if (c._id == idComment && c.author == req.body.id) {
            return {
              author: c.author,
              body: req.body.body || c.body,
              createdAt: Date.now()
            }
          } else {
            return c
          }
        })
        post.comments = comments

        post.save().then((post) => {
          const message = `The comment ${idComment} has been updated.`
          return res.json({ message, data: post })

        }).catch(err => {
          const message = `The comment has not been updated. Please try later.`
          return res.status(500).json({ message, data: err })
        })
      })
    })
}