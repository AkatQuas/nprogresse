import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import less from 'rollup-plugin-less';
import { uglify } from "rollup-plugin-uglify";
import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: {
    name: 'NProgress',
    banner: [
      '/** ',
      ' * @acknowledegment ',
      ' * NProgress version ' + pkg.version,
      ' * Repository: ' + pkg.repository.url,
      ' */'
    ].join('\n'),
    file: 'index.js',
    format: 'umd',
  },
  plugins: [
    less({
      output: 'style.css',
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    commonjs(),
    uglify({
      output: {
        comments: function (node, comment) {
          if (comment.type === "comment2") {
            return /@preserve|@license|@acknowledegment/i.test(comment.value);
          }
          return false;
        }
      }
    }),
  ]
}