// shared config (dev and prod)
const { resolve } = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    context: resolve(__dirname, '../../src'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'awesome-typescript-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]']
            },
            {
                test: /\.(ico)$/i,
                loaders: ['file-loader?name=[name].[ext]']
            }
        ]
    },
    plugins: [new CheckerPlugin(), new HtmlWebpackPlugin({ template: 'index.html' })],
    performance: {
        hints: false
    }
}
