'use strict';

/**
 * Set 'Server-Id' Header
 */
let core = function(){
    return async function(ctx, next) {
        let id = process.env.SERVER_ID || '00';
        ctx.set('Node-Server-Id', id);
        await next();
    }
}

module.exports = core;