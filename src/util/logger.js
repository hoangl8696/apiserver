//NEVER CALL THIS MODULE, THIS IS HERE FOR REFERENCE, WORKING BUT NEED A PLACE TO UPLOAD LOGGING FILE TO
const winston = require('winston');
const fs = require('fs');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'dev';
require('winston-daily-rotate-file');
const dir = /*env === 'dev' ?*/ config.LOG_DIR_DEV /*: config.LOG_DIR_PROD*/;

if(!fs.existsSync(dir)) {
    fs.mkdir(dir);
}

const timestamp = () => (new Date()).toLocaleTimeString();

const transportsDev = [
    new winston.transports.DailyRotateFile({
        level: 'error',
        name: 'error-file',
        filename: '%DATE%-error.log',
        json: true,
        colorize: false,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        dirname: dir,
        maxSize: '20m',
        maxFiles: '15d',
        showLevel: true,
        timestamp
    }), 
    new winston.transports.DailyRotateFile({
        name: 'debug-file',
        level: 'debug',
        filename: '%DATE%-debug.log',
        json: true,
        colorize: false,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        dirname: dir,
        maxSize: '20m',
        maxFiles: '15d',
        showLevel: true,
        timestamp
    }),
    new winston.transports.Console({
        level: 'debug',
        json: false,
        colorize: true,
        showLevel: true,
        timestamp: true
    })
]

const transportsProd = [
    new winston.transports.Console({
        level: 'debug',
        json: false,
        colorize: true,
        showLevel: true,
        timestamp: true
    })
]

module.exports = new winston.Logger({
    transports: env === 'dev' ? transportsDev : transportsProd,
    exitOnError: false
});