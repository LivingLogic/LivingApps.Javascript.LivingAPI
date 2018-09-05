const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');
const babel = require('rollup-plugin-babel');

export default {
    input: './dist/es2015/livingsdk.js',
    output: {
        file: './dist/umd/livingsdk.js',
        format: 'umd',
        name: 'livingsdk',
        sourcemap: true
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
                            "useBuiltIns": "entry"
                        }
                    ]
                ]
            }
        )
    ]
}