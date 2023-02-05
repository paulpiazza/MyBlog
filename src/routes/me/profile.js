const User = require('../../models/User.js')
const auth = require('../../auth/auth')

module.exports = (app) => {

    /**
     * GET /profile/me
     * @summary get datas about my profile
     * @tags profile
     * @return 200 - success response - application/json
     * @return 400 - no user found - application/json
     * @return 500 - internal error - application/json
     */
    app.get('/profile/me', auth, (req, res) => {

        const userId = req.body.id

        User.findById(userId).then((user) => {

            if (!user) {
                const message = `No user found. Please try to login.`
                return res.status(400).json({ message })
            }

            const message = `Profile ${user.email} found.`
            res.json({ message, data: user })

        }).catch(err => {
            const message = `Internal error. Please try later.`
            res.status(500).json({ message, data: err })

        })

    })
}