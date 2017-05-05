'use strict';

let Router = require('koa-router');
let router = new Router();
let rt = require('../middleware/responseTime')();

let homeCtr = require('../controller/homeCtr');
let detailCtr = require('../controller/detailCtr');

router.get('/home', rt, homeCtr.get);
router.get('/detail/:id', rt, detailCtr.get);

let core = {
    init: function(app) {
        app.use(router.routes())
           .use(router.allowedMethods());
    }   
}

module.exports = core;