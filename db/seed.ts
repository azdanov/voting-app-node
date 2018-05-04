import { promisify } from 'bluebird';
import faker from 'faker';
import { readFile } from 'fs';
import _ from 'lodash';
import mongoose, { Document } from 'mongoose';
import { join } from 'path';

import { createPoll, createUser } from '../src/models';

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

  const previousUsers = await User.find({});

  if (previousUsers.length > 0) {
    await mongoose.connection.db.dropDatabase();
  }

  const register = promisify(User.register, { context: User });

  await register(
    await new User({ email: config.email, name: config.name }),
    config.password,
  );

  const userInfos: { email: string; name: string }[] = [];

  _.times(10, () => {
    userInfos.push({ email: faker.internet.email(), name: faker.name.findName() });
  });

  const newUserPromises = userInfos.map(user => {
    return register(new User(user), faker.internet.password());
  });

  const users = await Promise.all(newUserPromises);
  const usersTotal = _.random(users.length - 1);

  const newPoll = () => {
    const options = _.times(_.random(2, 10), () => _.capitalize(faker.random.words()));
    return new Poll({
      options,
      name: _.capitalize(faker.random.words() + _.sample(['?', '.', '!'])),
      author: users[usersTotal]._id,
      votes: users.reduce((acc, user) => {
        if (Math.random() * 100 < 60) {
          acc.push({ option: _.sample(options), person: user._id });
        }
        return acc;
      }, []),
    }).save();
  };

  const polls: Promise<Document>[] = [];

  _.times(30, () => polls.push(newPoll()));

  await Promise.all(polls);

  console.log('Random data seeded successfully!');
  await mongoose.connection.close();
})();
