<template>
    <div>
        <alert :show.sync="isAlert" :type="alertType" placement="top" :duration="duration" width="300px">
            {{tipsMsg}}
        </alert>
    </div>
</template>
<script>
    import modal from 'strap/Modal.vue'
    import alert from 'strap/Alert.vue'
    export default{
        props: {
            tipsMsg: {default: ''},
            isAlert: {default: false},
            alertType: {default: 'success'},
            placement: {default: 'top'},
            duration: {default: 3000}
        },
        components: {
            alert,
            modal
        }
    }
</script>
