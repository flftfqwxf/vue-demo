<template>
    <div>
        <new-list v-if="listInit" :list="newsList" v-ref:newList :isreset="isReset" :total="total" :wrapper-height="wrapperHeight">
            <topic :info="topicsInfo" v-el:topic></topic>
        </new-list>
        <down-load-tips></down-load-tips>
    </div>
</template>
<script type="text/ecmascript-6">
    import topic from '../../components/topic/topic.vue';
    import newList from '../../components/newList/newList.vue'
    import downLoadTips from '../../components/downLoadTips/downLoadTips.vue';
    import {loadTopicsInfo, loadTopicsList, setPage, setReset} from '../../vuex/actions'
    require('topic')
    export default{
        data(){
            return {
                load: null,
                wrapperHeight: 400,
                listInit: false,
                curSort: 0,
                tempList: [],
                topic_id: 1
            }
        },
        components: {
            topic,
            newList,
            downLoadTips
        },
        computed: {
            len: function () {
                if (this.newsList) {
                    return this.newsList.length;
                }
                return 0
            }
        },
        methods: {
            reset(){
                if (this.curSort !== this.sort) {
                    this.tempList = [];
                    this.curSort = this.sort;
                }
            },
        },
        vuex: {
            getters: {
                topicsInfo: ({topics})=> {
                    return topics.topicsInfo
                },
                newsList: function ({newsList}) {
                    return newsList.newsList;
                },
                page: ({newsList})=> {
                    return newsList.page;
                },
                isReset: ({newsList})=> {
                    return newsList.isReset;
                },
                total: function ({newsList}) {
                    return newsList.total;
                },
            },
            actions: {
                loadTopicsInfo,
                loadTopicsList,
                setPage,
                setReset
            }
        },
        events: {
            getList: function (callback) {
                this.setPage(this.page + 1);
                this.loadTopicsList(this.topic_id, this.page, callback)
            }
        },
        ready(){
            this.topic_id = this.$route.params.topic_id
            this.loadTopicsInfo(this.topic_id);
            var _this = this;
            this.loadTopicsList(this.topic_id, 1, function () {
                _this.listInit = true;
            })
            this.wrapperHeight = document.documentElement.clientHeight;
        }
    }
</script>


