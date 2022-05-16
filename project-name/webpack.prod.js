const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// styles
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// media
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const FontminPlugin = require('fontmin-webpack');
// js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer'],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer'],
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new CssMinimizerPlugin({
                parallel: true,
            }),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                        ],
                    },
                },
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        }),
        new FontminPlugin({
            autodetect: true,
            allowedFilesRegex: null,
            skippedFilesRegex: null,
        }),
    ],
});
