const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);
const User = require('../../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

const privateKey = process.env.PRIVATE_KEY_JWT_TOKEN

module.exports = (app) => {

  /**
   * POST /users/login
   * @summary Log in and get access to your account
   * @tags Log In
   * @param {email} request.body.email - Email (login)
   * @param {password} request.body.password - Password
   * @return 200 - success response - application/json
   * @return 400 - bad credentials - application/json
   * @return 500 - internal error - application/json
   * @example request - example payload
   * {
   *  "email": "myname@myblog.net",
   *  "password": "Qjd56H*24"
   * }
   */
  app.post(

    '/users/login',

    bruteforce.prevent,

    body('email')
      .escape().trim().isEmail().normalizeEmail()
      .withMessage('enter a valid email'),

    body('password')
      .escape().trim()
      .isStrongPassword()
      .withMessage('enter your password'),

    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `${req.body.email} tries to login. Errors on ${msg}.`
        logger.error(errMsg)
        return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request.` })
      }

      User.findOne({ email: req.body.email }).exec().then((user) => {

        if (!user) {
          return res.status(400).json({ message: 'No user found.' })
        }

        return bcrypt.compare(req.body.password, user.password).then((result) => {
          if (!result) {
            return res.status(400).json({ message: 'bad credentials' })
          }

          const token = jwt.sign({ id: user._id, role: user.role }, privateKey, { expiresIn: '6h' })

          const message = `Login success!`
          res.json({ message, data: user, token })

        })

      }).catch(err => {
        const message = `Internal error. Please try later.`

        res.status(500).json({ message, data: err })
      })
    })
}
