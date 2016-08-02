import * as actions from './vuex/actions'
export default function (router) {
    router.map({
        //'/': {
        //    component: List
        //},
        // '/mvvm': {
        //     component: function (resolve) {
        //         require(['./components/tables/list'], resolve);
        //     }
        // },
        '/mvvm/2': {
            component: function (resolve) {
                require(['./components/tables/list2'], resolve);
            }
        },
        '/mvvm/message': {
            component: function (resolve) {
                require(['./components/message/list'], resolve);
            }
        },
        '/mvvm/demo': {
            component: function (resolve) {
                require(['./components/demo/index'], resolve);
            }
        },
        // '/mvvm/2': {
        //     component: function (resolve) {
        //         require(['./components/tables/list2'], resolve);
        //     }
        // },
        //'/about':
    });

    router.redirect({
        "*":'/mvvm/message'
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
            transition.next()
        // }
    })
}
