import {LOAD_BREADCRUMB} from '../mutation-types'
const state = {
    breadcrumbInfo: {}
}
const mutations = {
    [LOAD_BREADCRUMB](state, breadcrumbInfo){
        state.breadcrumbInfo = breadcrumbInfo
    }
}
export default{
    state,
    mutations
}