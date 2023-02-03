const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);
const User = require('../../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const privateKey = process.env.PRIVATE_KEY_JWT_TOKEN

module.exports = (app) => {

  app.post(

    '/users/login',

    bruteforce.prevent,

    body('email')
      .escape().trim().isEmail().normalizeEmail()
      .withMessage('enter a valid email'),

    body('password')
      .trim().isLength({ min: 8, max: 12 })
      .isStrongPassword()
      .withMessage('between 8 and 12 characters.'),

    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
      }

      User.findOne({ email: req.body.email }).exec().then((user) => {

        if (!user) {
          return res.status(400).json({ message: 'No user found.' })
        }

        return bcrypt.compare(req.body.password, user.password).then((result) => {
          if (!result) {
            return res.status(400).json({ message: 'bad credentials' })
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
