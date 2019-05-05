const path = require('path');
const webpack = require("webpack");
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnv = require("dotenv-webpack");
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    resolve: {
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
            'bower_modules': path.join(__dirname, 'bower_modules')
        }
    },
    entry: {
        index: `webpack-polyfill-injector?${JSON.stringify({
            modules: ['./src/index.js']
        })}!`,
        list: `webpack-polyfill-injector?${JSON.stringify({
            modules: ['./src/list/index.js']
        })}!`,
        about: `webpack-polyfill-injector?${JSON.stringify({
            modules: ['./src/about/index.js']
        })}!`,
    },
    plugins: [
        new GoogleFontsPlugin({
            fonts: [
                { family: "Libre Franklin", variants: ["400","700"], subsets: ['latin-ext'] }
            ],
            local: true
        }),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
        }),
        new DotEnv({systemvars: true}),
        new CopyPlugin([
            { from: './src/config.json', to: path.resolve(__dirname, 'dist') },
        ]),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            chunks: ['index'],
            template: '!ejs-loader!src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'list/index.html',
            inject: true,
            chunks: ['list'],
            template: '!ejs-loader!src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about/index.html',
            inject: true,
            chunks: ['about'],
            template: '!ejs-loader!src/index.html'
        }),
        new PolyfillInjectorPlugin({
            polyfills: [
                'Promise',
                'fetch',
                'Object.values',
                'Array.prototype.findIndex'
            ]
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        libraryTarget: 'umd',
        library: '[name]',
        globalObject: 'this',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', ':data-src'],
                        options: {
                            minimize: true
                        }
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|xml|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash]_[name].[ext]',
                    outputPath: 'assets'
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    }
};
