const express = require('express')
const app = express()
const path = require('path')
const db = require('./src/mongodb/mongodb')
const bodyParser = require('body-parser')
require('dotenv').config()
const helmet = require('helmet')
const port = process.env.PORT || 3000

db.connect()

app.use(helmet())

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

//todo : use Route() from Express
const sources = path.join(__dirname, 'src', 'routes')



// GET root
const sourcesRoot = path.join(sources, 'root')
require(path.join(sourcesRoot, 'main.js'))(app)
require(path.join(sourcesRoot, 'signin.js'))(app)
require(path.join(sourcesRoot, 'login.js'))(app)

// post
const sourcesPost = path.join(sources, 'post')
require(path.join(sourcesPost, 'createPost.js'))(app)
require(path.join(sourcesPost, 'getPost.js'))(app)
require(path.join(sourcesPost, 'getAllPosts.js'))(app)
require(path.join(sourcesPost, 'editPost.js'))(app)
require(path.join(sourcesPost, 'removePost.js'))(app)

// post comments
const sourcesComment = path.join(sources, 'comment')
require(path.join(sourcesComment, 'createComment.js'))(app)
require(path.join(sourcesComment, 'editComment.js'))(app)
require(path.join(sourcesComment, 'removeComment.js'))(app)

// users
const sourcesUsers = path.join(sources, 'user')
require(path.join(sourcesUsers, 'createUser'))(app)
require(path.join(sourcesUsers, 'getAllUsers'))(app)
require(path.join(sourcesUsers, 'getUser'))(app)
require(path.join(sourcesUsers, 'editUser'))(app)
require(path.join(sourcesUsers, 'removeUser'))(app)
require(path.join(sourcesUsers, 'login'))(app)



app.listen(port, _ => {
  console.log(`server listen on port: ${port}`)
  console.log(`Environnement: ${process.env.NODE_ENV}`)

})

module.exports = app