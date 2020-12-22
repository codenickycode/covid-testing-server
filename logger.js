const winston = require('winston');
const format = winston.format;
require('winston-daily-rotate-file');

/**************LOG FORMATS*********************/
const loggerFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.splat(),
  format.json(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
const consoleFormat = format.combine(
  format.colorize(),
  format.splat(),
  format.json(),
  format.printf((info) => `${info.level}: ${info.message}`)
);
/********************************************/

/******* LOGGER: CONSOLE AND DAILY **********/
const loggerTransport = {
  format: loggerFormat,
  filename: './logs/logger-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '1m',
  maxFiles: '14d',
};

const dailyLogger = new winston.transports.DailyRotateFile(loggerTransport);

const logger = winston.createLogger({
  transports: [
    dailyLogger,
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});
/************************************************/

/***** MORGAN: WRITE TO LOGGER & OPTIONS *******/
const loggerStream = {
  write: (message) => {
    logger.info(message);
  },
};

const morganOptions = {
  stream: loggerStream,
  prettify: false,
  noColors: true,
  includeNewLine: false,
  filterParameters: ['password', 'currentPassword', 'newPassword'],
};
/************************************************/

module.exports = { logger, morganOptions };
