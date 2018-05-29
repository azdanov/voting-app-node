import mongoose from 'mongoose';
import { logger } from '../utilities';

export const connect = async (database: string | null) => {
  if (!database) {
    logger.error('Please specify a database to connect to.');
    process.exit(1);
  } else {
    await mongoose.connect(database);
    mongoose.Promise = Promise;
    mongoose.connection.on('error', error => {
      logger.error('Problems connecting with the database', error);
    });
  }
};
