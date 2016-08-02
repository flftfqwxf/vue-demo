<template>
    <div class="page-wrapper">
        <silder>
        </silder>
        <main></main>
    </div>
</template>
<style lang="sass">
    /*@import "~bootstrapCss";*/
    @import "ddd/a.scss";
</style>
<script type="text/ecmascript-6">

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