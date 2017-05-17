'use strict';

module.exports = function() {
    return async function(ctx, next) {
        await next();
        if (404 != ctx.status) { return }
        ctx.status = 404;
        switch (ctx.accepts('html', 'json')) {
            case 'html':
                ctx.type = 'html';
                await ctx.render('404');
                break;
            case 'json':
                ctx.type = 'json';
                this.body = {
                    status: -1,
                    message: 'Page Not Found',
                    data: null
                };
                break;
            default: 
                ctx.type = 'text';
                ctx.body = 'Page Not Found';
        }
    }
}