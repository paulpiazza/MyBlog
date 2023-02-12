const mg = require('mongoose')
require('dotenv').config()


async function connect() {

  let uri = process.env.MONGODB_URI_DEV

  if (process.env.NODE_ENV && process.env.NODE_ENV === "prod") {
    uri = process.env.MONGODB_URI
  }

  if (process.env.NODE_ENV === "test") {
    uri = process.env.MONGODB_URI
  }

  
  try {
    await mg.connect(uri)

    console.log(`Database: ${uri}`)
    console.log(`Connexion with db established!`)

    if (process.env.NODE_ENV === 'dev') {
      await require('../../fixtures/usersFixtures')()
      await require('../../fixtures/postsFixtures')()
    }

    return mg

  } catch(err) {
    console.log(`Connexion error: ${err}`)
  }

}

module.exports = { connect }
