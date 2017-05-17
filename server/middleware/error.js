'use strict';

/**
 * Error Propagation
 */
module.exports = function() {
    return async function(ctx, next) {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.type = 'html';
            switch (ctx.accepts('html', 'json')) {
                case 'html':
                    ctx.type = 'html';
                    await ctx.render('500');
                    break;
                case 'json':
                    ctx.type = 'json';
                    this.body = {
                        status: -1,
                        message: 'Internet Server Error',
                        data: null
                    };
                    break;
                default: 
                    ctx.type = 'text';
                    ctx.body = 'Internet Server Error';
            }
            // Emit The Error Handler
            ctx.app.emit('error', err, ctx);
        }
    }
}