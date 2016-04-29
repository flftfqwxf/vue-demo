$(function(){
	$(".menu_li").removeClass("on");
	$(".menu_li:eq(2)").addClass("on");
	/*定义返回头部位置*/
	var left=0;
	left=($(window).width()-1200)/2-45;
	$(".return_top").css({"right":left+"px"});
	$(window).resize(function(){
		left=($(window).width()-1200)/2-45;
		$(".return_top").css({"right":left+"px"});
	});
})