import { promisify } from 'bluebird';
import { readFile } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';

import { createUser, createPoll } from '../src/models';

const readAsync = promisify(readFile);
const configFile = join(process.cwd(), 'cypress.json');

(async () => {
  let config: any = await readAsync(configFile);
  config = JSON.parse(config).env;

  await mongoose.connect(config.database);

  createUser();
  createPoll();

  const User = mongoose.model('User');
  const Poll = mongoose.model('Poll');

  let users = await User.find({});

  if (users.length > 0) {
    await mongoose.connection.db.dropDatabase();
  }

  const register = promisify(User.register, { context: User });

  await register(
    await new User({ email: config.email, name: config.name }),
    config.password,
  );
  await register(
    await new User({ email: config.email1, name: config.name1 }),
    config.password,
  );
  await register(
    await new User({ email: config.email2, name: config.name2 }),
    config.password,
  );

  users = await User.find({});

  await new Poll({
    name: 'Test Poll 1',
    author: users[0]._id,
    options: ['A', 'B', 'C'],
    votes: [
      { option: 'C', person: users[0]._id },
      { option: 'C', person: users[1]._id },
      { option: 'A', person: users[2]._id },
    ],
  }).save();

  await new Poll({
    name: 'Test Poll 2',
    author: users[1]._id,
    options: ['1', '2'],
    votes: [
      { option: '1', person: users[0]._id },
      { option: '1', person: users[2]._id },
    ],
  }).save();

  console.log(
    `Users registered:\n${config.email}  - ${config.name}  - ${config.password}` +
      `\n${config.email1} - ${config.name1} - ${config.password}` +
      `\n${config.email2} - ${config.name2} - ${config.password}`,
  );
  await mongoose.connection.close();
})();
