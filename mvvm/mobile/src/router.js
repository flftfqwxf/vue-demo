// import * as actions from './vuex/actions'
export default function (router, authorization) {
    router.map({
        //'/': {
        //    component: List
        //},

        '/articles/:article_id': {
            component: function (resolve) {
                require(['./pages/details/index'], resolve);
            }
        },
        '/topics/:topic_id': {
            component: function (resolve) {
                require(['./pages/topics/topics'], resolve);
            }
        },
        // '/homepage/:user_id': {
        //     component: function (resolve) {
        //         require(['./pages/homepage/homepage'], resolve);
        //     }
        // },
        '/': {
            component: function (resolve) {
                require(['./pages/index/index'], resolve);
            }
        }

    });
    router.redirect({
        "*":'/'
    })
    router.beforeEach(function (transition) {

        // if (transition) {
        //
        //
        // }
        // {result:{success:false,;message:请重新登录,isReload:true}}
        // actions
        // console.log("*====", transition)
        // var path=transition.to.path
        // var urls=path.split('/')
        // if (urls.length>0) {
        //     // Vue.prototype.navCurrent=urls[0]
        // }
        // actions.loadBreadCrumb(transition.to.path)
        // if (transition.to.path === '/forbidden') {
        //     transition.abort()
        // } else {
        // if (!authorization) {
        //     transition.redirect('/login');
        // } else if (transition.to.path === '/login') {
        //     transition.redirect('/');
        // } else {
            transition.next()
        // }
        // }
    })
}
