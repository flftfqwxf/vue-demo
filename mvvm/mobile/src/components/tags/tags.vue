<template>
    <div class="tags_wrap">
        <div class="tags_container">
            <div class="tags_list">
                <ul >
                    <li v-for="topic in topics"><a v-link="{path:'/topics/'+topic.topic_id}" class="btn btn-info btn-xs">{{topic.topic_name}}</a></li>
                </ul>
            </div>
        </div>
        <i class="wl-iconfont wl-right tag_ico"></i>
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        props:{
            topics:{
                type:Array,
                required:true
            }
        },
        ready(){
            $('.tag_ico').click(function () {
                var _this = $(this);
                var w = $('.tags_list ul').width();
                var c_w = $('.tags_list').width();
                if (_this.hasClass('wl-left')) {
                    $(this).removeClass('wl-left').addClass('wl-right');
                    $('.tags_list').animate({scrollLeft: 0}, 300);
                } else {
                    $(this).addClass('wl-left').removeClass('wl-right');
                    $('.tags_list').animate({scrollLeft: w - c_w}, 300);
                }
            })
        }
    }
</script>