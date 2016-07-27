import * as types from './mutation-types'
export const loadNavList = function ({ dispatch}) {
    this.$http.get('/menu.json').then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_NAV_LIST,res.data.menus)
        }
    }, function (res) {
//                alert(res)
    })

}
export const loadBreadCrumb= function ({dispatch},uri='') {
    this.$http.get('/menu.json?uri='+uri).then(function (res) {
        if (res.ok && res.data) {
          dispatch(types.LOAD_BREADCRUMB,res.data.menu)
        }
    }, function (res) {
        alert('请求错误')
    })
}
/**
 * 获取右侧头部信息
 * @param dispatch
 * @param url
 */
export const loadUserInfo= function ({dispatch}) {
    this.$http.get('/user/info.json').then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_USER_INFO,res.data)
        }
    }, function (res) {
        alert('请求错误')
    })
}