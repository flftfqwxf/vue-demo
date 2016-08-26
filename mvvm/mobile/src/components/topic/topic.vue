<template>
    <div class="topic_info">
        <span>
            <img :src="info.logo" alt="">
        </span>
        <p class="topic_name">{{info.topic_name}}</p>

    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        props:['info']
    }
</script>