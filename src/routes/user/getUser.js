const User = require('../../models/User.js')
const auth = require('../../auth/auth')

module.exports = (app) => {

  /**
 * GET /users/{id}
 * @summary get all users
 * @tags users, account
 * @return 200 - success response - application/json
 * @return 400 - bad credentials - application/json
 * @return 500 - internal error - application/json
 */
  app.get('/users/:id', auth, (req, res) => {

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