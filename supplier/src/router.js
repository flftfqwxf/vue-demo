import * as actions from './vuex/actions'
export default function (router) {
    router.map({
        //'/': {
        //    component: List
        //},
        '/mvvm': {
            component: function (resolve) {
                require(['./components/tables/list'], resolve);
            }
        },
        '/mvvm/2': {
            component: function (resolve) {
                require(['./components/tables/list2'], resolve);
            }
        },
        //'/about':
    });

    router.redirect({
        "*":'/mvvm'
    })
    router.beforeEach(function (transition) {
        // actions
        console.log("*====", transition)
        // actions.loadBreadCrumb(transition.to.path)
        // if (transition.to.path === '/forbidden') {
        //     transition.abort()
        // } else {
            transition.next()
        // }
    })
}
