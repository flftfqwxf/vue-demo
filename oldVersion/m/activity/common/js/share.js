(function(){
    var coverImg = $('[itemprop="image"]').attr('content');
    var title = $('[itemprop="name"]').attr('content');
    var description = $('[itemprop="description"]').attr('content');
    var url = $('[itemprop="shareUrl"]').attr('content');

    //判断是否是微信端
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }

    //网页版人人网分享
    function shareRenren() {
        var rrShareParam = {
            resourceUrl : url,    //分享的资源Url
            srcUrl : url, //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
            pic : coverImg,     //分享的主题图片Url
            title :title,        //分享的标题
            description : description   //分享的详细描述
        };
        rrShareOnclick(rrShareParam);
    }

    //网页版qq分享
    function shareQQzone(){
        var p = {
                url:url,
                showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                desc: description,/*默认分享理由(可选)*/
                summary:'',/*分享摘要(可选)*/
                title: title,/*分享标题(可选)*/
                site: '',/*分享来源 如：腾讯网(可选)*/
                pics:coverImg, /*分享图片的路径(可选)*/
                style:'203'
        };
        var s = [];
        for(var i in p){
            s.push(i + '=' + encodeURIComponent(p[i]||''));
        }
        window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&'));
    }

    //网页版微博分享
    function shareSina(){
        location.href="http://v.t.sina.com.cn/share/share.php?title=" +title + (title ? "：" : '') + url +"一起去旅游吧!";
    }

    $(function(){
        //点击底部的分享
        $("#shareBtn").click(function(){
            //判断是否是微信
            if(isWeiXin()){
                $("#WxShareTips").show();
                $("body").css({"overflow":"hidden"});
                $(".returnTop").hide();
            }else{
                alert('在微信中访问本页面才能抽奖哦！');
                // $("#share_body").show();
                // $("body").css({"overflow":"hidden"});
                // $(".returnTop").hide();
            }
        });
        
        //点击微信提示，微信提示消失
        $(".shareTipsBg").click(function(){
            $("#WxShareTips").hide();
            $("body").css({"overflow":"auto"});
            $(".returnTop").show();
        });
        
        //关闭分享界面
        $(".share_close_but").click(function(){
            $("#share_body").hide();
            $("body").css({"overflow":"auto"});
            $(".returnTop").show();
        });
    });

    window.isWeiXin = isWeiXin;
    window.shareRenren = shareRenren;
    window.shareQQzone = shareQQzone;
    window.shareSina = shareSina;
})();