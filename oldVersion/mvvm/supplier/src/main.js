import Vue from 'vue';
import Vuex from 'vuex';

import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
// import App from './App'
import mainPage from './index';
import configRouter from "./router"
//import List from './components/tables/list'
/* eslint-disable no-new */
// new Vue({
//  el: 'body',
//  components: { App }
// })
// Vue.config.debug=process.env.NODE_ENV !== 'production'
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.interceptors.push({
    request: function (request) {
        return request
    },
    response: function (response) {
        if (response.status===301) {
            alert('您需要重新登录或没有权限操作');
            location.href = '/login'

        }
        return response
    }
})
const router = new VueRouter({history: true});
configRouter(router)



// sync(store,router)
const App = Vue.extend(mainPage);
router.start(App, 'app');


