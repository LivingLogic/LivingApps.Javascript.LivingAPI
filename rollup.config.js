const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');
const babel = require('rollup-plugin-babel');
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );

export default [
	{
		input: './dist/es2015/livingsdk.js',
		output: {
			file: './dist/umd/livingsdk.js',
			format: 'umd',
			name: 'livingsdk',
			sourcemap: true,
			globals: {
				axios: 'axios',
				https: 'https',
			}
		},
		plugins: [
			uglify.uglify(),
			sourcemaps(),
			babel(
				{
					"presets": [
						[
							"@babel/preset-env",
							{
								"useBuiltIns": "usage"
							}
						]
					]
				}
			)
		]
	},
	{
		input: './dist/es2015/livingsdk.test.js',
		output: {
			file: './dist/test/livingsdk.test.js',
			format: 'umd',
			name: 'livingsdk',
			sourcemap: true,
			globals: {
				axios: 'axios',
				https: 'https',
				chai: 'chai',
				mocha: 'mocha'
			}
		},
		plugins: [
			sourcemaps()
		]
	},
]