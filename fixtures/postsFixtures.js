const bcrypt = require('bcrypt')
const Post = require('../src/models/Post')
const User = require('../src/models/User')

const saltRounds = 10


module.exports = async () => {

    // find a testing user

    const user = await User.findOne({ email: "user@myblog.net" }).exec()

    if (!user) {
        console.error('Before creating posts fixtures you should insert user (user@myblog.net) in the database.')
        return false
    }


    // create posts fixtures

    const countPosts = await Post.find().count()

    if (countPosts > 0) {
        await Post.deleteMany()
        await Post.syncIndexes()
    }

    const posts = [
        {
            author: user.id,
            slugg: "my_first_title",
            body: "This is a testing paragraph.",
            comments: [
                { author: user.id, body: "my best comment" },
                { author: user.id, body: "second comment" }
            ]
        },
        {
            author: user.id,
            slugg: "my_second_title",
            body: "This is a second testing paragraph.",
            comments: [
                { author: user.id, body: "my second best comment" },
                { author: user.id, body: "second comment" }
            ]
        }
    ]

    try {

        const docs = await Post.insertMany(posts)
        console.info(`${docs.length} Posts fixtures added.`)

    } catch (error) {

        console.error("Loading fixtures Posts failed.", error.message())

    }
}

