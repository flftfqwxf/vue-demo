var config = require('./webpack.base.conf')
const baseConfig = require('../../buildConfig')
var proxyConfig = require('./proxyConfig')[baseConfig.sysName];
const proxySetting = require('./proxySetting')
// config.devtool = 'eval-source-map'
//设置为source-map时才能用chrome断点调试
//文档查看：https://webpack.github.io/docs/configuration.html#devtool
config.devtool = "source-map"
var proxyUrl = {}
console.log('dev环境配置开始 :-------------------')
if (baseConfig.openProxy) {
    console.log('开启代理:-------------------')
    proxyUrl = proxySetting.setProxyUrls(proxyConfig)
   // if (baseConfig.isIP) {

        //TODO: 官方提供的方案无效,在网查上到,似乎需要依赖外部插件
        // proxyUrl["/images/*"] = {
        //     "target": {
        //         "host": "www.4c.cn",
        //         "protocol": 'http:',
        //         "port": 80
        //     },
        //     ignorePath: true,
        //     changeOrigin: true,
        //     secure: false,
        //     bypass: function (req, res, proxyOptions) {
        //
        //         console.log('wwwww使用代理的URL===>', req.url);
        //     }
        // }

   // }
}
config.devServer = {
    color: true,
    quite: false,
    host: baseConfig.host,
    historyApiFallback: true,
    noInfo: true,
    proxy: proxyUrl,
    port: baseConfig.port
}
module.exports = config
