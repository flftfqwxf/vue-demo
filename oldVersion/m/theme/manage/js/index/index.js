/*替换图片质量*/
function replaceImg(obj){
	var windowWidth=$(obj).width();
	var height=Math.floor(windowWidth/5*3);
	obj.find(".newImg").each(function(){
		$(this).width(windowWidth);
		$(this).height(height);
		var src="";
		var dataOriginal = $(this).attr("data-original");
		if(dataOriginal.indexOf("gmmtour.com")>0){
			src=dataOriginal+"@"+windowWidth+"w_"+height+"h_1e_80q";
		}
		else{
			src=dataOriginal;
		}
		$(this).attr("src",src);
	});
}

//获取产品列表 
function getProduct(tourType){
	$(".hot_list").empty();
	$("#loading").show();
	$.ajax({
		url: '/index/list.json',
		type: 'GET',
		dataType: 'json',
		data: {'tourType': tourType},
	})
	.done(function(result) {
		var listProducts = [],noResult = 1;
		listProducts = listProducts.concat(result.topItems,result.recItems,result.fillItems);
		if(result.topItems == null && result.fillItems == null && result.recItems == null){
			noResult = 0;
		}
		$(".hot_list").append(template("proList",{'list':listProducts,"noResult":noResult}));
	})
	.fail(function() {
		var html="<div class='text_center colorContent font14 reload' style='margin:60px 0px;'>加载失败，点击重新加载</div>"
			$(".hot_list").append(html);
			$(".reload").click(function(){
				getProduct(tourType)
			});
	})
	.always(function() {
		$("#loading").hide();
	});
	
}
/*处理轮播产品*/
 (function(){
	    var height=$(window).height();
		window.swipObjdelay=0;
		var $swip = $('#mySwipe'),$bullets = $("li", "#mySwipePage"), width =Math.floor($swip.width());
		$("img",$swip).each(function(){
			$(this).height(height);
			$(this).width(width);
			if($(this).attr("data-org")){
				this.src = $(this).attr("data-org")+"@"+width+"w_"+height+"h";
			}
		}).length > 0 ? $swip.show(): "";
		if($swip.length){
			var timeout;
			$("#mySwipePage li:eq(0)").addClass("active");
			var swipObj=$swip.Swipe({
				auto : 3000,
				continuous : true,
				speed:600,
				callback : function(pos) {
					if($('#mySwipePage .num').length == 2){
						pos = pos % 2;
					}
					$bullets.removeClass("active");
					$bullets.eq(pos).addClass("active");
					swipObjdelay=0;
				},touchEndCallBack:function(){
					swipObjdelay=3000;
				}

			}).data('Swipe');
		}
	})();

/*页面加载成功后弹出活动链接*/
$(window).load(function(){
	 $(".banner_dialog").slideDown(1500);
	 $(".J_closebanner").click(function(){
		 $(".banner_dialog").fadeOut(400);
	 });
 });
 (function(){
	 var h=window.innerHeight;
	 $(".index_body").height(h);
	 $(".swipe_item").height(h);
	 $(".swipe-wrap").height(h);
	 $(".swipe_item").click(function(){
		 if($(this).attr("id")){
		 	location.href="item/"+$(this).attr("id");
		 }
	 });
	 getProduct('group');
	 //替换图片
	 replaceImg($(".hot_list ul"));
	 /*点击图标，整个往下滑动*/
	 $("#downMove").click(function(){
		 var body = $("html, body");
		 body.stop().animate({scrollTop:h}, '500', 'swing');
	 });

	 //切换筛选产品类型
	 $(".tab_item .tab_but").click(function(event) {
	 	var tourType=$(this).attr("pro-type");
		$(".tab_item .tab_but").removeClass('on');
		$(this).addClass('on');
		getProduct(tourType);
	 });
 })();