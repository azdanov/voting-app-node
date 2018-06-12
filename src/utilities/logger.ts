import { createLogger, transports } from 'winston';

const { NODE_ENV } = process.env;

const level =
  NODE_ENV === 'test' ? 'error' : NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = createLogger({
  transports: [
    new transports.Console({
      level,
    }),
  ],
});

// create stream for morgan
export const logStream = {
  write(message: string) {
    logger.info(message);
  },
};
