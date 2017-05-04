'use strict';

let Koa = require('koa');
let App = new Koa();
let router = require('./router/router')
let bodyParser = require('koa-bodyparser');
let views = require('koa-views');

/**
 * 中间件
 */
/** A body parser for koa */
App.use(bodyParser());
/** 使用模板引擎 nunjunks */
App.use(views(__dirname + '/views'),{
    map: { html: 'nunjucks' }   
});

/**
 * 路由初始化
 */
router.init(App);

App.listen(3000);
console.log('server running at 3000...')
