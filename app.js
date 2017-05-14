'use strict';

let Koa = require('koa');
let App = new Koa();
let bodyParser = require('koa-bodyparser');
let views = require('koa-views');
let serverStatic = require('koa-static');
let router = require('./server/router/router')

/**
 * Middlewares
 */
/** A body parser for koa */
App.use(bodyParser());
/** Koa static (用来处理非路由访问的文件) */
App.use(serverStatic(__dirname + '/static'));
/** Template Engine -- nunjunks */
App.use(views(__dirname + '/server/views', {
    map: { html: 'nunjucks' }   
}));

/**
 * Router
 */
router.init(App);

/**
 * Error Handler
 */
App.on('error', (err, ctx) => {
    console.log(`Server Error: ${err}`);
});

App.listen(3000);
console.log('server running at 3000...')
