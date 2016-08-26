<template>
    <div class="personalInfo"><i class="wl-iconfont wl-peopple"></i>
        <p class="u_name">物联专家 <i class="wl-iconfont wl-male info_sex"></i></p>
        <p class="u_info">物联网中的赞斗机</p>
        <p class="u_count">关注20   粉丝20   赞20</p>
    </div>
</template>
<script type="text/ecmascript-6">

    import {loadArticles} from '../../vuex/actions'

    export default{
        vuex:{
            getters:{

            },
            action:{
                loadArticles
            }
        },
        ready(){
            this.lo
        }
    }
</script>