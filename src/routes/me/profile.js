const User = require('../../models/User.js')
const auth = require('../../auth/auth')

module.exports = (app) => {

    /**
     * @swagger
     *   /profile/me:
     *     get:
     *       summary: get your profile.
     *       tags: [Profile]
     *       security:
     *         - bearerAuth: []
     *       responses:
     *         "200":
     *           description: Get your profile (email and password).
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
    app.get('/profile/me', auth, (req, res) => {

        const userId = req.body.id

        User.findById(userId).then((user) => {

            if (!user) {
                const message = `No user found. Please try to login.`
                return res.status(404).json({ message })
            }

            const message = `Profile ${user.email} found.`
            res.json({ message, data: user })

        }).catch(err => {
            const message = `Internal error. Please try later.`
            res.status(500).json({ message, data: err.message })

        })
    })
}