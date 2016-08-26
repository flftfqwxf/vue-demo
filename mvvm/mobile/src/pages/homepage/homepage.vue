<template>
    <div>
        <personal-info></personal-info>
        <new-list></new-list>
        <down-load-tips></down-load-tips>
    </div>
</template>

<script type="text/ecmascript-6">
    import personalInfo from '../../components/personalInfo/personalInfo.vue';
    import newList from '../../components/newList/newList.vue'
    import downLoadTips from '../../components/downLoadTips/downLoadTips.vue';

    require('homepage')
    export default{
        data(){
            return {
                msg: 'hello vue',

            }
        },
        components: {
            personalInfo,
            newList,
            downLoadTips
        },

    }
</script>


