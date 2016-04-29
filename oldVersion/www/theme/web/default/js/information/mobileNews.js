		var titleName=$("#titleName").val();
	    var imageUrl=$("#imgUrl").val();
	    var summaryContent=$("#summaryContent").val();
	    var shareUrl=$("#shareUrl").val();
	    

        function imgWidth(){
            var _width = screen.width-25,
                text = '\@'+_width+'w\_140h\_1e\_1c';
            var bg=$(".related-product .pic .m-img").attr("src")+'';
            if(bg.indexOf("gmmtour.com")>0){
                bg=bg.replace("@140h_1e_1c",text);
            }
            $(".related-product .pic .m-img").attr("src",bg).show();
        }
        imgWidth();
        /*判断返回顶部事件*/
        //全局变量，触摸开始位置
        var startX = 0, startY = 0;

        //touchstart事件
        function touchSatrtFunc(evt) {
            var touch = evt.touches[0]; //获取第一个触点
            var x = Number(touch.pageX); //页面触点X坐标
            var y = Number(touch.pageY); //页面触点Y坐标
            //记录触点初始位置
            startX = x;
            startY = y;
        }

        //touchmove事件，这个事件无法获取坐标
        function touchMoveFunc(evt) {
            try
            {
                //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                var touch = evt.touches[0]; //获取第一个触点
                var x = Number(touch.pageX); //页面触点X坐标
                var y = Number(touch.pageY); //页面触点Y坐标

                //判断滑动方向
                //向上滑动
                if (y - startY > 0) {
                    if($(document).height()<=$(window).height()){return;}
                    $(".return_top").show();
                    if($(window).scrollTop()<5){
                        $(".return_top").hide();
                    }
                }
                //向下滑动
                if (y - startY < 0) {
                    $(".return_top").hide();
                    if($(document).height()<=$(window).height()){return;}
                    if( $(document).height() - $(window).height() == $(window).scrollTop() ){
                        $(".return_top").show();
                    }
                }
            }
            catch (e) {
                alert('touchMoveFunc：' + e.message);
            }
        }

        function bindTouch(){
            document.addEventListener('touchstart', touchSatrtFunc, false);
            document.addEventListener('touchmove', touchMoveFunc, false);
        }

        function isWeiXin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        }
        /*分享*/
        function shareRenren() {
            var rrShareParam = {
                resourceUrl :shareUrl,  //分享的资源Url
                srcUrl :shareUrl,   //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
                pic : imageUrl,     //分享的主题图片Url
                title : titleName,      //分享的标题
                description : summaryContent    //分享的详细描述
            };
            rrShareOnclick(rrShareParam);
        }
        function shareQQzone(){
            var p = {
                url:shareUrl,
                showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                summary:summaryContent,/*分享摘要(可选)*/
                title: titleName,/*分享标题(可选)*/
                site:shareUrl,/*分享来源 如：腾讯网(可选)*/
                pics:imageUrl, /*分享图片的路径(可选)*/
                style:'203'
            };
            var s = [];
            for(var i in p){
                s.push(i + '=' + encodeURIComponent(p[i]||''));
            }
            window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&'));
        }
        function shareSina(){
            window.open("http://v.t.sina.com.cn/share/share.php?title="+titleName);
        }

        function replaceImg(obj){
            obj.find(".newImg").each(function(){
            var src="";
            var dataOriginal = $(this).attr("data-original");
            if(dataOriginal.indexOf("gmmtour.com")>0){
                src=dataOriginal;
            }
            else{
                src=dataOriginal;
            }
            $(this).attr("src",src);
            });
        }

        $(function(){	
        	//处理资讯图片
	       	 $(".information_content").each(function(){
	    	     replaceImg($(this));
	    	 });
            $(window).on("scroll", function(){
                if($(document).height()<=$(window).height()){return;}
                if($(document).height() - $(window).height() == $(window).scrollTop() ){
                    $(".return_top").show();
                }
            });
            $(".return_top").click(function(){
                $("body").animate({scrollTop:0}, 500);
                $(".return_top").hide();
            });
            bindTouch();//绑定touch事件
            $("#WxShareTips").hide();
            $("#share_body").hide();
            $(".share_buts").click(function(){
                $(".return_top").hide();
                if(isWeiXin()){
                    $("#WxShareTips").show();
                }else{
                    $("#share_body").show();
                }
            });
            $(".closeShareTips").click(function(){
                $("#WxShareTips").hide();
                $(".return_top").show();
            });
            $(".share_close_but").click(function(){
                $("#share_body").hide();
                $(".return_top").show();
            });

        });