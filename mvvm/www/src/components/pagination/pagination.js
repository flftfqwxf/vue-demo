var Vue;
if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    Vue = require('vue');
} else if (typeof window.Vue !== 'undefined') {
    Vue = window.Vue;
}
if ($ && !$.pagination) {
    require('paginationPlugin')
}
let container;
Vue.directive('pagination', {
    twoWay: true,
    deep: true,
    priority: 1000,
    params: ['url', 'page'],
    bind: function () {
    },
    update: function (opts) {
        //_self.set('list',data.list);
        var _self = this;
        var vm = this.vm;
        var curPage = 1;
        if (vm.$route.query.page) {
            curPage = vm.$route.query.page
        }
        // $(this.el).pagination('destroy');
        if (container) {
            container.pagination('destroy')
            curPage = 1
        }
        var defaultOpts = {
            triggerPagingOnInit: true,
            hideWhenLessThanOnePage: true,
            getTotalPageByResponse: function (d) {
                this.rawData = d;
                return d.pagination.pageCount
            },
            alias: {
                pageNumber: 'page',
                pageSize: 'per'
            },
            totalNumber: 50,
            pageSize: 10,
            pageNumber: curPage,
            callback:null
        }
        opts = $.extend({}, defaultOpts, opts);
        container = $(this.el)
        container.pagination(opts);
    }, unbind: function () {

    }
});