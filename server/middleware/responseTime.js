'use strict';

/**
 * The middleware of record the response time
 */
module.exports = function() {
    return async function(ctx, next) {
        let start = new Date();
        await next();
        let time = new Date() - start;
        let logMsg = `This request cost ${time}ms`
        /** Instead of consoling the message， You can use Koa-log */
        console.info(logMsg);
    }
}