$(function(){
	$(".return_block").click(function(){
		history.back();
	});
	$(".return_home").click(function(){
		window.location = "/";
	});
	$(".search_but").click(function(){
		
	});
	$(".returnTop").click(function(){
		$("body").animate({scrollTop:0}, 300);
	});
});