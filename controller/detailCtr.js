'use strict';

let core = {
    async get(ctx) {
        let html = `<h1>Detail Page</h1>
                    <p>This is Detail page Content</p>
                    <p>Params: id:${ctx.params.id}</p>`;
        ctx.body = html;
    }
}

module.exports = core;