const auth = require('../../auth/auth')
const User = require('../../models/User.js')

module.exports = (app) => {

/**
 * GET /users/new
 * @summary get all users
 * @tags users, account
 * @return 200 - success response - application/json
 * @return 400 - bad credentials - application/json
 * @return 500 - internal error - application/json
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