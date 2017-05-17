'use strict';

const Koa           = require('koa');
const App           = new Koa();
const bodyParser    = require('koa-bodyparser');
const views         = require('koa-views');
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
App.use(serverStatic(__dirname + '/static'));

/* Template Engine -- nunjunks */
App.use(views(__dirname + '/server/views', {
    map: { html: 'nunjucks' },
    cache: util.isDEV || util.isLOCAL ? false : 'memory'    
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

App.listen(3000);
console.log('server running at 3000...')
