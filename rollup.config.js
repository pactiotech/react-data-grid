import { isAbsolute } from 'path';
import linaria from '@linaria/rollup';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import stylis from 'stylis';
import pkg from './package.json';

stylis.set({ prefix: false });
const extensions = ['.ts', '.tsx'];

export default {
  input: './src/index.ts',
  output: [
    {
      file: './lib/bundle.js',
      format: 'es',
      preferConst: true,
      sourcemap: true
    },
    {
      file: './lib/bundle.cjs',
      format: 'cjs',
      preferConst: true,
      sourcemap: true,
      interop: false
    }
  ],
  external: (id) => !id.startsWith('.') && !isAbsolute(id),
  plugins: [
    linaria({
      preprocessor: 'none',
      classNameSlug(hash) {
        return 'pactio-v7.0.8';
      }
    }),
    postcss({ minimize: true }),
    babel({
      babelHelpers: 'runtime',
      extensions,
      // remove all comments except terser annotations
      // https://github.com/terser/terser#annotations
      // https://babeljs.io/docs/en/options#shouldprintcomment
      shouldPrintComment: (comment) => /^[@#]__.+__$/.test(comment)
    }),
    nodeResolve({ extensions })
  ]
};
