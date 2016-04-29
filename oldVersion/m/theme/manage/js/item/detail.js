//替换图片质量
function replaceImg(obj,imgClass){
	var windowWidth=$(window).width();
	obj.find(imgClass).each(function(){
		var eWidth=Math.floor(windowWidth/10 *9.4);
		var src="";
		var dataOriginal = $(this).attr("data-original");
		if(dataOriginal.indexOf("gmmtour.com")>0){
			src=dataOriginal+"@"+eWidth+"w_60q";
		}
		else{
			src=dataOriginal;
		}
		$(this).attr("src",src);
	});
}

//为特殊产品设置旅游攻略链接
function setbannerUrl(){
	var loct='http://'+location.hostname+"/news/579",this_pro=$("#pro_id").val(),price=$(".installment").attr("item-price");
	var products={};
	var html='';
	if(products[this_pro]){
		html='<a href="'+loct+'">'
	        +'<div class="installment_info">'
	        +'<span class="gmIcon gm-installment"></span>'
	        +'<span class="installment_price font10">￥</span><span class="font14">'+price+'</span><span class="font10">起+</span>'
	        +'<span class="font14">'+price+'*11</span><span class="font10">期免息</span>'
	        +'<span class="inst_btn">查看规则</span>'
	        +'</div>'
	        +'<div class="installment_tags">'
	        +'<span class="inst_tag">首付即可出发</span>'
	        +'<span class="inst_tag">0手续费</span>'
	        +'<span class="inst_tag">轻松办理</span>'
	        +'</div>'
	        +'</a>';
		$(".installment").show().append(html);
	}
}

(function(){
	//替换轮播图片质量
	var width = $("#mySwipe").width();
	window.swipObjdelay=0;
	var $swip = $('#mySwipe'),$bullets = $("li", "#mySwipePage");
	$("img",$swip).each(function(){
		var dataOrg=$(this).attr("data-org");
		if(dataOrg.indexOf("gmmtour.com")>0){
			this.src = $(this).attr("data-org")+"@"+width+"w_"+"190h_1e_60q";
		}
		else{
			this.src=dataOrg;
		}
	}).length > 0 ? $swip.show(): "";
	
	//轮播图片
    $("#mySwipePage li:eq(0)").addClass("on");
	var swipLen=$swip.find('.swipe-wrap li').length;
	if(swipLen){
		var swipObj=$swip.Swipe({
			auto : 3000,
			continuous : true,
			speed:600,
			callback : function(pos) {
				if(pos>=swipLen){
					pos=pos-swipLen;
				}
				$bullets.removeClass("on");
				$bullets.eq(pos).addClass("on");
				swipObjdelay=0;
			},touchEndCallBack:function(){
				swipObjdelay=5000;
			},transitionEnd:function(index){
			}
		
		}).data('Swipe');
	} 
	$(".swipe .page").css({"margin-left":"-"+$(".page").width()/2+"px"});
	
	setbannerUrl();
})();


//处理图片的显示
//obj
function showSightImg(obj,imgName,sightImages,customImg,customerImgs){
	var html;
	var imgsCount=3-customImg;
	
	//处理用户图片
	if(customImg != 0 && customerImgs != null){
		for(var i = 0;i < customImg; i++){
			if(customerImgs[i] != undefined){
				html='<div class="img_info"><img data-original="'+customerImgs[i]+'" class="img_src" />'+'<div class="img_name">'+imgName+'</div></div>';
				obj.append(html);
			}
		}
		replaceImg(obj,".img_src");
	}

	obj.find(".newImg").remove();
	if(imgsCount > 0){
		if(!sightImages || (sightImages && sightImages.length===0)){
			return;
		}
		var tag=getSiteImgs(imgsCount,sightImages);
		for(var i=0;i<tag.length;i++){
			for(var j=0;j<tag[i].sightImages.length;j++){
				html='<div class="img_info"><img data-original="'+tag[i].sightImages[j]+'" class="img_src" />'+'<div class="img_name">'+tag[i].sightName+'</div></div>';
				obj.append(html);
			}
		}
		replaceImg(obj,".img_src");
	}
}

