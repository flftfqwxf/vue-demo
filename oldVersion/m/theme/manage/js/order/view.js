	$.fn.countDown=function(options){
	    return this.each(function() { 
	        var leaveTime=options.leaveTime/1000,
	            _this=$(this),
	            format=options.format?options.format:"hh:mm:ss",
	            h,
	            m,
	            s;

	        var timer=setInterval(function(){
	            leaveTime=leaveTime-1;
	            h=parseInt(leaveTime/3600),
	            m=parseInt((leaveTime-h*3600)/60),
	            s=parseInt((leaveTime-h*3600)%60);
	            h=(h>9?h:""+h);
	            m=(m>9?m:""+m);
	            s=(s>9?s:""+s);
	            _this.text((options.text || "")+""+format.replace("hh",h).replace("mm",m).replace("ss",s));
	            if(leaveTime<=0){
	        	(typeof options.onEnd=="function")&&options.onEnd(_this);
	        	clearInterval(timer);
	            }
	        },1000);
	    });
	};
    (function(){
        var timeMillis=$("#timeLeft_s").attr("timeMillis");
        var timeLeft_m=$("#timeLeft_m");
		timeLeft_m.countDown({
	        leaveTime: timeMillis,
	        text: timeLeft_m.attr("title"),
	        format:"hh时mm分ss秒",
	        onEnd:function(){
	        	timeLeft_m.text("已取消").css("color","#999");
	        }
	    });	
	    //取消弹窗
	    $('.J-artDialog').click(function() {
			//弹层
			$(".artDialog").show();
	    });
	    $('.J-no').click(function() {
			//取消订单选择否
			$(".artDialog").hide();
	    });
	    //隐藏页脚
	    if($.trim($("#order-btn").html())===''){
    	   $("#order-btn").parent().hide().prev(".order-info").find("div").css("border","none");
        } 
        //隐藏回到顶部按钮 
        $(".returnTop .gm-top").hide()     
    }());
