import {SET_ALERT_TIPS} from '../mutation-types'
const state = {
    alertTips: {
        tipMsg: {default: ''},
        isShow: {default: false},
        alertType: {default: 'success'},
        placement: {default: 'top'},
        duration: {default: 3000}
    }
}
const mutations = {
    [SET_ALERT_TIPS](state, alertTips){
        state.alertTips = Object.assign({}, state.alertTips, alertTips)
    },
}
export default{
    state,
    mutations
}