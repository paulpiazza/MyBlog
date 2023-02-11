const auth = require('../../auth/auth')
const User = require('../../models/User.js')
const logger = require('../../../logs/logger')


module.exports = (app) => {

  /**
   * @swagger
   *   /profile/me:
   *     delete:
   *       summary: Remove your account.
   *       tags: [Profile]
   *       security:
   *         - bearerAuth: []
   *       responses:
   *         "200":
   *           description: Delete your account.
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
  app.delete('/profile/me', auth, async (req, res) => {

    const userId = req.body.id

    try {
      const doc = await User.findByIdAndDelete(userId)

      if(!doc){
        logger.error(`user ${userId} tries to delete its account and fail.`)
        return res.status(404).json({ message: 'No user found.' })
      }

      const message = `Your account ${doc.email} has been deleted.`
      return res.json({ message, data: doc })

    } catch (error) {
      const message = `Internal error. Please try later.`
      return res.status(500).json({ message, data: error.message })
    }
  })
}