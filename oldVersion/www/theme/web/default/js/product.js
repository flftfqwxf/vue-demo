if(window.location.href.indexOf("?")>=0||window.location.search){
	try{
		$(window).scrollTop($(".plan-list").offset().top);
	}
	catch(ex){
		
	}
}
$(function(){
	
	//顶部focus hover事件
	$("#banner_slider li").hover(function(){
		$(this).find(".text_info_bg").stop(true).animate({height: 80}, 500);
		$(this).find(".text_info").stop(true).animate({height: 80}, 500);
	},function(){
		$(this).find(".text_info_bg").stop(true).animate({height: 40}, 500);
		$(this).find(".text_info").stop(true).animate({height: 40}, 500);
	});
	
	/*$(document).on("mouseover", "td[show-title]", function(d){
		_title = $(this).attr('show-title');
        $("body").append('<div id="tooltip"><pre style="white-space: pre-wrap!important;break-word:break-all;word-wrap:break-word;">' + _title + "</pre></div>"); //创建提示框,添加到页面中
        $("#tooltip").css({
        	position: "absolute",
        	maxWidth: "400px",
            left: (d.pageX + 30) + "px",
            top: d.pageY + "px",
            padding: '10px',
            //opacity: "0.8",
            background: "#fff",
            breakWord: "break-all",
            wordWrap: "break-word",
            'white-space': "pre-wrap!important"
        }).show() //设置提示框的坐标，并显示
	}).on("mouseout", "td[show-title]", function(d){
		//this.title = _title; //重新设置title
        $("#tooltip").remove() //移除弹出框
	}).on("mousemove", "td[show-title]", function(d){
		$("#tooltip").css({
            left: (d.pageX + 30) + "px",
            top: d.pageY + "px"
        })
	});*/
	
	function control_bubble(oEvent) {
		//取消冒泡
		oEvent = oEvent || window.event;
		if (document.all) {
			oEvent.cancelBubble = true;
		} else {
			oEvent.stopPropagation();
		}
	}

	$([$("#banner_slider"),$("#right_slider")]).each(function(i){
		setObjectSlider(this);
	});
	
	$(".gm_recommend_tips_link").click(function(){
		var dialog = $.dialog({
	        title: false,
	        padding: "0",
	        drag: false,
	        lock: true,
	        fixed: true,
	        close:true,
	        isOuterBoxShadow: false,
	        content: $("#gm-adv-tpl").html(),
	        init : function (){
	        	var api = this;
	            var wrap = api.DOM.wrap;
	            $(".gm-adv-nav a").click(function(){
	            	dialog.close();
	            });
//	            var auiContent = wrap.find(".aui_content");
//	            console.log(auiContent);
//	            auiContent.html($("#gm-adv-tpl").html());
	            var gmAdv = wrap.find(".gm-adv");
	            gmAdv.find(".gm-adv-slider").each(function(){
	            	setObjectSlider($(this));
	            });
	            gmAdv.find(".gm-adv-body-li").eq(0).show();
	            gmAdv.find(".gm-adv-nav-li").click(function(e){
	            	var index = $(this).parent().children(".gm-adv-nav-li").index(this);
	            	gmAdv.find(".gm-adv-body-li").hide();
	            	gmAdv.find(".gm-adv-body-li").eq(index).show();
	            	$(this).parent().find(".on").removeClass("on");
	            	$(this).addClass("on");
	            });
	        }
	    });
	});
	
	function setObjectSlider(obj){
		//hide
		$("#right_slider").find('.JQ-slide-nav-show').hide();
		obj.Slide({
			effect : "scroolLoop",
			autoPlay:true,
	    	speed : "normal",
			timer : 3000,
			steps:1,
			prevCallBack : function (_self, index) {
				var navShow = _self.find(".JQ-slide-nav-show");
				navShow.find("i.on").each(function(){
					$(this).removeClass("on");
				});
				navShow.find("i").eq(index).addClass("on");
			},
			nextCallBack : function (_self, index) {
				var navShow = _self.find(".JQ-slide-nav-show");
				navShow.find("i.on").each(function(){
					$(this).removeClass("on");
				});
				navShow.find("i").eq(index).addClass("on");
			}
		});
	}
	
	// 设置热门专线
	$.ajax({
		url: "/product/hotTouristLine.json?size=5&_=" + Date.parse(new Date()),
		type: 'GET',
		dataType: "json",
		success : function(data){
			if(data && data.hotTouristLineList){
				for(var i = 0; i < data.hotTouristLineList.length; i++){
					var thisHot = data.hotTouristLineList[i];
					thisHot.link = "javascript:void(0);";
					thisHot.nameShort = subString(thisHot.name,14);
					thisHot.index = i+1;
					$("#hot_tourist_line").append(template("tmp_hot_li", thisHot));
				}
			}
		}
	});
	// 设置热门供应商
	$.ajax({
		url: "/product/hotSupplier.json?size=5&_=" + Date.parse(new Date()),
		type: 'GET',
		dataType: "json",
		success : function(data){
			if(data && data.hotSupplierList){
				for(var i = 0; i < data.hotSupplierList.length; i++){
					var thisHot = data.hotSupplierList[i];
					thisHot.link = "javascript:void(0);";
					thisHot.nameShort = subString(thisHot.name,14);
					thisHot.index = i+1;
					$("#hot_supplier").append(template("tmp_hot_li", thisHot));
					
				}
			}
		}
	});
	$("#hot_tourist_line").on("click", ".hot_li_title", function(){
		var val = $(this).attr("attr_id");
		$("#subForm input").val("");
		$("#subForm [name=line]").val(val);
		subform();
	});
	$("#hot_supplier").on("click", ".hot_li_title", function(){
		var val = $(this).attr("attr_id");
		$("#subForm input").val("");
		$("#subForm [name=supplier]").val(val);
		subform();
	});
	
	var hotKey = ["巴厘岛","普吉岛","新西兰","芽庄","岘港","迪拜","日本","光雾山","苏梅岛","新加坡","甲米","夏威夷","三亚","丽江","芭提雅","斯里兰卡","德法意瑞"];
	for(var i = 0; i < hotKey.length; i++){
		$("#hot_keywords").append('<a href="javascript:void(0);" class="hot_key_li ' + '" title="' + hotKey[i] + '">' + hotKey[i] + '</a>');
	}
	$("#hot_keywords").on("click", ".hot_key_li", function(){
		var val = $(this).text();
		$("#subForm input").val("");
		var departurePlaceId = $("#province").attr('data-value');
		$("#subForm").find("input[name=departurePlaceId]").val(departurePlaceId);
		$("#subForm [name=keyWord]").val(val);
		subform();
	});
	
});
function subString(str, len) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++) {
            singleChar = str.charAt(i).toString();
            if(singleChar.match(chineseRegex) != null) {
                    newLength += 2;
            }else {
                    newLength++;
            }
            if(newLength > len) {
                    break;
            }
                    newStr += singleChar;
    }
    if(strLength > len) {
            newStr += "...";
    }
    return newStr;
} 