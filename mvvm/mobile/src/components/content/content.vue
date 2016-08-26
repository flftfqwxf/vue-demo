<template>
    <div class="detail_main">
        <h3>{{article.post_title}}</h3>
        <p class="detail_info">
            <span>{{article.created_time}}   <a >{{article.user && article.user.user_name}}</a></span>
            <span class="fr">阅读{{article.view_count}}</span>
        </p>
        <div class="detail_content">
            {{{article.post_content}}}
        </div>
        <div class="detail_count"><i class="wl-iconfont wl-eye"></i>{{article.view_count}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="wl-iconfont wl-like"></i>{{article.vote_count}}</div>

    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        props:{
            article:{
                required:true
            }
        }
    }
</script>