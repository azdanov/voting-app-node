import mongoose from 'mongoose';
import { promisify } from 'bluebird';
import { createUser } from '../src/models/User';
import { readFile } from 'fs';
import { join } from 'path';

const readAsync = promisify(readFile);
const configFile = join(process.cwd(), 'cypress.json');

(async () => {
  const config: any = await readAsync(configFile);
  const user = JSON.parse(config).env;

  await mongoose.connect('mongodb://localhost/voting-app-testing');

  createUser();
  const User = mongoose.model('User');

  const register = promisify(User.register, { context: User });
  const result = await register(
    new User({ email: user.email, name: user.name }),
    user.password,
  );

  console.log(`User registered: ${user.email} - ${user.name} - ${user.password}`);
  await mongoose.connection.close();
})();
