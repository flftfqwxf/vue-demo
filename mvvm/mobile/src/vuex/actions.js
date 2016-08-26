import * as types from './mutation-types'
/**
 * 获取轮播信息
 * @param dispatch
 * @param url
 */
export const loadIndexSwipeInfo = function ({dispatch}) {
    this.$http.get('/api/h5/banners/index').then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_INDEX_SWIPE_INFO, res.data.data)
        }
    }, function (res) {
        alert('请求错误')
    })
}
/**
 * 获取首页列表信息
 * @param dispatch
 * @param url
 */
export const loadList = function ({dispatch}, sort = 0, page = 1, callback) {
    this.$http.get('/api/h5/articles/index?sort=' + sort + '&page=' + page + '&per=10',).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_NEWS_LIST, res.data.data, sort, page)
        }
        if (callback) {
            callback.call(this, res.data.data.list.length)
        }
    }, function (res) {
        alert('请求错误')
    })
}
export const setPage = function ({dispatch}, page) {
    dispatch(types.SET_PAGE, page)
}
export const setReset = function ({dispatch}, isReset) {
    dispatch(types.SET_RESET, isReset)
}
/**
 * 获取话题列表信息
 * @param dispatch
 * @param url
 */
export const loadTopicsList = function ({dispatch}, topic_id, page = 1, callback) {
    this.$http.get('/api/h5/topics/posts?topic_id=' + topic_id + '&page=' + page + '&per=10',).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_NEWS_LIST, res.data.data, 0, page)
        }
        if (callback) {
            callback.call(this, res.data.data.list.length)
        }
    }, function (res) {
        alert('请求错误')
    })
}
/**
 * 获取话题信息
 * @param dispatch
 * @param url
 */
export const loadTopicsInfo = function ({dispatch}, topic_id) {
    this.$http.get('/api/h5/topics/show?topic_id=' + topic_id,).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_TOPICS_INFO, res.data.data)
        }
    }, function (res) {
        alert('请求错误')
    })
}
/**
 * 获取详情页信息 包括话题、内容、评论
 * @param dispatch
 * @param url
 */
export const loadArticles = function ({dispatch}, article_id, callback) {
    this.$http.get('/api/h5/articles/show?article_id=' + article_id,).then(function (res) {
        if (res.ok && res.data) {
            dispatch(types.LOAD_ARTICLES, res.data.data);
            dispatch(types.LOAD_TOPICS, res.data.data.topics);
            dispatch(types.LOAD_COMMENTS, res.data.data.comments);
        }
        if (callback) {
            callback.apply(this);
        }
    }, function (res) {
        alert('请求错误')
    })
}
/**
 * 获取个人信息
 * @param dispatch
 * @param url
 */
// export const loadUserInfo= function ({dispatch},article_id,callback) {
//     this.$http.get('/api/h5/articles/show?article_id='+article_id,).then(function (res) {
//         if (res.ok && res.data) {
//             dispatch(types.LOAD_ARTICLES,res.data.data);
//             dispatch(types.LOAD_TOPICS,res.data.data.topics);
//             dispatch(types.LOAD_COMMENTS,res.data.data.comments);
//         }
//         if (callback) {
//             callback.apply(this);
//         }
//     }, function (res) {
//         alert('请求错误')
//     })
// }