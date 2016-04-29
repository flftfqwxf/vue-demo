var gift={
          '1':{'title':"京东到家优惠卷",
               'desc':"新用户全场立减8元,以及满60立减20元",
               'logo':"gift_2.jpg",'price':28,'rules':0},
	      '2':{'title':"瑟兮美丽韩式半永久定制抵用券",
	            'desc':"购买全场任意产品均可抵扣300元现金。",
	            'logo':"gift_1.jpg",'price':300,'rules':1}
          };
//指定产品发放礼品
var proGift={};

//设置产品的相应礼包            
function setGift(){
  $(".module .module_item").each(function(index, el) {
    var proId= $(this).attr("pro-id");
    var html="",price=0;
    if(proGift[proId] != null){
      for (var i = 0; i < proGift[proId].length; i++) {
        var giftId=proGift[proId][i];
        price+=gift[giftId].price;
      }
      $(this).find(".gift_info").html('<small class="gift_icon"></small>'+price+'元大礼包<span class="gift_view J_info">[详情]</span>');    
      $(this).find(".J_gift").click(function(){
      var giftData={'allPrice':0,'gifts':[]};
        for (var i = 0; i < proGift[proId].length; i++) {
          var giftId=proGift[proId][i];
          giftData.gifts.push(gift[giftId]);
        }
        giftData.allPrice=price;
        $(".gift_detail").remove();
        $(".mask").removeClass("hidden").show();
        window.scrollY=$(window).scrollTop();
        $("body,html").css({"overflow":"hidden","height":"100%"}); 
        $("body").append(template("gift_detail", giftData));
        var h=$(window).height()-110;
        $(".gift_detail").css({"max-height":(h+70)+"px","overflow":"hidden"});
        $(".gift_detail .gift").css({"max-height":h+"px","overflow-y":"auto"});
      });
    }
  });

}
//判断是否是微信端
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
$(".gift_detail").on('touchmove',function(e){
	e.stopPropagation();
})
var Fclick=true;//防止重复点击领取奖品
//领取奖品
function getGift(){
    var regex= /^0?(13[0-9]|15[0-9]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
    var phone=$(".input_phone").val(),
    $obj=$("#share_success"),
    actID=$("#actID").val(),
    giftID=parseInt($("#giftID").val()),
    giftData={'userPhone': phone};
    if(giftID!= "" || giftID!="null"){
    	giftData={'userPhone': phone,'giftId':giftID}
    }
    if(!regex.test(phone)){
      $obj.find(".erro").text("请输入正确的手机号！");
      $(".J_getGift").text("立即领取");
    }else{
     $(".J_getGift").text("领取中...");
     $obj.find(".erro").text("");
     $.ajax({
           url: '/activity/'+actID+'/gift',
           type: 'POST',
           dataType: 'json',
           data:giftData ,
         })
         .done(function(result) {
        	if(result.errMsg){
                $obj.find(".erro").text(result.errMsg);
        	}else{
	            $("#share_success").addClass('hidden').hide();
	            $("#get_success").removeClass('hidden').show(300);
        	}
            $(".J_getGift").text("立即领取");
            Fclick=true;
         })
         .fail(function() {
             $(".J_getGift").text("领取失败，请重试");
         });
    }
}
//关闭领取礼包
function colseShare(){
	 $('.share_div').removeClass("hidden").hide();
	 $("#get_success").removeClass("hidden").hide();
	 $("#share_success").show();
	 $(".mask").removeClass("hidden").hide();
}
(function(){
    //为产品设置礼包
    setGift();
    //关闭礼包详情
    $('body').on("click",".gift_detail .J_close",function(){
       $(".gift_detail").remove();
       $(".mask").removeClass("hidden").hide();
         $("body,html").css({"overflow-y":"auto","height":"auto"});
         $(window).scrollTop(window.scrollY);
         
     });
    
   
   //点击见面礼的礼包详情
   $(".J_meet").click(function(){
      var giftData={'allPrice':gift['1'].price + gift['2'].price,'gifts':[gift['1'],gift['2']]};
      $(".gift_detail").remove();
      $(".mask").removeClass("hidden").show();
       window.scrollY=$(window).scrollTop();
      $("body,html").css({"overflow":"hidden","height":"100%"});
      $("body").append(template("gift_detail", giftData));
      var h=$(window).height()-110;
      $(".gift_detail .gift").css({"max-height":h+"px"});
   });

   $("body").on("input",".input_phone",function(){
	   Fclick=true;
   });
   //点击领取见面礼
   $("header").on("click",".J_giftBtn",function(){
      if(isWeiXin()){
          checkSuccess=true;
          $(".share_tips").removeClass("hidden").show();
          $(".returnTop").hide();
          wx.ready(function () {
              weixinShareSDK.webWeiXinShare(title,imgUrl,content,checkSuccess);
          });
      }else{
          alert('在微信中访问本页面才能抽奖哦！');
      }
   });

   //输入电话号码领取奖品
   $("#weiXinSuccess").on("click",".J_getGift",function(){
	    if(Fclick){
	      Fclick=false;
		   getGift();
        }else{
        	return;
    	}
   });

  $("#weiXinSuccess").on('click', '.J_goPro', function(event) {
    $("#weiXinSuccess,#get_success").addClass("hidden").hide();
    $("#share_success").removeClass("hidden").show();
    $(".mask").removeClass('hidden').hide();
  });
  //点击微信提示，微信提示消失       
   $(".share_tips").click(function() {
     $(this).hide();
   });

 })();