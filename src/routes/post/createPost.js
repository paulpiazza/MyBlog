const Post = require('../../models/Post.js')
const auth = require('../../auth/auth')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')


module.exports = (app) => {

  /**
 * POST /posts/new
 * @summary create a post
 * @tags posts
 * @param {body} request.body.body - Body of the post
 * @param {slugg} request.body.slugg - Title of the post
 * @return 200 - success response - application/json
 * @return 400 - no user found - application/json
 * @return 500 - internal error - application/json
 * @example request - example payload
 * {
 *     "slugg": "my first title",
 *     "body": "<h1>My title</h1><p>test paragraph</p>"
 *   }
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

        return res.json({ message: 'new post created', data: newPost })

      } catch (error) {
        const message = `The post has not been created. Please try later.`
        return res.status(500).json({ message, data: error.message })
      }

    })
}