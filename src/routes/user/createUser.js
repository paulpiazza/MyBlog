const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();
const User = require('../../models/User.js')
const bcrypt = require('bcrypt')
const bruteforce = new ExpressBrute(store)
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /users/new:
   *     post:
   *       summary: Creates an account.
   *       tags: [Users]
   *       requestBody:
   *         description: Data for the new account.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Create an account.
   *           contents: 
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *         "400":
   *           $ref: '#/components/responses/400'
   *         "401":
   *           $ref: '#/components/responses/401'
   *         "500":
   *           $ref: '#/components/responses/500'
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
      .withMessage('minimum 8 characters'),

    (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request. Your password should have a minimum of 8 characters. It should contain lowercase, uppercase, numbers, and special characters.` })
      }

      bcrypt.hash(req.body.password, 10).then((hash) => {
        const newUser = {
          email: req.body.email,
          password: hash
        }

        User.create(newUser).then((userCreated) => {
          const message = `New user created with email address: ${userCreated.email}.`
          logger.error(message)
          res.json({ message: `${message} You can now login and get your token.`, data: userCreated })
        })

      }).catch(err => {
        const message = `Internal error. Please try later.`

        res.status(500).json({ message, data: err })

      })

    })
}