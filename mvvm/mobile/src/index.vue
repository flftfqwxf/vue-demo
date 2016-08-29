<template>
    <div >
        <router-view class="view" transition="fade" transition-mode="out-in"></router-view>
    </div>
</template>
<style>
    .fade-transition {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
    }
</style>
<script type="text/ecmascript-6">

    require('jquery')
    import store from './vuex/store'
    export default {
        store:store,
        components: {
//            Main
        }
    }
</script>