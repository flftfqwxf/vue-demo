$(function(){
	
	$.bindbeforeout();
	String.prototype.template = function(json){
		var s = this;
		for(var v in json) {
			s = s.replace(/{(\w+)}/g, function(w){var s=w.substring(1,w.length-1); return json[s] || ""});
		}
		return s;
	}
	
	var w = window;
	var $banner = $(".banner");
	var $current;
	
	var $dashboard = $(".dashboard");
	$dashboard.draggable();
	
	var sizedata = [12, 14, 16, 18, 20, 24, 28, 30, 34, 36, 40, 50, 60 , 70, 100, 120, 150];
	var sizehtml = "";
	for (var i = sizedata.length - 1; i >= 0 ;i--) {
			sizehtml += "<li  data='{v}px' >{v}</li>".template({ v : sizedata[i]});
	}
	$(".text-size .size", $dashboard).html(sizehtml);
	
	var colordata = ['#ffffff','#eeeeee','#dcdcdc','#c9c9c9','#b5b5b5','#a0a0a0','#898989','#707070','#535353','#313131','#000000','#ff0000','#ff6000','#ffff00','#00b015','#0071e4','#eb6877','#e400b6','#4c0808','#a40000','#f19149','#22ac38','#32b16c','#0d3802','#31a6ed','#081564','#001c58','#5f52a0','#8957a1','#601986','#cfa972','#81511c'];
	var colorhtml = "";
	for (var i = 0; i < colordata.length ;i++) {
		colorhtml += "<li data='{c}'><span class='color' style='background-color:{c}'></span></li>".template({ c : colordata[i]});
	}
	$(".text-color", $dashboard).html(colorhtml);
	
	var familydata = [{txt: "微软雅黑", img : "CN_WeiRuanYaHei.png"},
	                  {txt: "宋体", img : "CN_SongTi.png"}, 
	                  {txt:"Arial", img : "aril.png"}, 
	                  {txt: "BauhausMedium", img: "bouch.png"},
	                  {txt:"LucidaCalligraphy", img: "luch.png"},
	                  {txt: "SourceSansPro", img: "source.png"},
	                  {txt: "方正标准圆简体", img: "CN_FangZhengBiaoZhunJianYuanTi.png" },
	                  {txt: "方正藏体简体", img : "CN_FangZhengZangTiJianTi.png"},
	                  {txt: "方正超粗黑简体", img : "CN_FangZhengChaoCuHeiJianTi.png"}, 
	                  {txt: "方正粗活意简体", img : "CN_FangZhengCuHuoYiJianTi.png"},
	                  {txt: "方正汉真广标简体", img: "CN_FangZhengHanZhenChangBiaoJianTi.png"}, 
	                  {txt: "方正小标宋简体", img : "CN_FangZhengXiaoBiaoSongJianTi.png"},
	                  {txt: "方正综艺简体", img: "CN_FangZhengZongYiJianTi.png"}, 
	                  {txt:"汉仪彩云体简", img: "CN_HanYiCaiYunJianTi.png"},
	                  {txt:"汉仪综艺体简", img:"CN_HanYiZongYiTiJian.png"},
	                  {txt:"汉真广标", img:"CN_HanZhenGuangBiao.png"},
	                  {txt: "兰亭黑简", img:"CN_LanTingHeiJian.png"}]
					//, "迷你简菱心", "文鼎习字体"];
	var familyhtml = "";
	for (var i = 0; i < familydata.length ;i++) {
		familyhtml += ("<li data='{txt}' ><img src='"+WEB_STATIC+"/supplier/theme/manage/blue/images/fontImg/{img}'/></li>").template(familydata[i]);
	}
	$(".text-family .family", $dashboard).html(familyhtml);
	
	
	var $replaceImg = null;
	$banner.on("click", ".btn.del",function(){
		var $this = $(this);
		 $.dialog({
             title: false,
             width: 300,
             height: 150,
             padding: '0 20px',
             isOuterBoxShadow: false,
             //isClose: false,
             content: '<center>操作确认</center><p>是否确认删除文字模板?</p>',
             lock: true,
             fixed: true,
             ok: false,
             cancel: function () {
             },
             cancelVal: '关闭',
             button: [
                 {
                     name: '删除',
                     className: 'btn-important',
                     callback: function () {
                    	$current = null;
                 		$dashboard.hide();
                 		$jsondom.remove($this.closest("[data-type]"));
                     },
                     focus: true
                 }
             ]
         });
		
	}).on("click",".btn.image.edit", function(){
		if ($replaceImg != null) {
			$(this).validationEngine('showPrompt',"当前正在上传图片请稍后",'error',null,true);
		} else {
			var $this = $(this);
			if ($current != null) {
				$current.dblclick();
			}
			$current = $this.closest("[data-name=images]");
			$(".webuploader-element-invisible").click();
		}
	}).on("click", ".btn.font.edit", function(){
		var $this = $(this);
		$this.closest("[data-name=fonts]").dblclick();
	});
	
	$dashboard.on("click", ".okText", function(){
		$current.dblclick();
	}).on("click", ".allowImg :checkbox",function(){
		var allow = $(this).prop("checked") ? 1 : 0;
		$(">data [name=allowReplace]", $current).val(allow);
	}).on("click", ".allowFont :checkbox",function(){
		var allow = $(this).prop("checked") ? 1 : 0;
		$(">data [name=allowReplace]", $current).val(allow);
	}).on("keyup", "textarea.text", function(){
		if ($current) {
			var text = $(this).val();
			$(">data [name=text]", $current).val(text);
			$(".text", $current).text(text);
		}
		afreshSetPosition($current);
	}).on("change", "textarea.text", function(){
		if ($current) {
			var text = $(this).val();
			$(">data [name=text]", $current).val(text);
			$(".text", $current).text(text);
		}
		afreshSetPosition($current);
	})
	.on("click", ".text-bold", function(){
		var $bold = $(">data [name=bold]", $current);
		var v = $bold.val();
		if (v == "1") {
			$bold.val("0");
			$(this).css("font-weight", "normal");
			$(".text", $current).css("font-weight", "normal");
		} else {
			$bold.val("1");
			$(this).css("font-weight", "bold");
			$(".text", $current).css("font-weight", "bold");
		}
	}).on("click", ".text-size .size li", function(){
		var size = $(this).attr("data");
		$(">data [name=size]", $current).val(size);
		$(".text", $current).css("font-size", size);
		$(".text-size input", $dashboard).val($(this).text());
		
		afreshSetPosition($current);
		
	}).on("click", ".text-family .family li", function(){
		var family = $(this).attr("data");
		$(">data [name=family]", $current).val(family);
		$(".text", $current).css("font-family", family);
		$(".text-family input", $dashboard).val($(this).attr("data"));
		
		afreshSetPosition($current);
	}).on("click", ".text-color li", function(){
		var color = $(this).attr("data");
		$(">data [name=color]", $current).val(color);
		$(".text", $current).css("color", color);
	});
	
//	$(document).keydown(function(key){
//		if (key.keyCode == 8) {	return false;}
//	});
	
	
	$(window).keyup(function(key){
		if ($current != null) {
			if (key.keyCode == 46) {
				$jsondom.remove($current);
				$dashboard.hide();
				$current = null;
				return false
			} else if (key.keyCode == 109 || key.keyCode == 189) {
				//z-index --
				var $zindex = $("data [name=zindex]", $current);
				var z = $zindex.val();
				if (z == null || z == "" || z == "1") {
					z = 1;
				} else {
					z = parseInt(z) - 1;
				}
				$zindex.val(z);
				$current.css("z-index", z);
			} else if (key.keyCode == 107 || key.keyCode == 187) {
				// z-index ++
				var $zindex = $("data [name=zindex]", $current);
				var z = $zindex.val();
				if (z == null || z == "") {
					z = 1;
				} else {
					var v = parseInt(z);
					if (v >= 500) {
						z = 500;
					} else {
						z = parseInt(z) + 1;
					}
				}
				$zindex.val(z);
				$current.css("z-index", z);
			} else if (key.keyCode == 27) {
				$current.dblclick();
			}
		} 
		return true;
	});
	
	var banner = {
		//公用初始化DOM
		initElement : function($element, loadDashboard, clearDashboard){
			$(".font", $dashboard).hide();
			$(".image", $dashboard).hide();
			
			$banner.append($element);
			$element.dblclick(function(){
				//不允许编辑的不动
				if (!$element.hasClass("editable") || $element.hasClass("banner_image")) {
					return false;
				}
				
				if ($current == $element) {
					$("[active!=show]",$element).hide();
					$current = null;
					$element.removeClass("cursor");
					$dashboard.hide();
					$(".image, .font",$dashboard).hide();
				} else {
					if ($current) {
						$current.removeClass("cursor");
						$("[active!=show]", $current).hide();
						$(".image, .font",$dashboard).hide();
					}
					$dashboard.show();
					$("*:not('[active=show]')", $element).show();
					$element.addClass("cursor");
					$current = $element;
					loadDashboard && loadDashboard();
				}
			});
			
			if ($element.hasClass("draggable")) {
				$element.draggable({
					start : function(){
						if ($element != $current) {
							return false;
						}
					},
					stop : function(){
						$e = $(this);
						$("data [name=xaxis]", $element).val($e.css("left").replace("px", ""));
						$("data [name=yaxis]", $element).val($e.css("top").replace("px", ""));
					}
				});
			}
			//默认隐藏操作选项
			$("[active!=show]",$element).hide();
		},
		insertImage : function(data){
			var $element = $(template("tmp_banner_image", data || {}));
			banner.initElement($element, function(){
				$(".image", $dashboard).show();
				var allow = $(">data [name=allowReplace]", $element).val();
				$checkbox = $(".allowImg :checkbox");
				allow == "1" ? $checkbox.prop("checked", true) : $checkbox.prop("checked", false);
			}, function(){
				$(".image", $dashboard).hide();
			});
			
			var $divImage = $(".div_image", $element);
			var $img = $("img", $divImage);
			var $handles = $(".handle", $element);
			
			//根据点剪切图形
			var func_polygon = function(){
				var polygon = "";
				for (var i = 0; i < $handles.length; i++) {
					$h = $($handles[i]);
					var top = parseFloat($h.css("top")) / $divImage.height() * 100;
					var left = parseFloat($h.css("left")) / $divImage.width() * 100;
					top = top.toFixed(2);
					left = left.toFixed(2);
					polygon += left  + "% " +top + "%";
					if (i < $handles.length - 1) {
						polygon += ",";
					}
					$("[name=yaxis]",$h).val(parseFloat($h.css("top")));
					$("[name=xaxis]",$h).val(parseFloat($h.css("left")));
				}
				polygon = "polygon(" + polygon + ")";
				$img.css("-webkit-clip-path", polygon);
				$img.css("clip-path", polygon);
			}
			
			
			
			if ($element.hasClass("resizable")) {
				var func_resize = function(){
					var old_width = $element.data().old_width;
					var old_height = $element.data().old_height;
					var width = $element.width().toFixed(2);
					var height = $element.height().toFixed(2);
					$element.width(width);
					$element.height(height);
					
					//实际图片比reisze层高宽各少20px
					$(">data [name=width]", $element).val(width - 20);
					$(">data [name=height]", $element).val(height -20);
					
					//x, y 等比例偏移
					$handles.each(function(){
						$h = $(this);
						var x = $h.data().old_left;
						var y = $h.data().old_top;
						var new_x = x * width / old_width;
						var new_y = y * height / old_height;
						$h.css("left", new_x + "px");
						$h.css("top", new_y + "px");
					});
					
					//x, y 同步偏移
//					if (old_width == width) {
//						$([2, 3]).each(function(i, e){
//							console.log(this);
//							$h = $($handles[this]);
//							var y = $h.data().old_top;
//							var offset = height - old_height;
//							var new_y = y + offset; 
//							$h.css("top", new_y + "px");
//						})
//						
//					} else {
//						$([1, 2]).each(function(i, e){
//							$h = $($handles[this]);
//							var x = $h.data().old_left;
//							var offset = width - old_width;
//							var new_x = x + offset; 
//							$h.css("left", new_x + "px");
//						})
//					}
					
					func_polygon();
				}
				
				$element.resizable({
					start : function(){
						$element.data({old_width : $element.width(),old_height: $element.height()});
						$handles.each(function(){
							var left = parseInt($(this).css("left"));
							var top = parseInt($(this).css("top"));
							$(this).data({old_left : left, old_top : top});
							
						});
					},
					resize : function(event, ui){
						func_resize();
					},
					stop : function(){
						func_resize();
					}
				});
				
			}
			
			$(".handle", $element).each(function(){
				var $handle = $(this);
				$handle.draggable({ 
					containment: $element,
					scroll: false,
					start : function(){
						$handle.data({top: $handle.css("top").replace("px",""), left:$handle.css("left").replace("px","")});
					},
					drag : function(){
						func_polygon();
					},
					stop : function(){
						func_polygon();
					}
				});
				$handle.mousedown(function(){
					$handle.addClass("is-dragging");
				});
				$(document).mouseup(function(){
					$handles.removeClass("is-dragging");
				});
			});
			
			//默认隐藏操作选项
			$("[active!=show]",$element).hide();
			
			//初始化
			func_polygon();
			return $element;
		},
		insertFont : function(data){
			var defaultfont = { text: "广告文案",zindex: 100, width:300, height:80, yaxis:0, xaxis:0, color : "#000000", size : "70px", bold: false, family: "微软雅黑" };
			
			var $element = $(template("tmp_banner_font", data || defaultfont));
			banner.initElement($element, function(){
				
				$(".font", $dashboard).show();
				var $checkbox = $(".allowFont :checkbox", $dashboard);
				var allow = $(">data [name=allowReplace]", $element).val();
				allow == "1" ? $checkbox.prop("checked", true) : $checkbox.prop("checked", false);
				
				var text = $(">data [name=text]", $element).val();
				var $text = $(".text", $dashboard).val(text);
				
				
				var $bold = $(".text-bold", $dashboard);
				var bold = $(">data [name=bold]", $element).val();
				$bold.css("font-weight", bold == "1" ? "bold" : "normal");
				
				var size = $(">data [name=size]",$element).val();
				var v = $(".text-size .size li[data="+size+"]").text();
				$(".text-size input", $dashboard).val(v);
				
				
				var family = $(">data [name=family]",$element).val();
				var v = $(".text-family .family li[data="+family+"]");
				$(".text-family input", $dashboard).val(family);
				
				afreshSetPosition($element);
			}, function(){
				$(".font", $dashboard).hide();
			});
			
			var func_resize = function(){
				var width = $element.width().toFixed(2);
				var height = $element.height().toFixed(2);
				$(">data [name=width]", $element).val(width);
				$(">data [name=height]", $element).val(height);
				$element.width(width);
				$element.height(height);
			}
			if ($element.hasClass("resizable")) {
				$element.resizable({
					start : function(){
					},
					resize : function(event, ui){
						func_resize();
					},
					stop : function(){
						afreshSetPosition($element);
					}
				});
			}
			$("[active!=show]",$element).hide();
			return $element;
		}
	};
	
	// 重设文字div：解决文字resizable后，canvas画文字bug
	function afreshSetPosition(element) {
		var spanTextNum = getStrLength($(element).children("span").text());
		if(spanTextNum > 0) {	
			var fontsWidth = $(element).children("span").width();
			
			// 拉伸后重新定位位置：这里会有抖动问题
			//var fontLeft = $(element).children("span").offset().left;
			//$(element).offset({left: fontLeft});
			
			var spanStyle = $(element).children("span").attr('style'); 
			var fontSize = spanStyle.match(/(?:font-size:)\s*(\d+.{0,1}\d*)/)[0].replace(/font-size:/,'');
			fontSize = fontSize.substr(0, fontSize.length-1);
			
			var temp = (fontsWidth/fontSize).toFixed(2);
			$(element).height('auto');
			$(element).width(temp*fontSize);
			$(">data [name=width]", $(element)).val(temp*fontSize);
			$(">data [name=height]", $(element)).val($(element).children("span").height());
		}
	}
	
	function getStrLength(str) {
	    ///<summary>获得字符串实际长度，中文2，英文1</summary>
	    ///<param name="str">要获得长度的字符串</param>
	    var realLength = 0, len = str.length, charCode = -1;
	    for (var i = 0; i < len; i++) {
	        charCode = str.charCodeAt(i);
	        if (charCode >= 0 && charCode <= 128) realLength += 1;
	        else realLength += 2;
	    }
	    return realLength;
	}; 
	
//	webUpload({"target":"#uploadBackground","operateType":"user_image", success:function(response) {
//		$(">data [name=background]", $banner).val(response.url);
//		$(">data [name=width]", $banner).val(response.width);
//		$(">data [name=height]", $banner).val(response.height);
//		$banner.css("background-image", "url('" + response.url + "')");
//		$banner.css("width", response.width);
//		$banner.css("height", response.height);
//	 },error:function(id,message){
//		 $(id).validationEngine('showPrompt',message,'error',null,true);
//	 }, label : "上传背景图"
//	 });
	 
	
	$("#insertFont").click(function(){
		$element = banner.insertFont();
		$element.dblclick();
	});

	webUpload({"target":"#insertImage","operateType":"user_image",addFile:function(){
		$replaceImg = $current;
		$(".element-active-img-op .edit", $replaceImg).hide();
		$(".element-active-img-op .wait", $replaceImg).show();
	},success:function(response) {
		$replaceImg.find("img[tag=image]").attr("src", response.url);
		$(".element-active-img-op .edit", $replaceImg).show();
		$(".element-active-img-op .wait", $replaceImg).hide();
		$replaceImg = null;
//		$element = banner.insertImage({
//			yaxis:0,
//			xaxis:0,
//			width : response.width,
//			height : response.height,
//			url : response.url,
//			zindex : 10,
//			handles : [{xaxis : 0 , yaxis : 0},
//			           {xaxis : response.width , yaxis : 0},
//			           {xaxis : response.width , yaxis : response.height},
//			           {xaxis : 0 , yaxis : response.height}],
//			allowReplace : false,
//		});
//		$element.dblclick();
	},error:function(id,message){
		$replaceImg = null;
		$(".element-active-img-op .edit",$current).show();
		$(".element-active-img-op .wait",$current).hide();
		$current.validationEngine('showPrompt',message,'error',null,true);
	}, label : "加图片"});
	 
	
	 
	var $form = $("#form").validationEngine({validateNonVisibleFields:true,scroll:true,scrollOffset:100,autoHidePrompt:true,autoHideDelay:5000,focusFirstField:true});
	var $jsondom;
	$(".cancelSave").click(function(){
		window.close();
	});
	$(".saveBtn").click(function(){
//		var valid = $form.validationEngine('validate');
//		if ($(">data [name=background]", $banner).val() == "") {
//			$banner.validationEngine('showPrompt',"背景图片必须上传",'error',null,true);
//			valid = false;
//		}
		var valid = true;
		var $save = $(".saveBtn");
		var $saving = $(".saving");
		var $saved = $(".saved");
		
		if (valid) {
			// mask
			$(".mask").css({
    			height : $(document).height()
    		}).show();
    		$(".loading-wrap").show();
    		$save.hide();
    		$saving.show();
    		$(".gmWeixin").hide();
    		$("html").addClass("nature-screen");
			html2canvas($("#cutpicture"), { 
				proxy:"http://console.gmmtour.com/download",
				onrendered: function(canvas) {
					if (Promise.isTimeOut) {
						$saving.hide();
			    		$save.show();
						$(".mask").hide();
						$(".loading-wrap").hide();
						$("html").removeClass("nature-screen");
						alert('保存超时，请重试');
						return;
					}
					var canvasUrl = canvas.toDataURL("image/png");
					// 转blob
					var imgBlob = dataURLtoBlob(canvasUrl);
					// 上传
					var xhr = new XMLHttpRequest();
					var data = new FormData();
					data.append("file_image", imgBlob, "autoScreenshot.png");
					data.append("operateType", "advert_image");
					
					xhr.open("post", "http://www.gmmtour.com/api/upload?format=json", true);
					xhr.send(data);
					xhr.onreadystatechange = function(){
						if(xhr.readyState == 4) {
							if(xhr.status == 200) {
								var result = JSON.parse(xhr.responseText);
								if(result.success) {
						    		$saving.hide();
						    		$saved.show();
						    		var $qrcode = $(".gmWeixin");
						    		var url = "/qrcode?height=184&width=184&text=" + result.url;
						    		$("img", $qrcode).attr("src", url);
						    		
						    		var download = "/download?name=banner&file=" + result.url
						    		$("a", $qrcode).attr("href", download);
						    		$qrcode.show();
						    		setTimeout(function(){
						    			$save.show();
						    			$saved.hide();
						    		},2000);
									(">data [name=render]", $banner).val(result.url);
									$(".mask").hide();
									$(".loading-wrap").hide();
								}else {
									$(".mask").hide();
									$(".loading-wrap").hide();
									alert(result.message);
								}
								$("html").removeClass("nature-screen");
							}else {
								$(".mask").hide();
								$(".loading-wrap").hide();
								$("html").removeClass("nature-screen");
								
								alert("保存失败，请重试！");
							}
						}
					}
				}
			});
			
			
		}
	 });
	
	
	//加载
	var getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) 
        	return unescape(r[2]); 
        return null;
    };
    var bannerId = getUrlParam("id");
    if (bannerId) {
    	$.getJSON("/banner/" + bannerId + ".json",null, function(data){
    		if (data && data.banner) {
    			var json = data.banner; 
    			$jsondom = $.jsondom.bind(json, $form);
    			
    			var idx = 0;
    			$(json.images).each(function(){
    				banner.insertImage($.extend({}, this, {"idx" : idx++}));
    			});
    			idx = 0;
    			$(json.fonts).each(function(){
    				banner.insertFont($.extend({}, this, {"idx" : idx++}));
    			});
    			
    			$banner.css("width", json.width + "px").css("height", json.height + "px")
    				.css("background-image", "url('" + json.background + "')");
    			
    			$(">data [name=id]", $banner).val(json.id);
    			$(">data [name=background]", $banner).val(json.background);
    			$(">data [name=render]", $banner).val(json.render);
    			$(">data [name=width]", $banner).val(json.width);
    			$(">data [name=height]", $banner).val(json.height);
    			
    			var base = $(".tourist_line");
    			$("[name=tag]", base).val(json.tag);
    			$("[name=name]", base).val(json.name);
    			$("[data-name=touristLine] [name=id]", base).val(json.touristLine.id);
    			if ($current) {
    				$current.dblclick();
    			}
    		}
    	});
    } else {
    	$jsondom = $.jsondom.bind({}, $form);
    }
    
    
});