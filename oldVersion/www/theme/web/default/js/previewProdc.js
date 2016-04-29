//去掉空白P标签
$("p").each(function(){
	if((!$.trim($(this).text()))&&$(this).find("img").size()==0) $(this).remove();
});

/*//初始化是否显示默认景点  
$(".data-info-body").each(function(){
	var $this=$(this),
		imgs={};
		
	
	if($(".J_scenic",$this).size()>0){
		$this.addClass("default-pic");
		
		$(".J_scenic",$this).each(function(){
			imgs[$(this).attr("sight_id")]=$(this).attr("icon_src")+"@218h";
		});
		
		$this.data("imgs",imgs);
		var h=$(".data-info",$this).height()-($this.height()>250?83:0);
		$this.append("<div class=\"default-pic-container\" style=\"height:"+h+"px\"><ul></ul></div>");
	}
});*/

//行程概览日期线条补充
if($("#survey .day-line").size()>1){
	$("#survey .day-line").each(function(i){
		var h=(($(this).parents("td").height()-$(this).parent().height())/2);
		$(this).height(h+"px").css(((i==0)?"bottom":"top"),"-"+(h-1)+"px");
	});
}

//只有一个景点时bug处理
$(".scenic-list").each(function(){
	if($("li",$(this)).size()==1){
		$("li",$(this)).addClass("line-onlyone");
	}
});


