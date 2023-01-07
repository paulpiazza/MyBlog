const mg = require('mongoose');

const uri = process.env.MONGODB_URI;

mg.connect(uri).then(() => {
  console.log(`Connexion established!`)
}).catch(err => {
  console.log(`Connexion error: ${err}`)
})

module.exports = mg