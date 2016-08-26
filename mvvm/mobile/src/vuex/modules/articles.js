import {LOAD_TOPICS,LOAD_ARTICLES,LOAD_COMMENTS} from '../mutation-types'
const state = {
    topics: {},
    article:{},
    comments:{}
}
const mutations = {
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