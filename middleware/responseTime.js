'use strict';

/**
 * 记录响应时间中间件
 */
module.exports = function() {
    return async function(ctx, next) {
        let start = new Date();
        await next();
        let time = new Date() - start;
        let logMsg = `This request cost ${time}ms`
        console.log(logMsg);
    }
}