import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator'
import {checkLogin, clearToken} from './checkLogin';
// import App from './App'
import mainPage from './index';
import login from './page/login/login'
import configRouter from "./router"
/**
 * Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
 //
 //
 // 举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片
 */
// import 'babel-polyfill'
/**
 * ie9以及下不支持 classList,加此polyfill
 */
require('classlist-polyfill')

require('input-placeholder-polyfill')


//引入全局CSS,不建议使用 style方式引入,因为通过style方式引入的外部CSS的background:url的路径必须相对于当前VUE组件
require('webScss')
//import List from './components/tables/list'
/* eslint-disable no-new */
// new Vue({
//  el: 'body',
//  components: { App }
// })
// Vue.config.debug=process.env.NODE_ENV !== 'production'
/**
 * 验证组件必须放在 router use之前
 */
Vue.use(VueValidator);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({history: true});
const authorization = checkLogin();
configRouter(router, authorization);
var App;
if (!authorization) {
    App = Vue.extend(login);
} else {
    require('jquery');
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authorization);
        }
    });
    Vue.http.headers.common['Authorization'] = authorization;
    Vue.http.interceptors.push({
        request: function (request) {
            return request
        },
        response: function (response) {
            if (response.data && response.data.code && response.data.code.toString() === "401") {
                clearToken();
                // alert(response.data.message);
                 location.reload()
            }
            return response;
        }
    })
    App = Vue.extend(mainPage);
}
router.start(App, 'app');


