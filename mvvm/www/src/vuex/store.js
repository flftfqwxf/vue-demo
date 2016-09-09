
import Vue from "vue"
import Vuex from "vuex"
import message from './modules/message'
import user from './modules/user'
Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        message,
        user
    },
    strict: process.env.NODE_ENV !== 'production'
})