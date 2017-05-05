'use strict';

let Koa = require('koa');
let App = new Koa();
let router = require('./server/router/router')
let bodyParser = require('koa-bodyparser');
let views = require('koa-views');

/**
 * Middlewares
 */
/** A body parser for koa */
App.use(bodyParser());
/** Template Engine -- nunjunks */
App.use(views(__dirname + '/server/views', {
    map: { html: 'nunjucks' }   
}));

/**
 * Router
 */
router.init(App);

App.listen(3000);
console.log('server running at 3000...')
