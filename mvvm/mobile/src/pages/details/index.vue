<template>
    <div>
        <down-load-tips></down-load-tips>
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
                isLoad:false
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
                },comment_count: ({articles})=> {
                    return articles.article.comment_count;
                }
            },
            actions: {
                loadArticles
            }
        },
        ready(){
            const _this=this;
            const article_id = this.$route.params.article_id
            this.loadArticles(article_id,function () {
                _this.isLoad=true
            });
        }
    }
</script>


