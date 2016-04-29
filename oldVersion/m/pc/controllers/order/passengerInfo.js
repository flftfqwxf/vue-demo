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

			this.storeData();
		},
		/**
		 * [globalError description] order submission failed global prompt
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
		 * [defaulttelphone description] initial phone number verification
		 * @return {[type]} [description]
		 */
		defaulttelphone:function(){
			var _len = $(".J-passenger-input").find(".travel-list").length;

			if (_len === 1) {
				$(".J-telephone").attr("required","true");
			}

		},
		/**
		 * [storeData description] Define an array of passenger information
		 * @return {[type]} [description]
		 */
		storeData:function(){
			window.passengerData = [];
			var obj = $(".J-passenger-select").find("input")
			var _len = $(".J-passenger-select li").length;
			for (var i = 0; i < _len; i++) {

				/*passengerData[i] = $.parseJSON(obj.eq(i).attr("data"));*/
				passengerData.push($.parseJSON(obj.eq(i).attr("data")))

			}
			/*console.log(passengerData);*/
		},
		/**
		 * [repeatedTel description] when the number of passengers is greater than one on the phone number to verify
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
		 * [repeatedCard description] when the number of passenger is greater than one on the duplicate of identification number to verify
		 * 当旅客人数大于1 证件号码填写的重复进行判断
		 * @param  {[obj]}  [description] object $(".J-card:visible")
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
		 * [successSubmit description] form submission verify
		 * @return {[true]} [description] form submission successfully
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
			    		if (_status == false) {

			    			return false;
			    		}
			    		
			    	}


					if ($(".J-passenger-select label.active").size()>0) {
						window.cardDataArray = [];
						var _len = $(".J-passenger-input .travel-list").length;
						var _typeObj = {"1":"idCard","2":"passport","3":"gangAoPermit","4":"taiwanPermit"};
						
						for (var i = 0; i < _len; i++) {
							var _obj = {};
							var _val=$(".J-passenger-input .travel-list").eq(i).find(".J-cardNum").val();
							/*var typeCard = Object.keys(_obj[val]);*/
							var _typeCard = _typeObj[_val];
							var _value = $(".J-passenger-input .travel-list").eq(i).find(".J-card:visible").val();
							_obj.id = parseInt($(".J-passenger-input .travel-list").eq(i).find(".pro-id").val());
							_obj[_typeCard] = _value;
							cardDataArray.push(_obj);
						}
						console.log(cardDataArray);
						var _passengerDataLen = passengerData.length;
						var _cardDataArrayLen = cardDataArray.length;
						var _cardtype;
						var _status = true;
						var _cardTypeObj = {"idCard":"身份证","passport":"护照","gangAoPermit":"港澳通行证","taiwanPermit":"台湾通行证"};
						for (var i = 0; i < _passengerDataLen; i++) {

							for (var m = 0; m < _cardDataArrayLen; m++) {
								_cardtype = Object.keys(cardDataArray[m])[1];
								console.log(passengerData[i][_cardtype]);
								if (passengerData[i][_cardtype] == cardDataArray[m][_cardtype]&&passengerData[i]["id"] !== cardDataArray[m]["id"]) {
									var _name = passengerData[i]["name"];
									var _cardText = _cardTypeObj[_cardtype];
									$(".J-passenger-input .travel-list").eq(m).find(".J-card:visible").showMsg("证件与"+_name+_cardText+"一致,请重新输入或勾选"+_name)
									_status = false;
								}
								
							}
						}

						return _status;
						
					}

			    	
			    }
			});
		},
		/**
		 * [defaultinput description] initialization hk an tw choice
		 * 初始化香港澳门台湾的input的显示和隐藏
		 * @return {[type]} [description]
		 */
		defaultinput:function(){
			var _dataValue = $("#province").attr("data-value");
			$("input[data-value="+_dataValue+"]").show().siblings("input").hide();
		},
		/**
		 * [addPassengerInfo description] passenger information data 
		 * @param {[type]} _travelList [description] object $(".J-passenger-input .travel-list")
		 * @param {[type]} i           [description] for parameter
		 * @param {[type]} data        [description] passenger information data
		 */
		addPassengerInfo:function(_travelList,i,data){
			_travelList.eq(i).find('[name="passengers\['+i+'\].id"]').val(data.id);
			if (_travelList.hasClass('china')) {
				//如果是国内  需要添加的数据
				_travelList.eq(i).find('[name="passengers\['+i+'\].name"]').val(data.name);
				_travelList.eq(i).find('[name="passengers\['+i+'\].idCard"]').val(data.idCard);
				_travelList.eq(i).find('[name="passengers\['+i+'\].contact"]').val(data.contact);

			}else if (_travelList.hasClass('foreign')) {
				//如果是国外 需要添加的数据
				_travelList.eq(i).find('[name="passengers\['+i+'\].name"]').val(data.name);
				_travelList.eq(i).find('[name="passengers\['+i+'\].lastName"]').val(data.lastName);
				_travelList.eq(i).find('[name="passengers\['+i+'\].firstName"]').val(data.firstName);
				if ($('[name="passengers\['+i+'\].passport"]').size()>0) {

					_travelList.eq(i).find('[name="passengers\['+i+'\].passport"]').val(data.passport);

				}else{

					_travelList.eq(i).find('[name="passengers\['+i+'\].gangAoPermit"]').val(data.gangAoPermit);
					_travelList.eq(i).find('[name="passengers\['+i+'\].taiwanPermit"]').val(data.taiwanPermit);

				}
				if (data.genderCode == 1) {
					_travelList.eq(i).find(".sex").find("label").eq(0).addClass("active").siblings("label").removeClass('active');

				}else if(data.genderCode == 2){
					_travelList.eq(i).find(".sex").find("label").eq(1).addClass("active").siblings("label").removeClass('active');

				}
				_travelList.eq(i).find('[name="passengers\['+i+'\].contact"]').val(data.contact);

			}
		},
		/**
		 * [checkEmpty description] judge the input of passenger information is empty.
		 * 旅客信息表单input值循环判断是否为空，获取返回值;
		 * @param  {[type]} _travelList [description] object $(".J-passenger-input .travel-list");
		 * @param  {[type]} i           [description] i
		 * @return {[type]}             [description] _travelList.length
		 */
		checkEmpty:function(_travelList,i){
			var isEmpty=true;
			
			_travelList.eq(i).find(".J-input-empty").each(function(){

				if ($.trim($(this).val())!=="") {
					isEmpty=false;
					return true;
				}
			})
			return isEmpty;
		},
		event:function(){
			var _this = this;

			$(document).on("click",".J-empty",function(){
				//清空用户填写的数据
				var _travelList = $(".J-passenger-input .travel-list");
				var _value = $(this).parents("li").find(".pro-id").val();
				var _obj = $(".J-passenger-select li");
				$(this).parents("li").find(".J-input-empty").val("").removeClass('error');
				$(this).parents("li").find("p.error").hide();
				if (_value !== "") {
					for (var i = 0; i < _obj.length; i++) {
						if (_value == _obj.eq(i).find('input').attr("data-id")) {
							_obj.eq(i).find('input').removeAttr('checked');
							_obj.eq(i).find('input').parent("label").removeClass('active').removeClass('done');
						}
					}
				}

			}).on("click",".J-list-more",function(){

				//passenger information list display an hidden.
				var _text = $(this).find("span").html();
				if (_text == "更多") {

					$(this).find("span").html("收起");
					$(this).find("i").removeClass('fa-caret-down').addClass('fa-caret-up');
					$(".passenger-select ul").css('height', 'auto');

				}else if (_text == "收起") {

					$(this).find("span").html("更多");
					$(this).find("i").removeClass('fa-caret-up').addClass('fa-caret-down');
					$(".passenger-select ul").css('height', '32px');

				}

			}).on('click', '.J-passenger-select label', function() {
				//旅客选择和参数的传递
				var _travelList = $(".J-passenger-input .travel-list");
				var _passengerInputLen = _travelList.find(".J-input-empty").length/_travelList.length;
				var data = $.parseJSON($(this).find('input').attr("data"));
				/*data = {contact: "111", id: 63, idCard: "111", name: "111", passport: "111", gangAoPermit: "111", taiwanPermit: "111", gender: "2", lastName: "111", firstName: "111"}*/
				
				if ($(this).hasClass('done')) {
					//取消勾选 以及删除所涉及到的数据
					$(this).removeClass("done").removeClass("active");
					var proId = data.id;
					for (var i = 0; i < _travelList.length; i++) {
						if (proId == _travelList.eq(i).find('[name="passengers\['+i+'\].id"]').val()) {
							//清空当前旅客信息
							
							_travelList.eq(i).find(".J-input-empty").val("").removeClass('error');
							_travelList.eq(i).find("p.error").hide();
						}
					}
					return false;
					
				}else{

					var _len = $(".J-passenger-select").find("label.done").length;

					for (var i = 0; i < _travelList.length; i++) {
						$(this).addClass('done').addClass("active");
						var passengerInfo = [];
						//检查是否为空
						var passengerStatus=_this.checkEmpty(_travelList,i);
						if(passengerStatus){
							_travelList.eq(i).find('input').removeClass('error');
							_travelList.eq(i).find('p.error').hide();
							_this.addPassengerInfo(_travelList,i,data);
							return false;
						}else{

							if (_len == _travelList.length) {
								$(this).removeClass("done").removeClass("active");
								return false;

							}else if(_len < _travelList.length){
								$(this).removeClass("done");
								continue;
							}
						}
					}
				}
			}).on('click', '.J-dropdown-menu a', function() {
				/*港澳台input判断*/
				var _value = $(this).attr("data-value");
				var _obj = $(this).parents(".J-dropdown-menu");
				_obj.siblings(".J-cardButton").attr("data-value",_value);
				_obj.siblings('.J-cardNum').val(_value);
				_obj.parents(".dropdown").siblings("input[data-value="+_value+"]").show().siblings(".J-card").hide();

			}).on('blur.defined', '.J-telephone', function() {
				/*$(this).parents(".travel-list").siblings("li").find(".J-telephone").siblings("p.error").remove();*/
				$(".J-telephone").next("span.title").removeClass('error');
			});
		}
	};
	
	controller.call();

}(new this.jSharp.controller());