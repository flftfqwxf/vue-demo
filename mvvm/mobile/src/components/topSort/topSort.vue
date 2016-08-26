<template>
    <header>
        <i class="wl-iconfont wl-mail"></i>
        物联网安全
        <i class="wl-iconfont wl-shai" id="header_sort" @click="sort"></i>
        <ul v-show="isShow" class="sort_wrap">
            <li @click="changeSort(0)" :class="{active:currentSort==0}">时间最近</li>
            <li @click="changeSort(1)" :class="{active:currentSort==1}">被赞最多</li>
            <li @click="changeSort(2)" :class="{active:currentSort==2}">评论最多</li>
        </ul>
    </header>
</template>
<script type="text/ecmascript-6">
    //    require('./topSort.sc')
    import {loadList,setReset} from "../../vuex/actions"
    export default {
        data(){
            return {
                currentSort:0,
                isShow: false
            }
        },
        methods: {
            sort(){
                this.isShow = this.isShow ? false : true;
            },
            changeSort(sort){
                this.setReset(true);
                this.loadList(sort);
                this.isShow=false;
                this.currentSort=sort;

            }
        },
        vuex: {
            actions: {
                loadList,
                setReset
            }
        },
        ready(){
//            $('#header_sort').on('click', function () {
//                // console.log('444')
//                var sort_wrap = $('.sort_wrap');
//                if (sort_wrap) {
//                    sort_wrap.toggle()
//                }
//                // $('.sort_wrap').show()
//            });
//            $('.sort_wrap>li').on('click', function () {
//                $('.sort_wrap >li').removeClass('active')
//                $(this).addClass('active');
//                location.href = $(this).attr('data-url')
//            })
        }
    }
</script>