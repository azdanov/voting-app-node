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

  createUser();
  const User = mongoose.model('User');

  const register = promisify(User.register, { context: User });
  const result = await register(
    new User({ email: config.email, name: config.name }),
    config.password,
  );

  console.log(`User registered: ${config.email} - ${config.name} - ${config.password}`);
  await mongoose.connection.close();
})();
