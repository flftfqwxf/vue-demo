<template>
    <div>
        <top-sort></top-sort>
        <new-list v-if="listInit" :list="newsList" v-ref:newList :isreset="isReset" :total="total" :wrapper-height="wrapperHeight">
            <swiper></swiper>
        </new-list>
        <down-load-tips></down-load-tips>
    </div>
</template>
<script type="text/ecmascript-6">
    import topSort from '../../components/topSort/topSort.vue';
    import swiper from '../../components/swipe/swipe.vue'
    import newList from '../../components/newList/newList.vue';
    import downLoadTips from '../../components/downLoadTips/downLoadTips.vue';
    import {loadList, setPage, setReset} from '../../vuex/actions'
    require('indexCss')
    //    require('jquery')
    export default{
        vuex: {
            getters: {
                newsList: function ({newsList}) {
                    return newsList.newsList;
                },
                total: function ({newsList}) {
                    return newsList.total;
                },
                sort: ({newsList})=> {
                    return newsList.sort;
                },
                page: ({newsList})=> {
                    return newsList.page;
                },
                isReset: ({newsList})=> {
                    return newsList.isReset;
                }
            },
            actions: {
                loadList,
                setPage,
                setReset
            }
        },
        computed: {
            len: function () {
                if (this.newsList) {
                    return this.newsList.length;
                }
                return 0
            }
        },
        data(){
            return {
                load: null,
                wrapperHeight: 400,
                listInit: false,
            }
        },
//        watch: {
//            'isReset': function () {
//                console.log(this.isReset)
//                if (this.isReset) {
//                    this.$refs.newlist.reset();
//                }
//            }
//        },
        events: {
            getList: function (callback) {
                this.setPage(this.page + 1);
                this.loadList(this.sort, this.page, callback)
            }
        },
        components: {
            topSort,
            swiper,
            newList,
            downLoadTips
        },
        ready(){
            this.loadList(0, 1, function () {
                this.listInit = true;
            })
            this.wrapperHeight = document.documentElement.clientHeight - 40;
//            this.wrapperHeight=200
//            $(window).load(function () {
//                setTimeout(()=> {
//                    alert($('.scrollWrap')[0].getBoundingClientRect().top)
//                },3000)
//            })
        }
    }
</script>


