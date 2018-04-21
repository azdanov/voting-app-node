import { Logger, transports } from 'winston';

const { NODE_ENV } = process.env;

const level =
  NODE_ENV === 'testing' ? 'error' : NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = new Logger({
  transports: [
    new transports.Console({
      level,
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      label: 'voting-app',
    }),
  ],
});

// create stream for morgan
export const logStream = {
  write(message: string) {
    logger.info(message);
  },
};
