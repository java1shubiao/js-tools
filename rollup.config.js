const { DEFAULT_EXTENSIONS } = require('@babel/core');
const path = require('path');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
// const uglify = require('rollup-plugin-uglify').uglify;
// const { eslint }  = require('rollup-plugin-eslint')
const { terser } = require('rollup-plugin-terser');
const tslint = require('rollup-plugin-tslint');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

const pathResolve = (...args) => {
    return path.resolve(__dirname, ...args);
};

// console.log(nodeResolve.default)
const extensions = [...DEFAULT_EXTENSIONS, '.js', '.ts'];
const plugins = [
    nodeResolve({
        extensions,
        modulesOnly: true,
    }),
    commonjs(),
    babel({
        extensions,
        exclude: 'node_modules/**',
        runtimeHelpers: true,
    }),
    typescript({
        typescript: require('typescript'),
        include: ['*.js+(|x)', '**/*.js+(|x)'],
        exclude: ['coverage', 'dist', 'node_modules/**', '*.test.{js+(|x), ts+(|x)}', '**/*.test.{js+(|x), ts+(|x)}'],
    }),
];
if (process.env.production) {
    plugins.push(terser());
}
if (process.env.development) {
    plugins.push(tslint());
}
module.exports = [
    {
        input: pathResolve(__dirname, 'src/index.ts'),
        output: {
            file: pathResolve('./', pkg.main),
            format: 'umd',
            name: 'index',
        },
        plugins,
    },
    {
        input: pathResolve(__dirname, 'src/request.ts'),
        output: {
            file: pathResolve('./', pkg.request),
            format: 'umd',
            name: 'request',
        },
        plugins,
    },
];
