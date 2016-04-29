import * as types from './mutation-types'
export const loadNavList = function ({ dispatch}) {
    this.$http.get('/api/mvvm/a.json').then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_NAV_LIST,res.data.navList)
        }
    }, function (res) {
//                alert(res)
    })

}
export const loadBreadCrumb= function ({dispatch},url='') {
    this.$http.get('/api/mvvm/breadcrumb.json?url='+url).then(function (res) {
        if (res.ok && res.data) {
          dispatch(types.LOAD_BREADCRUMB,res.data.breadcrumb)
        }
    }, function (res) {
        alert('请求错误')
    })
}