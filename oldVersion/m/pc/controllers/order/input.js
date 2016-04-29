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
			var price,discount=0;
			var priceArray = [];
			var priceSum = 0;

			$(".money-list .J-people:visible").each(function(i, el) {
				num = parseInt($(this).find(".J-selectNum").text());
				price = parseInt($(this).find(".J-selectId").text());
				priceArray.push(num*price);
			});
			//优惠金额
			if($(".J-discount").text() != ""){
				discount=parseInt($(".J-discount").text());
			}
			priceArray.map(function(value, index,array) {
				return priceSum += value;
			})
			priceSum=priceSum-discount;
			$(".J-allMoney").text(priceSum);

			
					
		},
		/**
		 * [rightStatus description] 结算信息的 num price rebate minus dataId 的参数的传递
		 * @return {[type]} [description]
		 */
		rightStatus:function(){
			var obj = $(".add-travel-info .add-number");
			var parentObj;
			var className;
			var val;
			var money;
			var priceClassName;
			var dataId;
			var rebate;//定义返利的变量
			var minus;//定义红包的变量

			for (var i = 0; i < obj.length; i++) {
				val = obj.eq(i).val();
				parentObj = obj.eq(i).parents("li");
				className = parentObj.attr("class");
				priceClassName = $("[price=price]",parentObj).attr('class');
				money = $("[price=price]",parentObj).text();
				dataId = $("[price=price]",parentObj).attr('data-id');


				$(".money-list").find("."+className).find('.J-selectNum').text(val);
				$(".money-list").find("."+priceClassName).text(money);
				$(".money-list").find("."+priceClassName).attr('data-id', dataId);


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
					_this.checkCoupon();
				},
				min:1
			});
			$("[name=childNum],[name=childYesNum],[name=childNoNum]").plusminus({
				callBack:function(){
					_this.checkCoupon();
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

							_objClassName    = _obj[passengerType];//获取类名
							_parentClassName = _objclass[_objClassName]//父级类
							
							$(".add-travel-info").find("."+_parentClassName).show();
							$(".add-travel-info").find("."+_objClassName).html(passengerPrice).attr({
								"data-id": passengerId,

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
							datePrices.push({id:vvv.id,type:vvv.type,price:vvv.price});//get id type price rebate minus data
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
					_this.checkCoupon();
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
		checkCoupon:function(){
			var _this = this;
			 $(".couponMoney").hide();
             $(".J-discount").text('');
		     _this.orderCheckout();
             $(".discount-list p.info,.discount-list p.error").remove();
			 var allMoney=parseInt($(".order-con .J-allMoney").text()),mes="";
             var $coupon=$(".discount-tab").find("input[type='text']");
             var regex= /^[0-9]{16}$/;
             var checked=$(".J-use").hasClass("active");
            if(checked){
            	if( !regex.test($coupon.val())){
                    $coupon.focus();
                    mes='<p class="error fa fa-exclamation-circle">&nbsp;请输入16位纯数字优惠码</p>';
                    $(".discount-list").append(mes);
                }else{
                	$.ajax({
	                    url: '/coupon/check.json?',
	                    type: 'POST',
	                    dataType: 'json',
	                    data:{'code':$coupon.val(),'price':allMoney}
                    })
                    .done(function(option) {
                        var success=option.result;
                        var couponCodeInfo=option.couponCodeInfo;
                        if(couponCodeInfo){
                            var coupon=couponCodeInfo.coupon;
                            $('[name="couponCodeId"]').val(couponCodeInfo.couponCodeId);//优惠码ID
                            $(".J-discount").text(coupon.couponRule.discountMoney);
                            $(".couponMoney").show();
                            mes='<p class="info fa fa-check-circle">&nbsp;已省'+coupon.couponRule.discountMoney+"(满"+coupon.couponRule.consumeMoney+'减'+coupon.couponRule.discountMoney+')</p>';
                        }
                        else{
                            mes='<p class="error fa fa-exclamation-circle">&nbsp;'+option.result.message+'</p>';
                        }
                        _this.orderCheckout();
                        $(".discount-list").append(mes);
                    })
                    .fail(function() {
                        mes='<p class="error fa fa-exclamation-circle">&nbsp;'+'请求失败，请重试!'+'</p>';
                        $(".discount-list").append(mes);
                    });
                }
            }
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
			}).on('click', '.J-unuse,.J-use', function() {
                //coupons toggle event
                var obj = $(this).attr('class');;
                $(this).addClass('active').siblings().removeClass('active');
                $(".discount-list p.info,.discount-list p.error").remove();
                $(".discount-tab input.form-control").removeClass("error");
                $(".couponMoney").hide();
	            $(".J-discount").text('');
                $('[name="couponCodeId"]').val('');
            	$('[name="userCoupon"]').val("");
            	_this.orderCheckout();
            	if ($('.J-use').hasClass('active')) {
                	$(".discount-tab input").attr("required","true");
                    $(".discount-tab").show();
                }else{
                    $(".discount-tab").hide();
                    $(".discount-tab input").removeAttr("required");
                }

            }).on('click', '.discount-tab .J_query', function() {
            	_this.checkCoupon();
            }).on("click",'.discount-tab .gm-close',function(){//清除优惠码
            	$(".couponMoney").hide();
	            $(".J-discount").text('');
			     _this.orderCheckout();
                $('[name="couponCodeId"]').val('');
                $(".discount-list p.info,.discount-list p.error").remove();
            	$('[name="userCoupon"]').val("");
            }).on("input",".discount-tab input[type=text]",function(){
				$(".couponMoney").hide();
	             $(".J-discount").text('');
			     _this.orderCheckout();
			});
		}
	};
	
	controller.call();

}(new this.jSharp.controller());