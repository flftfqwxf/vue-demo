var Mock = require('mockjs');
var Server = require("ohana");
// 使用 madoka.generate 为默认的解析器，解析数据模板
var server = new Server({
    parser: Mock.mock
});
server.get('/api/mvvm/list1.json', {
    delay: 200,
    data: function (params, query) {
        return {
            "list": [
                {
                    "firstName": 66644124,
                    "lastName": 122,
                    "fullName": 12112
                },
                {
                    "firstName": 132,
                    "lastName": 132,
                    "fullName": 1312
                },
                {
                    "firstName": 133,
                    "lastName": 132,
                    "fullName": 1312
                }
            ]
        }
    }
})
server.get('/api/mvvm/list2.json', {
    //delay: 12000,
    data: function (params, query) {
        var page = query.page, data;
        if (parseInt(page) > 1) {
            data = require('./list3.json');
        } else {
            data = require('./list2.json');
        }
        return data
    }
});
server.get('/api/mvvm/message.json', {
    //delay: 12000,
    data: function (params, query) {
        var page = query.page, data;
        data = require('./message.json');
        return data
    }
});
server.get('/api/menu.json', {
    //delay: 12000,
    data: function (params, query) {
        data = require('./menu.json');
        return data
    }
});
server.get('/api/user/info.json', {
    //delay: 12000,
    data: function (params, query) {
        data = require('./info.json');
        return data
    }
});
server.get('/api/order/count.json', {
    //delay: 12000,
    data: function (params, query) {
        data = require('./count.json');
        return data
    }
});
server.get('/api/message/received.json', {
    //delay: 12000,
    data: function (params, query) {
        data = require('./received.json');
        return data
    }
});
server.get('/api/mvvm/breadcrumb.json', {
    data: function (params, query) {
        var data = require('./breakcrumb.json');
        if (query.url === '/mvvm') {
            data = require('./breakcrumb3.json');
        }
        return data
    }
});
server.get('/api/booking/count', {
    //delay: 12000,
    data: function (params, query) {
        var data = require('./list2.json');
        return data
    }
});
server.get('/api/mvvm/a.json', {
    delay: 200,
    //statusCode: 301,
    data: function (params, query) {
        var data = require('./a.json')
        return data
    }
});
// 输出数据之前，处理一下数据
server.get('/api/user/filter/', {
    beforeResponse: function (data) {
        return data.data;
    },
    data: function (params, query) {
        return {
            'data': [
                '{{ repeat(5, 7) }}',
                {
                    'user_name': '{{ firstName() }} {{ lastName() }}'
                }
            ]
        }
    }
});
// 指定输出的 content-type
// 返回 text/html 类型
server.get('/api/user/:id/tag', {
    contentType: 'text/html',
    beforeResponse: function (data) {
        return data.tag;
    },
    data: {
        tag: 'loli'
    }
});
server.start(9098);