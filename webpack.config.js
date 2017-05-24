'use strict';
const path = require('path');

module.exports = {
    context: __dirname + '/app',
    entry: './main.js',
    output: {
        filename: 'index.js'
    },
    devtool: "source-map",
    watch: true/*,
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.js$/,
                loader: 'babel-core',
                exclude: /node_modules/
            }]

    }*/

};