import * as types from './mutation-types'
/**
 * 获取用户信息
 * @param dispatch
 * @param url
 */
export const loadUserInfo = function ({dispatch}) {
    this.$http.get('/api/website/users/show').then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_USER_INFO, res.data)
            if (res.data.data.is_expert===0) {
               console.log(this.$route.router.path)
                // this.$route.router.go('/')

            }
        }
    }, function (res) {
        alert('请求错误')
    })
}
import {setToken} from '../checkLogin'
/**
 * 登录
 * @param dispatch
 * @param url
 */
export const login = function ({dispatch}, mobile, password, vm) {
    this.$http.post('/api/website/users/sign_in', {'mobile': mobile, 'password': password}).then(function (res) {
        if (res.ok && res.data) {
            if (res.headers('access_token')) {
                dispatch(types.LOAD_USER_INFO, res.data.data)
                setToken('Token token=' + res.headers('access_token'));
                location.reload();
            } else {
                vm.loginError = res.data.message
            }
        }
    }, function (res) {
        alert(res)
    })
}
/**
 *
 * @param dispatch
 * @param url
 */
/**
 * 获取文章列表
 * @param dispatch
 * @param sort  排序方式
 * @param page 当前页数
 * @param per 每页多少条数据
 */
export const loadArticlesList = function ({dispatch}, sort = 0, page = 1, per = 10) {
    this.$http.get('/api/website/users/articles?sort=' + sort + '&page=' + page + '&per=' + per).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_ARTICLES_LIST, res.data.list)
        }
    }, function (res) {
        alert('请求错误')
    })
}
export const addArticle = function ({dispatch}, opts, vm) {
    this.$http.post('/api/website/articles/create', opts).then(function (res) {
        if (res.ok && res.data) {
            if (res.data.code === 1) {
                vm.$dispatch('openTips', {'tipsMsg': res.data.data});
                vm.$route.router.go('/');
            } else {
                // dispatch(types.SET_MESSAGE,res.data.message)
                vm.postError = res.data.message;
            }
        }
    }, function (res) {
        alert(res)
    })
}
export const updateArticle = function ({dispatch}, opts, vm) {
    this.$http.put('/api/website/articles/update', opts).then(function (res) {
        if (res.ok && res.data) {
            if (res.data.code === 1) {
                // vm.tipMsg = res.data.message;
                // vm.isAlert = true;
                vm.$dispatch('openTips', {'tipsMsg': res.data.data});
                vm.$route.router.go('/');
                // setTimeout(()=> {
                //     vm.$route.router.go('/');
                // }, 1000)
            } else {
                // dispatch(types.SET_MESSAGE,res.data.message)
                vm.postError = res.data.message;
            }
        }
    }, function (res) {
        alert(res)
    })
}
/**
 * 获取详情页信息 包括话题、内容、评论
 * @param dispatch
 * @param url
 */
export const loadArticles = function ({dispatch}, post_id, callback) {
    this.$http.get('/api/website/articles/show?post_id=' + post_id,).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_ARTICLES, res.data.data);
            dispatch(types.LOAD_TOPICS, res.data.data.topics);
            // dispatch(types.LOAD_COMMENTS, res.data.data.comments);
        }
        if (callback) {
            callback.apply(this);
        }
    }, function (res) {
        console.log('请求错误5')
    })
}
/**
 * 设置顶部提示
 * @param dispatch
 * @param alertOpts
 */
export const setAlertTips = function ({dispatch}, alertOpts) {
    dispatch(types.SET_ALERT_TIPS, alertOpts);
}