import {LOAD_INDEX_SWIPE_INFO} from '../mutation-types'
const state = {
    swipeList: {}
}
const mutations = {
    [LOAD_INDEX_SWIPE_INFO](state, res){
        state.swipeList = res
    }
}
export default{
    state,
    mutations
}