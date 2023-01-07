const auth = require('../../auth/auth')

module.exports = (app) => {
  app.get('/users', auth, (req, res) => {
    const User = require('../../models/User.js')

    User.find()
      .select('email')
      .exec()
      .then((users) => {
        const message = `${users.length} user(s) found.`

        res.json({ message, data: users })

      }).catch(err => {
        const message = `Internal error. Please try later.`

        res.status(500).json({ message, data: err })

      })
  })
}