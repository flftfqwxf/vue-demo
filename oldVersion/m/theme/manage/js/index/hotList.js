// 初始化列表，使用默认排序
var params = {size:1, page:1},
page =1;
var items_id=1,group_id=1;//标明
var curPageCount; // 总页数
var loading = true;
var $loading=$("#loading");

/*加载数据*/
function loadData(query){
	if (curPageCount != undefined && params["page"] >= curPageCount && !loading) {
		return;
	}
	loading = false;
	$loading.show();
	if(query === true){
		params["page"] = 1;
	}else {
		params["page"] += 1;
	}
	$.getJSON("/item/hotDetails.json", params, function (data) {
		curPageCount = data.pagination.pageCount;
    	var da=data.centreList;
    	setTimeout(function(){
	    	$loading.hide();
 		},400);
	    $.each(da, function (i,list) {
	    	group_id++;
	    	$(".hot_list").append("<div class='hot_group' id='group_"+group_id+"'>"+template("hot_title", this)+"</div>")
	    	var tag=$("#group_"+group_id+" .group_list");
	    	$.each(list.children, function (i,item) {
	    		this.product.recentDates=this.product.recentDates.replace(/\//g,"、");
	    		if(item.recommendType === "shop-hotproduct_l"){
	    			items_id++;
	    			tag.append("<div class='hot_items' id='random"+items_id+"'>");
	    			$("#random"+items_id).append(template("hot_left",this));
	    		}
	    		if(item.recommendType === "shop-hotproduct_r"){
	    			$("#random"+items_id).append(template("hot_right",this));
	    				tag.append("</div>");
				}
	        	if(item.recommendType === "shop-hotproduct_d"){
	        		tag.append(template("hot_item", this));
	        	}
	        });
	    	/*替换图片质量*/
	    	var s_w=Math.floor($(".hot_list").width()/2)-10,s_h=Math.floor(s_w/5*3);
	    	var b_w=Math.floor($(".hot_list").width()),b_h=Math.floor(b_w/5*2);
	    	replaceImg($(".hot_left"),s_w,120);
	    	replaceImg($(".hot_item"),b_w,170);
	    	replaceImg($(".hot_title"),b_w,150);
	    }); 
     }).fail(function () {
    	 loading = true;
    	 params["page"] = params["page"] == 1 ? 1 : params["page"]-1;
    	 return;
     });
 }

/*替换图片*/
function replaceImg(obj,width,height){
		var src="";
	    obj.find(".newImg").each(function(){
			$(this).height(height);
			var dataOriginal = $(this).attr("data-original");
			if(dataOriginal.indexOf("gmmtour.com")>0){
				src=dataOriginal+"@"+width+"w_"+height+"h_1e_60q";
			}
			else{
				src=dataOriginal;
			}
			$(this).attr("src",src);
	    });
	}

/*滚动加载*/
var scrollTimer;
function onScroll(){
	scrollTimer && clearTimeout(scrollTimer);
	scrollTimer = setTimeout(function () {
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		var footerTop=$("footer").offset().top;
		var t=footerTop-windowHeight + 60;
		if (scrollTop >= t) {
			loadData();
		}
    }, 600);
}

(function(){
	loadData(true);
	$(window).on("scroll", onScroll);
	var height=180;
	window.swipObjdelay=0;
	var $swip = $('#mySwipe'),$bullets = $("li", "#mySwipePage"), width =Math.floor($swip.width());
	$("img",$swip).each(function(){
		if($(this).attr("data-org")){
			this.src = $(this).attr("data-org")+"@"+width+"w_"+height+"h";
		}
	}).length > 0 ? $swip.show(): "";
	if($swip.length){
		var timeout;
		$("#mySwipePage li:eq(0)").addClass("on");
		var swipObj=$swip.Swipe({
			auto : 3000,
			continuous : true,
			speed:600,
			callback : function(pos) {
				$bullets.removeClass("on");
				$bullets.eq(pos).addClass("on");
				swipObjdelay=0;
			},touchEndCallBack:function(){
				swipObjdelay=5000;
			}
		
		}).data('Swipe');
	} 
})();
 
