import dotenv from 'dotenv';
import http from 'http';
import { join } from 'path';
import createApp from './app';
import { connect } from './db';
import { createPoll, createUser } from './models';
import { normalizePort, onError, onListening } from './utilities';

dotenv.config({ path: join(__dirname, '../.env') });

createUser();
createPoll();

const app = createApp();

app.set('port', normalizePort(process.env.PORT || 3000));

let db = process.env.DATABASE;
if (process.env.NODE_ENV === 'test') {
  db = process.env.DATABASE_TEST;
}

(async () => await connect(db || null))();

const server = http.createServer(app);
server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);
