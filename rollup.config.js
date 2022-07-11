import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

const plugins = [
	sourcemaps(),
	json(),
	resolve(),
	commonjs(),
	babel({
		exclude: 'node_modules/**', // only transpile our source code
		presets: [
			"@babel/preset-env"
		]
	}),
	terser({
		keep_fnames: true
	})
];

export default [
	{
		input: './src/livingapi.js',
		output: [
			{
				file: './dist/umd/livingapi.js',
				format: 'umd',
				name: 'la',
				sourcemap: true,
				globals: {"@livinglogic/ul4": "ul4"}
			},
			{
				file: './dist/esm-node/livingapi.js',
				format: 'esm',
				name: 'la',
				sourcemap: true,
				globals: {"@livinglogic/ul4": "ul4"}
			},
			{
				file: './dist/esm-static/livingapi.js',
				format: 'esm',
				name: 'la',
				sourcemap: true,
				globals: {"@livinglogic/ul4": "ul4"},
				paths: {
					"@livinglogic/ul4": '/static/ul4/1.13.1/dist/esm/ul4.js'
				}
			}
		],
		plugins: plugins,
		external: ["@livinglogic/ul4"],
	}
];
