$(function(){
	$(".menu_li").removeClass("on");
	$(".menu_li:eq(6)").addClass("on");
	/*定义返回头部位置*/
	var left=0;
	var page_content_viewport = $("#page-content-viewport"),
	return_top=$(".return_top");
	left=(page_content_viewport.width()-1000)/2;
	isShow=false;
	page_content_viewport.scroll(function(){
		var top=page_content_viewport.scrollTop();
		if(top>80 && !isShow){
			$(".gmmtour").addClass("fixed_right");
			$(".gmmtour").css({top:"60px"});
			return_top.css({display:"block"});
			isShow=true;
			if(page_content_viewport.width()<=1300){
				$(".gmmtour").removeClass("fixed_right");
			}
		}
		else if(top<80 && isShow){
			$(".gmmtour").removeClass("fixed_right");
			return_top.css({display:"none"});
			isShow=false;
		}
	});
	return_top.css({"right":left+"px"});
	$(window).resize(function(){
		left=(page_content_viewport.width()-1000)/2;
		$(".return_top").css({"right":left+"px"});
	});
	return_top.click(function(){
		page_content_viewport.scrollTop(0);
	})
})
