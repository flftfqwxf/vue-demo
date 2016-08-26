import Vue from "vue"
import Vuex from "vuex"
import swipe from './modules/swipe'
import newsList from './modules/newsList'
import articles from './modules/articles'
import topics from './modules/topic'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        swipe,
        newsList,
        articles,
        topics
    },
    strict: process.env.NODE_ENV !== 'production'
})