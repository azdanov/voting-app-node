import bluebird, { promisify } from "bluebird";
import { readFile } from "fs";
import mongoose from "mongoose";
import { join } from "path";

const readAsync = promisify(readFile);
const configFile = join(process.cwd(), "cypress.json");

mongoose.Promise = bluebird;

(async () => {
  let config: any = await readAsync(configFile);
  config = JSON.parse(config).env;

  await mongoose.connect(
    config.database,
    { useNewUrlParser: true }
  );
  mongoose.set("useCreateIndex", true);
  await mongoose.connection.db.dropDatabase();

  console.log("Testing database dropped");

  await mongoose.connection.close();
})();