$(function(){
	
	//行程概览查看详细hover
	$("#survey .col4>div>.scenic-list").mouseenter(function(){
	
		$(".view-detail").hide();
		
		var $this=$(this).parents(".col4"),
			child=$this.children("div"),
			detail=$this.find(".view-detail");
		if(detail.size()>0){
			detail.show();
		}
		else{
			if($this.hasClass("col4")&&$this.find("li").size()>3){
				var temp=$("<div class=\"view-detail\"><div>"+child.html()+"<div></div>");
				temp.mouseleave(function(){
					var $that=$(this);
					setTimeout(function(){
						$that.hide();
					},50);
					
				});
				$this.append(temp);
			}
			
		}
	});

	//时间轴高度处理
	$(".item-cont").find("dl").each(function(){
		var h = $(this).find("dd").height();
		$(this).find("dt").css({"height": h, lineHeight: h+"px"});
	});
	
	//用户编辑器中的图片处理
	$(".newImg").each(function(){
		var src = "";
		var dataOriginal = $(this).attr("data-original");
		if(dataOriginal.indexOf("gmmtour.com")>0){
			src = dataOriginal+"@600w_60q";
		}else{
			src = dataOriginal;
		}
		$(this).removeAttr("width");
		$(this).attr("src",src);
	});
	
	//行程描述中的图片提到文字下方
	$(".dailyTrip-desc").each(function(){
		var $this=$(this);
		
		if($this.parents(".time-duan").size()>0){
				
			var parent=$this.parents(".data-info"),
				last=parent.find(".dailyTrip-desc:last()");
			if(last.text()==$this.text()){
				showScenicPic($("img",parent),$(".J_scenic",parent),last.parents(".line-day"));
			}
		}
		else{
			showScenicPic($this.find("img"),$this.find(".J_scenic"),$this);
		}
		
	});
	
	//行程亮点中的图片提到文字下方
	/*if($("#product-bright-spot img").size()>0){
		var imgsStr="";
		$("#product-bright-spot img").each(function(){
			imgsStr+="<li><span class=\"pic-loading\"><span><i class=\"gm-icon gm-img\"></i><b>加载中...</b></span></span><img src=\""+$(this).attr("src")+"\" /><h3><span></span><span>沿途风光</span></h3></li>";
			$(this).remove();
		});
		
		$("#product-bright-spot").append("<li><div class=\"uploadList\"><ul class=\"clearfix\">"+imgsStr+"</ul></div></li>");
	}*/
	
	$(".distributor_item_tip .gm-wrong").click(function(){
		$(this).parent().fadeOut("slow");
	});
	
	//景点添加图标
	$(".J_scenic").append("<i class=\"gm-icon gm-address2\"></i>");
	
	/*//显示图片
	$(".data-info-body").each(function(){
		var data=$(this).data("imgs"),
			item=$(".default-pic-container ul",$(this));
		
		for(var key in data){
			item.append("<li><span class=\"pic-loading\"><span><i class=\"gm-icon gm-img\"></i><b>加载中...</b></span></span><img src=\""+data[key]+"\"/></li>");
		}
	});
	
	//去掉多余图片
	function delImg($this){
		var temp=$this.parents(".default-pic-container"),
			h=temp.height()+temp.offset().top;
		if($this.offset().top+238>h){
			$this.remove();
		}
		else $this.css("visibility","visible");
	}
	
	//循环处理图片溢出，做多处理20次，即10秒
	var max=20;
	var timer=setInterval (function(){
		max--;
		$(".default-pic-container img").each(function(){
			delImg($(this));
		});
		if(max<=0) clearInterval(timer);
	},500);*/
	
	//景点点击事件
	$(document).on('click','.J_scenic',function(){
		var sightDiv = $("#scenic-layer");
		var sightId = $(this).attr("sight_id");
		
		$.ajax({
			url:'/sight/'+sightId+'.json',
			type:'GET',
			dataType:'json',
			success:function(data){
				if(null != data && null != data.sight){
					var imgs = data.sight.sightImages;
					setShowInfo(sightDiv, data.sight.name, data.sight.description, imgs);
					
					var divLeft = sightDiv.find(".scenic-pic-box");
					var divRight = sightDiv.find(".scenic-font");
					if(divLeft.height()>divRight.height()) divRight.height(divLeft.height()+"px");
				}
			},
			error:function(){}
		});
		
	}).on('click','.aui_close',function(){
		myDialog.close();
	}).on('click','.J_hotel',function(){
		var hotelDiv = $("#hotel-layer");
		var hotelId = $(this).attr("attr_id");

		if("" != hotelId && null != hotelId){
			$.ajax({
				url:'/hotel/'+hotelId+'.json',
				type:'GET',
				dataType:'json',
				success:function(data){
					if(null != data && null != data.hotel){
						var imgs = data.hotel.hotelImages;
						setShowInfo(hotelDiv, data.hotel.name, data.hotel.description, imgs);
						
						var divLeft = hotelDiv.find(".scenic-pic-box");
						var divRight = hotelDiv.find(".scenic-font");
						if(divLeft.height()>divRight.height()) divRight.height(divLeft.height()+"px");
					}
				},
				error:function(){}
			});
		}
//		myDialog = prodcutDialg({
//			content: $("#hotel-layer") && $("#hotel-layer").length && $("#hotel-layer")[0]
//		});
	}).on('click','.J_visa',function(){
		var visaDiv = $("#J_visalayer");
		var visaId = $(this).attr("attr_id");
		var visaDivLeft = visaDiv.find(".scenic-pic-box");
		var visaDivRight = visaDiv.find(".scenic-font");
		$.ajax({
			url:'/visa/'+visaId+'.json',
			type:'GET',
			dataType:'json',
			success:function(data){
				if(null != data && null != data.visa){
					var visaTermTypeList = data.visa.termTypes;
					var visaTermList = data.visa.terms;
					
					visaDivLeft.find(".tilte").text(data.visa.title);
					visaDivLeft.find(".visa-number").text(data.visa.inbound);
					visaDivLeft.find(".visa-stay").text(data.visa.stay);
					visaDivLeft.find(".visa-validate").text(data.visa.validate);
					visaDivLeft.find(".visa-scope").html(data.visa.scope);
					visaDivRight.find(".visa-type").html("");
					visaDivRight.find(".visa-list").html("");
					for(var i = 0; i < visaTermTypeList.length; i ++){
						var typeIndex = 0;
						var visaContent = '<div class="visa-content hidden">';
						for(var j = 0; j < visaTermList.length; j ++){
							if(visaTermTypeList[i] == visaTermList[j].type){
								typeIndex == 0 && visaDivRight.find(".visa-type").append('<li><a href="javascript:void(0);">'+visaTermList[j].typeName+'</a></li>');
								visaContent += '<dl><dt>'+visaTermList[j].term+'</dt><dt>'+visaTermList[j].termExplain+'</dt></dl>';
								typeIndex++;
							}
						}
						visaContent += '</div>';
						visaDivRight.find(".visa-list").append(visaContent);
					}
					$(visaDivRight.find(".visa-type").find("li").get(0)).click();
					myDialog = prodcutDialg({
						content: visaDiv[0]
					});
					if(visaDivLeft.height()>visaDivRight.height()) visaDivRight.height(visaDivLeft.height()+"px");
					
				}else{
					myDialog = prodcutDialg({
						content: '暂无信息'
					});
					myDialog.close();
				}
			},
			error:function(){}
		});
	}).on('click','#J-share',function(){
		myDialog = prodcutDialg({
			content: $("#J_sharelayer") && $("#J_sharelayer").length && $("#J_sharelayer")[0]		
		});
	}).on('click','.tab li',function(){
		$(this).addClass('selected').siblings().removeClass('selected');
		$('.visa-content').eq($('.tab li').index(this)).removeClass('hidden').siblings().addClass('hidden');				
	}).on("click", ".day-select", function(){
		$(this).parent().find(".select").each(function(){
			$(this).removeClass("select");
		});
		$(this).addClass("select");
	}).on("click", ".scenic-ul>li", function(){
		$(".scenic-ul").find(".selected").each(function(){
			$(this).removeClass("selected");
		});
		$(this).addClass("selected");
		var src = $(this).find("img").attr("data-src");
		var showBigImg = $(this).parent().parent().find(".scenic-pic");
		showBigImg.html("");
		showBigImg.append('<img src="'+src+'" data-src="'+src+'" />');
//		var thisImg = showBigImg.find("img");
//		if(thisImg.height() > 120){
//			thisImg.css({"margin-top": -((thisImg.height() - 120) / 2)});
//		}else{
//			thisImg.css({"margin-top": 0 });
//		}
	});
	
	function setShowInfo(obj, title, description, imgs){
		obj.find(".content-body").html($("#showInfoDialog").html());
		obj.find(".scenic-font").find(".title").text(title);
		obj.find(".scenic-font").find(".font-content").html(description);
		obj.find(".scenic-pic-box").find(".scenic-ul").html("");
		
//		var max = 12 < imgs.length ? 12 : imgs.length;
		var max = imgs ? imgs.length : 0;
		for(var i = 0 ; i < max ; i++){
			obj.find(".scenic-pic-box").find(".scenic-ul")
				.append('<li><img src="'+imgs[i].url+'@50w_20h_1e" data-src="'+imgs[i].url+'@210w_120h_1e"><span class="icon"></span></li>');
		}
		myDialog = prodcutDialg({
			content: obj[0]
		});
		if(obj.find(".scenic-pic-box").find(".scenic-ul").find("li").length > 0){
			$(obj.find(".scenic-pic-box").find(".scenic-ul").find("li").get(0)).click();
		}
	}
	
	var prodcutDialg = function(options){		
		var defaults = ({
			fixed: true,
			//top:'',
			lock: true,
			title:false,
			padding:"0",
			isClose:true,
			content:"加载中...",
			init : function(){
				$(".aui_content").css({
					'margin-top': '-5px'
				});
			}
		});		
		_prodcutDialg = $.dialog($.extend(defaults, options));
		return _prodcutDialg;
	};
	var heardHeight = $('.heard').height(),navHeight = $('.nav').height(),
	windowHeight = $(window).height(),item = $(".item-bg").height(),
	documentHeight = $(document).outerWidth(true), h = heardHeight + navHeight + 36;
	var right=($(window).width()-$(".main.w").width())/2;
	menuPosition(h,right);
	$(window).resize(function(){
		if($(window).width()>1200){
			 var right=($(window).width()-$(".main.w").width())/2;
			 menuPosition(h,right);
			 $(window).trigger("scroll");
		}
		else{
			$(".side").removeAttr("style");
		}
	 });
//	$(".dailyTrip-desc").each(function(){
//		var htmlDiv = $(this);
//		var html = $(this).html();
//		if("" != html && null != html){
//			$.ajax({
//				url:'/sight/hightlight.json',
//				data: {'contents': html, touristLine: $("#touristLineId").val()},
//				type:'POST',
//				dataType:'json',
//				success:function(data){
//					htmlDiv.html(data.contents[0]);
//					htmlDiv.parents(".day-box-up").find(".jindian-notice").text(htmlDiv.find(".hightlight").length);
//					htmlDiv.find(".hightlight").each(function(){
//						$(this).addClass("J_scenic").removeAttr("target").attr("href", "javascript:void(0);");
//					});
//				},
//				error:function(){}
//			});
//		}
//	});
	$(".jindian-notice").each(function(){
		var sight = [];
		$(this).parents(".data-info").find(".hightlight").each(function(){
			var sightId = $(this).attr("sight_id");
			if(sight.in_array(sightId) == -1){
				sight.push(sightId);
			}
		});
		$(this).text(sight.length);
	});
});
function menuPosition(h,right){
		if($(window).scrollTop > h){
			$('.side').css({"position":($(window).height()>$('.side').height()?"fixed":""),"top":"0","right":($(window).height()>$('.side').height()?right:0)});
		};
		$(window).scroll(function(){
			if($(window).width()>1200){
				if ($(window).scrollTop() > h) {
				     $(".side").css({
				    	 "position":($(window).height()>$('.side').height()?"fixed":""),
				    	 "top":"0",
				    	 "right":($(window).height()>$('.side').height()?right:0)
				    	 });
				}
				if ($(window).scrollTop() <= h) {				
					$(".side").css({
						"position":($(window).height()>$('.side').height()?"absolute":""),
						"top":"5px",
						right:"0"
					});
				}
			}
			else{
				$(".side").removeAttr("style");
			}
			var wScrollTop = $(window).scrollTop();
			
			/*if(($("#brightSpot").offset().top + $("#brightSpot").height() - wScrollTop) - 85 > 0) {
				$(".baoj-title").find("a").addClass("sele");
			} else {
				$(".baoj-title").find("a").removeClass("sele");
			}*/
			
			$("#pricesInfos,#brightSpot,#contactList,#overview,#survey").each(function(){
				var top = $(this).offset().top - wScrollTop;
				var end = $(this).offset().top + $(this).height();
				var id=$(this).attr("id");
				
				if(top < 85 && wScrollTop <= end - 85){
					$(".side").find("[href=#"+id+"]").addClass("sele");
				} else {
					$(".side").find("[href=#"+id+"]").removeClass("sele");
				}
			});
			
			$(".data-info-body").each(function(i){
				var top = $(this).offset().top - wScrollTop;
				var end = $(this).offset().top + $(this).height();
				if(top < 85 && wScrollTop <= end - 85){
					$(".side").find(".days").find(".select").each(function(){
						$(this).removeClass("select");
					});
					$(".side").find(".days").find(".day-select").eq(i).addClass("select");
				} else {
					$(".side").find(".days").find(".day-select").eq(i).removeClass("select");
				}
			});
			$(".other-info").each(function(i){
				if(i < (($(".side").find(".fiexd-menu").find("li").length)*1 - 1)){
					var top = $(this).offset().top - wScrollTop;
					var end = $(this).offset().top + $(this).height();
					if(top < 85 && wScrollTop <= end - 85){
						$(".side").find(".fiexd-menu").find("li").eq(i).find("a").addClass("sele");
					} else {
						$(".side").find(".fiexd-menu").find("li").eq(i).find("a").removeClass("sele");
					}
				}
			});
		});
}
function showScenicPic(imgDom,scenicDom,insertDom){

	var imgsStr="",
		imgs=imgDom.map(function(){return $(this).attr("src");}).get();
	imgDom.remove();

	for(var i=0;i<((imgs.length<=3)?imgs.length:3);i++){
		imgsStr+="<li><span class=\"pic-loading\"><span><i class=\"gm-icon gm-img\"></i><b>加载中...</b></span></span><img src=\""+imgs[i]+"\" /><h3><span></span><span>沿途风光</span></h3></li>";
	}
	
	//用户上传不足三张
	if(imgs.length<3){
		var sysImgs=[],
			sysImgsName=scenicDom.map(function(){return $(this).text()}).get(),
			length=3-imgs.length,
			index1,
			index2;
		
		scenicDom.each(function(){
			sysImgs[sysImgs.length]=$(this).attr("images").split(",")||[];
		});
		
		/*代码待优化以满足扩展需求 start*/
		if(length==1){
			if(sysImgs.length>0){
				index1=0;
				index2=0;
			}
		}
		else if(length==2){
			if(sysImgs.length==1){
				index1=0;
				index2=1;
			}
			else if(sysImgs.length>=2){
				index1=1;
				index2=0;
			}
		}
		else if(length==3){
			if(sysImgs.length==1){
				index1=0;
				index2=2;
			}
			else if(sysImgs.length==2){
				index1=1;
				index2=1;
			}
			else if(sysImgs.length>=3){
				index1=2;
				index2=0;
			}
		}
		
		/*代码待优化 end*/
		
		var currentLength=imgs.length;
		for(var i=0;i<=index1;i++){
			for(var j=0;j<=index2;j++){
				if(sysImgs[i][j]){
					if(currentLength>=3){
						break;
					}
					currentLength++;
					
					imgsStr+="<li><img src=\""+sysImgs[i][j]+"@218h\" /><h3><span></span><span>"+sysImgsName[i]+"</span></h3></li>";
				}
			}
		}
		
	}
	if(imgsStr){
		insertDom.after("<div class=\"uploadList\"><ul class=\"clearfix\">"+imgsStr+"</ul></div>");
	}
}