import mongoose from 'mongoose';
import { promisify } from 'bluebird';
import { readFile } from 'fs';
import { join } from 'path';

import { createUser } from '../src/models/User';

const readAsync = promisify(readFile);
const configFile = join(process.cwd(), 'cypress.json');

(async () => {
  let config: any = await readAsync(configFile);
  config = JSON.parse(config).env;

  await mongoose.connect(config.database);
  await mongoose.connection.db.dropDatabase();

  console.log('User collection removed');

  await mongoose.connection.close();
})();
