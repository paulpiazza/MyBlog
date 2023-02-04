const ew = require('express-winston')
const { createLogger, transports, format } = require('winston')

const logger = createLogger({
    
    transports: [
        new transports.Console()
    ],

    format: format.combine(
        format.prettyPrint(),
        format.json()
    )
})

module.exports = logger