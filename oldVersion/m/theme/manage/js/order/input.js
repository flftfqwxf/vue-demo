   //初始化日历	
		(function(){
	        var itemId= $("#item_id").val();
	        var clearDate=Date.parse(new Date());
	         $.ajax({
	             url: '/item/'+itemId+'/prices.json?v='+clearDate,
	             type: "GET",
	             async:false,
	             dataType: "json",
	             success:function(result){
	                 var type=result.item.product.tourType;
	                 var objDate=showColseDate(result);
	                 colseDate=objDate.colseDate;
	                 maxDate=objDate.maxDate;
	                 $.DatePrice({objId:"showDate", preDataDisabled:true,maxDate:maxDate, dayTdIdFixFun:function(data){
	                     if(null != data){
	                         showPrice(data);
	                     }
	                 }, 
	                 defaultData: result.item.itemCalendar, 
	                 initHandle : function(){
	                     getFormValue();
	                         var defaultSelect = $("#select-date").val();
	                         if ("" != defaultSelect && null != defaultSelect) {
	                             var this_date = new Date(defaultSelect);
	                             var this_day = this_date.getDate();
	                             var date_value=$("#gm-datePrice-day-" + this_day).attr("date-value");
	                             if(date_value ==defaultSelect){
	                                 $("#gm-datePrice-day-" + this_day).click();
	                             }
	                         } else{
	                             $('[date-value ="'+colseDate+'"]').click();
	                         }
	                         
	                     }
	                 });
	             }
	         });
	    })();		
		(function(){
			//隐藏提示信息
			$(".btn_ok").click(function(){
				$(".message_info").hide();
			});
			$(".btn_ok").click(function(){
				$(".message_info").hide();
			});
			
			$(".over_mask").click(function(){
				$(".coupon-select,.money_detail,.over_mask").hide();
			});
			//优惠券
			$(".J_couponShow").click(function(){
				$(".coupon-select,.over_mask").show();
			});
			$(".coupon-select .J_colse").click(function(){
				$(".coupon-select,.over_mask").hide();
			});
			//输入优惠码领取优惠码
			$(".J_coupon").click(function(){
				checkCoupon($(".coupon_code"));
			});
			/*$(".coupon_item3.usable").show();
			$(".coupon_item3.disabled").hide();
			$(".tab_item2").click(function(){
				var value=$(this).attr('data-value');
				$('.tab_item2').removeClass('active');
				$(this).addClass('active');
				if(value ==='0'){
					$(".coupon_item3.usable").show();
					$(".coupon_item3.disabled").hide();
				}else{
					$(".coupon_item3.usable").hide();
					$(".coupon_item3.disabled").show();
					var len=$(".coupon_item3.disabled").length;
					if(len < 1){
						$(".no-result").removeClass("hidden").show();
					}
				}
			});*/
			
			//勾选阅读协议事件
			var checked=true;
	       $('[for="argee"]').click(function(){
	           if(checked==true){
	        	   $("#agree").attr("checked",null);
	        	   checked=false;
	           }
	           else{
	        	   $("#agree").attr("checked","checked");
	        	   checked=true;
	           }
		    });
			//提交
			$("#submit_btn").click(function(){
				var str=[];
				$(".cus_num").each(function(){
					var id=$(this).find('[name="priceId"]').val();
					var count=$(this).find('.num_input').val();
					if(count == 0){
						return;
					}else{
						var s=id+":"+count;
						str.push(s);	
					}
				});
				$("#item_prices").val(str.join(","));
				var fl=checkForm();//验证
				if(!fl){
					return false;
				}
				if(fl){
					keepValue(null);
					$("#order_form").attr("action","/order/submit");
					$("#submit_btn").attr("disabled","disabled");  
					$("#order_form").submit();
				}
			});
			
			//显示订单费用详细
			var show=true;
			$(".J_moneyDetail").click(function(){
				if(show == true){
					$(".J_moneyDetail .gmIcon").removeClass("gm-up").addClass("gm-down");
					$(".money_detail,.over_mask").show();
					show=false;
				}else{
					$(".J_moneyDetail .gmIcon").removeClass("gm-down").addClass("gm-up");
					$(".money_detail,.over_mask").hide();
					show=true;
				}
			});

			//点击遮罩层隐藏所有
			$(".over_mask").click(function(){
				$(".J_moneyDetail .gmIcon").removeClass("gm-down").addClass("gm-up");
				$('.money_detail,.over_mask').hide();
				show=true;
			});
		})();
   
   
   
     //日期格式化
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }

	    //获取今天以后第一个团期,若提交失败，返回的是上一次所选提交的日期
	    var colseDate;//今天以后第一个团期
	    var maxDate;//获取最大团期
		function showColseDate(result){
            var array =result.item.itemCalendar;
            var now=new Date();
            var temp = [];
            
            for(var i=0;i<array.length;i++){
                var day=new Date(array[i].date.replace(/-/g,'/'));
                var m = (day.getTime()-now.getTime())/(1000*60*60);                
                if(m>=0){
                    temp.push(array[i]);
                }
            }
            temp=temp.sort(function(a,b){
                return new Date(a.date.replace(/-/g,'/')) > new Date(b.date.replace(/-/g,'/')) ? 1 : -1;
            });
            colseDate=new Date(temp[0].date.replace(/-/g,'/'));
            var len=temp.length;
            maxDate=new Date(temp[len-1].date.replace(/-/g,'/'));
            var departDate=$("#departureDate").val();
             if(new Date(departDate) != colseDate && departDate !=""){
                 colseDate=new Date(departDate).format("yyyy/MM/dd").toString()+" 00:00:00";
                 return {"colseDate":colseDate,"maxDate":maxDate};
             }else{
                 colseDate = colseDate.format("yyyy/MM/dd").toString()+" 00:00:00";
                 return {"colseDate":colseDate,"maxDate":maxDate};
             }
		 }
		
		//根据选中的日期显示相应的操作
		function showPrice(data){
            var today=new Date();
            today = today.format("yyyy-MM-dd").toString();
            today = new Date(today.replace(/-/g, "/"));
            var date = new Date(data.date.replace(/-/g,'/'));
            $("#select-date").val(data.date);
            var orderInfo= getFormPrice(),selectedGroups=null;
            if(orderInfo !=null && orderInfo.priceGroup.length > 0){
                selectedGroups=orderInfo.priceGroup;
            }
            
            if(today>date){
                return;
            }else{
                $("[name=departureDate]").val(date.format("yyyy-MM-dd"));
                var pricesGroup=data.dateGroupPrices;
                for(var i=0;i<pricesGroup.length;i++){
                    var prices=pricesGroup[i].prices;
                     var allMoney=0;
                     $(".cus_num").remove();
                     $("#calcMoney").empty();
                     var priceHtml="",detailPrice="",roomPrice="";
                    for(var j=0;j<prices.length;j++){
                        var initNum=0,manNum="";
                        if(prices[j].type.indexOf("成人") > -1){
                            initNum=2; 
                            manNum="manNum";
                        }
                        if(orderInfo !=null && selectedGroups != null && prices[j].id==selectedGroups[j].priceId){
                            initNum=selectedGroups[j].priceNum;
                        }
                        var thisData={"id":prices[j].id,"type":prices[j].type,"price":prices[j].price,"extraprice":prices[j].extraPrice,"initNum":initNum,"manNum":manNum};
                        priceHtml+=template("price_type", thisData); 
                        detailPrice+=template("detail_money",thisData);
                        roomPrice=template("room_price", thisData);//单房差只有一个
                    }
                    $("#priceType").append(priceHtml);
                    $("#priceType").append(roomPrice);
                    $("#calcMoney").append(detailPrice);
                    calcMoney();
                    //减少人数
                    $(".J_less").click(function(){
                        var $input=$(this).parent().find("input"),
                        val=parseInt($input.val()),
                        name=$input.attr("data-name");
                        if(val>0){
                            if(name == 'manNum' && val == 1){
                                return;
                            }
                            else{
                                var inputVal=val-1;
                                $input.val(inputVal);
                                var price=parseInt($(this).parent().parent().parent().find(".priceGroup .textBig").text());
                                var targetId=$(this).parent().parent().parent().find('[name="priceId"]').val();
                                checkCoupon($(".coupon_code"));
                                $('[data-id="'+targetId+'"]').find(".small_price").text("￥"+price+"x"+inputVal+"");
                                if(inputVal ==0){
                                    $('[data-id="'+targetId+'"]').css({"display":"none"});
                                }else{
                                    $('[data-id="'+targetId+'"]').css({"display":"block"});
                                }
                            }
                            
                        }
                    });
                    
                    //增加人数
                    $(".J_add").click(function(){
                        var $input=$(this).parent().find("input"),
                        val=parseInt($input.val());
                        inputVal=val+1,
                        name=$input.attr("data-name");
                        $input.val(inputVal);
                        var price=parseInt($(this).parent().parent().parent().find(".priceGroup .textBig").text());
                        var targetId=$(this).parent().parent().parent().find('[name="priceId"]').val();
                        $('[data-id="'+targetId+'"]').find(".small_price").text("￥"+price+"x"+inputVal+"");
                        $('[data-id="'+targetId+'"]').css({"display":"block"});
                        checkCoupon($(".coupon_code"));
                    });
                 }
            }
		 }
    
		//计算总价
		function calcMoney(){
			var priceArray=[],allMoney=0,discount=0;
			$('.cus_num').each(function(){
				var _this=$(this);
				if(_this.find(".priceGroup .textBig").text()){
					var price=parseInt(_this.find(".priceGroup .textBig").text()),
					num=parseInt(_this.find(".num_input").val());
					priceArray.push(price*num);
				}
			});
			if($("[name=couponCodeId]").val() !=""){
				discount=parseInt($('[name=couponCodeId]').attr("data-price"));
			}
			priceArray.map(function(value, index,array) {
				return allMoney += value;
			})
			$(".allMoney_base").html("<small>￥</small>"+allMoney);
			allMoney=allMoney-discount;
			$(".allMoney").html(allMoney);
		}
		
		/*隐藏提示信息*/	
		function warginInfo(obj,mes){
			var time=null;
			$(".waring_desc").html(mes);
			$(".waring_info").show();
			clearTimeout(time);
			time=setTimeout(function(){
				$(".waring_info").hide();
				obj.focus();
			},1500);
		}
		/*判断是否含有中文*/
		function  isChina(s){  
	        var  index = escape(s).indexOf("%u");  
	        if(index < 0){return false;}else{return true;}  
	    }  
		//表单验证
		function checkForm(){
			var name=$("#user_name").val(),
			phone=$.trim($("#phone").val()),
			cus_date=$.trim($("#departureDate").val()),
			email=$.trim($("#email").val()),
			num="",
			check=$("#agree").attr("checked");
			/*验证手机号是否合法*/
			var regex= /^0?(13[0-9]|15[0-9]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
			var emailRegex=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			var set=null;
			clearTimeout(set);
			
			if(cus_date==""){
				$(".waring_desc").html("您未选择出发时间");
				$(".waring_info").show();
				clearTimeout(set);
				set=setTimeout(function(){
					$(".waring_info").hide();
					$("html,body").stop().animate({scrollTop:0}, '500', 'swing');
				},1000);
				return false;
			}
			
			if(name =="" || !isChina(name)){
				warginInfo($("#user_name"),"请输入正确的中文姓名");
				return false;
			}
			if(phone==""){
				warginInfo($("#phone","手机号不能为空"));
				return false;
			}
			if(phone!="" && !regex.test(phone)){
				warginInfo($("#phone"),"您的手机号有误，请重新输入");
				return false;
			}
			if (check != 'checked') {
				warginInfo($("#agree"),"您未阅读/未接受合同条款");
				return false;
			}
			if(email !="" && !emailRegex.test(email)){
				warginInfo($("#email"),"您输入的电子邮件格式不正确");
				return false;
			}else{
				return true;
			}

		}
   
	    //点击查看合同条款，补充条款后，
	    function keepValue(url){
	        var priceGroup=[];
	        var name=$("#user_name").val(),
	        phone=$("#phone").val(),
	        remark=$("[name='remark']").val(),
	        email=$("#email").val(),
	        departureDate=$("#departureDate").val();
	        var len=$("#priceType .priceNum").length-1;
	        $("#priceType .priceNum").each(function(index){
	            var priceItem={'priceId':$(this).find('[name="priceId"]').val(),'priceNum':$(this).find('.num_input').val()};
	            priceGroup.push(priceItem);
	        });
	        var orderInfo={'name':name,'phone':phone,'remark':remark,'email':email,'departureDate':departureDate,'priceGroup':priceGroup,"loctUrl":location.href};
	        window.localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
	        if(url){
	        	location.href=url;
	        }
	    }
	    
	    //查看合同条款后返回下订单页，获取之前填写数据
	    function getFormValue(){
	        var orderInfo=null;
	        orderInfo= $.parseJSON(window.localStorage.getItem('orderInfo'));
	        if(orderInfo !=null){
	            $("#user_name").val(orderInfo.name);
	            $("#phone").val(orderInfo.phone);
	            $("[name='remark']").val(orderInfo.remark);
	            $("#email").val(orderInfo.email);
	            var selectDate=orderInfo.departureDate;
	            formatDate=new Date(selectDate).format("yyyy/MM/dd")+" 00:00:00";
	            $("#select-date").val(formatDate);
	            colseDate=formatDate;
	        }
	        
	    }
	    //价格设置
	    function getFormPrice(){
	        var orderInfo=null;
	        orderInfo= $.parseJSON(window.localStorage.getItem('orderInfo'));
	        if(orderInfo !=null){
	        	var selectDate=orderInfo.departureDate;
	            formatDate=new Date(selectDate).format("yyyy/MM/dd")+" 00:00:00";
	            $("#select-date").val(formatDate);
	            colseDate=formatDate;
	        }
	        window.localStorage.removeItem('orderInfo');
	        return orderInfo;
	    }
	    
	    //验证优惠码
	    function checkCoupon($code){
	    	$(".couponDetail").each(function(){$(this).remove();});//移除之前的优惠信息
	    	$('[name=couponCodeId]').val("").attr("data-price","");
	    	$(".J_couponShow .status").text('若您有优惠码，请输入后使用');
	    	calcMoney();
	    	var allMoney=parseInt($(".order_money .allMoney").text());
	    	var code=$code.val();
	    	var mes="";
	    	var regex= /^[0-9]{16}$/;
	    	if(code !=""){
	    		if(!regex.test(code)){
		    		mes="请输入16位纯数字的优惠码";
		    		warginInfo($code,mes);
		    	}else{
		    		$.ajax({
	    			url: '/coupon/check.json?',
	    			type: 'POST',
	    			dataType: 'json',
	    			data:{'code':code,'price':allMoney}
		    		})
		    		.done(function(option) {
		    			var success=option.result;
		    			var couponCodeInfo=option.couponCodeInfo;
		    			if(couponCodeInfo){
		    				var coupon=couponCodeInfo.coupon;
		    				$('[name="couponCodeId"]').val(couponCodeInfo.couponCodeId).attr("data-price",coupon.couponRule.discountMoney);//优惠码ID
		    				$(".J_couponShow .status").text("满"+coupon.couponRule.consumeMoney+'减'+coupon.couponRule.discountMoney);
				    		var html='<div class="money_item clearfix couponDetail">'
								       +'<span class="left">'
								       +'<span class="baseMoney">优惠金额：<big>-￥'+coupon.couponRule.discountMoney+'</big></span>'
								       +'</span>'
								       +'<span class="right">'
								       +'<small>优惠码：</small>'+("满"+coupon.couponRule.consumeMoney+'减'+coupon.couponRule.discountMoney);
								       +'</span>'
								      +'</div>';
				    		$(".money_detail").append(html);
				    		$(".coupon-select,.over_mask").hide();
		    			}
		    			else{
		    				mes=option.result.message;
		    			}
		    	    	calcMoney();
		    		})
		    		.fail(function() {
		    			mes='领取失败！请重试';
		    		})
		    		.always(function() {
		    			if(mes !=""){
		    				warginInfo($code,mes);
		    			}
		    		});
		    	}
	    	}
	    	else{
	    		$('[name="couponCodeId"]').val('').attr("data-price",'');//优惠码ID
	    		$(".J_couponShow .status").text('若您有优惠码，请输入后使用');
		    	calcMoney();
				
	    	}
	    }
	  