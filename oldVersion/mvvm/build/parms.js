/**
 * Created by Administrator on 2016/5/4.
 */
var minimist = require('minimist');
var knownOptions = {
    string: 'sys',
    default: {sys: 'supplier'},
    boolean: 'ip',
    default: {ip: true}
};
var devConfig = require('./devConfig.json')
var options = minimist(process.argv.slice(2), knownOptions);
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