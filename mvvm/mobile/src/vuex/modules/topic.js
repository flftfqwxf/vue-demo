import {LOAD_TOPICS_INFO} from '../mutation-types'
const state = {
    topicsInfo: {
        topic_id: '',
        topic_name: '',
        description: '',
        logo: ''
    }
}
const mutations = {
    [LOAD_TOPICS_INFO](state, res){
        state.topicsInfo = res
    }
}
export default{
    state,
    mutations
}