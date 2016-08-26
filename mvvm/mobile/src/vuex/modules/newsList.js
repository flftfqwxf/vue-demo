import {LOAD_NEWS_LIST, SET_PAGE, SET_RESET} from '../mutation-types'
const state = {
    newsList: [],
    sort: 0,
    page: 1,
    total: 0,
    isReset: false
}
const mutations = {
    [LOAD_NEWS_LIST](state, res, sort = 0, page = 1){
        if (state.isReset) {
            state.newsList = res.list
            state.isReset = false;
            state.page = 1;

        } else {
            state.newsList = state.newsList.concat(res.list);
            state.page = page;
        }
        state.total = res.total_count
        // state.newsList = res.list
        state.sort = sort;
        // state.isReset = isReset;
    },
    [SET_PAGE](state, page = 1){
        state.page = page;
    },
    [SET_RESET](state, isReset){
        state.isReset = isReset;
    }
}
export default{
    state,
    mutations
}