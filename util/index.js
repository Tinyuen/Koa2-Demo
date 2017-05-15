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
    },
    /**
     * 获取打包的manifest对象
     */
    getManifest() {
        let env = this.isDEV || this.isLOCAL ? 'dev' : this.isQA ? 'qa' : this.isYZ || this.isRelease ? 'release' : 'dev';
        let manifest = require(`../static/build/${env}/manifest.json`) || {};
        return manifest;    
    }
}

module.exports = core;