function getSiteImgs(imgsCount,sightImages){
	if(imgsCount<=0 || sightImages.length===0){
		return false;
	}
	/**
	 * imgs保存需要显示的图片集合
	 * siteLen：景点个数
	 */
	var imgs=[],siteLen=sightImages.length;
	/**
	 * sightImages:所有景点
	 * startIndex：图片开始的索引
	 */
	function _eachImgs(sightImages,startIndex){
		/**
		 * tempImgs:临时保存所取图片的对象集合
		 */
		var tempImgs=[];
		startIndex=startIndex || 0;
		
		//每次从每个景点数组中取一个图片
		$.each(sightImages,function(index){
			/**
			 * imgsList:针对每个景点
			 * sightName：景点名称
			 * sightObj：拿到的景点对象
			 */
			var imgsList=sightImages[index],sightName=sightImages[index].sightName;
			var sightObj={};
			sightObj.sightName=sightName;
			sightObj.sightImages=[];
			$.each(imgsList.sightImgs,function(u){
				if(u === startIndex){
					sightObj.sightImages.push(imgsList.sightImgs[u]);
					
				}else if(u > startIndex){
						return ;
				}
			});
			tempImgs.push(sightObj);
		});
		
		imgs=imgs.concat(tempImgs);
		startIndex++;
		if(startIndex>3){
			return;
		}
		var curImgsLen=imgs.length;
		if(curImgsLen> imgsCount){//如果取到的图片张数大于需要展示的数量，则把长度置为需要的张数
			imgs.length=imgsCount;
		}else if(curImgsLen < imgsCount){//否则循环再取图片
			if(tempImgs.length==0){
				for(var p=0;p<imgsCount-curImgsLen;p++){
					imgs.push(imgs[p]);
				}
			}else{
				_eachImgs(sightImages,startIndex);
			}			
		}
		return imgs;
	}
	
	imgs=_eachImgs(sightImages,0);
	return imgs;
}
//将行程中客户录入的图片提取到文字下方
function customerImg(image,imgName){
	var html;
	
	html='<div class="img_info"><img src="'+images[i]+'" class="img_src" />'+'<div class="img_name">'+imgName+'</div></div>';
}

//处理图片
function setImg($obj){
	var $obj,sightImages=[],images=[],customImg= $obj.find(".newImg").length,sightName;
	var customerImgs=[];//用户图片
	//处理用户图片
	$obj.find(".newImg").each(function(index){
		var src=$(this).attr("data-original");
		if(index<3){
			customerImgs.push(src);
		}
	});
	showSightImg($obj,"沿途风光",null,customImg,customerImgs);
	
	//处理景点图片
	$obj.find(".hightlight").each(function(index){
		if(index<3){
			var imgs=$(this).attr("images");
			sightName=$(this).text();
			images ={};
			images['sightName']=sightName;
			images['sightImgs']=imgs.split(",");
			//排除景点图片为0的景点
			if(images['sightImgs'] != ""){
				sightImages.push(images);
			}
		}
	});
	showSightImg($obj,null,sightImages,customImg,null);
}

