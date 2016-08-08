var Vue;
if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    Vue = require('vue');
} else if (typeof window.Vue !== 'undefined') {
    Vue = window.Vue;
}
var WdatePicker=require('./e97Date/WdatePicker')
require('jquery')
Vue.directive('datepicker', {
    bind: function () {
        var vm = this.vm;
        var key = this.expression;

        function setVal() {
            vm.$set(key, date);
        }

        $(this.el).focus(function () {
            WdatePicker({dchanging: setVal, Mchanging: setVal, ychanging: setVal, dchanged: setVal, Mchanged: setVal, ychanged: setVal})
        })
    },
    update: function (val) {

        // $(this.el).datepicker('setDate', val);
    }
});
var v = new Vue({
    el: "#main",
    data: {
        dt: '04/29/2015'
    },
    methods: {
        CheckDate: function () {
            console.log(this.dt);
        }
    }
});