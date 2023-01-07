const mg = require('mongoose')

function isEmail(email) {
  if (email === '') return false
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  return email.match(emailFormat)
}

const userSchema = mg.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Your email address is required."],
    validate: {
      validator: email => isEmail(email),
      message: props => `${props.value} is not a valid phone number!`
    },
  },

  password: {
    type: String,
    required: [true, "You should have a password."]
  }
}, {
  timestamps: true
})

const user = mg.model('user', userSchema)

module.exports = user
