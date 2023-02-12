const auth = require('../../auth/auth')
const User = require('../../models/User.js')

module.exports = (app) => {

  /**
   * @swagger
   *   /users:
   *     get:
   *       summary: Get all account (only for admins).
   *       tags: [Users]
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: List of accounts.
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
  app.get('/users', auth, (req, res) => {

    User.find()
      .select('email createdAt updatedAt')
      .exec()
      .then((users) => {

        if(users.length === 0) {
          const message = `No users found.`
          return res.status(400).json({ message })
        }

        const message = `${users.length} user(s) found.`
        return res.json({ message, data: users })

      }).catch(err => {
        const message = `Internal error. Please try later.`
        return res.status(500).json({ message, data: err })

      })
  })
}