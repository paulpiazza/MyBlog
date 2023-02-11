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
   * @swagger
   *   /users/login:
   *     post:
   *       summary: Log in with your credentials and get your token.
   *       tags: [Users]
   *       requestBody:
   *         description: credentials (email and password).
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Log in.
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
