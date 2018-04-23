import http from 'http';

import app from './app';
import { connect } from './db';
import { normalizePort, onError, onListening } from './utilities';

require('dotenv').config();

const port = normalizePort(process.env.PORT || 3000);

app.set('port', port);

connect(process.env.DATABASE || null);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
