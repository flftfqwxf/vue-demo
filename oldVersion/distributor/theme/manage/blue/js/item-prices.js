$(function(){
	// 价格设置
	var priceUrl;

	$('body').on('click', '.price-tt', function(){
		if($(this).hasClass('btn-info')) return false;
		if(!$('#priceSave').validationEngine('validate')) return false;

		$(this).parent().find('.btn-info').removeClass('btn-info').addClass('btn-default');
		$(this).removeClass('btn-default').addClass('btn-info');
		$('.price-list li').eq($(this).index()).show().siblings().hide();
	});

	$('.priceSet').on('click', function(){
		priceUrl = '/item/'+ $(this).attr("attr_id") + '/price';

		$.dialog({
			title: '修改价格',
			width: 300,
	        padding: '5px',
	        isOuterBoxShadow: false,
	        lock: true,
	        fixed: true,
			button: [
				{
					name: '取消',
					callback: function(){
						// console.log('cancle');
					}
				},
				{
					name: '保存',
					className: 'btn-process',
					callback: function(){
						if(!$('#priceSave').validationEngine('validate')) return false;

						var data = {};
						$("#priceSave .input-group").each(function(i){
							data["prices["+i+"].specifiedPrice"] = $(this).find(".specifiedPrice").val();
							data["prices["+i+"].tourPlanItemPrice.id"] = $(this).find(".tourPlanItemPrice").val();
						});

						$.post(priceUrl+'.json?v='+Date.parse(new Date()), data, function(data){
				    		$.gmMessage("操作成功", true);
				    		// window.location.replace(location.href);
				    	}).fail(function(){
							$.gmMessage("保存失败，请稍后重试");
						});
						
					}
				}
			],
			init: function(){
				var dialog = this;

				setTimeout(function(){
				$.ajax({
					url : priceUrl + '?v=' + Date.parse(new Date()),
		    		type: "GET",
		    		async:false,
		    		dataType: "html",
		    		success:function(data){
		    			dialog.content(data);
		    			$('#priceSave').validationEngine('attach', {
		    				promptPosition: 'centerLeft'
		    			});
		    		},
		    		error:function(){
		    			$.gmMessage("获取价格失败，请刷新重试！", true);
		    			dialog.close();
		    		}
				});
			}, 2000)
			}
		});
	});
	// 价格设置 end
});