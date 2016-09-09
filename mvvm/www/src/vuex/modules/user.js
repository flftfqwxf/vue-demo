import {LOAD_USER_INFO} from '../mutation-types'
const state = {
    userInfo: {}
}
const mutations = {
    [LOAD_USER_INFO](state, userInfo){
        state.userInfo = userInfo.data
    }
}
export default{
    state,
    mutations
}