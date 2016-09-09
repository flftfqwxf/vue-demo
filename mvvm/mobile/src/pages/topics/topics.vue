<template>
    <div>
        <new-list v-if="listInit" @getlist="getList" :list="newsList" v-ref:newList :isreset="isReset" :total="total" :wrapper-height="wrapperHeight">
            <topic :info="topicsInfo" v-el:topic></topic>
        </new-list>
        <down-load-tips v-if="isLoad" :scheme-link="schemeLink" :base-link="baseLink" :intent-link="intentLink" :ios-down-load-link="iosDownLoadLink"
                        :android-down-load-link="androidDownLoadLink"></down-load-tips>
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
                wrapperHeight: 400,
                listInit: false,
                curSort: 0,
                tempList: [],
                topic_id: 1,
                isLoad: false,
                schemeLink: "ironhide://Topic?source_id=",
//                baseLink: "youku://play?vid=XMTY5OTEzODI4MA==&ua=other&source=mplaypage2&cookieid=1472528008334sxcHJG|c4xzLb",
                baseLink: '',
                intentLink: "intent://Topic?source_id=222/#Intent;scheme=ironhide;package=com.istuary.ironhide;end;",
                iosDownLoadLink: "http://www.wulianaq.com",
                androidDownLoadLink: "http://www.wulianaq.com"
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
            getList: function (callback) {
                this.setPage(this.page + 1);
                this.loadTopicsList(this.topic_id, this.page, callback)
            }
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
        ready(){
            this.topic_id = this.$route.params.topic_id;
            this.isLoad = true;
            this.loadTopicsInfo(this.topic_id);
            var _this = this;
            this.schemeLink += this.topic_id;
            this.intentLink = "intent://Topic?source_id=" + this.topic_id + "/#Intent;scheme=ironhide;package=com.istuary.ironhide;end;"
            this.setReset(true)
            this.loadTopicsList(this.topic_id, 1, function () {
                _this.listInit = true;
            })
            this.wrapperHeight = document.documentElement.clientHeight;
        }
    }
</script>


