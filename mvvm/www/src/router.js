import * as actions from './vuex/actions'
export default function (router, authorization) {
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
        '/': {
            component: function (resolve) {
                require(['./components/articlesList/list'], resolve);
            }
        },
        '/article/add': {
            component: function (resolve) {
                require(['./page/article/add'], resolve);
            }
        },
        '/article/editor/:id': {
            component: function (resolve) {
                require(['./page/article/editor'], resolve);
            }
        },
        '/mvvm/demo': {
            component: function (resolve) {
                require(['./components/demo/index'], resolve);
            }
        },
        '/mvvm/demo/picker': {
            component: function (resolve) {
                require(['./components/demo/demo.vue'], resolve);
            }
        },
        '/mvvm/demo/upload': {
            component: function (resolve) {
                require(['./components/demo/upload-demo.vue'], resolve);
            }
        },
        '/mvvm/demo/ueditor': {
            component: function (resolve) {
                require(['./components/demo/ueditor-demo.vue'], resolve);
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
