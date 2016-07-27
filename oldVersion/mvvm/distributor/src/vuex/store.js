
import Vue from "vue"
import Vuex from "vuex"
import nav from './modules/nav'
import breadcrumb from './modules/breadcrumb'
import top from './modules/top'
Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        nav,
        top,
        breadcrumb
    },
    strict: process.env.NODE_ENV !== 'production'
})