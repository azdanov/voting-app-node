import http from 'http';

export function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? Number.parseInt(val, 10) : val;

  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

export function onError(this: http.Server, error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

  const address = this.address();

  const bind = address.port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function onListening(this: http.Server): void {
  const address = this.address();
  console.info(`Listening on ${address.port}`);
}
