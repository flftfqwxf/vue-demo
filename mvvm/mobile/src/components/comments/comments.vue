<template>
    <div class="comments" v-if="comment_count>0">
        <div class="comments_head">评论</div>
        <div class="comment_list">
            <div class="comment_item" v-for="comment in comments">
                <img class="face_pic" :src="comment.user.avatar" alt="">
                <div class="comment_content">
                    <p class="u_name">{{comment.user.user_name}}</p>
                    <p class="comment_txt">
                        {{comment.content}} </p>
                    <div class="comment_info"><span class="comment_time">{{comment.created_time}} </span><span class="comment_agree fr"><i
                            class="wl-iconfont wl-like"></i>&nbsp;{{comment.vote_count > 999 ? comment.vote_count+'＋' : comment.vote_count}} </span></div>
                </div>
            </div>
        </div>
        <div class="openAppWrap">
            <button v-if="comment_count>3" @click="openApp" class="btn btn-default btn-lg ">打开物联网安全，查看更多评论</button>
            <button v-if="comment_count>0 && comment_count<3" @click="openApp" class="btn btn-default btn-lg ">打开物联网安全，参与讨论</button>
            <button v-if="comment_count==0" @click="openApp" class="btn btn-default btn-lg ">打开物联网安全，去抢沙发</button>
        </div>
    </div>
    <div class="comments" v-if="comment_count===0">
        <div class="comments_head">评论</div>
        <div class="comment_empty">暂无评论</div>
        <div class="openAppWrap">
            <button class="btn btn-default btn-lg " @click="openApp">打开物联网安全，去抢沙发</button>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    const openApp=require('../openApp/openApp')
    export default{
        props: ['comments', 'comment_count','schemeLink','baseLink','intentLink','iosDownLoadLink','androidDownLoadLink'],
        data(){
            return {}
        },
        methods: {
            openApp(){
//                location.href=Scheme;
                openApp(this.schemeLink, this.baseLink, this.intentLink, this.iosDownLoadLink, this.androidDownLoadLink);
            }
        }
    }
</script>