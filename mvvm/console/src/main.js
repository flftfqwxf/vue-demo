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
        if (response.data && response.data.result && !response.data.result.success) {
            alert(response.data.result.message);
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


