/**
 * Created by leixianhua on 16/8/23.
 */

module.exports=function (server) {
    server.get('/api/h5/banners/index', {
        // delay: 12000,
        data: function (params, query) {
            var page = query.page, data;
            data = require('./data/swipeList');
            return data
        }
    });
    server.get('/api/h5/articles/index', {
        // delay: 12000,
        data: function (params, query) {
            var page = query.page, data;
            data = require('./data/newList');
            return data
        }
    });
    server.get('/api/h5/topics/posts', {
        // delay: 12000,
        data: function (params, query) {
            var page = query.page, data;
            data = require('./data/topicList');
            return data
        }
    });
    server.get('/api/h5/topics/show', {
        // delay: 12000,
        data: function (params, query) {
            var page = query.page, data;
            data = require('./data/topicInfo');
            return data
        }
    });
    server.get('/api/h5/articles/show', {
        // delay: 12000,
        data: function (params, query) {
            var page = query.page, data;
            data = require('./data/details');
            return data
        }
    });
}
