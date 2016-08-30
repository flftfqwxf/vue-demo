<template>
    <div>
        <down-load-tips v-if="isLoad" :scheme-link="schemeLink" :base-link="baseLink" :intent-link="intentLink" :ios-down-load-link="iosDownLoadLink"
                        :android-down-load-link="androidDownLoadLink"></down-load-tips>
        <tags v-if="topics.length" :topics="topics"></tags>
        <content :article="article"></content>
        <comments :comments="comments" v-if="isLoad" :comment_count="comment_count"></comments>
    </div>
</template>
<style scoped>
    /*重置底部下载提示,使之在顶部显示*/

    .openApp{ position: static }
</style>
<script type="text/ecmascript-6">
    import downLoadTips from '../../components/downLoadTips/downLoadTips.vue';
    import topSort from '../../components/topSort/topSort.vue';
    import tags from '../../components/tags/tags.vue';
    import content from '../../components/content/content.vue';
    import comments from '../../components/comments/comments.vue';

    import {loadArticles} from '../../vuex/actions'
    require('detailCss')
    export default{
        data(){
            return {
                isLoad: false,
                schemeLink: "ironhide://Article?source_id=",
//                baseLink: "youku://play?vid=XMTY5OTEzODI4MA==&ua=other&source=mplaypage2&cookieid=1472528008334sxcHJG|c4xzLb",
                baseLink: '',
                intentLink: "intent://Article?source_id=222/#Intent;scheme=ironhide;package=com.istuary.ironhide;end;",
                iosDownLoadLink: "http://www.wulianaq.com",
                androidDownLoadLink: "http://www.wulianaq.com"
            }
        },
        components: {
            downLoadTips,
            topSort,
            tags,
            content,
            comments
        },
        vuex: {
            getters: {
                topics: ({articles})=> {
                    return articles.topics;
                },
                article: function ({articles}) {
                    return articles.article;
                },
                comments: ({articles})=> {
                    return articles.comments;
                }, comment_count: ({articles})=> {
                    return articles.article.comment_count;
                }
            },
            actions: {
                loadArticles
            }
        },
        ready(){
            const _this = this;
            const article_id = this.$route.params.article_id;
            this.schemeLink += article_id;
            this.intentLink = "intent://Article?source_id=" + article_id + "/#Intent;scheme=ironhide;package=com.istuary.ironhide;end;"
            this.loadArticles(article_id, function () {
                _this.isLoad = true
            });
        }
    }
</script>


