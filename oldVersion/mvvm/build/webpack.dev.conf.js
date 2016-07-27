var config = require('./webpack.base.conf')
var sysConfig=require('./parms');
var devConfig=sysConfig.devConfig;
var devServer=devConfig.devServer;
var proxyConfig = {
    "/booking/*": {
        target: "http://localhost:9098",
        bypass: function (req, res, proxyOptions) {
            console.log('api==>', req.url);
            for (var item in devConfig.bypass) {
                if (req.url.indexOf(item) !== -1 && devConfig.bypass[item]) {
                    console.warn(req.url, ": is pass proxy");
                    return req.url;
                }
            }
        }
    },
    "/*/*.json*": {
        target: "http://localhost:9098",
        bypass: function (req, res, proxyOptions) {
            console.log('api==>', req.url);
            for (var item in devConfig.bypass) {
                if (req.url.indexOf(item) !== -1 && devConfig.bypass[item]) {
                    console.warn(req.url, ": is pass proxy");
                    return req.url;
                }
            }
        }
    },
    "/*.json*": {
        target: "http://localhost:9098",
        bypass: function (req, res, proxyOptions) {
            console.log('api==>', req.url);
            for (var item in devConfig.bypass) {
                if (req.url.indexOf(item) !== -1 && devConfig.bypass[item]) {
                    console.warn(req.url, ": is pass proxy");
                    return req.url;
                }
            }
        }
    }
    // "/*/*.json*": {
    //     target: "http://localhost:9098",
    //     bypass: function (req, res, proxyOptions) {
    //         console.log('api==>', req.url);
    //         for (var item in devConfig.bypass) {
    //             if (req.url.indexOf(item) !== -1 && devConfig.bypass[item]) {
    //                 console.warn(req.url, ": is pass proxy");
    //                 return req.url;
    //             }
    //         }
    //     }
    // }
}
if (!devServer.isIP) {
    proxyConfig["*"]={
        target: "http://localhost:8081",
        rewrite: function (req, proxyOptions) {

            // console.log('*==>', req);
            if (req.hostname && devServer.hostList[req.hostname]) {
                console.log('*==>',req.hostname, devServer.hostList[req.hostname]);
                proxyOptions.target = devServer.hostList[req.hostname];
            }

            // console.log('sss', devConfig.hostList[req.hostname] + req.url);
            // req.url=devConfig.hostList[req.hostname]+req.url;
        }
    }

}

if (!devConfig.proxy) {
    proxyConfig = {}
}

// config.devtool = 'eval-source-map'
//设置为source-map时才能用chrome断点调试
//文档查看：https://webpack.github.io/docs/configuration.html#devtool
config.devtool = "source-map"

config.devServer = {
    host: devServer.host,
    historyApiFallback: true,
    noInfo: true,
    proxy: proxyConfig,
    port: devServer.port
    //proxy: {
    //    "*": {
    //        target: "http://static.gmmtour.com/",
    //        host: "static.gmmtour.com"
    //    }
    //    //path: "/api/*",
    //    //target: "https://cnodejs.org",
    //    //host: "cnodejs.org"
    //}
}
module.exports = config
