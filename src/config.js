'use strict';

const config = {
    //版本号相关
    
    //app版本号 编译版本号

    version: '1.1.2 build-20170810v1',

    //点击title是否弹出编译版本号
    showVersion: false,

    //使用debug模式，jutils.debugAlert生效
    isDebug: false,

    //使用本地测试模式，部分数据为本地数据，开启后首页为home本地测试页
    isLocalTest: false,

    defaultLang: 'en',
    /*
     * 千万不要开启!!!!!!
     * 测试webpai获取数据时间消耗
     * 记录服务http://webpai.fe.ptdev.cn/paiband/webapi
     * 记录文件/data/logs/paiband_webapi.txt
     */
    isWebapiTest: false,
 
    //业务相关
    //remoteURL: 'http://api-paiband.ptdev.cn', //开发
    // remoteURL: 'http://test-api-paibanden.ptdev.cn', //测试
    remoteURL: 'http://api-paibanden.putao.com', //产线

    //帐号相关
    //remoteAccountURL: 'http://children-account-dev.ptdev.cn', //开发
    // remoteAccountURL: 'http://children-account.ptdev.cn', //测试
    remoteAccountURL: 'https://children-account.putao.com', //产线

    //remoteAvaterURL: 'http://weidu.file.dev.putaocloud.com/file/', //开发
    // remoteAvaterURL: 'http://weidu.file.dev.putaocloud.com/file/', //测试
    remoteAvaterURL: 'http://weidu.file.putaocloud.com/file/', //产线
};

export default config;
