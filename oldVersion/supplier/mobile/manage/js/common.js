(function(){
	var url = window.location.href;
	//url = url.replace(/([^?]+[^/]).*/,"$1");
	//不能使用AJAX..跨域AJAX不会带上cookie
//	alert(encodeURIComponent(url));
	var request = "http://www.gmmtour.com/statistics?url=" + encodeURIComponent(url);
	var img = new Image();
	img.src = request;
})();

$(function(){
	$(".return_block,.return_back").click(function(){
		history.back();
	});
	$(".returnTop").click(function(){
		$("html,body").animate({scrollTop:0}, 500);
		$(".returnTop").hide();
	});
	if( $(window).scrollTop() < 5){
			$(".returnTop").hide();
	 }
	$(window).on("scroll", function(){
		if($(document).height()<=$(window).height()){return;}
		if($(document).height() - $(window).height() == $(window).scrollTop() ){
			if($(document).height()<=$(window).height()){return;}
			$(".returnTop").show();
		}
	});
	$(".moreContacts").click(function(){
		$(".more_contacts").show();
	});
	$(".close_contacts").click(function(){
		$(".more_contacts").hide();
	});
	bindEvent() ;
	var getTimer=null;
	$(window).scroll(function(){
		clearTimeout(getTimer);
		getTimer= setTimeout(function(){
			  getTop();
		},100);
	});
});


/*禁止输入特殊字符*/
function ValidateValue(textbox)  
{  
     var IllegalString = "\`~@#;,.!#$%^&*()+{}|\\:\"<>?=/,\'";  
     var textboxvalue = textbox.value;  
     var index = textboxvalue.length - 1;  
       
     var s = textbox.value.charAt(index);  
       
     if(IllegalString.indexOf(s)>=0)  
     {  
        s = textboxvalue.substring(0,index);  
        textbox.value = s;  
     }  
} 
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

function getTop(){
	var $otherTitle=$(".other_title"),$showInfoSection=$("#showInfoSection");
	if($otherTitle.length != 0 && $showInfoSection.length != 0){
		var top=$(window).scrollTop();
		var otherTitle=$otherTitle.height();
		var infoHeight=$showInfoSection.height() + otherTitle;
		var infoTop=$showInfoSection.offset().top - otherTitle;
		//滚动到相应的位置高亮对应的天
		$(".day_info_body").each(function(i){
			var t=$(this).offset().top-100;
			var h=$(this).height() + 40;
			if(top <= t+h && top >= t){
				$(".day_num .J_day").removeClass("on");
				$(".day_num .J_day:eq("+i+")").addClass("on");
			}
		});
		if(top <= infoTop+infoHeight && top > infoTop && $(".J_day").length > 0){
			if($(".day_num").hasClass("fixed") && $otherTitle.hasClass("fixed")){
				return;
			}else{
				$(".day_num").addClass("fixed");
				$otherTitle.addClass("fixed");
			}
		}else{
			$(".day_num").removeClass("fixed");
			$otherTitle.removeClass("fixed");
		}
	}else{
		return;
	}
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
         getTop();
    	if($(document).height()<=$(window).height()){return;}
        if($(document).height()<=$(window).height()){return;}
        $(".returnTop").show();
      	if($(window).scrollTop() < 5){
			$(".returnTop").hide();
      	}
      }  
      //向下滑动
      if (y - startY < 0) {  
    	  getTop();
    	  $(".returnTop").hide();
    	  if($(document).height()<=$(window).height()){return;  }
    	  if( $(document).height() - $(window).height() == $(window).scrollTop() ){
  				$(".returnTop").show();
  		  }
      }  
  }  
  catch (e) {  
      //alert('touchMoveFunc：' + e.message);  
  }  
} 


//绑定事件  
function bindEvent() {  
  document.addEventListener('touchstart', touchSatrtFunc, false);  
  document.addEventListener('touchmove', touchMoveFunc, false);  
}  

function getBodyHeight(){
	if(document.compatMode == "BackCompat"){
		var Node = document.body;
	}else{
		var Node = document.documentElement;
	}
	var h = Math.max(Node.scrollHeight,Node.clientHeight);
	if(h > window.screen.height){
		h = window.screen.height;
	}
	if(h > window.screen.availHeight){
		h = window.screen.availHeight;
	}
	return h;
}
function getBodyWidth(){
	if(document.compatMode == "BackCompat"){
		var Node = document.body;
	}else{
		var Node = document.documentElement;
	}
	var w = Math.max(Node.scrollHeight,Node.clientWidth);
	if(w > window.screen.width){
		w = window.screen.width;
	}
	if(w > window.screen.availWidth){
		w = window.screen.availWidth;
	}
	return w;
}