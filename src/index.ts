import dotenv from "dotenv";
import http from "http";
import { join } from "path";
import createApp from "./app";
import { connect } from "./db";
import { createPoll, createUser } from "./models";
import { normalizePort, onError, onListening } from "./utilities";

dotenv.config({ path: join(process.cwd(), ".env") });

createUser();
createPoll();

const app = createApp();

const port = normalizePort(process.env.PORT || 3000);

app.set("port", port);

let db = process.env.DATABASE || "";
if (process.env.NODE_ENV === "test") {
  db = process.env.DATABASE_TEST || "";
}

(async () => {
  try {
    await connect(db);
  } catch (err) {
    console.log(err);
  }
})();

const server = http.createServer(app);
server.listen(app.get("port"));
server.on("error", onError);
server.on("listening", onListening);
