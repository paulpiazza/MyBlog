const auth = require('../../auth/auth')
const User = require('../../models/User.js')
const logger = require('../../../logs/logger')


module.exports = (app) => {

  /**
 * DELETE /profile/me
 * @summary delete your account
 * @tags profile
 * @return 200 - success response - application/json
 * @return 400 - no user found - application/json
 * @return 500 - internal error - application/json
 */
  app.delete('/profile/me', auth, async (req, res) => {

    const userId = req.body.id

    try {
      const doc = await User.findByIdAndDelete(userId)

      if(!doc){
        logger.error(`user ${userId} tries to delete its account and fail.`)
        return res.status(400).json({ message: 'No user found.' })
      }

      const message = `Your account ${doc.email} has been deleted.`
      return res.json({ message, data: doc })

    } catch (error) {
      const message = `Internal error. Please try later.`
      return res.status(500).json({ message, data: error.message })
    }
  })
}