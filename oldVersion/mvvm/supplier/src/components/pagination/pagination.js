var Vue;

if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    Vue = require('vue');
} else if (typeof window.Vue !== 'undefined') {
    Vue = window.Vue;
}
Vue.directive('pagination', {
    twoWay: true,
    priority: 1000,
    params:['url','page'],
    bind: function () {

    },
    update: function (value) {
        //_self.set('list',data.list);
        var _self=this;
        var vm = this.vm;
        var curPage=1;
        if (vm.$route.query.page) {
            curPage=vm.$route.query.page
        }
        $(this.el).pagination({
            dataSource: this.params.url + "?_=" + Math.random(),
            locator: "list",
            triggerPagingOnInit: true,
            hideWhenLessThanOnePage: true,
            getTotalPageByResponse: function (d) {
                this.rawData = d;
                return d.pagination.pageCount
            },
            alias: {
                pageNumber: 'page',
                pageSize: 'size'
            },
            totalNumber: 50,
            pageSize: 5,
            pageNumber:curPage,
            callback: function (data, pagination) {
                vm.list=data;
                vm.$router.go(vm.$route.fullPath+'?page='+pagination.pageNumber);
            }
        });
    }, unbind: function () {
    }
});