'use strict';

let env = process.env.NODE_ENV;

let core = {
    env: env,
    isLOCAL: env === 'local',
    isDEV: env === 'dev',
    isQA: env === 'qa',
    isYZ: env === 'yz',
    isRelease: env === 'production',
    /**
     * 获取前段资源build路径
     */
    getPublicPath() {
        let pathStr = '';
        pathStr = this.isDEV || this.isLOCAL ? '/build/dev/' : 
                  this.isYZ || this.isRelease ? '/build/release/' : 
                  this.isQA ? '/build/qa/' : 
                  '/build/dev/';
        return pathStr;
    }
}

module.exports = core;