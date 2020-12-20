const winston = require('winston');
const format = winston.format;

const loggerFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.splat(),
  format.json(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const consoleFormat = format.combine(loggerFormat, format.colorize());

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      format: loggerFormat,
      filename: './logs/logger.log',
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

module.exports = logger;
