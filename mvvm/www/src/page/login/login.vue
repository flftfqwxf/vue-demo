<template>
    <div style="height: 100%;">
        <top></top>
        <login></login>
        <foot></foot>
    </div>
</template>
<style lang="sass">



</style>
<script>
    import Top from '../../components/navs/top.vue'
    import Login from '../../components/dialogLogin/login.vue'
    import Foot from '../../components/footer/footer.vue'
    import store from '../../vuex/store'
//    require('jquery')
    export default {
        store:store,
        components: {
            Top,
            Foot,
            Login,
        }

    }
</script>
