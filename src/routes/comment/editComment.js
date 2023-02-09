const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
 * PUT /posts/{slugg}/comments/{id}
 * @summary update a comment in a post
 * @tags comments
 * @param {body} request.body.body - Body of the comment
 * @param {slugg} request.params.slugg - Title of the post
 * @param {id} request.params.id - id of the comment
 * @return 200 - success response - application/json
 * @return 400 - client error - application/json
 * @return 500 - internal error - application/json
 * @example request - example payload
 * {
 *     "body": "my comment"
 *   }
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