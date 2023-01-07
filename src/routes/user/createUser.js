module.exports = (app) => {

  app.post('/users/new', (req, res) => {
    const User = require('../../models/User.js')
    const bcrypt = require('bcrypt')

    bcrypt.hash(req.body.password, 10).then((hash) => {
      const newUser = {
        email: req.body.email,
        password: hash
      }

      const user = new User(newUser)

      res.json({ user })

      user.save().then((userCreated) => {
        const message = `New user created with email address: ${userCreated.email}`
        res.json({ message, data: userCreated })
      })

    }).catch(err => {
      const message = `Internal error. Please try later.`

      res.status(500).json({ message, data: err })

    })

  })
}