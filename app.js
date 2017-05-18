'use strict';

const Koa           = require('koa');
const App           = new Koa();
const path          = require('path');
const bodyParser    = require('koa-bodyparser');
// const views         = require('koa-views');
const koaNunjucks   = require('koa-nunjucks-2');
const serverStatic  = require('koa-static');
const logger        = require('koa-logger');
const compose       = require('koa-compose');
const notFound      = require('./server/middleware/404');
const error         = require('./server/middleware/error');
const router        = require('./server/router/router');

const util          = require('./util');

/**
 * Koa2 config
 */
App.name = 'Koa2-Demo';

/**
 * Middlewares
 */
if (util.isDEV || util.isLOCAL) {
    /* Koa logger midileware | Near the top of all middleware */
    App.use(logger());
}

/* Koa static (用来处理非路由访问的文件) */
App.use(serverStatic(path.join(__dirname, '/static')));

/**
 * Bug: can not use extends, err: can not found _layout.html
 * so, use koa-nunjucks-2 insted!
 */
// App.use(views(__dirname + '/server/views', {
//     map: { html: 'nunjucks' },
//     cache: util.isDEV || util.isLOCAL ? false : 'memory'    
// }));

/* Template Engine -- nunjunks */
App.use(koaNunjucks({
  ext: 'html',
  path: path.join(__dirname, '/server/views'),
  nunjucksConfig: {
    autoescape: true,
    noCache: util.isDEV || util.isLOCAL
  }
}));

/* A body parser for koa */
App.use(bodyParser());

/* 404 Error Handler */
App.use(notFound());
/* 500 Error Handler */
App.use(error());

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

module.exports = App;
