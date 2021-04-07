// development config
const { merge } = require('webpack-merge')

const webpack = require('webpack')
const commonConfig = require('./common')
const setup = require('./devServer')
const Dotenv = require('dotenv-webpack')

module.exports = merge(commonConfig, {
    output: {
        publicPath: '/'
    },
    mode: 'development',
    entry: [
        './index.tsx' // the entry point of our app
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader' }]
            },
            {
                test: /\.(scss|sass)$/,
                loaders: ['style-loader', { loader: 'css-loader' }, 'sass-loader']
            }
        ]
    },
    devServer: {
        hot: true, // enable HMR on the server
        historyApiFallback: true,
        port: 3005,
        publicPath: '/',
        contentBase: '../../src',
        setup        
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new Dotenv(),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
    ]
})
