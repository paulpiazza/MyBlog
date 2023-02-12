const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { param, validationResult } = require('express-validator')

module.exports = (app) => {

  /**
   * @swagger
   *   /posts/{slugg}/comments/{id}:
   *     delete:
   *       summary: Remove one comment in one post.
   *       tags: [Comments]
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
   *           description: Delete one comment in a post.
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

    '/posts/:slugg/comments/:id',

    param('slugg').not().isEmpty().trim().escape(),

    param('id').not().isEmpty().trim().escape(),

    auth,

    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: errMsg })
      }

      const slugg = req.params.slugg
      const idComment = req.params.id

      Post.findOne({ slugg }).then((post) => {

        post.comments = post.comments.filter(c => c._id != idComment && c.author === req.body.id)

        post.save().then((postUpdated) => {
          const message = `The comment ${idComment} has been deleted.`
          return res.json({ message, data: postUpdated })

        }).catch(err => {
          const message = `The comment has not been deleted. Please try later.`
          return res.status(500).json({ message, data: err })
        })
      })
    })
}