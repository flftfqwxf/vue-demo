$(function(){
	// 推广
	var $advImageShow = $("#advImageShow");
	var $advLinkShow = $("#advLinkShow");

	$('.productProm').on('click', function(){
		var advLinkUrl = $(this).parent().find(".advLinkUrl").val();
		var advBannerImage = $(this).parent().find(".advBannerImage").val();
		if("" != advBannerImage && null != advBannerImage){
			$advImageShow.find(".prom_img").attr("src", advBannerImage + '@167w_180h_4e_248-248-248bgc');
			$advImageShow.find(".downImage").attr("href", "/download?file="+encodeURIComponent(advBannerImage)+"&name="+encodeURI("广告图"));
			$advImageShow.find(".showQrcode").attr("attr_ct", advBannerImage);
		}else{
			$advImageShow.hide();
		}
		if("" != advLinkUrl && null != advLinkUrl){
			$advLinkShow.find(".links_text").html(advLinkUrl);
			$advLinkShow.find(".promUrlCopy").attr("attr_url", advLinkUrl);
			$advLinkShow.find(".showQrcode").attr("attr_ct", advLinkUrl);
			$advLinkShow.show();
		}else{
			$advLinkShow.hide();
		}

		$.dialog({
			title: '产品推广<small>由供应商提供的广告，您可直接用于宣传推广</small>',
	        isOuterBoxShadow: false,
	        width: 480,
	        lock: true,
	        fixed: true,
			content: $('#dialog_promotion').html(),
			init: function(){
				var self = this;
				var wrap = self.DOM.wrap;
				//wrap.find('.aui_footer').hide();
				wrap.find(".promUrlCopy").zclip({
					path: WEB_STATIC + "/common/plugins/jqueryui/zclip/ZeroClipboard.swf",
					copy: function(){ return $(this).attr("attr_url"); },
					beforeCopy:function(){},
					afterCopy:function(){
						$.alert("复制成功", false, null, null, (self.config.zIndex+1));
					}
				});
			}
		});
	});
	
	$('body').on('click', '.aui_content .showQrcode', function(){
		var content = $(this).attr("attr_ct");
		if(content.indexOf("http://") != 0){
			content = "http://" + content;
		}
		if(null != content && "" != content){
			var $qrcode = $(this).parents('li').find('.qrcode');
			$qrcode.show();
			//$qrcode.find('.qrcode_img').qrcode({render:'table', width: 125,height: 125,text: content});
			$qrcode.find('.qrcode_img').html("<img src=\"/qrcode?text="+encodeURIComponent(content)+"&width=125&height=125\"/>");
			$qrcode.find('.qrcode_close').click(function(){
				$qrcode.find('.qrcode_img').html("");
				$(this).parent().hide();
			});
		}
	});


	// 下架提示详情 start
	$('#showTips').on('click', function(){
		$.dialog({
			title: false,
			isClose: false,
	        width: 384,
	        minHeight: 200,
	        isOuterBoxShadow: false,
	        content: $('#removePro_tpl').html(),
	        lock: true,
	        fixed: true,
			button: [
				{
					name: '我知道了',
					className: 'btn-process',
					callback: function () {
						//changeRemoveInfo();
					}
				}
			]
		});
	});





var keepModifypPriceId = {},
	warpBox = $(".m-btn-w.active"),
	recordFiltrAll = false,
	filterTotal = parseInt($(".filterTotal").val()),
	ajaxParamObj = {},
	f = 0;

		// 新增的批量改价
	$('.modify_Price_box').on('click', function(){
		$.dialog({
			title: "批量设置直客加价",
			isClose: true,
	        width: 400,
	        minHeight: 230,
	        isOuterBoxShadow: false,
	        content: '<form name="modifyPrice" id="modifyPrice" action method="put"><label for="">直客加价</label> <input type="text" class="form-control form-control-m  validate[required,custom[number],min[0],max[10000000]]" data-errormessage-value-missing="价格不能为空" data-errormessage-custom-error="价格错误" placeholder="输入数字" /></form>',
	        lock: true,
	        fixed: true,
			button: [
				{
					name: '关闭',
					callback: function(){
						// console.log('cancle');
					}
				},
				{
					name: '确定',
					className: 'btn-process',
					callback: function () {
						var modifyPrice = $(".form-control-m").val(),
						    L = $(".m-btn-w");

						if(!$('#modifyPrice').validationEngine('validate')) return false;
						if(filterTotal && !recordFiltrAll){
							for(var i=0;i<L.length;i++){
								if((i!==0) && L.eq(i).hasClass('active')){
									keepModifypPriceId[f++] = parseInt(L.eq(i).find("input[type='checkbox']").attr("data-id"));
								
								}
								
							}
						}

						recordFiltrAll ? ajaxParamObj['type'] = "all" : ajaxParamObj['itemIds'] = keepModifypPriceId ;
						recordFiltrAll ? delete ajaxParamObj.itemIds : delete ajaxParamObj.type;  
						ajaxParamObj['price'] = modifyPrice;
						ajaxParamObj['format'] = "json";
						if(getUrlParam() !== "notFilter"){
							ajaxParamObj = $.extend({},ajaxParamObj,getUrlParam());
						} 

						 subModifyData(ajaxParamObj,function(data){
							$.gmMessage(data.result.message, data.result.success);
						 	if(data.result.success){
						 		location.reload();
						 	}
						 },function(){
						 	$.gmMessage("修改失败，请稍后重试");
						 });


						
					}
				}
			]
		});
		return false;
	});


	function subModifyData(data,success,error){
		$.ajax({
			url: '/item/price',
			type: 'POST',
			data: data,
			success:success,
			error:error
		})
		
		
	}

	function getUrlParam(){
		var url = window.location.href,
		    splitJson = {};
		if(!url.split("?")[1]){
			return "notFilter";
		}
		var t = url.split("?")[1].split("&");
		for(var i=0;i<t.length;i++){
			var c = t[i].split("=");
			splitJson[c[0]] = c[1];
		}
		return splitJson;

	}


	// 批量改价的事件
	
	$(".m-btn-w").on("click",function(){
		var t = $(".m-btn-w").eq(0).hasClass('active'),
		isFirst = $(this).hasClass('first-temp');

		if(!t && isFirst){
			$(".m-btn-w").not($(".m-btn-w").eq(0)).addClass('active');
			$(".modify_Price_box").removeAttr("disabled");
			$(".currentProduct").show();
			$(".currentProduct").find('em').text($(".m-btn-w.active").length);
			recordFiltrAll = false;
		}else{
			if(!isFirst){

				$(".m-btn-w").eq(0).removeClass('active');
				$(".modify_Price_box").removeAttr("disabled");
				setTimeout(function(){
					var s = $(".m-btn-w.active").length;
					!s && $(".modify_Price_box").attr("disabled","disabled");
				}, 10);


			}else{
				$(".m-btn-w").not($(".m-btn-w").eq(0)).removeClass('active');
				 $(".modify_Price_box").attr("disabled","disabled");
				
				
			}
			$(".totalProduct").hide();
			$(".currentProduct").hide();
			recordFiltrAll = false;
			
		}

	})


	$(".currentProduct a").on("click",function(){	
		$(".currentProduct").hide();
		$(".totalProduct").show();
		recordFiltrAll = true;
	})

	$(".totalProduct a").on("click",function(){
		$(".currentProduct").show();
		$(".totalProduct").hide();
		recordFiltrAll = false;
	})



	// 下架提示详情 end

	var itemForm = document.getElementById("itemForm");
	$(".list_search_but").click(function(){
		// Placeholders.disable(itemForm);
		$("#itemForm").submit();
	});
	
	$('[name="lineId"]').change(function(){
		// Placeholders.disable(itemForm);
		$('[name="playOptionId"]').eq(0).attr('checked', true);
		$("#itemForm").submit();
	});
	$('[name="playOptionId"], [name="supplierId"]').change(function(){
		// Placeholders.disable(itemForm);
		$("#itemForm").submit();
	});

});
