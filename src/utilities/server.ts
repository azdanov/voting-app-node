import http from 'http';
import { logger } from './logger';

export function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? Number.parseInt(val, 10) : val;

  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

export function onError(this: http.Server, error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = this.address();

  const bind = address && address.port ? address.port : 'Port';

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`, error);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`, error);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function onListening(this: http.Server): void {
  const { address, port } = this.address();
  logger.info(`Server is listening at http://${address}:${port}`);
}
