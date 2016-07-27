import Vue from 'vue';
import VueRouter from 'vue-router';
// import App from './App'
import mainPage from './myList';
//import List from './components/tables/list'
/* eslint-disable no-new */
// new Vue({
//  el: 'body',
//  components: { App }
// })
Vue.use(VueRouter);
const router = new VueRouter({history: true});
router.map({
    //'/': {
    //    component: List
    //},
    '/mvvm': {
        component: function (resolve) {
            require(['./components/tables/list'],resolve);
        }
    },
    '/mvvm/2': {
        component: function (resolve) {
            require(['./components/tables/list2'],resolve);
        }
    },
    //'/about':
});
const App = Vue.extend(mainPage);
router.start(App, 'app');


