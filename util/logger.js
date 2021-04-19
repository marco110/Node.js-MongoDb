let winston = require('winston');
let path = require('path');
const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({level, message, timestamp}) => `${timestamp} ${level} : ${message}`);
const logger = winston.createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, '../log/logs.log')
        })
    ]
});

module.exports = logger;