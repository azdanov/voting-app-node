import http from 'http';

import app from './app';
import { normalizePort, onError, onListening } from './utilities';

const port = normalizePort(process.env.PORT || 3000);

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
