module.exports = {
    /**
     * 代理配置
     *
     * 项目名为 console的代理配置
     */
    console: {
        /**
         * 将一些域名代理到指定的服务上
         * 如果你的项目中有许多引用其他域名的服务,可能会使用到此项
         */
        rewrite: {
            "supplier.wulianaq.com": "http://localhost:8081"
        },
        /**
         * 设置当前项目哪些请求不使用代理,如:
         * "/api/mvvm/list2.json": false, 表示这个请求不通过WEBPACK的代理,直接使用服务器端接口
         */
        bypass: {
            "/api/mvvm/list2.json": false,
            "/api/mvvm/message.json": false,
            "/message/received.json": false,
            "/menu.json": false,
            "/user/info.json": false,
            "/booking/count": false
        },
        /**
         * 设置要代理的URL规则
         * url:为 代理规则,可用通配符
         * target:将此规则代理到指定的服务上
         */
        proxyUrlList: [{url: "/api/*", target: "http://localhost:9098"}]
    }
}