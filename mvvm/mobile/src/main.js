import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// import App from './App'
import mainPage from './index';
import configRouter from "./router"
//引入全局CSS,不建议使用 style方式引入,因为通过style方式引入的外部CSS的background:url的路径必须相对于当前VUE组件
require('bootstrapMobileCss')

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
// Vue.use(VueValidator);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({history: true,saveScrollPosition:false});
// const authorization = checkLogin();
const authorization='';
configRouter(router, authorization);
var App;
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
router.start(App, 'app');


