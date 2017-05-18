'use strict';

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const fs            = require('fs-extra');
const path          = require('path');
const nodemon       = require('gulp-nodemon');
const webpack       = require('webpack');
const util          = require('./util');

/**
 * Nodemon plugin
 */
function startNodemon(env, port) {
    let config = {
        script: './tasks/server.js',
        /**
         * 监控指定后缀名的文件，用空格间隔
         */
        ext: 'js html',
        /**
         * true 表示输出详细启动与重启信息
         */
        verbose: false,
        /**
         * 重启的命令，默认是 rs ，可以改成你自己喜欢的字符串。
         * 当用 nodemon 启动应用时，可以直接键入 rs 直接重启服务,也可设置为false
         */
        restartable: 'rs',
        /**
         * 运行服务的后缀名和对应的运行命令，
         * "js": "node --harmony" 表示用 nodemon 代替 node  --harmony 运行 js 后缀文件
         */
        execMap: {
            'js': 'node '
        },
        env: {
            NODE_ENV: env || 'dev',
            PORT: port || '3002'  
        },
        /**
         * 忽略的文件后缀名或者文件夹，文件路径的书写用相对于 nodemon.json 所在位置的相对路径
         * 默认忽略的文件有：.git, node_modules, bower_components, .sass-cache
         */
        ignore: ['.git', 'node_modules/**', 'static', 'front', '.vscode', 'server/views'],

    }
    nodemon(config).on('restart', function() {
        console.log('The server is restart...')
    }); 
}


/**
 * task: run the local server
 */
gulp.task('start', function() {
    startNodemon('dev', '3002');
});

/**
 * task: clean directory
 */
gulp.task('clean', function() {
    let env = util.isDEV || util.isLOCAL ? 'dev' : 
                util.isQA ? 'qa' : 
                util.isRelease || util.isYZ ? 'release' : 'dev';
    let buildPath = './static/build';
    let dirPath = path.resolve(`${buildPath}/${env}`);
    fs.emptyDir(dirPath, err => {
        if (err) {
            return console.log(err);
        }
        console.log('clean success...');
    });
});

/**
 * task: pack use webpack
 */
let taskClean = util.isDEV || util.isLOCAL ? '' : ['clean'];
gulp.task('webpack', taskClean, function() {
    let config = require('./webpack.config.js');
    webpack(config, function(err, stats){
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[Webpack]', stats.toString({
            colors: true    
        }))
    });
});
