const winston = require('winston');

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.combine(
		winston.format.timestamp({
			format: () => new Date().toLocaleString('pt-BR').replace(',', ' |'),
		}),
		winston.format.errors({ stack: true }),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ level, message, timestamp, stack }) => {
					return `${level}: ${stack || message} - ${timestamp}`;
				}),
			),
		}),
	],
});

module.exports = logger;