;!function(controller) {
	//use strict
	'use strict';
	controller.using("e97Date");
	controller.using("tools");
	controller.using("compare");
	controller.using("template");
	controller.using("eValidate");


	controller.modules={

		init : function(){
			

			this.event();

			this.successSubmit();

			this.defaultinput();

			this.defaulttelphone();

			this.globalError();
		},
		/**
		 * [globalError description] 全局提交订单失败 提示
		 * @return {[type]} [description]
		 */
		globalError:function(){
			if ($.trim($(".global-error").find("span").text()) !== "") {
				$(".global-error").fadeIn();
				setTimeout(function(){
					$(".global-error").fadeOut();
				},2000);
			};
		},
		/**
		 * [defaulttelphone description] 初始化电话号码验证
		 * 
		 */
		defaulttelphone:function(){
			var _len = $(".J-passenger-input").find(".travel-list").length;

			if (_len === 1) {
				$(".J-telephone").attr("required","true");
			}

		},
		/**
		 * [repeatedTel description] 当旅客人数大于1  针对电话号码进行判断
		 * @return {[type]} [description]
		 */
		repeatedTel:function(){
			var telStatus = false;
			$(".J-telephone").each(function(){
	    		if ($.trim($(this).val()) !== "") {

	    			telStatus = true;
	    		}
	    	});
	    	if (telStatus === false) {
	    		$(".J-telephone").next("span.title").addClass("error");
	    	}
	    	return telStatus;
		},
		/**
		 * [repeatedCard description] 当旅客人数大于1 证件号码填写的重复进行判断
		 * @param  {[obj]}  [description] 证件对象
		 * @return {[type]} [description]
		 */
		repeatedCard:function(obj){
			var _this = this;
			var _cardStatus = true;
			_cardStatus = _this.repeatedTel();
			if (_cardStatus == false) {

				return _cardStatus;

			}else{
				var _cardValue = {},
				value;
				obj.each(function(){
					value = $(this).val();
					if (_cardValue[value]) {
						$(this).showMsg("您填写的证件号码重复！");
						_cardValue[value].showMsg("您填写的证件号码重复！");
						_cardStatus = false;
					}else{
						_cardValue[value] = $(this);
					}
				})
				return _cardStatus;
			}
			
		},
		/**
		 * @title form表单提交 验证
		 * @return {[true]} 验证成功 提交表单 
		 */
		successSubmit:function(){
			var _this = this;

			$("#form-info").eValidate({
			    submit:function(){
			    	$(".sex label.active").find("input").attr("checked","checked");
			    	var _length = $(".J-passenger-input").find(".travel-list").length;
					
			    	//当旅客人数大于1的时候进行电话号码为空和证件号码重复的验证
			    	if ($(".J-card:visible").size()>1) {

			    		var _status = true;
			    		var _obj = $(".J-card:visible");
			    		_status = _this.repeatedCard(_obj);
			    		return _status;	
			    	}	    	
			    }
			});
		},
		/**
		 * @title 港澳台select选择  form表单隐藏域datavalue传递 初始化港澳台input显示与隐藏
		 * @return {[type]}
		 */
		defaultinput:function(){
			var _dataValue = $("#province").attr("data-value");
			$("input[data-value="+_dataValue+"]").show().siblings("input").hide();
		},
		event:function(){
			var _this = this;

			$(document).on("click",".J-empty",function(){
				//清空用户填写的数据
				$(this).parents("li").find(".J-input-empty").val("").removeClass('error');
				$(this).parents("li").find("p.error").hide();

			}).on('click', '.J-dropdown-menu a', function() {
				/*港澳台input判断*/
				var _value = $(this).attr("data-value");
				var _obj = $(this).parents(".J-dropdown-menu");
				_obj.siblings(".J-cardButton").attr("data-value",_value);
				_obj.siblings('.J-cardNum').val(_value);
				_obj.parents(".dropdown").siblings("input[data-value="+_value+"]").show().siblings(".J-card").hide();

			}).on('blur.defined', '.J-telephone', function() {
				$(".J-telephone").next("span.title").removeClass('error');
			});
		}
	};
	
	controller.call();

}(new this.jSharp.controller());