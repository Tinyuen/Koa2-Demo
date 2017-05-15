'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const util                  = require('./util');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const ManifestPlugin        = require('webpack-manifest-plugin');
const autoprefixer          = require('autoprefixer');
const frontBase             = './front';

let buildPath = path.resolve(__dirname, 'static/build');
let buildEnv = util.isDEV || util.isLOCAL ? '/dev' : 
               util.isYZ || util.isRelease ? '/release' : 
               util.isQA ? '/qa' :
               '/dev';
let plugins = [],
    entry = {};

/**
 * ==============
 *  plugins object
 * ==============
 */
let packPlugins = {
    //order: new webpack.optimize.OccurrenceOrderPlugin(), //wepack2 中默认加载
    hot: new webpack.HotModuleReplacementPlugin(),
    namedModule: new webpack.NamedModulesPlugin(),
    noError: new webpack.NoEmitOnErrorsPlugin(),
    manifest: new ManifestPlugin(),
    css: new ExtractTextPlugin({
        filename: util.isRelease || util.isYZ ? '[name].[hash:8].css' : '[name].css',
        allChunks: false
    }),
    uglify: new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        }
    }),
    loaderOption: new webpack.LoaderOptionsPlugin({
        context: __dirname
    })
}

/**
 * =======================================
 * Custom config for different environement
 * =======================================
 */
if (util.isDEV || util.isLOCAL) {
    //plugins
    plugins.push(packPlugins.hot);
    plugins.push(packPlugins.namedModule);
    plugins.push(packPlugins.noError);  
} else {
    plugins.push(packPlugins.manifest);
} 

if (util.isYZ || util.isRelease) {
    plugins.push(packPlugins.uglify);
}

plugins.push(packPlugins.css);
plugins.push(packPlugins.loaderOption);
/**
 * webpak config
 * 'webpack-hot-middleware/client?reload=true', './src/index.js'
 */
let packConfig = {
    entry: {
        home: [path.resolve(frontBase, 'home')],
        detail: [path.resolve(frontBase, 'detail')]
    },
    output: {
        path: buildPath + buildEnv,
        filename: util.isDEV ? '[name].js' :  '[name].[hash:8].js',
        /**
         * publicPath: 针对css等文件中的相对路径,如背景图片做处理
         * 使用publicPath给定的路径来替换图片相对路径
         * 比如css中引用背景图片地址为’./assets/xx.png‘ 则打包后css中背景图片地址变为 publicPath + ’xx.png‘
         * 验证生产环境建议使用 静态服务器地址 比如：http://static.example.com/
         */
        publicPath: util.getPublicPath()
    },
    plugins: plugins,
    //不推荐忽略 -loader
    resolveLoader: {
        moduleExtensions: ["-loader"],
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.css', '.scss'],
    },
    devtool: false,//util.isDEV || util.isQA || utili.isLOCAL ? 'source-map' : false,
    //watch: util.isDEV,
    module: {
        rules: [
            //babel
            {
                test: /\.js$/,
                loader: 'babel',
                include: __dirname + '/src'
            },
            // css
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style',
                    use: ['css']
                })
            },
            //scss 
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style',
                    use: [
                        'css',
                        {
                            loader: 'postcss',
                            options: {
                                plugins: [autoprefixer({ browsers: ['> 5%'] })]
                            }
                        },
                        {
                            loader: 'sass'
                        }
                    ]
                })
            },
            // img
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url',
                options: {
                    limit: 4096,
                    name: '[name].[ext]?[hash:16]'
                }
            }
        ]
    }
}

module.exports = packConfig;