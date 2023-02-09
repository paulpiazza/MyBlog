const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * PUT /posts/{slugg}
   * @summary update a post
   * @tags posts
   * @param {body} request.body.body - Body of the post
   * @param {slugg} request.body.slugg - title of the post
   * @return 200 - success response - application/json
   * @return 400 - no user found - application/json
   * @return 500 - internal error - application/json
   * @example request - example payload
   * {
   *     "slugg": "my first title",
   *     "body": "<h1>My title</h1><p>test paragraph</p>"
   *   }
  */
  app.put(

    '/posts/:slugg',

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