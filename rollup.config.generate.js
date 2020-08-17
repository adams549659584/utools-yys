// import cleaner from 'rollup-plugin-cleaner';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

/**
 * 当前环境
 * @type {'development'|'production'}
 */
const NODE_ENV = (process.env.NODE_ENV || 'development').trim();

/** 生成js */
/** @type {import ('rollup').RollupOptions} */
const rollupOptions = {
  input: './src/generate.ts',
  output: {
    file: './dist/generate.js',
    format: 'cjs',
    sourcemap: NODE_ENV === 'production' ? false : 'inline',
  },
  plugins: [
    // cleaner({
    //   targets: ['dist'],
    // }),
    json(),
    typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
    resolve(),
    commonjs(),
    replace({
      ENV: JSON.stringify(NODE_ENV),
    }),
    NODE_ENV === 'production' && terser(),
  ],
};
export default rollupOptions;
