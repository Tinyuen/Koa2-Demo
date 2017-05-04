'use strict';

let core = {
    async get(ctx) {
        //使用koa2 cookies
        ctx.cookies.set('TEST_COOKIE', 'Test cookie from koa2', {
            expires: new Date('2017-12-12'),
            path: '/home'  
        });
        let data = {
            name: 'xiaohu'
        }
        //使用nunjuncks渲染页面
        await ctx.render('home.html', data);
    }
}

module.exports = core;