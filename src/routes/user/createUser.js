const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();
const User = require('../../models/User.js')
const bcrypt = require('bcrypt')
const bruteforce = new ExpressBrute(store)
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {


  /**
   * GET /users/new
   * @summary create new account
   * @tags file upload
   * @return 200 - success response - application/json
   */
  app.post(

    '/users/new',

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
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `${req.body.email} tries to create an account. Errors on ${msg}.`
        logger.error(errMsg)
        return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request.` })
      }

      bcrypt.hash(req.body.password, 10).then((hash) => {
        const newUser = {
          email: req.body.email,
          password: hash
        }

        User.create(newUser).then((userCreated) => {
          const message = `New user created with email address: ${userCreated.email}. You can now login and get your token.`
          res.json({ message, data: userCreated })
        })

      }).catch(err => {
        const message = `Internal error. Please try later.`

        res.status(500).json({ message, data: err })

      })

    })
}