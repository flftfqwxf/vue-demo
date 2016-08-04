import {GET_MESSAGE_LIST} from '../mutation-types'
const state={
    msgInfo:null
}
const mutations={
    [GET_MESSAGE_LIST](state,msgInfo){
        state.msgInfo=msgInfo
    }
}
export default{
    state,
    mutations
}