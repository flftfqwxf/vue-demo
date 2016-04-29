;!function(controller) {
	//use strict
	'use strict';
	controller.using("jquery");
	controller.using("tools");
	controller.using("compare");
	controller.using("template");
	controller.using("eDate");
	controller.using("eValidate");
	controller.using("dialog");
	

	controller.modules={
		init : function(){

			this.event();

			this.peopleNum();

			this.timeCheck();

			this.successReg();

			this.globalError();

			this.rightStatus();

		},
		/**
		 * [orderCheckout description]total order price
		 * @return {[type]} [description]
		 */
		orderCheckout:function(){
			var _this = this;
			_this.rightStatus();

			//人数
			var num;

			//总价
			var price;
			var priceArray = [];
			var priceSum = 0;

			
			$(".money-list .J-people:visible").each(function(i, el) {
				num = parseInt($(this).find(".J-selectNum").text());
				price = parseInt($(this).find(".J-selectId").text());
				priceArray.push(num*price);
			});
			


			priceArray.map(function(value, index,array) {
				return priceSum += value;
			})

			_this.rebate(priceSum);//返利
			_this.minus(priceSum);//红包

			var rebate = parseInt($(".J-discountNum").text());

			if ($(".J-discount-select label").find("input").is(':checked')) {

				$(".J-discount").show();
				$(".J-allMoney").text(priceSum-rebate);

			}else{
				$(".J-discount").hide();
				$(".J-allMoney").text(priceSum);
			}
			
					
		},
		/**
		 * [rebate description] total rebate price
		 * @return {[type]} [description]
		 */
		rebate:function(priceSum){
			//返利
			/*var num;
			var rebate;
			var rebateArray = [];
			var rebateSum = 0;

			$(".money-list .J-people:visible").each(function(i, el) {
				num = parseInt($(this).find(".J-selectNum").text());
				rebate = parseInt($(this).find(".J-selectId").attr("rebate"))//返利
				rebateArray.push(num*rebate);
			});

			rebateArray.map(function(value, index) {
				return rebateSum += value;
			})*/
			var rebatePercent = $("[name=rebatePercent]").val();
			var rebateSum = parseInt(priceSum*rebatePercent/100);
			$(".J-rebate").text(rebateSum);
		},
		/**
		 * [rebate description] total minus price
		 * @return {[type]} [description]
		 */
		minus:function(priceSum){
			//红包
			/*var num;
			var minus;
			var minusArray = [];
			var minusSum = 0;

			$(".money-list .J-people:visible").each(function(i, el) {
				num = parseInt($(this).find(".J-selectNum").text());
				minus = parseInt($(this).find(".J-selectId").attr("minus"));//红包
				minusArray.push(num*minus);
			});

			minusArray.map(function(value, index) {
				return minusSum += value;
			})*/
			/*console.log(minusArray)*/
			var minusPercent = $("[name=minusPercent]").val();
			var minusSum = parseInt(priceSum*minusPercent/100);
			var haveDiscount = parseInt($(".J-have-discount").text());

			$(".J-useminus").text(minusSum);

			if (minusSum <= haveDiscount) {
				$(".J-currentuseable").text(minusSum);
				$(".J-discountNum").text(minusSum);
			}else{
				$(".J-currentuseable").text(haveDiscount);
				$(".J-discountNum").text(haveDiscount);
			}
			
			
		},

		/**
		 * [rightStatus description] 结算信息的 num price rebate minus dataId 的参数的传递
		 * @return {[type]} [description]
		 */
		rightStatus:function(){
			var obj = $(".add-travel-info .add-number");
			var parentClassObj = ["J-adult","J-child","J-child-no","J-child-yes"];
			var priceClassObj = ["J-adultPrice","J-childPrice","J-childNoPrice","J-childYesPrice"];
			var parentObj;
			var className;
			var val;
			var money;
			var priceClassName;
			var dataId;
			//var rebate;//定义返利的变量
			//var minus;//定义红包的变量

			for (var i = 0; i < obj.length; i++) {
				val = obj.eq(i).val();
				parentObj = obj.eq(i).parents("li");
				className = parentClassObj[i];
				priceClassName = priceClassObj[i];
				money = $("[price=price]",parentObj).text();
				dataId = $("[price=price]",parentObj).attr('data-id');
				//红包属性
				//rebate = $("[price=price]",parentObj).attr("rebate");
				//返利属性
				//minus = $("[price=price]",parentObj).attr("minus");

				$(".money-list").find("."+className).find('.J-selectNum').text(val);
				$(".money-list").find("."+priceClassName).text(money);
				$(".money-list").find("."+priceClassName).attr('data-id', dataId);
				//获取红包的值
				//$(".money-list").find("."+priceClassName).attr('rebate', rebate);
				//返利属性
				//$(".money-list").find("."+priceClassName).attr('minus', minus);

				if (val == 0||parentObj.is(':hidden')) {
					$(".money-list").find("."+className).hide();
				}else{
					$(".money-list").find("."+className).show();
				}
			}
		},
		/**
		 * [peopleNum description] 初始化人数
		 * @return {[type]} [description]
		 */
		peopleNum:function(){
			var _this = this;
			$("[name=adultNum]").plusminus({
				callBack:function(){
					_this.orderCheckout();

				},
				min:1
			});
			$("[name=childNum],[name=childYesNum],[name=childNoNum]").plusminus({
				callBack:function(){
					_this.orderCheckout();
				}
			});
		},
		/**
		 * [timeCheck description] time plugins
		 * @return {[type]} [description]
		 */
		timeCheck:function(){
			var id = parseInt($("[name=productId]").val()),
				_this=this;
			
			 $.getJSON("/product/"+ id +"/prices?format=json",
			function(serverData) {
				var prices = serverData && serverData.productPrices || [];
				//json 格式
				/*{"product":{"tourType":"group"},
					"productPrices":[{
						"date":"2016-12-31 00:00:00",
						"dateGroupPrices":[{
							"airline":null,
							"departure":null,
							"prices":[{
								"extraPrice":0.00,
								"hotels":[],
								"price":4380,
								"remark":null,
								"type":"成人价"
							}],
							"remark":null,"ship":null,"shippingLine":null
						}],
						"minPrice":4380,"priceNumber":1

					}]
				}*/
				//日期选择器
				$("[name=departureDate]").eDate({
					months: 2,
					direction: 'future',
					disablePreviousYear: true,
					disableNextYear: true,
					format: "YYYY年MM月DD日",
					disabled: function (date) {
						  var disabled=true;
						  for(var i=0;i<prices.length;i++){
							  if(prices[i].date.replace(" 00:00:00", "")==eDate.moment(date).format("YYYY-MM-DD")){
							disabled=false;
							break;
							  }
						  }
						  return disabled;
					},
					onSelected: function(date) {
						var dateId = date.replace("年", "-").replace("月", "-").replace("日", ""),
							dateDom=$(".e-in-month[data-date=" + dateId + "].e-active"),
							datePrices=dateDom.attr("prices")?$.parseJSON(dateDom.attr("prices")):[];
						var passengerId,rebateVal,minusVal,passengerPrice,passengerType;
						var _obj = {"成人价":"J-adultPrice","儿童价":"J-childPrice","儿童占床":"J-childYesPrice","儿童不占床":"J-childNoPrice"};
						var _objclass = {"J-adultPrice":"J-adult","J-childPrice":"J-child","J-childYesPrice":"J-child-yes","J-childNoPrice":"J-child-no"};
						var _objClassName;
						var _parentClassName;
						$(".J-child").hide();
						$(".J-child-yes").hide();
						$(".J-child-no").hide();
						for (var i = 0; i < datePrices.length; i++) {
							passengerType    = datePrices[i].type;//成人还是儿童的类型
							passengerPrice   = datePrices[i].price;//价格
							passengerId      = datePrices[i].id;//id
							//rebateVal        = datePrices[i].rebate;//红包
							//minusVal         = datePrices[i].minus;//返利
							_objClassName    = _obj[passengerType];//获取类名
							_parentClassName = _objclass[_objClassName]//父级类
							
							$(".add-travel-info").find("."+_parentClassName).show();
							$(".add-travel-info").find("."+_objClassName).html(passengerPrice).attr({
								"data-id": passengerId,
								//"rebate": rebateVal,
								//"minus": minusVal,
							});
							
						}

						_this.orderCheckout();

						$("[name=departureDate]").val(date);

						
					},
					drawCompate: function() {
						var date, pricesDetail,dateDom,datePrices;
						$("span[data-date]").removeAttr("data-original-title");
						$(".e-in-month.e-active").attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", "提交订单后客服将会联系您确认该日报价");
						$(prices).each(function(i, v) {
							date = v.date.replace(" 00:00:00", "");
							dateDom=$(".e-in-month[data-date=" + date + "].e-active");
							datePrices=[];
							pricesDetail = $(v.dateGroupPrices[0].prices).map(function(iii, vvv) {
							datePrices.push({id:vvv.id,type:vvv.type,price:vvv.price});//,rebate:vvv.rebate,minus:vvv.minus get id type price rebate minus data
								return vvv.type + "：￥" + vvv.price;
							}).get().join(" ");

							dateDom.attr("prices",JSON.stringify(datePrices)).attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", pricesDetail);
						});
					}
				});
			});
		},
		/**
		 * [orderInfo description] id and number of passengers to submit
		 * @return {[type]} [description]
		 */
		orderInfo:function(){

			var obj = $(".money-list li:visible");
			var orderArray = [];
			for (var i = 0; i < obj.length; i++) {
				var dataId = obj.eq(i).find(".J-selectId").attr("data-id");
				var dataNum = parseInt(obj.eq(i).find(".J-selectNum").html());
				orderArray.push(dataId+":"+dataNum);
			}

			$("[name=itemPrices]").val(orderArray.join(","));

		},
		/**
		 * [successReg description] reguler of submit form
		 * @return {[type]} [description]
		 */
		successReg:function(){
			var _this = this;
			$("#form-info").eValidate({
				submit:function(){
					_this.orderInfo();
					var _value = $("[name=departureDate]").val();
					_value = _value.replace("年","-").replace("月","-").replace("日","");
					$("[name=departureDate]").val(_value);
					return true;
				}

			});
		},
		/**
		 * [showDemoDialog description] product contact ajax request
		 * @return {[type]} [description]
		 */
		showDemoDialog:function() {
			var _orderId = parseInt($("#J-p-info").attr("data-id"));

			var url = "http://www.gmmtour.com/contract-product"; //产品合同
			var isOrder = "false";
			var data = {productId:_orderId,m:Math.random()}; 
			if(isOrder && isOrder == "true") {
				url = "http://www.gmmtour.com/contract-order/"+_orderId; //订单合同
				data = {m:Math.random()}; 
			}
		    $(function(){
		        $.ajax({
		            url:  url,
		            type: 'GET',
		            async: false,
		            dataType: 'html',
		            data:data
		        })
		        .done(function(result,response) {
			        $.dialog({
						title:"合同条款、补充协议",
						//title: false,
						width: 1001,
						height: 575,
						padding: 20,
						isOuterBoxShadow: true,
						//isClose: false,
						init:function(){
							
						},
						content: result,
						lock: true,
						fixed: true,
						ok: false,
						//cancelCssClass: 'btn-process',
						cancel: function () {
							$("#agree").attr("checked","checked");
							$(".submit-btn").removeClass('disable').removeAttr('disabled');
						},
						cancelVal: '我已认真阅读',
					});
		        })
		        .fail(function() {
		           $.showMsg("请重新点击，查看合同条款，补充协议。")
		        });
		    });
			
		},
		/**
		 * [globalError description] submit order failed global prompt
		 * @return {[type]} [description]
		 */
		globalError:function(){
			if ($.trim($(".global-error p").find("span").text()) !== "") {
				$(".global-error").fadeIn();
				setTimeout(function(){
					$(".global-error").fadeOut();
				},2000);
			};
		},
		/**
		 * [event description] default event
		 * @return {[type]} [description]
		 */
		event:function(){
			var _this = this;
			
			$(".J-contract").click(function(){
				//合同弹窗点击事件
				_this.showDemoDialog();
			})
			$(".J-discount-select label").click(function(){

				
				/*if ($(this).find("input").is(":checked")) {
					$(this).find("input").removeAttr("checked");
				}else{
					$(this).find("input").attr("checked","checked");
				}*/
				var checked = $(this).find('input').attr('checked');
				if (!checked) {
					$(this).find("input").attr("checked","checked");
				}else{
					$(this).find("input").removeAttr("checked");
				}
				_this.orderCheckout();
			});
			$(document).on('click', '#agree', function() {
				//我已阅读并接受合同条款、补充协议的点击事件
				var _status =$(this).attr("checked");
				if (_status == "checked") {
					$(".submit-btn").removeClass('disable').removeAttr('disabled');
				}else{
					$(".submit-btn").addClass('disable').attr('disabled', 'disabled');
				}
			}).scroll(function(){
	    		var scrollTop=$(window).scrollTop();
	    		if (scrollTop > 300) {
	    			$(".balance-info").addClass("fixed");
	    			$(window).resize(function(){
			    		//resize事件
			    		var winW=$(window).width();
			    		if ($(".balance-info").hasClass("fixed")) {
			    			
			    			$(".balance-info").css("right",(winW/2-549+"px"));
			    		}
			    	}).resize();

	    		}else{
	    			$(".balance-info").removeClass("fixed").removeAttr("style");
	    		}
			})
			
		}
	};
	
	controller.call();

}(new this.jSharp.controller());