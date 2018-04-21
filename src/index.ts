import http from 'http';

import app from './app';
import { normalizePort, onError, onListening } from './utilities';

require('dotenv').config();
import { connect } from './db';

const port = normalizePort(process.env.PORT || 3000);

app.set('port', port);

connect(process.env.DATABASE);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
