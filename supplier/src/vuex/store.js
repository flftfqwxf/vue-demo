
import Vue from "vue"
import Vuex from "vuex"
import nav from './modules/nav'
import breadcrumb from './modules/breadcrumb'
Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        nav,
        breadcrumb
    },
    strict: process.env.NODE_ENV !== 'production'
})