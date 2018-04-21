import mongoose from 'mongoose';
import { logger } from '../utilities';

export const connect = (database?: string) => {
  if (!database) {
    logger.error('Please specify a database to connect to.');
    process.exit(1);
  } else {
    mongoose.connect(database);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', error => {
      logger.error('Problems connecting with the database', error);
    });
  }
};
