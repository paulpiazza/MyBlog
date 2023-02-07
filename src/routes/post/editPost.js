const auth = require('../../auth/auth')
const Post = require('../../models/Post.js')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * PUT /posts/:slugg
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

    (req, res) => {

      const slugg = req.params.slugg

      const newPost = {
        body: req.body.body,
        slugg: req.body.slugg,
      }

      return Post.findOneAndUpdate({ slugg, author: req.body.id }, newPost).then((post) => {

        return Post.findOne({ slugg }).then((post) => {

          if (!post) {
            const message = `update ${post.slugg} fails.`
            return res.json({ message })
          }

          const msg = `update ${post.slugg}`
          return res.json({ message: msg, data: post })
        })

      }).catch(err => {
        const message = `No posts found. Please try later.`

        res.status(500).json({ message: message, data: err })

      })

    })
}