const bcrypt = require('bcrypt')
const User = require('../src/models/User')

const saltRounds = 10;


module.exports = async () => {

    const count = await User.find().count()

    if (count > 0) {
        await User.deleteMany()
        await User.syncIndexes()
    }

    const users = [
        {
            email: "admin@myblog.net",
            password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds),
            role: 'Admin'
        },
        {
            email: "user@myblog.net",
            password: await bcrypt.hash(process.env.USER_PWD_TEST, saltRounds)
        }
    ]

    try {

        const docs = await User.insertMany(users)
        console.info(`${docs.length} Users fixtures added.`)

    } catch (error) {

        if (error) {
            console.error("Loading fixtures Users failed.", error.message())
        }

    }
}

