import bluebird, { promisify, all } from "bluebird";
import faker from "faker";
import { readFile } from "fs";
import _ from "lodash";
import mongoose, { Document } from "mongoose";
import { join } from "path";

import { createPoll, createUser } from "../src/models";

const readAsync = promisify(readFile);
const configFile = join(process.cwd(), "cypress.json");

mongoose.Promise = bluebird;

faker.seed(123);

(async () => {
  let config: any = await readAsync(configFile);
  config = JSON.parse(config).env;

  await mongoose.connect(
    config.database,
    { useNewUrlParser: true }
  );

  mongoose.set("useCreateIndex", true);

  await mongoose.connection.db.dropDatabase();

  createUser();
  createPoll();

  const User = mongoose.model("User");
  const Poll = mongoose.model("Poll");

  const register = promisify(User.register, { context: User });

  const userInfos: { email: string; name: string }[] = [];

  _.times(4, () => {
    userInfos.push({
      email: faker.internet.email(),
      name: faker.name.findName()
    });
  });

  const newUserPromises = userInfos.map(async user => {
    return register(new User(user), faker.internet.password());
  });

  const testUser: any = register(
    new User({ email: config.email, name: config.name }),
    config.password
  );

  newUserPromises.push(testUser);

  let users;
  try {
    users = await all(newUserPromises);
  } catch (err) {
    throw err;
  }

  const newPoll = () => {
    const options = _.times(_.random(2, 10), () =>
      _.capitalize(faker.random.words())
    );
    const randomUserIndex = _.random(users.length - 1);

    return new Poll({
      options,
      name: _.capitalize(faker.random.words() + _.sample(["?", ".", "!"])),
      author: users[randomUserIndex]._id,
      votes: users.reduce((acc, user) => {
        const voteChance = Math.random() * 100 < 65;

        if (voteChance) {
          acc.push({ option: _.sample(options), person: user._id });
        }
        return acc;
      }, [])
    }).save();
  };

  const polls: Promise<Document>[] = [];

  _.times(4, () => polls.push(newPoll()));

  try {
    await all(polls);
  } catch (err) {
    throw err;
  }

  console.log("Random data seeded successfully!");
  await mongoose.connection.close();
})();
