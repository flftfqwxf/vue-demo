;
!
function(controller) {
	// use strict
	'use strict';

	controller.using("tools");
	controller.using("zclip");
	controller.using("slider");
	controller.using("compare");
	controller.using("eDate");
	controller.using("eCalendar");

	controller.modules = {
		staticVar: function() {
			this.staticVar = {
				"nav": $("#J-p-nav"),
				"navH": $("#J-p-nav").outerHeight(true),
				"days": $("#J-days"),
				"daysLi": $("#J-days .days-list>li"),
				"daysNav": $("#J-p-days-nav"),
				"pics": $("#J-pics"),
				"picsLength": $("#J-pics .pic-small img").size(),
				"picsLi": $("#J-pics li"),
				"picsTimer": new Object(),
				"picsDelay": 5000,
				"picsAnimate": false,
				"navClick": false,
				"ajaxClick": false
			};
		},
		init: function() {
			// 初始化静态变量
			this.staticVar();

			// 产品图片集交互
			this.productPicsEvent();

			//下单功能
			this.orderInit();

			// 日程安排图片处理
			this.daysImgs();

			// 价格须知、注意事项里面图片处理
			this.otherInfoImgsHandler();

			// 亮点图片处理
			this.highlightsHandler();

			// 编辑器录入空、或换行的数据处理
			this.emptyRemove();

			// 日程概览交互
			this.surveyHandler();

			// 日程安排导航
			this.daysNav();

			// 事件
			this.event();

			// 对比功能
			this.compare();

			// 图片处理
			this.imgHander();
			
			//copy
			$(".scan-weixin").show();
			$(".J-clone").copy();
			$(".scan-weixin").removeAttr("style");
		},
		orderCheckout: function() {
			var rebateCount=0,
		    	    minusCount=0,
		    	    adultRebate=parseInt($(".price-item[name=adult] [v=price]").attr("data-rebate"))||0,
		    	    adultMinus=parseInt($(".price-item[name=adult] [v=price]").attr("data-Minus"))||0,
		    	    childRebate=parseInt($(".price-item[name=children] [v=price]").attr("data-rebate"))||0,
		    	    childMinus=parseInt($(".price-item[name=children] [v=price]").attr("data-Minus"))||0,
		    	    adultNum = $("[name=adultNum]:first").val(),
		    	    adultPrice = $(".price-item[name=adult] [v=price]:first").attr("price"),
		    	    childNum = $("[name=childNum]:first").val(),
		    	    childPrice = $(".price-item[name=children] [v=price]:first").attr("price"),
		    	    priceDom = $(".price-item[name=price]"),
		    	    sum = 0;
			
			var rebatePercent = $("[name=rebatePercent]").val();
			var minusPercent = $("[name=minusPercent]").val();
			
			adultPrice = adultPrice ? parseInt(adultPrice) : 0;
			childPrice = childPrice ? parseInt(childPrice) : 0;
			
			sum = adultNum * adultPrice + childNum * childPrice;
			$("input[type=hidden]", priceDom).val(sum);
			$(".price em", priceDom).text(sum);
			
			rebateCount = parseInt(sum*rebatePercent/100);
			minusCount = parseInt(sum*minusPercent/100);
			
			
			$("#J-discount").text("下单可用红包立减"+minusCount+"元，并获得返利"+rebateCount+"元红包");
		},
		orderHandler: function(options) {
		    var _this = this,
			adult = $(".price-item[name=adult] [v=price]"),
			children = $(".price-item[name=children] [v=price]"),
			priceCounter = $(".price-item[name=price]"),
			childrenPrice = 0,
			childrenId = 0;

			$(options.datePrices).each(function(i, v) {
				if (v.type.indexOf("成人") >= 0) {
				    adult.attr("data-rebate",v.rebate).attr("data-minus",v.minus).attr("data-id", v.id).attr("data-type", v.type).attr("price", v.price).text("￥" + v.price + "/人");
				}

				if (v.type.indexOf("儿童") >= 0) {
				    childrenId = v.id;
				    if (v.type == "儿童价") {
					childrenPrice = v.price;
					children.attr("data-rebate",v.rebate).attr("data-minus",v.minus);
				    } 
				    else if (v.type == "儿童不占床") {
					childrenPrice = v.price;
					children.attr("data-rebate",v.rebate).attr("data-minus",v.minus);
				    }
				} 
				else {
				    children.parent().hide();
				    $("[name=childNum]").val(0);
				}
				
				priceCounter.show();
			});

			//显示儿童价
			if (childrenPrice) {
				children.parent().show();
				children.attr("data-id", childrenId).attr("price", childrenPrice).text("￥" + childrenPrice + "/人");
			}
			
			_this.orderCheckout();
		},
		eCalendar: function() {
			var id = $("#J-p-info").attr("data-id"),
				allowOrder = true,
				_this = this;

			$.getJSON("/product/" + id + "/prices", function(serverData) {
				var prices = serverData && serverData.productPrices || [];

				//日期选择器
				$("[name=tempDate]").eDate({
					months: 2,
					direction: 'future',
					disablePreviousYear: true,
					disableNextYear: true,
					format: "YYYY年MM月DD日",
					disabled: function(date) {
						if (allowOrder) {
							var disabled = true;
							for (var i = 0; i < prices.length; i++) {
								if (prices[i].date.replace(" 00:00:00", "") == eDate.moment(date).format("YYYY-MM-DD")) {
									disabled = false;
									break;
								}
							}
							return disabled;
						}
					},
					onSelected: function(date) {
						$(".p-calendar .selected").removeClass("selected");
						var dateId = date.replace("年", "-").replace("月", "-").replace("日", ""),
							dateDom = $(".e-in-month[data-date=" + dateId + "].e-active"),
							datePrices = dateDom.attr("prices") ? $.parseJSON(dateDom.attr("prices")) : [];

						if (allowOrder) {
							//下单
							_this.orderHandler({
								datePrices: datePrices
							});
						} else {
							//预定
							$("#J-goDate .price-detail").size() == 0 && $("#J-goDate").append("<span class=\"price-detail\"></span>");
							var pricesDetail = dateDom.attr("data-original-title");
							pricesDetail = (pricesDetail != "提交订单后客服将会联系您确认该日报价" ? pricesDetail : "");
							$("#J-goDate .price-detail").text(pricesDetail).attr("title", pricesDetail);
						}
						$("[name=tempDate]").val(date);
					},
					drawCompate: function() {
						var date, pricesDetail, dateDom, datePrices;
						$("span[data-date]").removeAttr("data-original-title");
						$(".e-in-month.e-active").attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", "提交订单后客服将会联系您确认该日报价");
						$(prices).each(function(i, v) {
							date = v.date.replace(" 00:00:00", "");
							dateDom = $(".e-in-month[data-date=" + date + "].e-active");
							datePrices = [];
							pricesDetail = $(v.dateGroupPrices[0].prices).map(function(iii, vvv) {
								datePrices.push(vvv);
								return vvv.type + "：￥" + vvv.price;
							}).get().join(" ");

							dateDom.attr("prices", JSON.stringify(datePrices)).attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", pricesDetail);
							if (date == $("[name=tempDate]:visible:first").val().replace("年", "-").replace("月", "-").replace("日", "")) {
								_this.orderHandler({
									datePrices: datePrices
								});
							}

						});
					}
				});

				//左侧日历
				$("#J-nCalendar").eCalendar({
					dataHandler: function() {
						$(".fc-today:last").text("今天");

						//显示价格
						var date, pricesDetail, dom, today = $(".fc-today:last").attr("data-date"),
							datePrices;
						$(prices).each(function(i, v) {
							date = v.date.replace(" 00:00:00", "");
							datePrices = [];
							pricesDetail = $(v.dateGroupPrices[0].prices).map(function(iii, vvv) {
								datePrices.push(vvv);
								return vvv.type + "：￥" + vvv.price;
							}).get().join(" ");

							dom = $(".fc-day-number[data-date=" + date + "]");
							if ((!dom.hasClass("fc-other-month")) && (dom.hasClass("fc-future") || dom.hasClass("fc-today"))) {
								dom.attr("prices", JSON.stringify(datePrices)).attr("data-detail", pricesDetail).append((v.seats?"<em class=\"date-store\">位置余" + v.seats + "</em>":"")+"<em class=\"date-price\">￥" + v.minPrice + "</em>");
							}
						});

						//当月不能再切换小于当月
						if ($(".fc-today:last").size() > 0) {
							$(".fc-left").css("visibility", "hidden");
						} else {
							$(".fc-left").removeAttr("style");
						}


						var disabled;
						$(".fc-day-number").each(function() {
							disabled = true;

							//今天之前禁用
							if (!$(this).hasClass("fc-other-month") && $(this).attr("data-date") < today) {
								$(this).addClass("fc-disabled");
							}

							//只显示有价格的日期
							if (allowOrder) {
								for (var i = 0; i < prices.length; i++) {
									if (prices[i].date.replace(" 00:00:00", "") == $(this).attr("data-date")) {
										disabled = false;
										break;
									}
								}
								if (disabled) {
									$(this).addClass("fc-disabled");
								}
							}
						});
					},
					selectable: false,
					dayClick: function(date) {
						$("[name=tempDate]").blur();
						var dom = $(".fc-day-number[data-date=" + date.format() + "]");

						if ((!dom.hasClass("fc-other-month")) && (!dom.hasClass("fc-disabled")) && (dom.hasClass("fc-future") || dom.hasClass("fc-today"))) {
							$(".p-calendar .selected").removeClass("selected");
							$("td[data-date=" + date.format() + "]").addClass("selected");
							$("[name=tempDate]").val(date.format("YYYY年MM月DD日"));
							var datePrices = dom.attr("prices") ? $.parseJSON(dom.attr("prices")) : [];
							if (allowOrder) {
								//下单
								_this.orderHandler({
									datePrices: datePrices
								});
							} else {
								//预定
								$("#J-goDate .price-detail").size() == 0 && $("#J-goDate").append("<span class=\"price-detail\"></span>");
								$("#J-goDate .price-detail").text(dom.attr("data-detail") || "").attr("title", dom.attr("data-detail") || "");
							}
						}

					}
				});
			});

		},
		orderInit: function() {
			var _this = this,
				allowOrder = $(".value .price-item").size() > 0 ? true : false;

			_this.eCalendar();

			if (allowOrder) {
				$("[name=adultNum]").plusminus({
					callBack: function() {
						_this.orderCheckout();
					},
					min: 1
				});

				$("[name=childNum]").plusminus({
					callBack: function() {
						_this.orderCheckout();
					}
				});
			} else {
				$("[name=adultNum]").plusminus({
					min: 1
				});
			}
		},
		imgHander: function() {
			$("img[url]").each(function() {
				$(this).attr("src", $(this).attr("url"));
			});
		},
		compare: function() {
			var box = $(".p-detail");
			box.compare({
				addBtn: "compare-btn",
				addText: "加入对比",
				cancelText: "取消对比",
				getData: function() {
					var data = {};
					data.pic = $(".pic-cover img:first").attr("src") || "";
					data.id = $("div[d=id]").text();
					data.title = $(".fixed-height>h1").text();
					data.startPlace = $("div[d=departurePlace]").text();
					data.price = $(".p-price .price strong").text().replace("￥","");
					return data;
				},
				actionUrl: "/product-compare",
				postDataName: "productsId",
				productUrl: "/product/",
				direction: (box.attr("type") == "manage" ? "right" : "center")
			});
		},
		productPicsEvent: function() {
			var i = this,
				vars = this.staticVar,
				imgs = "";

			$(".pic-small img", vars.pics).each(

			function() {
				var url = $(this).attr("pic-url");
				$(this).attr("src", url + "@80w_60h_1e_1c");
				imgs += "<div><img src=\"" + (url + "@470w_354h_1e_1c") + "\"/></div>";
			});
			$(".pic-cover div", vars.pics).html(imgs);

			vars.pics.on("click", ".prev", function() {
				i.productPicsAnimate(vars.picsIndex - 1);

			}).on("click", ".next", function() {
				i.productPicsAnimate(vars.picsIndex + 1);

			}).on("click", "li img", function() {
				i.productPicsAnimate($(this).parent().index());
			});

			i.productPicsTimer();
		},
		productPicsTimer: function() {
			var i = this,
				vars = this.staticVar;

			vars.picsIndex = (vars.picsIndex ? vars.picsIndex : 0);
			vars.timer = setTimeout(function() {
				i.productPicsAnimate(vars.picsIndex + 1);
			}, vars.picsDelay);

		},
		productPicsAnimate: function(index) {
			var i = this,
				vars = this.staticVar,
				margin = {};
			if (vars.picsAnimate == true) {
				return false;
			}

			clearTimeout(vars.timer);
			vars.picsAnimate = true;
			if (index < 0) index = vars.picsLength - 1;
			else if (index >= vars.picsLength) index = 0;
			vars.picsIndex = index;

			margin["marginLeft"] = -(index * 470) + "px";
			$(".pic-cover>div", vars.pics).animate(margin, 400, function() {
				vars.picsAnimate = false;
				i.productPicsTimer();
			});
			vars.picsLi.removeClass("active").eq(index).addClass("active");
		},
		otherInfoImgsHandler: function() {
			$(".p-content-list .newImg").each(function() {
				var src = "";
				var dataOriginal = $(this).attr("data-original");
				if (dataOriginal.indexOf("gmmtour.com") > 0) {
					src = dataOriginal + "@742w";
				} else {
					src = dataOriginal;
				}
				$(this).removeAttr("width");
				$(this).attr("src", src);
			});
		},
		surveyHandler: function() {

			var survey = $("#J-survey");
			// 日程概览线条补充
			if ($(".day-line", survey).size() > 1) {
				$(".day-line", survey).each(

				function(i) {
					var h = (($(this).parents("td").outerHeight(true) - $(this).parent().height()) / 2);
					$(this).height(h + "px").css(((i == 0) ? "bottom" : "top"), "-" + (h) + "px");
				});
			}

			// 只有一个景点时bug处理
			$(".scenic-list", survey).each(function() {
				if ($("li", $(this)).size() == 1) {
					$("li", $(this)).addClass("line-onlyone");
				}
			});

			// 行程概览查看详细hover
			$(".scenic-list", survey).mouseenter(

			function() {

				$(".view-detail", survey).hide();
				var $this = $(this).parents(".col4"),
					child = $this.children("div"),
					detail = $this.find(".view-detail");
				if (detail.size() > 0) {
					detail.show();
				} else {
					if ($this.hasClass("col4") && $this.find("li").size() > 3) {
						var temp = $("<div class=\"view-detail\"><div>" + child.html() + "<div></div>");
						temp.mouseleave(function() {
							var $that = $(this);
							setTimeout(function() {
								$that.hide();
							}, 50);

						});
						$this.append(temp);
					}
				}
			});

			// 行程概览查看详细hover
			$(".col2>div, .col5>div", survey).mouseenter(

			function() {

				$(".view-detail", survey).hide();
				var $this = $(this).parents(".col4"),
					child = $this.children("div"),
					detail = $this.find(".view-detail");
				if (detail.size() > 0) {
					detail.show();
				} else {
					if ($this.hasClass("col4") && $this.find("li").size() > 3) {
						var temp = $("<div class=\"view-detail\"><div>" + child.html() + "<div></div>");
						temp.mouseleave(function() {
							var $that = $(this);
							setTimeout(function() {
								$that.hide();
							}, 50);

						});
						$this.append(temp);
					}
				}
			});
		},
		daysImgs: function() {
			var i = this;
			$(".J-day-content", this.days).each(

			function() {
				var imgs = $("img", $(this)),
					scenics = $(".J_scenic", $(this)),
					insertDom = $(this);
				i.daysImgsHandler(imgs, scenics, insertDom);
			});
		},
		emptyRemove: function() {
			$(".p-detail-content p").each(

			function() {
				if ((!$.trim($(this).text())) && $(this).find("img").size() == 0) $(this).remove();
			});
		},
		daysNav: function() {
			var nav = $("#J-p-days-nav"),
				maxDay = parseInt(nav.attr("max-days")),
				html = "",
				library = {
					"1": "一",
					"2": "二",
					"3": "三",
					"4": "四",
					"5": "五",
					"6": "六",
					"7": "七",
					"8": "八",
					"9": "九",
					"10": "十",
					"11": "十一",
					"12": "十二",
					"13": "十三",
					"14": "十四",
					"15": "十五",
					"16": "十六",
					"17": "十七",
					"18": "十八",
					"19": "十九",
					"20": "二十",
					"21": "二十一",
					"22": "二十二",
					"23": "二十三",
					"24": "二十四",
					"25": "二十五",
					"26": "二十六",
					"27": "二十七",
					"28": "二十八",
					"29": "二十九",
					"30": "三十"
				};
			for (var i = 0; i < maxDay; i++) {
				html += "<li" + (i == 0 ? " class=\"active\"" : "") + "><a class=\"J-day-click\" day=\"day" + (i + 1) + "\">第" + (library[i + 1]) + "天</a><i class=\"p-arrow-right\"></i></li>";
			}
			$("ul", nav).html(html);
		},
		jumpUrl: function(link) {
			var vars = this.staticVar;

			vars.navClick = true;

			var url = link.attr("href");

			url = url.substring(url.indexOf("#") + 1, url.length);
			var top = $("#" + url).offset().top - vars.navH;

			vars.daysNav.removeAttr("style");

			if (url == "J-days") {
				$("li", vars.daysNav).removeClass("active").eq(0).addClass("active");
			}

			$("html,body").animate({
				scrollTop: (isNaN(top) ? 0 : top)
			}, 400, function() {
				$("a.active", vars.nav).removeClass("active");
				link.addClass("active");
				setTimeout(function() {
					vars.navClick = false;
				}, 100)
			});
		},
		jumpDay: function(link) {
			var vars = this.staticVar,
				day = link.attr("day"),
				top = $("#" + day).offset().top - vars.navH - 1,
				link = $("[day=" + day + "]", vars.daysNav).parent();

			vars.navClick = true;
			if (link.parents("#J-p-days-nav").size() > 0) {
				top = top - link.index() * 28;
			}

			$("html,body").animate({
				scrollTop: top
			}, 400, function() {
				setTimeout(function() {
					vars.navClick = false;
					$(window).trigger("scroll");
					$("li", vars.daysNav).removeClass("active");
					link.addClass("active");
				}, 100);

			});
		},
		slider: function() {
			// 2.4改版
			$("#right_slider").each(function() {
				$(this).Slide({
					effect: "scroolLoop",
					autoPlay: true,
					speed: "normal",
					timer: 3000,
					steps: 1,
					prevCallBack: function(_self, index) {
						var navShow = _self.find(".JQ-slide-nav-show");
						navShow.find("i.on").each(function() {
							$(this).removeClass("on");
						});
						navShow.find("i").eq(index).addClass("on");
					},
					nextCallBack: function(_self, index) {
						var navShow = _self.find(".JQ-slide-nav-show");
						navShow.find("i.on").each(function() {
							$(this).removeClass("on");
						});
						navShow.find("i").eq(index).addClass("on");
					}
				});
			});
		},
		event: function() {
			var i = this,
				that = this,
				vars = i.staticVar,
				nav = vars.nav,
				navH = vars.navH,
				days = vars.days,
				daysNav = $("#J-p-days-nav"),
				items = $(".p-detail-item"),
				itemsSize = items.size(),
				detailW = $(".p-detail").width(),
				winW = $(window).width(),
				daysLeft = days.offset().left,
				seller = $("#J-seller"),
				sellerTop = seller.offset().top,
				sellerLeft = seller.offset().left,
				goTop = $("#J-goTop");

			// go to top
			$("#J-back,#J-goTop").click(function() {
				if (vars.navClick == true) {
					return false;
				}

				vars.navClick = true;
				$("html,body").animate({
					scrollTop: 0
				}, 400, function() {
					vars.navClick = false;
					$("a", vars.nav).removeClass("active").eq(0).addClass("active");
					goTop.hide();
				});
			});

			//form
			$("section .btn-submit").click(function() {
				var action = $("section form").attr("action");
				if($(this).attr("disabled")!=undefined){
				    return false;
				}
				if (!$("#J-goDate input").val()) {
					$.showMsg("请选择出发日期。");
					return false;
				} else if ($(".value .price-item").size() > 0) {
					var orderData = {};
					orderData["departureDate"] = $("[name=tempDate]:first").val().replace("年", "-").replace("月", "-").replace("日", "");
					orderData["itemPrices"] = [];
					$(".price-item[name=adult]:first:visible, .price-item[name=children]:first:visible").each(function() {
						var dom = $(this).find("[v=price]");
						var dataId = dom.attr("data-id");
						var dataValue = $(this).find("input").val();
						var item = dataId + ":" + dataValue;
						orderData["itemPrices"].push(item);
					});
					orderData["itemPrices"] = orderData["itemPrices"].toString();
					$.postData({
						data: orderData,
						action: action
					});
					return false;
				}
			});

			// 使用事件代理
			$(document).on("click", ".visa-type li", function() {

				// 签证弹窗中的页签事件
				$(".visa-type li.selected").removeClass("selected");
				$(this).addClass("selected");
				$(".visa-list .visa-content").addClass("hidden").eq($(this).index()).removeClass("hidden");

			}).on("click", ".J-shopPlace", function() {
				var top = $("#J-shopPlace").offset().top - vars.navH;
				$("html,body").animate({
					scrollTop: (isNaN(top) ? 0 : top)
				}, 400);
			}).on("click", ".J-hotel, .J-scenic, .J_scenic", function() {

				// 景点、酒店弹窗
				if (vars.ajaxClick == true) return false;

				var type = ($(this).hasClass("J-hotel") ? "hotel" : "sight"),
					id = ($(this).hasClass("J_scenic") ? $(this).attr("sight_id") : $(this).attr("data-id")),
					api = id + ".json";
				api = "/" + type + "/" + api

				vars.ajaxClick = true;
				$.ajax({
					url: api,
					type: 'GET',
					dataType: 'json',
					success: function(data) {
						vars.ajaxClick = false;
						var title = ((type == "hotel") ? data.hotel.name : data.sight.cnName),
							content = ((type == "hotel") ? (data.hotel.description) : (data.sight.description)),
							images = ((type == "hotel") ? (data.hotel.hotelImages) : (data.sight.sightImages));
						var coordinate = "";
						$("#J-hotel-scenic-dialog").window({
							title: (type == "hotel" ? "酒店详情" : "景点详情"),
							width: "800px",
							footer: "<div class=\"dialog-tip\">以上信息由港马负责统一维护和管理，若发现错误，<a class=\"linkGmService color-graw\">欢迎指正</a></div>",
							event: function(
							dialog) {
								$(".title", dialog).text(
								title);
								$(".font-content", dialog).html(
								content);
								var items = (type == "hotel") ? "酒店图片" : "景点图片";
								// 2.4弹窗改版
								if (images.length > 0) {
									var html = "";
									$(
									images).each(

									function(
									i, v) {
										html += "<li><img src=\"" + v.url + "@430w_242h_1e_1c\"><span class=\"icon\"></span>" + "<div class='text_info'><a href='' target='_blank' title=''>" + items + "</a><span class='text_info_mum'><span>" + (i + 1) + "</span>/<span></span>" + images.length + "</span></div>" + "</li>";
									});
									// $(".scenic-pic",dialog).html("<img
									// src=\""+images[0].url+"@210w_120h_1e\"/>");
									// $('.scenic-ul
									// li:eq(0)',dialog).addClass('selected');
									$(".scenic-ul", dialog).html(
									html);
									that.slider();
								} else {
									// 当没有图片的时候显示的界面
									$(".JQ-slide-nav").css({
										"display": "none"
									});
									if (type == "sight") {
										$(".scenic-pic", dialog).css({
											"background": "url('http://static.gmmtour.com/www/theme/web/default/images/common/no_hotel.png')"
										});
									} else if (type == "hotel") {
										$(".scenic-pic", dialog).css({
											'background': 'url("http://static.gmmtour.com/www/theme/web/default/images/common/no_hotel.png")'
										});
									}
								}
								if (type == "sight") {
									var content_box = $(".content_box").html('<div class="play_time"><span class="content_box_itmes">游玩时间:</span><span class="content_box_details">' + data.sight.playTime + '</span></div>' + '<div class="contact_number"><span class="content_box_itmes">联系电话:</span><span class="content_box_details">' + data.sight.phone + '</span></div>' + '<div class="detailed_address"><span class="content_box_itmes">详细地址:</span><span class="content_box_details">' + data.sight.address + '</span><span class="content_box_map" id="map"></span></div>' + '<div class="open_time"><span class="content_box_itmes">开放时间:</span><span class="content_box_details">' + data.sight.openTime + '</span></div>' + '<div class="ticket_information"><span class="content_box_itmes">门票信息:</span><span class="content_box_details">' + data.sight.ticket + '</span></div>')
									var scenic_font = $(".scenic-font").html('<div class="title">景点亮点</div><div class="font-content">' + data.sight.brightSpot + '</div>' + '<div class="title">景点介绍</div><div class="font-content">' + data.sight.description + '</div>' + '<div class="title">景点导览</div><div class="font-content"></div>' + '<div class="title">特别提示</div><div class="font-content">' + data.sight.tips + '</div>')

									coordinate = data.sight.coordinate;
									// 是否影藏地图
									if (data.sight.area.regionHome) {
										$("#map").css({
											"display": "block"
										});
									} else {
										$("#map").css({
											"display": "none"
										});
									}
								} else if (type == "hotel") {
									var content_box = $(".content_box").html('<div class="play_time"><span class="content_box_itmes">英文名称:</span><span class="content_box_details">' + data.hotel.enName + '</span></div>' + '<div class="contact_number"><span class="content_box_itmes">酒店类型:</span><span class="content_box_details">' + data.hotel.grade + '</span></div>' + '<div class="detailed_address"><span class="content_box_itmes">详细地址:</span><span class="content_box_details">' + data.hotel.address + '</span><span class="content_box_map" id="map"></span></div>')
									var scenic_font = $(".scenic-font").html('<div class="title">酒店介绍</div><div class="font-content">' + data.hotel.description + '</div>');
									coordinate = data.hotel.coordinate;
									// 是否影藏地图
									if (data.hotel.area.regionHome) {
										$("#map").css({
											"display": "block"
										});
									} else {
										$("#map").css({
											"display": "none"
										});
									}
								}
								// 如果返回数据为NULL,则显示为暂无
								$(".content_box_details").each(

								function() {
									if ($(
									this).text() == "null" || $(
									this).text() == "") {
										$(
										this).text("暂无");
									}
								})
								$(".font-content").each(

								function() {
									if ($(
									this).text() == "null" || $(
									this).text() == "") {
										$(
										this).text("暂无").css("border-bottom", "none");

									}
								})
								// 获取左边div高度
								var rightHeight = $(".scenic-pic-box").height();
								$(".hotel-scenic-dialog .scenic-font").css({
									"height": rightHeight + "px"
								});

								// 获取经纬度
								var code = coordinate.split("|");

								// 创建和初始化地图函数：

								function initMap() {
									createMap(); // 创建地图
									setMapEvent(); // 设置地图事件
									addMapControl(); // 向地图添加控件
									addMapOverlay(); // 向地图添加覆盖物
								}

								function createMap() {
									map = new BMap.Map("map");
									map.centerAndZoom(
									new BMap.Point(
									code[0], code[1]), 15);
								}

								function setMapEvent() {
									map.enableScrollWheelZoom();
								}

								function addClickHandler(
								target, window) {
									target.addEventListener("click", function() {
										target.openInfoWindow(window);
									});
								}

								function addMapOverlay() {
									var markers = [{
										content: "我的备注",
										title: "我的标记",
										imageOffset: {
											width: -46,
											height: -21
										},
										position: {
											lat: 30.664636,
											lng: 104.07194
										}
									}];
									for (var index = 0; index < markers.length; index++) {
										var point = new BMap.Point(
										markers[index].position.lng, markers[index].position.lat);
										var marker = new BMap.Marker(
										point, {
											icon: new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png", new BMap.Size(
											20, 25), {
												imageOffset: new BMap.Size(
												markers[index].imageOffset.width, markers[index].imageOffset.height)
											})
										});
										var label = new BMap.Label(
										markers[index].title, {
											offset: new BMap.Size(
											25, 5)
										});
										var opts = {
											width: 200,
											title: markers[index].title,
											enableMessage: false
										};
										var infoWindow = new BMap.InfoWindow(
										markers[index].content, opts);
										marker.setLabel(label);
										addClickHandler(
										marker, infoWindow);
										map.addOverlay(marker);
									};
								}
								// 向地图添加控件

								function addMapControl() {
									var navControl = new BMap.NavigationControl({
										anchor: BMAP_ANCHOR_TOP_LEFT,
										type: BMAP_NAVIGATION_CONTROL_LARGE
									});
									map.addControl(navControl);
								}
								var map;
								// 初始化地图
								initMap();
							}
						});
					},
					error: function() {
						vars.ajaxClick = false;
					}
				});

			}).on("click", ".J-visa", function() {
				var id = $(this).attr("data-id");

				// 签证弹窗
				if (vars.ajaxClick == true) return false;

				vars.ajaxClick = true;

				$.ajax({
					url: "/visa/" + id + ".json",
					success: function(data) {
						vars.ajaxClick = false;
						$("#J-visa-dialog").window({
							title: "签证详情",
							footer: "<div class=\"dialog-tip\">以上信息由港马负责统一维护和管理，若发现错误，<a class=\"linkGmService color-graw\">欢迎指正</a></div>",
							event: function(
							dialog) {
								if (null != data && null != data.visa) {
									var visaTermTypeList = data.visa.termTypes;
									var visaTermList = data.visa.terms;

									$(".tilte", dialog).text(
									data.visa.title);
									$(".visa-number", dialog).text(
									data.visa.inbound);
									$(".visa-stay", dialog).text(
									data.visa.stay);
									$(".visa-validate", dialog).text(
									data.visa.validate);
									$(".visa-scope", dialog).html(
									data.visa.scope);
									$(".visa-type", dialog).html("");
									$(".visa-list", dialog).html("");

									for (var i = 0; i < visaTermTypeList.length; i++) {
										var typeIndex = 0;
										var visaContent = '<div class="visa-content hidden">';
										for (var j = 0; j < visaTermList.length; j++) {
											if (visaTermTypeList[i] == visaTermList[j].type) {
												typeIndex == 0 && $(".visa-type", dialog).append('<li><a href="javascript:void(0);">' + visaTermList[j].typeName + '</a></li>');
												visaContent += '<dl><dt>' + visaTermList[j].term + '</dt><dt>' + visaTermList[j].termExplain + '</dt></dl>';
												typeIndex++;
											}
										}
										visaContent += '</div>';
										$(".visa-list", dialog).append(
										visaContent);
									}

									$(".visa-type li:eq(0)").click();
								}
							}
						});
					},
					error: function() {
						vars.ajaxClick = false;
					}
				});

			}).on("click", ".hotel-scenic-dialog .scenic-ul li", function() {

				// 酒店、景点详情图片选择事件
				var lis = $(this).parent().find("li"),
					img = $(
					this).parent().prev(".scenic-pic").find("img");
				img.removeAttr("src").attr("src", $("img", $(this)).attr("data-src"));
				lis.removeClass("selected");
				$(this).addClass("selected");

			}).on("click", ".J-day-click", function() {

				// 具体某天跳转事件
				i.jumpDay($(this));
				return false;

			}).on("click", "ul.dashed a, #J-p-nav a", function() {

				// 导航链接，产品头部信息中价格与团期链接
				i.jumpUrl($(this));
				return false;

			});

			// resize事件
			$(window).resize(function() {
				winW = $(window).width();
				daysLeft = days.offset().left;
				$(window).trigger("scroll");
				goTop.css("right", ((winW - detailW) / 2) + 110 + "px");
			}).resize();

			// 滚动事件
			setTimeout(

			function() {
				$(window).scroll(

				function() {
					var scrollTop = $(window).scrollTop();

					// 导航浮动
					if (nav.offset().top < scrollTop) {
						nav.addClass("p-nav-fixed");
						goTop.fadeIn(300);
					} else {
						goTop.hide();
						nav.removeClass("p-nav-fixed");
						$("a", vars.nav).removeClass("active").eq(0).addClass("active");
					}

					if (vars.navClick == false) {

						// 滚动时，自动关联导航
						for (var i = 0; i < itemsSize; i++) {
							var item = items.eq(i),
								min = item.offset().top - navH - 20,
								max = min + item.outerHeight(true) + 20;

							if (min < scrollTop && scrollTop < max) {
								$(".active", nav).removeClass("active");
								$("a[href=#" + item.attr("id") + "]", nav).addClass("active");
								break;
							}
						}

						// 滚动时日程导航自动关联
						var min = days.offset().top - navH,
							max = min + days.outerHeight(true) - vars.daysNav.outerHeight(true);

						if (min < scrollTop && scrollTop < max) {
							var left = daysLeft - 85;
							daysNav.css({
								position: "fixed",
								top: navH + 1 + "px",
								"left": left + "px"
							});

							if (vars.navClick == false) {
								for (var i = 0; i < vars.daysLi.size(); i++) {
									var $this = vars.daysLi.eq(i),
										dayMin = $this.offset().top - navH,
										dayMax = dayMin + $this.outerHeight(true),
										dayNavItem = $("[day=" + ($this.attr("id")) + "]", vars.daysNav).parent();

									dayMin = dayMin - dayNavItem.index() * 28;
									dayMax = dayMax - dayNavItem.index() * 28;

									if (dayMin <= scrollTop && scrollTop <= dayMax) {
										$("li", vars.daysNav).removeClass("active");
										dayNavItem.addClass("active");

										if (dayNavItem.index() + 1 >= 15) {
											$("ul", vars.daysNav).css("margin-top", "-420px");
										} else {
											$("ul", vars.daysNav).css("margin-top", "0");
										}
										break;
									}
								}
							}
						} else {
							daysNav.removeAttr("style");
						}
					}

					//商户信息
					if (scrollTop > sellerTop && winW >= detailW) {
						var right = (winW - detailW) / 2;
						right = right > 0 ? right : 0;
						seller.css({
							position: "fixed",
							top: (navH + 30 + "px"),
							left: "auto",
							"right": right + "px"
						});
					} else {
						seller.removeAttr("style");
					}

				});
			}, 50);
		},
		daysImgsHandler: function(imgDom, scenicDom, insertDom) {
			var vars = this.staticVar,
				imgsStr = "",
				imgs = $(imgDom).map(

				function() {
					return $(this).attr("data-original");
				}).get();

			$(imgDom).remove();

			for (var i = 0; i < ((imgs.length <= 3) ? imgs.length : 3); i++) {
				imgsStr += "<li><img src=\"" + imgs[i] + "@300w_222h_1e_1c\" /><h6><span></span><span>沿途风光</span></h6></li>";
			}

			//用户上传不足三张
			if (imgs.length < 3) {
				var sysImgs = [],
					sysImgsName = [],
					length = 3 - imgs.length,
					index1, index2;

				$(scenicDom).each(function() {
					var temp = $(this).attr("images").split(",") || [];
					if ($(this).attr("images") && temp.length >= 1) {
						sysImgs[sysImgs.length] = temp;
						sysImgsName[sysImgsName.length] = $(this).text();
					}
				});

				/*代码待优化以满足扩展需求 start*/
				if (length == 1) {
					if (sysImgs.length > 0) {
						index1 = 0;
						index2 = 0;
					}
				} else if (length == 2) {
					if (sysImgs.length == 1) {
						index1 = 0;
						index2 = 1;
					} else if (sysImgs.length >= 2) {
						index1 = 1;
						index2 = 0;
					}
				} else if (length == 3) {
					if (sysImgs.length == 1) {
						index1 = 0;
						index2 = 2;
					} else if (sysImgs.length == 2) {
						index1 = 1;
						index2 = 1;
					} else if (sysImgs.length >= 3) {
						index1 = 2;
						index2 = 0;
					}
				}

				/*代码待优化 end*/

				var currentLength = imgs.length;
				for (var i = 0; i <= index1; i++) {
					for (var j = 0; j <= index2; j++) {
						if (sysImgs[i][j]) {
							if (currentLength >= 3) {
								break;
							}
							currentLength++;

							imgsStr += "<li><img src=\"" + sysImgs[i][j] + "@300w_222h_1e_1c\" /><h6><span></span><span>" + sysImgsName[i] + "</span></h6></li>";
						}
					}
				}

			}
			if (imgsStr) {
				insertDom.after("<div class=\"p-upload-list\"><ul class=\"clearfix\">" + imgsStr + "</ul></div>");
			}
		},
		highlightsHandler: function() {
			var highlights = $("#J-highlights .p-highlights-content");

			$("img", highlights).each(function() {
				var src = $(this).attr("data-original");
				if ($(this).attr("data-original").indexOf("gmmtour.com") >= 0) {
					src += "@870w";
				}
				highlights.before("<div class=\"p-highlights-pic\"><img src=\"" + src + "\"/></div>");
				$(this).remove();
			});
		}
	};

	controller.call();

}(new this.jSharp.controller());