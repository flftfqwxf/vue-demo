<template>
    <div style="height: 200px" >
        <!--<loading :show="!swipeList.length" :text="加载中...."></loading>-->
        <swiper v-if="swipeList.length" id="swipe" auto  dots-class="custom_bottom" dots-position="center">
            <swiper-item class="black" v-for="item in swipeList">
                <a v-link="{path:'articles/'+item.target_id}">
                    <img :src="item.img" alt="">
                </a>
            </swiper-item>

        </swiper>
    </div>
</template>
<style>
    .vux-slider .custom_bottom{
        bottom: 0 !important;
        font-size: 12px;
        right: auto;
    }
    .vux-slider > .vux-swiper{
        margin-bottom: 20px;
    }
    #swipe .vux-icon-dot{
        background: #D8D8D8;
        border-radius: 20px;
        width: 14px; height: 2px; overflow: hidden;
    }
    #swipe .active{
        background: #FF901F;
    }
</style>
<script>
    import swiper from 'vux/src/components/swiper';
    import swiperItem from 'vux/src/components/swiper-item';

    import loading from 'vux/src/components/loading';

    import {loadIndexSwipeInfo} from "../../vuex/actions"
    export default{
        data(){
            return {
                list: []
            }
        }, components: {
            swiper,
            swiperItem,
            loading
        },
        vuex: {
            getters: {
                swipeList: ({swipe})=> {
                    return swipe.swipeList;
                }
            },
            actions: {
                loadIndexSwipeInfo
            }
        },
        computed: {},
        ready: function () {
            this.loadIndexSwipeInfo()
        },
    }
</script>