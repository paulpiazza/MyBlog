const bcrypt = require('bcrypt')
const User = require('../src/models/User')

const saltRounds = 10;


module.exports = async () => {
    
    const users = [
        {
            email: "admin@myblog.net",
            password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds)
        },
        {
            email: "user@myblog.net",
            password: await bcrypt.hash(process.env.USER_PWD_TEST, saltRounds)
        }
    ]

    User.insertMany(users, (err, docs) => {
       if(err) {
           console.error("Loading fixtures Users failed", err)
           return
       }

       console.info(`new stock ${docs.length} fixtures added`)
        
    })
}

