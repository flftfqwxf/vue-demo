;
! function(controller) {
	//use strict
	'use strict';

	controller.using("eDate");
	controller.using("tools");

	controller.modules = {
		init: function() {

			//我要参团
			this.joinHandler();

		},
		eCalendar: function() {


			var id=$(".box-url").attr("data-url");
		    	$.getJSON("/product/"+id+"/prices",function(serverData){
		    		var prices=serverData&&serverData.item&&serverData.item.itemCalendar||[];
		    		$("[name=departureDate]").eCalendar({   
		    		months:2,
				direction:'future',
				disablePreviousYear:true,
	        	disableNextYear:true,
				format:"YYYY年MM月DD日",
				onSelected:function(date){
					$("#J-goDate .price-detail").size()==0&&$("#J-goDate").append("<span class=\"price-detail\"></span>");
					var dateId=date.replace("年","-").replace("月","-").replace("日",""),
						pricesDetail=$(".e-in-month[data-date="+dateId+"].e-active").attr("data-original-title");
					$("#J-goDate .price-detail").text(pricesDetail!="提交订单后客服将会联系您确认该日报价"?pricesDetail:"");
					$("[name=tempDate]").val(date);
				},
				drawCompate: function () {
					var date,
						pricesDetail;
					$("span[data-date]").removeAttr("data-original-title");
					$(".e-in-month.e-active").attr("data-placement","bottom").attr("data-toggle","tooltip").attr("data-original-title","提交订单后客服将会联系您确认该日报价");
					$(prices).each(function(i,v){
						date=v.date.replace(" 00:00:00","");
						pricesDetail=$(v.dateGroupPrices[0].prices).map(function(iii,vvv){
							return vvv.type+"："+vvv.price;
						}).get().join(" ");

						$(".e-in-month[data-date="+date+"].e-active").attr("data-placement","bottom").attr("data-toggle","tooltip").attr("data-original-title",pricesDetail);
					});
				}
					});
		    	});
		},
		questTime: function(time) {
			var dateTem = time.replace("年", "-").replace("月", "-").replace("日", "");
			$.ajax({
				url: '/product/' + $(".box-url").attr('data-url') + '/dates/' + dateTem + ".json",
				type: 'get',
				dataType: 'json',
				success: function(data) {
					if (data.price) {
						$(".price_start").html('￥<em>' + data.price + '</em>起/人');
						data.extraPrice ? $(".extraPrice").html('(单房差：￥<em>' + data.extraPrice + '</em>)') :$(".extraPrice").html("");
					} else {
						$(".price_start").html("<span>提交后客服将与您联系确认该日报价</span>");
						$(".extraPrice").html("");
					}
				}
			})

		},
		joinHandler: function() {
			this.eCalendar();
			this.questTime($("[name=departureDate]").val());
			$(".first-td").on("click", 'span', function() {
				var val = $(".add-number").val();
				if ($(this).hasClass('reduce') && val > 1) {
					val--;
					$(".add-number").val(val);
					val <=1 && $(".reduce").css("color", "#ccc");
					val <10 && $(".increase").css("color", "#999");
				}

				if ($(this).hasClass('increase') && val<10) {
					val++;
					val >0 && $(".reduce").css("color", "#999");
					val >=10 && $(".increase").css("color", "#ccc");
				}

				$(".add-number").val(val);



			})


			var Verification = {
				mobileNumber: {
					regex: /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
					alertText: "请输入正确的手机号"
				},
				empty: {
					regex: /\S/,
					alertText: "请输入内容"
				},
				userName: {
					regex: /^[\u4E00-\u9FA5]{1,10}$/,
					"alertText": "请输入正确的姓名，限10字"
				}

			}

			$(".J-submit-intention").on("click", function() {

				var subJson = {
					departureDate: $('input[name="departureDate"]'),
					num: $(".add-number"),
					phone: $(".phone-number"),
					userName: $('input[name="userName"]')
				}

				for (var t in subJson) {

					if (subJson[t].val()) {
						if (!parseInt(subJson.num.val())) {
							$.showMsg("人数不能小于1");
							subJson.num.focus();
							return false;

						}
						if (!Verification.mobileNumber.regex.test(subJson.phone.val())) {
							$.showMsg(Verification.mobileNumber.alertText);
							subJson.phone.focus();
							return false;
						}

						if (!Verification.userName.regex.test(subJson.userName.val())) {
							$.showMsg(Verification.userName.alertText);
							subJson.userName.focus();
							return false;
						}

					} else {
						$.showMsg("不能为空");
						subJson[t].focus();
						return false;

					}


				}



				return subJson.flag;


			})



			if ($(".prorFaild").attr("data-state")) {
				var len = $(".prorFaild p").length;
				for(var j=0;j<len;j++){
					if($(".prorFaild").find("p").eq(j).find("span").text()){
						$.showMsg($(".prorFaild span").text())
						return ;
					}
				}
				
			}


		}
	};

	controller.call();

}(new this.jSharp.controller());