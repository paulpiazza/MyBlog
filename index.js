const express = require('express')
const app = express()
const path = require('path')
const db = require('./src/mongodb/mongodb')
const bodyParser = require('body-parser')
require('dotenv').config()
const helmet = require('helmet')
const expressWinston = require('express-winston')
const logger = require('./logs/logger')
const errLogger = require('./logs/errorsLogger')
const winston = require('winston/lib/winston/config')
const port = process.env.PORT || 3000

db.connect()

app.use(helmet())

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

if (process.env.NODE_ENV === 'test') {
  logger.silent = true
  errLogger.silent = true
}

app.use(expressWinston.logger({
  winstonInstance: logger
}))

app.set('view engine', 'ejs')


const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'My Blog',
    license: {
      name: 'Copyrights, Paul Piazza',
    },
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },

  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './routes/**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v1/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

expressJSDocSwagger(app)(options);


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

app.use(expressWinston.errorLogger({
  winstonInstance: errLogger
}))

app.listen(port, _ => {
  console.log(`server listen on port: ${port}`)
  console.log(`Environnement: ${process.env.NODE_ENV}`)

})

module.exports = app