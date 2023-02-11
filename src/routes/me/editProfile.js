const auth = require('../../auth/auth')
const User = require('../../models/User.js')
const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();
const bcrypt = require('bcrypt')
const bruteforce = new ExpressBrute(store)
const { body, validationResult } = require('express-validator')
const logger = require('../../../logs/logger')

module.exports = (app) => {

  /**
   * @swagger
   *   /profile/me:
   *     put:
   *       summary: Update your account.
   *       tags: [Profile]
   *       security:
   *         - bearerAuth: []
   *       requestBody:
   *         description: Data for updating your profile.
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       responses:
   *         "200":
   *           description: Update email or/and password of your account.
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
  app.put(

    '/profile/me',

    bruteforce.prevent,

    body('email')
      .isEmail().normalizeEmail()
      .escape().trim()
      .optional()
      .withMessage('enter a valid email'),

    body('password')
      .isLength({ min: 8, max: 12 })
      .isStrongPassword()
      .optional(),

    auth,

    async (req, res) => {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const msg = errors.array().map(err => err.param).join(', ')
        const errMsg = `Errors on ${msg}.`
        return res.status(400).json({ message: `${errMsg} Please check your credentials and send another request. Your password should have a minimum of 8 characters. It should contain lowercase, uppercase, numbers, and special characters.` })
      }
      
      const userId = req.body.id

      const newUser = {}

      if ('email' in req.body) {
        newUser['email'] = req.body.email
      }

      if ('password' in req.body) {
        const hash = await bcrypt.hash(req.body.password, 10)
        newUser['password'] = hash
      }

      try {
        const doc = await User.findByIdAndUpdate(userId, newUser, { new: true })

        if (!doc) {
          logger.error(`user id:${userId} tries to update its profile.`)
          return res.status(404).json({ message: 'No user found.' })
        }

        const message = `The user ${doc.email} has been updated.`
        return res.json({ message, data: doc })

      } catch (error) {
        const message = `Internal error. Please try later.`
        return res.status(500).json({ message, data: error.message })

      }
    })
}