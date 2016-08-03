<template>
    <div class="page-wrapper">
        <silder>
        </silder>
        <main></main>
    </div>
</template>

<script type="text/ecmascript-6">

    //引入全局CSS,不建议使用 style方式引入,因为通过style方式引入的外部CSS的background:url的路径必须相对于当前VUE组件

    require('bootstrapCss')
    import Silder from './components/navs/Silder'
    import Main from './components/container/Main.vue'
    import store from './vuex/store'
    export default {
        store:store,
        components: {
            Silder,
            Main
        }
    }
</script>