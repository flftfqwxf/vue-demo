<template>
    <div class="page-wrapper">
        <silder>
        </silder>
        <main></main>
    </div>
</template>
<!--<style lang="sass" >-->
    <!--/*根据组件位置的相对路径修改字体图标的引用地址*/-->
    <!--$fa-font-path:"../../../common/fonts/";-->

    <!--@import "~bootstrapCss";-->
    <!--/*@import "./ddd/a.scss";*/-->
<!--</style>-->
<script type="text/ecmascript-6">

    require('bootstrapCss')
//    import '../../../common/font-awesome'
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