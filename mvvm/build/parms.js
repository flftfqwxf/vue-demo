/**
 * Created by Administrator on 2016/5/4.
 */
const baseConfig=require('../../buildConfig')

function setConfigByDomain() {
    var devServer;
    devConfig.devServer.isIP = options.ip
    if (devConfig.devServer.isIP) {
        devServer = devConfig.devServer.ip
        devServer.isIP=true;
        devServer.sys = options.sys;
        devServer.publicPath = devServer.publicPath + devServer.sys
    } else {
        devServer = devConfig.devServer.domain;
        devServer.sys = options.sys;
        console.log(devServer.host,'---------------------------!!!!!!!!!!!!!')
        //把二级域名与主域名拼接,如  'distributor'+'.wulianaq.com'
        devServer.host = devServer.sys + devServer.host;

        devServer.publicPath = 'http://' + devServer.host
    }
    return devServer;
}
devConfig.devServer = setConfigByDomain();
module.exports = {
    options: options,
    devConfig: devConfig,
}