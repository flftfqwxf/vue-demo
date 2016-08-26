/**
 * 根据URL规则来指定代理及处理 PASS的路径
 * @param proxyConfig 代理的配置文件对象
 * @returns {{}} 返回webpack-dev-server的代理对象
 */
function setProxyUrls(proxyConfig) {
    var proxyUrl = {};
    if (proxyConfig && proxyConfig.proxyUrlList) {
        proxyConfig.proxyUrlList.map((item)=> {
            proxyUrl[item.url] = {
                target: item.target,
                bypass: function (req, res, proxyOptions) {
                    for (var item in proxyConfig.bypass) {
                        if (req.url.indexOf(item) !== -1 && proxyConfig.bypass[item]) {
                            console.warn(req.url, ": is pass proxy");
                            return req.url;
                        }
                    }
                    console.log('使用代理的URL===>', req.url);
                }
            }
        })
        console.log('代理规则:',proxyUrl);
      
    }

    return proxyUrl
}

// function setHostRewriteOtherHost(proxyConfig) {
//
//     proxyConfig.rewrite.map((item)=> {
//         proxyUrl[item.url] = {
//             target: item.target,
//             bypass: function (req, res, proxyOptions) {
//                 for (var item in proxyConfig.bypass) {
//                     if (req.url.indexOf(item) !== -1 && proxyConfig.bypass[item]) {
//                         console.warn(req.url, ": is pass proxy");
//                         return req.url;
//                     }
//                 }
//                 console.log('使用代理的URL===>', req.url);
//             }
//         }
//     })
//     console.log('代理规则:',proxyUrl);
//
//     {
//         target: "http://localhost:8081",
//             rewrite: function (req, proxyOptions) {
//
//         // console.log('*==>', req);
//         if (req.hostname && proxyConfig.hostList[req.hostname]) {
//             console.log('*==>', req.hostname, proxyConfig.hostList[req.hostname]);
//             proxyOptions.target = proxyConfig.hostList[req.hostname];
//         }
//         // console.log('sss', devConfig.hostList[req.hostname] + req.url);
//         // req.url=devConfig.hostList[req.hostname]+req.url;
//     }
//     }
// }

module.exports = {
    setProxyUrls: setProxyUrls
}