(function(){
	//去掉空白P标签
	$("p").each(function(){
		if((!$.trim($(this).text()))&&$(this).find("img").size()==0) $(this).remove();
	});
	
	//点击第几天
	$(".day_num .J_day:eq(0)").addClass("on");
	$(".day_num .J_day").each(function(index){
		$(this).click(function(){
			$(".day_num").find(".J_day").removeClass("on");
			$(this).addClass("on");
			var t=$(".day_info_body:eq("+index+")").offset().top;
			$(window).scrollTop(t);
		});
	});
	
	/*行程的详情和概览*/
	var first=true;
	var h=$(window).height()-160;
	$(".day_num").css({"max-height":h+"px"});
	$(".all_day_num").css({"max-height":(h-65)+"px"});
	$(".day_num .J_day").show();
	$(".hideInfo").show();
	//处理日程中图片
	$(".schedule_info").each(function(){
		setImg($(this));
	});
	//行程概览
	$("#J_hideView").click(function(){
		$("#J_hideView").hide();
		$("#J_showView").show();
		$(".day_num .J_day").hide();
		$(".hideInfo").hide();
	});
	
	//查看行程详情
	$("#J_showView").click(function(){
		$("#J_hideView").show();
		$("#J_showView").hide();
		$(".day_num .J_day").show();
		$(".hideInfo").show();
	});
	
	//使用hash
	var position = window.location.hash;
	if(null != position && "" != position){
		$(".other_title_li").each(function(){
			if(position == "#"+$(this).attr("attr_id")){
				$(this).click();
			}
		})
	}
	var all_timer;
	//处理图片
	$(".all_spot").each(function(){
		replaceImg($(this),".newImg");
		clearTimeout(all_timer);
		all_timer=setTimeout(function(){
			if($(this).height() > 60){
				$(".product_spot_show").show();
			} else {
				$(this).parent().css({height : "auto"});
				$(".product_spot_show").hide();
			}
		},300);
	});
	
	//替换酒店图片质量
	$(".hotelImg").each(function(){
		var src = ""
		var dataOriginal = $(this).attr("data-original");
		if(dataOriginal.indexOf("gmmtour.com")>0){
			src = dataOriginal+"@120h_60q";
		}else{
			src = dataOriginal;
		}
		$(this).attr("src", src);
	});
	var show = true;
	
	//展开行程亮点
	$(".showButton").click(function(){
		var allHeight = $(".product_spot_ct .product_light_show").find(".all_spot").height();
		var st = $(".product_spot_ct .product_light_show").attr("attr_st");
		if(1 == st){
			$(".product_spot_ct .product_light_show").animate({overflow:"visible", height:(allHeight>60?allHeight:60)}, 300);
			$(this).addClass("all");
			$(this).html("收起&nbsp;&nbsp;<i class='gmIcon gm-shouqi01'></i>");
			$(".product_spot_ct .product_light_show").attr("attr_st", 2);
		}else{
			$(".product_spot_ct .product_light_show").animate({overflow:"hidden",height:60}, 300);
			$(this).removeClass("all");
			$(this).html("展开&nbsp;&nbsp;<i class='gmIcon gm-down'></i>");
			$(".product_spot_ct .product_light_show").attr("attr_st", 1);
		}
	});
	
	
	//点击行程，注意事项，价格包含
	$(".other_title_li").click(function(){
		if(show){
			show = false;
			var scroll_offset = $(this).offset();
			$("body,html").animate({scrollTop:(scroll_offset.top*1-80)},50);
			$(this).parent().find(".on").each(function(){
				$(this).removeClass("on");
				var to = $(this).attr("attr_id");
				$("#"+to).hide();
			});
			$(this).addClass("on");
			var toId = $(this).attr("attr_id");
			var width = $("#"+toId).width();
			$("#"+toId).css({width:width,left:width}).show();
			var showname="#"+$(this).attr("name");
			replaceImg($(showname),".newImg");
			window.location.hash = "#"+toId;
			show = true;
		}
	});

	//点击行程附件
	$(".fileup").click(function(){
		$(window).scrollTop(0);
		$("#banner,#otherInfo,#showInfoSection,.tips,.bottom_share").hide();
		$(".return_back").unbind("click").click(function(){
			$(".return_back").unbind("click").click(function(){
				history.back();
			});
			$("#banner,#otherInfo,#showInfoSection,.tips,.bottom_share").show();
			$(".other_title").removeClass("fixed");
			$(".day_num").removeClass("fixed");
			$("#files").hide();
		});
		$("#files").css({height:getBodyHeight()}).show();
	});
	
	//点击底部的分享
	$(".share_buts_a").click(function(){
		//判断是否是微信
		if(isWeiXin()){
			$("#WxShareTips").show();
            $("body").css({"overflow":"hidden"});
            $(".returnTop").hide();
		}else{
			$("#share_body").show();
			$("body").css({"overflow":"hidden"});
			$(".returnTop").hide();
		}
	});
	
	//点击微信提示，微信提示消失
	$(".shareTipsBg").click(function(){
		$("#WxShareTips").hide();
        $("body").css({"overflow":"auto"});
        $(".returnTop").show();
	});
	
	//关闭分享界面
	$(".share_close_but").click(function(){
		$("#share_body").hide();
        $("body").css({"overflow":"auto"});
        $(".returnTop").show();
	});
})();
