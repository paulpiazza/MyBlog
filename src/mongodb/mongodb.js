const mg = require('mongoose');
require('dotenv').config()

const uri = process.env.NODE_ENV && process.env.NODE_ENV === "Prod" ? process.env.MONGODB_URI : process.env.MONGODB_URI_TEST

mg.connect(uri).then(async () => {
  
  if(process.env.NODE_ENV !== 'Prd') {
    console.log(`Database: ${uri}`)
    console.log(`Connexion with db established!`)

    await require('../../fixtures/usersFixtures')()

  }

}).catch(err => {
  console.log(`Connexion error: ${err}`)
})

module.exports = mg