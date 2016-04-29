import {LOAD_NAV_LIST} from '../mutation-types'
const state = {
    navList: []
}
const mutations = {
    [LOAD_NAV_LIST](state, list){
        state.navList = list
    }
}
export default{
    state,
    mutations
}