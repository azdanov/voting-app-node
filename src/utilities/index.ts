import Hashids from 'hashids';

export { assignValidationsToSession } from './session';
export { pugHelpers } from './pugHelpers';
export { setupPassport } from '../auth/passport';
export { catchAsyncErrors } from './catchAsyncErrors';
export { logger, logStream } from './logger';
export { normalizePort, onError, onListening } from './server';

export const hashids = new Hashids(process.env.SITE_NAME || 'test');
