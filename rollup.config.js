import typescript from 'rollup-plugin-typescript2';

export default {
  input: `src/index.ts`,
  output: [{ file: 'public/dist/index.js', format: 'cjs', sourcemap: true }],
  plugins: [typescript()],
  external: [
    'https',
    'http',
    'express',
    'morgan',
    'body-parser',
    'cors',
    'path',
    'winston',
    'mongoose',
    'moment',
    'connect-flash',
    'connect-redis',
    'express-session',
    'passport',
    'redis',
    'cookie-parser',
    'csurf',
    'passport-local-mongoose',
    'validator',
    'express-validator/check',
  ],
};
