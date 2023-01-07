const auth = require('../../auth/auth')

module.exports = (app) => {
  app.get('/profile/:id', auth, (req, res) => {
    const User = require('../../models/User.js')

    const userId = req.params.id

    User.findById(userId).then((user) => {
      const message = `Profile ${user.email} found.`
      res.json({ message, data: user })

    }).catch(err => {
      const message = `Internal error. Please try later.`

      res.status(500).json({ message, data: err })

    })
  })
}