module.exports = (app) => {
  app.delete('/users/:id/delete', (req, res) => {
    const User = require('../../models/User.js')

    const userId = req.params.id

    User.findById(userId).then((user) => {
      return User.findByIdAndRemove(userId).then(() => {
        const message = `user ${user.email} ha been deleted.`

        res.json({ message, data: user })

      })
    }).catch(err => {
      const message = `Internal error. Please try later.`

      res.status(500).json({ message, data: err })

    })
  })
}