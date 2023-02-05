require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

  const headerAuthorization = req.headers.authorization

  if (!headerAuthorization) {
    const message = `You need to add your token in your headers.`
    res.status(401).json({ message })
  }

  const token = headerAuthorization.split(' ')[1]

  const privateKey = process.env.PRIVATE_KEY_JWT_TOKEN

  jwt.verify(token, privateKey, function(err, decoded) {
    if (err) {
      const message = `Unauthorized`
      return res.status(401).json({ message, data: err })
    }

    const { id, role } = decoded

    if (req.body.id && req.body.id !== idUser) {
      const message = `Email invalid`
      res.status(401).json({ message })
    } else {
      req.body.id = id
      req.body.role = role
      next()
    }
  })
}