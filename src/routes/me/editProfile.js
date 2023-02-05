const auth = require('../../auth/auth')

module.exports = (app) => {

  app.put('/profile/me', auth, async (req, res) => {
    const User = require('../../models/User.js')
    const bcrypt = require('bcrypt')

    const userId = req.body.userid

    const newUser = {
      email: req.body.email
    }

    if ('password' in req.body) {
      const hash = await bcrypt.hash(req.body.password, 10)
      newUser['password'] = hash
    }

    return User.findByIdAndUpdate(userId, newUser).then(() => {

      return User.findById(userId).then((user) => {
        const message = `The user ${user.email} has been updated.`
        res.json({ message, data: user })
      })

    }).catch(err => {
      const message = `Internal error. Please try later.`

      res.status(500).json({ message, data: err })

    })

  })
}