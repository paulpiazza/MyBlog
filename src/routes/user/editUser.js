module.exports = (app) => {

  app.put('/users/:id/update', async (req, res) => {
    const User = require('../../models/User.js')
    const bcrypt = require('bcrypt')

    const userId = req.params.id

    const newUser = {
      email: req.body.email
    }

    if ('password' in req.body) {
      const hash = await bcrypt.hash(req.body.password, 10)
      newUser['password'] = hash
    }

    console.log(newUser)

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