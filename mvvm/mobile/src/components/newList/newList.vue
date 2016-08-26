<template>
    <div class="scrollWrap">

        <scroller v-if="list.length>0" lock-x scrollbar-y use-pullup v-el:wrapper :pullup-config="pullupConfig"
                  :height="wrapperHeight+'px'" @pullup:loading="load2" v-ref:scroller>
            <div>
                <slot></slot>
                <div class="main">
                    <template track-by="$index" v-for="item in list">
                        <div track-by="item.post_id" v-if="item.attachments && item.attachments.length===1" class="news_item pic_and_txt_item">
                            <div class="txt_info">
                                <p class="info_title"><a v-link="{path:'/articles/'+item.post_id}">{{item.post_title}}</a></p>
                                <span class="news_count">阅读{{item.view_count}}  赞{{item.vote_count}}  评论{{item.comment_count}}</span>
                            </div>
                            <a v-link="{path:'/articles/'+item.post_id}"><img :src="item.attachments[0].thumbnail" alt=""></a>
                        </div>
                        <div track-by="item.post_id" v-if="item.attachments && item.attachments.length===0" class="news_item txt_item">
                            <div class="txt_info">
                                <p class="info_title"><a v-link="{path:'/articles/'+item.post_id}">{{item.post_title}}</a></p>
                                <p class="summary_txt">
                                    {{item.post_short_content}}</p>
                                <span class="news_count">阅读{{item.view_count}}  赞{{item.vote_count}}  评论{{item.comment_count}}</span>
                            </div>
                        </div>
                        <div track-by="item.post_id" v-if="item.attachments && item.attachments.length>1" class="news_item pic_item">
                            <div class="txt_info">
                                <p class="info_title"><a v-link="{path:'/articles/'+item.post_id}">{{item.post_title}}</a></p>
                            </div>
                            <div class="img_list">
                                <div>
                                    <a v-link="{path:'/articles/'+item.post_id}" v-for=" img in item.attachments "><img :src="img.thumbnail" alt=""></a>
                                </div>
                                <p class="news_count">阅读{{item.view_count}} 赞{{item.vote_count}} 评论{{item.comment_count}}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </scroller>
    </div>
</template>
<script type="text/ecmascript-6">

    import Scroller from 'vux/src/components/scroller'
    export default{
        props: ['list', 'total', 'isreset', 'minSize', 'wrapperHeight'],
        data(){
            return {
//                isInit:false
                pullupConfig: {
//                    content: '上拉加载更多',
                    content: '正在加载',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                },
                pullupStatus: 'default',
            }
        },
        watch: {
            'isreset': function () {
//                console.log(this.isreset)
                if (this.isreset) {
                    this.reset()
                }
            }
        },
        computed: {
            minsize: function () {
                if (this.minSize) {
                    return minSize;
                }
                return 10
            }
        },
        methods: {
            reset(){
                this.$broadcast('scroller:reset', this.$refs.scroller.uuid)
                this.$nextTick(() => {
//                    this.$refs.scroller.reset()
                    this.$refs.scroller.reset({top: 0});
                })
            },
            load2 (uuid) {
                var _this = this;
                this.$dispatch('getList', function (len) {
                    if (len == 0) {
                        _this.$broadcast('pullup:done', uuid)
                    } else {
                        setTimeout(() => {
                            _this.$broadcast('pullup:reset', uuid)
                        }, 10)
                    }
                })
            },
        },
        ready() {
            if (this.list.length > 0 && this.total < this.minsize) {
                this.$broadcast('pullup:disable', this.$refs.scroller.uuid)
            }
            this.$broadcast('scroller:reset', this.$refs.scroller.uuid)
//            console.log(1)
//            this.wrapperHeight = document.documentElement.clientHeight - this.$els.wrapper.getBoundingClientRect().top;
//            alert(this.$els.wrapper.getBoundingClientRect().top)
        },
        components: {
            Scroller,
        }
    }
</script>
