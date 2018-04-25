import http from 'http';

import app from './app';
import { connect } from './db';
import { normalizePort, onError, onListening } from './utilities';

require('dotenv').config();

const port = normalizePort(process.env.PORT || 3000);

app.set('port', port);

let db = process.env.DATABASE || null;
if (process.env.NODE_ENV === 'test') {
  db = 'mongodb://localhost/voting-app-testing';
}
connect(db);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
