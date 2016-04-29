var titleName=$("#titleName").val();
var imageUrl=$("#imgUrl").val();
var summaryContent=$("#summaryContent").val();
var shareUrl=$("#shareUrl").val();
var jiathis_config = {
    url:shareUrl,
    title:titleName,//分享的标题
	pic:imageUrl,//分享的图片
	summary:summaryContent //分享的描述
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
	/*定义返回头部位置*/
	var	left=($(window).width()-1000)/2;
	var return_top=$(".return_top"),isShow=false;
	$(window).scroll(function(){
		var top=$(window).scrollTop();
		if(top>80 && !isShow){
			$(".gmmtour").addClass("fixed_right");
			return_top.css({display:"block"});
			isShow=true;
		}
		else if(top<80 && isShow){
			$(".gmmtour").removeClass("fixed_right");
			return_top.css({display:"none"});
			isShow=false;
		}
	});
	return_top.css({"right":left+"px"});
	$(window).resize(function(){
		left=($(window).width()-1000)/2;
		return_top.css({"right":left+"px"});
	});
	return_top.click(function(){
		$(window).scrollTop(0);
	});
	
	 $(".information_content").each(function(){
	     replaceImg($(this));
	 });
});