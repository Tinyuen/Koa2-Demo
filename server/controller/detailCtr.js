'use strict';

let core = {
    async get(ctx) {
        let data = {
            content: 'some detail'
        }
        await ctx.render('detail.html', data);
    }
}

module.exports = core;