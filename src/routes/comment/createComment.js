const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * POST /posts/:slugg/comments/new
   * @summary create a comment in a post
   * @tags comments
   * @param {body} request.body.body - Body of the comment
   * @param {slugg} request.body.slugg - Title of the post
   * @param {date} request.body.date - date of the comment
   * @return 200 - success response - application/json
   * @return 400 - no user found - application/json
   * @return 500 - internal error - application/json
   * @example request - example payload
   * {
   *     "date": "2022-02-01",
   *     "body": "my comment"
   *   }
   */
  app.post(

    '/posts/{slugg}/comments/new',

    body('slugg').escape().trim(),

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

      const comment = {
        author: req.body.id,
        body: req.body.body
      }

      Post.findOne({ slugg }).then((post) => {
        post.comments.push(comment)

        post.save().then((post) => {
          const message = `The comment has been created.`

          res.json({ message, data: post })

        }).catch(err => {
          const message = `The comment has not been created. Please try later.`

          res.status(500).json({ message, data: err })
        })
      })
    })
}