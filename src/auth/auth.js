require('dotenv').config()

module.exports = (req, res, next) => {

    const headerAuthorization = req.headers.authorization

    if(!headerAuthorization) {
        const message = `You need to add yur token in your headers.`
        res.status(401).json({message})
    }

    const token = headerAuthorization.split(' ')[1]

    const privateKey = process.env.PRIVATE_KEY_JWT_TOKEN

    jwt.verify(token, privateKey, function(err, decoded) {
        if(error) {
            const message = `Unauthorized`
            return res.status(401).json({ message, data: error })
        }
  
        const emailUser = decodedToken.email

        if (req.body.email && req.body.email !== emailUser) {
            const message = `Email invalid`
            res.status(401).json({ message })
        } else {
            next()
        }
  })

    });
}