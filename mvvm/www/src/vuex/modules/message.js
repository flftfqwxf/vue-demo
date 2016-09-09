import {LOAD_ARTICLES_LIST, SET_MESSAGE, LOAD_TOPICS, LOAD_ARTICLES, LOAD_COMMENTS} from '../mutation-types'
const state = {
    articlesList: null,
    topics: {},
    article: {},
    comments: {}
}
const mutations = {
    [LOAD_ARTICLES_LIST](state, articlesList){
        state.articlesList = articlesList
    },
    [SET_MESSAGE](state, message){
        state.message = message
    },
    [LOAD_TOPICS](state, res){
        state.topics = res
    },
    [LOAD_ARTICLES](state, res){
        state.article = res
    },
    [LOAD_COMMENTS](state, res){
        state.comments = res
    }
}
export default{
    state,
    mutations
}