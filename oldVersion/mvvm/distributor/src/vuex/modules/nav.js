import {LOAD_NAV_LIST} from '../mutation-types'
const state = {
    navList: []
}
const mutations = {
    [LOAD_NAV_LIST](state, menus){
        state.navList = menus
    }
}
export default{
    state,
    mutations
}