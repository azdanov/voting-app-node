import winston from 'winston';

const { NODE_ENV } = process.env;

const level =
  NODE_ENV === 'testing' ? 'error' : NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      label: 'voting-app',
    }),
  ],
});

// create stream for morgan
logger.stream = {
  write: message => logger.info(message),
};
