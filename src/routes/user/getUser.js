const User = require('../../models/User.js')
const auth = require('../../auth/auth')
const { param, validationResult } = require('express-validator')

module.exports = (app) => {
  
  /**
   * @swagger
   *   /users/{id}:
   *     get:
   *       summary: Get one account by id (only for admins).
   *       tags: [Users]
   *       security:
   *         - bearerAuth: []
   *       parameters:
   *         - in: path
   *           name: id
   *           schema:
   *             type: string
   *           required: true
   *           description: id of the account.
   *       responses:
   *         "200":
   *           description: data of an account.
   *           contents: 
   *             application/json:
   *                 $ref: '#/components/schemas/User'
   *         "400":
   *           $ref: '#/components/responses/400'
   *         "401":
   *           $ref: '#/components/responses/401'
   *         "500":
   *           $ref: '#/components/responses/500'
   */
  app.get(
    
    '/users/:id',

    param('id').not().isEmpty().trim().escape(),
    
    auth,
    
    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: errMsg })
      }


    const userId = req.params.id

    User.findById(userId)
      .select('email createdAt updatedAt')
      .exec()
      .then((user) => {

        if (!user) {
          const message = `No user found.`
          return res.status(400).json({ message })
        }

        const message = `Profile ${user.email} found.`
        return res.json({ message, data: user })

      }).catch(err => {
        const message = `Internal error. Please try later.`
        return res.status(500).json({ message, data: err })

      })
  })
}