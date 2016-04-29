module.exports = {
    // GET
    "GET /api/mvvm/list1.json": function (req, res, next) {

        // response json format
        res.send({
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
        })
    },
    "GET /api/mvvm/list2.json": function (req, res, next) {
        var page = req.query.page, data;
        if (parseInt(page)>1) {
            data = require('./list3.json');
        } else {
            data = require('./list2.json');
        }
        // response json format
        res.send(data)
    },
    "GET /api/mvvm/a.json": function (req, res, next) {
        //接收 ?a=1类型参数
        //console.log(req.query.name);
        //接收 /:id 类型参数
        //console.log(req.params.name);
        //接收 POST 类型参数
        //console.log(req.body.name);
        // response json format
        res.send({
            "navList": [{"navName": "111", "path": "/mvvm"}, {"navName": "222", "path": "/mvvm/2"}]
        })
    },
    // PUT POST DELETE is the same
    "PUT /v1/posts/:id": function () {
    },
    "POST /v1/posts": function () {
    },
    "DELETE /v1/posts/:id": function () {
    }
}