import Hashids from 'hashids';

export { assignValidationsToSession } from './session';
export { pugHelpers } from './pugHelpers';
export { setupPassport } from './passport';
export { catchErrors } from './catchErrors';
export { logger, logStream } from './logger';
export { normalizePort, onError, onListening } from './server';

export const hashids = new Hashids(process.env.SITE_NAME || 'test');
