const ew = require('express-winston')
const { createLogger, transports, format } = require('winston')


const customFormat = format.printf(({level, message, meta, timestamp}) => {
    const d = new Date(timestamp)
    return `${d.toUTCString()} [${level}] : ${meta?.message || message} \n`
})

const logger = createLogger({
    
    transports: [
        new transports.File({
            filename: "./logs.log"
        })
    ],

    format: format.combine(
        format.json(),
        format.timestamp(),
        customFormat
    )
})

module.exports = logger