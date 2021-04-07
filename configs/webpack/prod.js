// production config
const { resolve } = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

const commonConfig = require('./common')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: './index.tsx',
    output: {
        filename: 'js/[name].[contenthash:8].min.js',
        path: resolve(__dirname, '../../dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(scss|sass)$/,
                loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                        return `npm.${packageName.replace('@', '')}`
                    }
                }
            }
        }
    },
    plugins: [
        new Dotenv(),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].min.css', chunkFilename: '[id].[contenthash:8].min.css' }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                safe: true,
                discardComments: {
                    removeAll: true
                }
            }
        })
    ]
})
