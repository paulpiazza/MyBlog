const bcrypt = require('bcrypt')
const Post = require('../src/models/Post')
const User = require('../src/models/User')

const saltRounds = 10


module.exports = async () => {

    // create a testing user

    const userTest = {
        email: "addpostsfixtures@myblob.net",
        password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds),
        role: 'User'
    }

    let user = await User.findOne({ email: userTest.email })

    if (!user) {
        user = await User.create(userTest)
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

    Post.insertMany(posts, (err, docs) => {
        if (err) {
            console.error("Loading fixtures Posts failed.", err)
            return
        }

        console.info(`${docs.length} Posts fixtures added.`)

    })
}

