'use strict';

const Koa           = require('koa');
const App           = new Koa();
const path          = require('path');
const bodyParser    = require('koa-bodyparser');
// const views         = require('koa-views');
const koaNunjucks   = require('koa-nunjucks-2');
const convert       = require('koa-convert');
const serverStatic  = require('koa-static');
const logger        = require('koa-logger');
const compose       = require('koa-compose');
const compress      = require('koa-compress');
const helmet        = require('koa-helmet');
const validate      = require('koa-validate');
const session       = require('koa-session');
const conditional   = require('koa-conditional-get');
const etag          = require('koa-etag');
const webpack       = require('webpack');
const devMiddleware = require('koa-webpack-dev-middleware');
const hotMiddleware = require('koa-webpack-hot-middleware');
const notFound      = require('./server/middleware/404');
const error         = require('./server/middleware/error');
const serverId      = require('./server/middleware/serverId');
const router        = require('./server/router/router');

const util          = require('./util');
const webpackConfig = require('./webpack.config.js');
const compiler      = webpack(webpackConfig);

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
    /* Hot Module Reload Middleware for Koa2 */
    App.use(convert(devMiddleware(compiler, {
        noInfo: false,
        quiet: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },
        publicPath: util.getPublicPath(),
        stats: {
            colors: true
        }
    })));
    App.use(convert(hotMiddleware(compiler)));
}

/* Koa static (用来处理非路由访问的文件) */
App.use(serverStatic(path.join(__dirname, '/static')));

/**
 * Bug: can not use extends, err info: can not found _layout.html
 * so, use koa-nunjucks-2 instead!
 */
/** App.use(views(__dirname + '/server/views', {
 *   map: { html: 'nunjucks' },
 *   cache: util.isDEV || util.isLOCAL ? false : 'memory'    
 *  })); 
 */

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
//App.use(bodyParser());

/**
 * Add Header
 */
App.use(serverId());
/**
 * koa-helmet is a wrapper for helmet to work with koa. 
 * It provides important security headers to make your app more secure by default.
 */
App.use(helmet());
/**
 * Compress middleware for Koa
 */
App.use(compress());
/**
 * Etag support
 */
App.use(conditional());
App.use(etag());
/**
 * Session Middleware for Koa 
 */
App.use(session(App));

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
