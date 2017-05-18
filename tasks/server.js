'use strict';

const http      = require('http');
const app       = require('../app');
const util      = require('../util');
const bs        = require('browser-sync').create();

// 返回一个 Http.Server 的实例
const server = http.createServer(app.callback());
let port = process.env.PORT || 3002;

server.listen(port, function() {
    
});


