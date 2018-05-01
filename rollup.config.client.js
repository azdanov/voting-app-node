import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: `src/client/client.ts`,
  output: [{ file: 'public/dist/client.js', format: 'iife', sourcemap: true }],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    typescript(),
    commonjs({
      namedExports: { './src/vendor/palette.js/palette.js': ['palette'] },
    }),
  ],
};
