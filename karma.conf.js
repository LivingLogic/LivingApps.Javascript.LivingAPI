// Karma configuration
// Generated on Thu Jul 12 2018 19:50:02 GMT+0200 (CEST)
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );


module.exports = function(config) {
	config.set({
  
		frameworks: ["mocha", "karma-typescript"],
  
		files: [
			'https://unpkg.com/axios/dist/axios.min.js',
			'./node_modules/chai/chai.js',
			{ pattern: "dist/test/**/*.test.js" }
		],
  
  
		reporters: ["progress"],
  
		browsers: ["Chrome"],
  
		singleRun: true
	});
  };