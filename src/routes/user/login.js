module.exports = (app) => {
  app.post('/users/login', (req, res) => {
    const User = require('../../models/User.js')
    const bcrypt = require('bcrypt')
    const jwt = require('jsonwebtoken')
    const privateKey = process.env.PRIVATE_KEY_JWT_TOKEN

    User.findOne({ email: req.body.email }).exec().then((user) => {

      if (!user) {
        res.status(400).json({ message: 'No user found.' })
      }

      return bcrypt.compare(req.body.password, user.password).then((result) => {
        if (result == false) {
          res.status(400).json({ message: 'bad credentials' })
        }

        const token = jwt.sign({ email: user.email }, privateKey, { expiresIn: '6h' })

        const message = `Login success!`
        res.json({ message, data: user, token })

      })

    }).catch(err => {
      const message = `Internal error. Please try later.`

      res.status(500).json({ message, data: err })
    })
  })
}
