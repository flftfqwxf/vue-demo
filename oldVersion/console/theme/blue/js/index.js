$(window).load(function(){
	// 页面最小高度设置
	var indexMainTopPadding = parseInt($('.index_main').css('padding-top'));
	var indexMainBottomPadding = parseInt($('.index_main').css('padding-bottom'));
	$('.index_main').css('min-height', $('#rightBody').innerHeight()-indexMainTopPadding-indexMainBottomPadding-$('.ct_title_fff').innerHeight());
});