import typescript from 'rollup-plugin-typescript2';

export default {
  input: `src/index.ts`,
  output: [{ file: 'bundle/index.js', format: 'cjs', sourcemap: true }],
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
  ],
};
