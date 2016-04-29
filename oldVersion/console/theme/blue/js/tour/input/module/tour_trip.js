
((function($, w){
	var toCNNumber = function(n){
		return  0 < n && n <= 10 ? ["01","02","03","04","05","06", "07", "08", "09", "10"][n - 1] : n;
	}
	
	//每日之间滑动偏移
	var offset = 165;
	
	var service = {
		getGradeHotel : function(hotel){
			hotel = hotel || {"grade": "当地3星"};
			return template("tmp_step_trip_hotel_grade", hotel);
		},
		
		getHotel : function(hotel){
			hotel = hotel || {};
			var $tar = $(template("tmp_step_trip_hotel_specific", hotel));
			var i = 0;
			$(hotel.items).each(function(){
				$(".items", $tar).append(service.getHotelItem($.extend({},this, {"idx" : i++})));
			});
			if (hotel.items && hotel.items.length == 1) {
				$("[data-del-action]", $tar).hide();
			}
			return $tar;
		},
		getHotelItem : function(item){
			item = item || {};
			var tips = "<span class='tips' style='text-align:center'>港马数据库中发现以下{n}个名称类似的酒店，<span style='color:red'>点击酒店名称</span>完成选择(选择后用户可以看到酒店介绍)</span>";
			var $tar = $(template("tmp_step_trip_hotel_specific_item", item));
			Tour.utils.initAutocomplete($(".hotelName",$tar),{hotType: tips, lineId : Tour.current.lineId ,noResultSetNull:false,minChars:2, renderCallback : function(data){
				
				var rows = $.isArray(data) ? data : data.list;
				var $hot = $(this).parent().find(".hottip");			
				if ($.isArray(rows)) {
					$hot.html(tips.template({"n": rows.length}));
					$hot.show();
				} else {
					$hot.hide();
				}
				
			}},function(e,data){
				if(data){
					$(this).parent().find("input[name='id']").val(data.id);
				} else {
					$(this).parent().find("input[name='id']").val("");
				}
			});
			return $tar;
		},
		
		getTraffic : function(traffic){
			
			traffic = traffic || {"transportation" : "airplane", "confirmed" : 1};
			
			var getShiftType = function(type){
				var shifttype;
				if (type == "airplane") {
					shifttype = "参考航班：";
				} else if (type == "train") {
					shifttype = "列车车次：";
				} else if (type == "bus") {
					shifttype = "参考班次：";
				} else if (type=="ship") {
					shifttype = "游轮号：";
				} else if (type=="custom"){
					shifttype = "参考班次：";
				} else {
					shifttype = "参考班次：";
				}
				return shifttype;
			}
			
			
			var $traffic = $(template("tmp_step_trip_traffic", $.extend({}, traffic, {"shifttype" : getShiftType(traffic.transportation)})));
			
			Tour.utils.initAutocomplete($(":input[ac_url]", $traffic),{noResultSetNull:true,minChars:1},function(e,data){
				var input = $(this).parent().find("input[name='id']");
				if(input.val()==""){
					$(this).blur(function(){
						$(this).css('color','#757575');
					});
					$(this).focus(function(){
						$(this).css('color','#000');
					});
				}
				if(data){
					var originId = input.val();
					input.val(data.id);
					if (originId != data.id && $(":input[name=transportation]",$traffic).val() == "airplane" && $(":input[name=confirmed]",$traffic).val() == 1) {
						service.loadFlights($traffic);
					} 
					$(this).css('color','#000');
				} else {
					input.val("");
				}
				
			});
			
			$traffic.on("click", ".flight.__unconfirmed", function(){
				var $elm = $(this);
				if($elm.hasClass("active_checkbox")) {
					
					service.loadFlights($traffic);
					
					$elm.removeClass("active_checkbox");
					$("[name=confirmed]", $traffic).val(1);
				} else {
					$(".flights", $traffic).hide();
					$(".greyText", $traffic).hide();
					$(".__shift", $traffic).show();
					$traffic.find("data[data-name=flight] :input").val("");
					$elm.addClass("active_checkbox");
					$("[name=confirmed]", $traffic).val(0);
				}
			}).on("change", ":input[name=transportation]", function(){
				var $traffic = $(this).closest(".traffics");
				var type = $(this).val();
				//默认交通/航班 重置已确认
				$("[name=confirmed]", $traffic).val(1);
				
				var shifttype = getShiftType(type);
				$(".__shift_text", $traffic).text(shifttype);
				
				if (type == "airplane") {
					$(".flight.__unconfirmed", $traffic).show();
					$(".greyText", $traffic).show();
					service.loadFlights($traffic);
				} else {
					
					
					var $elm = $(".flight.__unconfirmed", $traffic).hide();
					$elm.removeClass("active_checkbox");
					
					$(".greyText", $traffic).hide();
					$(".flights", $traffic).hide();
					$(".__shift", $traffic).show();
				}
			}).on("click", ".updateBtn", function(){
				service.loadFlights($traffic);
			});
			
			
			$(":input[name=transportation]", $traffic).val(traffic.transportation);
			
			if (traffic.transportation == 'airplane') {
				if (traffic.flight && traffic.flight.id && traffic.flight.id != "") {
					var $flight = service.getTrafficsFlight(traffic.flight);
					$(".flightInfo tbody", $traffic).append($flight);
					$(".__shift", $traffic).hide();
					$flight.click();
				} 
			}
			
			return $traffic;
		},
		
		getTrafficsFlight : function(flight){
			
			var $tar = $(template("tmp_step_trip_traffic_flight", flight));
			$tar.data("flight", flight);
			
			$tar.on("click",function(){
				var $tr = $(this);
				
				if ($tr.hasClass("selected")) {
					$tr.removeClass("selected");
					$tar.closest(".traffics").find("data[data-name=flight] :input").val("");
				} else {
					$tr.parent().find("tr").removeClass("selected");
					$tr.addClass("selected");
					var $flight = $tr.closest(".traffics").find("[data-name=flight]");
					var data = $tar.data("flight");
					
					$flight.find("[name=id]").val(data.id);
					$flight.find("[name=arrTime]").val(data.arrTime);
					$flight.find("[name=depTime]").val(data.depTime);
					$flight.find("[name=plane]").val(data.plane);
					$flight.find("[name=stop]").val(data.stop);
					$flight.find("[name=schedule]").val(data.schedule);
					$flight.find("[data-name=airline] [name=name]").val(data.airline.name);
					$flight.find("[data-name=arrCity] [name=cnName]").val(data.arrCity.cnName);
					$flight.find("[data-name=arrAirport] [name=name]").val(data.arrAirport.name);
					
					$flight.find("[data-name=depCity] [name=cnName]").val(data.depCity.cnName);
					$flight.find("[data-name=depAirport] [name=name]").val(data.depAirport.name);
				}
				
			});
			return $tar;
		},
		loadFlights : function($traffic){
			$(".flights", $traffic).show();
			$(".updateBtn", $traffic).hide();
			$(".__shift", $traffic).hide();
			var depCityId = $(".departure", $traffic).parent().find("[name=id]").val();
			var arrCityId = $(".destination", $traffic).parent().find("[name=id]").val();
			var $elm = $(".flight.__unconfirmed", $traffic).removeClass("active_checkbox");
			
			
			if (arrCityId && arrCityId != "" && depCityId && depCityId != "") {
				
				$("[name=shift]", $traffic).val("");
				var $page = $(".page", $traffic);
				$page.find(".pagination").remove();
				$page.append("<div class='pagination'></div>");
				$page.find(".pagination").pagination({
					dataSource:"/flight?depCityId="+depCityId+"&arrCityId="+arrCityId+"&format=json&_"+Math.random(),
					locator:"flightList",
					triggerPagingOnInit:true,
					hideWhenLessThanOnePage:true,
					getTotalPageByResponse:function(d){return d.pagination.pageCount},
					alias:{
						 pageNumber: 'page',
						 pageSize: 'size'
					},
					totalNumber: 50,
					pageSize:5,
					callback:function(d,p){
						
						var $tbody = $(".flightInfo tbody", $traffic);
						$tbody.empty();
						if (d.length != 0) {
							var selected = $("[data-name=flight] [name=id]",$traffic).val();
							$(d).each(function(){
								$tbody.append(service.getTrafficsFlight($.extend(this, {'selected' : selected == this.id})));
							});
						} else {
							$tbody.append("<tr style='height:60px;'><td colspan=8><h2>暂时没有航班数据</h2></td></tr>");
						}
					}
				});
			}
		},
		
		getSchedule : function(trip){
			//时间日程安排类型： [AMPM:上午下午, TIME: 时间, CUSTOM: 自定义，一段话描述]
			trip = trip || {};
			trip.timeType = trip.timeType || "CUSTOM";
			var type = trip.timeType;
			var $schedule = $(template("tmp_step_trip_schedule", trip));
			
			if (trip.schedules) {
				var i = 0;
				$(trip.schedules).each(function(){
					$(".daily", $schedule).append(service.getScheduleItem($.extend({idx : i++} , this), type));
				});
			} else {
				$(".daily", $schedule).append(service.getScheduleItem());
			}
			
			$schedule.on("click", ".switch.custom",function(){
				var $li = $(this);
				if ($li.hasClass("active_checkbox")) return ;
				
				$.confirm(
						"切换方式后,您当前输入的内容将被清除", 
						"是否确认切换？", 
						function() {
							$(".switch.time", $schedule).removeClass("active_checkbox");
							$("[name=timeType]", $schedule).val("CUSTOM");
							 
							
							if (!$li.hasClass("active_checkbox")) {
								$li.addClass("active_checkbox");
								$(".daily [data-name=schedules]", $schedule).each(function(){
									Tour.current.jsondom.remove($(this));
								});
								$(".daily", $schedule).append(service.getScheduleItem({}, "CUSTOM"));
								$(".__add_schedule",$schedule).hide();
							}
							$("textarea[tag=edit]", $schedule).each(function(){
								initKindEditor($(this), null, null, Tour.current.lineId);
							});
						},
						function(){}
				);
			
			}).on("click", ".switch.time", function(){
				var $li = $(this);
				if ($li.hasClass("active_checkbox")) return ;
				
				$.confirm(
						"切换方式后,您当前输入的内容将被清除", 
						"是否确认切换？", 
						function() {
							var timeType = $('.timeType', $schedule).val();
							$("[name=timeType]", $schedule).val(timeType);
							
							$(".switch.custom", $schedule).removeClass("active_checkbox");
							
							if (!$li.hasClass("active_checkbox")) {
								$li.addClass("active_checkbox");
								$(".daily [data-name=schedules]", $schedule).each(function(){
									Tour.current.jsondom.remove($(this));
								});
								$(".daily", $schedule).append(service.getScheduleItem({}, timeType));
								$(".selectTime").val(timeType);
								$(".__add_schedule",$schedule).show();
							}
							$("textarea[tag=edit]", $schedule).each(function(){
								initKindEditor($(this), null, null, Tour.current.lineId);
							});
						},
						function(){}
				);
				
				
			}).on("click", ".__add_schedule", function(){
				if ($("[data-name=schedules]", $schedule).length >= 10) {
					Tour.utils.showError($(this),"最多添加10条日程安排");
					return false;
				}
				var timeType = $("[name=timeType]",$schedule).val();
				$(".daily", $schedule).append(service.getScheduleItem({}, timeType));
				$("textarea[tag=edit]", $schedule).each(function(){
					initKindEditor($(this), null, null, Tour.current.lineId);
				});
			}).on("change", ".timeType", function(){
				var $typeTypeDiv = $(".daily", $schedule);
				
				var type = $(this).val();
				$("[name=timeType]", $schedule).val(type);
				if (type=="AMPM") {
					$(".timeSelect", $typeTypeDiv).hide();
					$("[name=time]",$typeTypeDiv).val("上午");
					$(".ampmSelect",$typeTypeDiv).val("上午").show();
					$(".__time", $schedule).addClass("when2");
					$(".__time", $schedule).removeClass("when");
					
				} else if (type == "TIME") {
					$(".__time", $schedule).addClass("when");
					$(".__time", $schedule).removeClass("when2");
					$(".ampmSelect",$typeTypeDiv).hide();
					$("[name=time]",$typeTypeDiv).val("0:0");
					$(".timeSelect", $typeTypeDiv).val("0").show();
				}
			});
			return $schedule;
			
		},
		getScheduleItem : function(schedule, type){
			type = type || "CUSTOM";
			schedule = schedule || {type : type};
			
			if (type == "CUSTOM") {
				return template("tmp_step_trip_schedule_inshort", schedule);
			}  else {
				
				var $t = $(template("tmp_step_trip_schedule_time", schedule));
				if (type == "AMPM") {
					$(".timeSelect", $t).hide();
					$(".__time", $t).addClass("when2");
					$(".ampmSelect", $t).val(schedule.time);
				} else if (type == "TIME") {
					$(".ampmSelect", $t).hide();
					
					$(".__time", $t).addClass("when");
					if (schedule.time && schedule.time != "") {
						var arr = schedule.time.split(":");
						$(".timeSelect.hour", $t).val(arr[0]);
						$(".timeSelect.minute", $t).val(arr[1]);
					}
				}
				var $time = $("[name=time]",$t);
				$t.on("change",".timeSelect", function(){
					
					var v = $(".timeSelect.hour", $t).val() + ":" + $(".timeSelect.minute", $t).val();
					$time.val(v);
				}).on("change", ".ampmSelect", function(){
					$time.val($(this).val());
				});
				
				
				
				return $t;
			}
			
		},
		//每天
		getDailyTrip : function(trip) {
			
			var $tar = $(template("tmp_step_dailytrip", $.extend({}, trip, {"random" : new Date().getTime()})));
			
			//初始化酒店子项
			if (trip.hotel && trip.hotel.custom != null) {
				if (trip.hotel.custom) {
					$(".hotelInfo", $tar).append(service.getGradeHotel(trip.hotel));
				} else {
					$(".hotelInfo", $tar).append(service.getHotel(trip.hotel));
				}
			}
			
			//初始化交通
			if (trip.traffics && trip.traffics.length > 0) {
				var $traffics = $(".__traffics", $tar);
				var i = 0;
				$(trip.traffics).each(function(){
					$traffics.append(service.getTraffic($.extend({idx : i++ }, this)));
				});
			}
			
			//初始化日程
			$(".daily_trip_item._schedule",$tar).append(service.getSchedule(trip));
			return $tar;
			
		},
		// 设置几晚
		setNightNumber : function(){
			Tour.current.jsondom.refresh($body);
			var nightsOld = Tour.current.data.nights;
			var nights = 0;
			var dailyTrip = Tour.current.data.dailyTrips;
			for (var i = 0 ; i < dailyTrip.length; i++) {
				var hotel = dailyTrip[i].hotel;
				if (null != hotel && null != hotel.custom) {
					nights++;
				}
			}
			
			$("input[name=nights]").val(nights > 0 ? nights : '');
		}
	}
	var $body = $(".input_body #trip");
	var inited = false;
	var currentLoad;
	
	var module = {
			load : function(end) {
				
				$(".mask").show();
				$(".loading-wrap").show();
				var start = currentLoad || currentLoad===0 ? (currentLoad + 1) : 0;
				for (var i = start; i <= end && i < Tour.current.data.dailyTrips.length; i++) {
					var $tar = $(service.getDailyTrip($.extend({idx: i, index:i+1}, Tour.current.data.dailyTrips[i])));
					$(".step_tripBody").append($tar);
					$("textarea[tag=edit]",$tar).each(function(){
						initKindEditor($(this), null, null, Tour.current.lineId);
					});
				}
				if (currentLoad < end ) {
					currentLoad = end >= Tour.current.data.dailyTrips.length ? Tour.current.data.dailyTrips.length - 1 : end;
				}
				$(".mask").hide();
				$(".loading-wrap").hide();
			},
			hide : function(){
				$body.hide();
			},
			show : function(){
				$("#nextBtn").show();
				$("#btnSave").hide();
				var windowHeight = $(window).height();
				if(windowHeight<=750){
					
					$(".days").css({"top":"200px"});
				}
				$body.show();
			},
			clear : function(){
				currentLoad = null;
				inited = false;
				$body.html("");
				$(window).unbind("scroll");
				$(window).unbind("resize");
				init_step_top();
			},
			isInit : function(){
				return inited;
			},
			init : function(config){
				config = config || {init_jsondom_event:true};
				inited = true;
				//日程总模板
				$body.html(template("tmp_step_trip",{}));
				$menuDay = $(".menu_day");

				
				
				
				var pager = (function() {
					//右侧天数菜单
					var page = 1;
					var pagesize = 10;
					
					
					
					var $pagepre = $(".page .pre");
					var $pagenext = $(".page .next");
					//天数菜单
					$pagepre.click(function(){
						pager.prePage();
						pager.refresh();
						
					});
					$pagenext.click(function(){
						pager.nextPage();
						pager.refresh();
					});
					
					
					//右侧天数菜单 end
					return {
						locate : function(day){
							var p = day / pagesize;
							var pint = parseInt(p);

							return p > pint ? pint + 1 : pint;
						},
						load : function(p){
							p = p > pager.lastPage() ? pager.lastPage() : p;
							
							
							
							var start = (p-1) * pagesize;
							$menuDay.html("");
							for (var i = start; i < Tour.current.data.dailyTrips.length && i < start + pagesize; i++) {
								$menuDay.append("<li day='{index}'>第{day}天</li>".template({index:i + 1 , day : toCNNumber(i + 1)}));
							}
							page = p;
							pager.refresh();
							
						},
						lastPage : function(){
							if (Tour.current.data.dailyTrips.length <= 10) {
								return 1;
							} else {
								var p = Tour.current.data.dailyTrips.length/10;
								var pint = parseInt(Tour.current.data.dailyTrips.length/10);
								var last = p > pint ? pint + 1 : pint;
								return last;
							} 
						},
						
						nextPage : function(){
							if (page < pager.lastPage()) {
								pager.load(page + 1);
								return true;
							} else {
								return false;
							}
						},
						prePage : function(){
							if (page > 1) {
								pager.load(page - 1);
								return true;
							} else {
								return false;
							}
						},
						hasNext : function(){
							return page < pager.lastPage();
						},
						hasPre : function(){
							return page > 1
						},
						currentPage : function(){
							return page;
						},
						refresh : function(){
							pager.hasPre() ? $pagepre.addClass("active") : $pagepre.removeClass("active"); 
							pager.hasNext() ? $pagenext.addClass("active") : $pagenext.removeClass("active");
						}
					};
				})();
				
				
				

				var activeMenuDay = function(){
					var scrollTop = $(window).scrollTop();               //滚动条距离顶部的高度
					
					var t = scrollTop < 50 ? 50 : offset;
					//console.log(scrollTop, $(this).height(), $(document).height());
					var arr = $(".daily_trip");
					var day = 1;
					//滚动到底部直接显示最后一天.
					//ps: 细节是魔鬼
					if (scrollTop + $(this).height() >= $(document).height()) {
						 day = arr.length;
					} else {
					    for (var i = 0; i < arr.length; i++) {
					    	var $trip = $(arr[i]);
					    	var top = $trip.offset().top;
					    	if (top + $trip.height() > scrollTop + t) {
					    		day = parseInt($trip.attr("data-index")) + 1;
					    		break;
					    	}
					    }
					}
					var $tar = $("li[day="+day+"]", $menuDay);
					
		    		if ($tar.length==0) {
		    			pager.load(pager.locate(day));
		    		}
		    		$("li.active", $menuDay).removeClass("active");
		    		$("li[day="+day+"]", $menuDay).addClass("active");

				}
				$(window).resize(function(){          //滚动条距离顶部的高度
					var windowHeight = $(window).height();
					var daysHeight=$(".days").height();
					var t=windowHeight-daysHeight;
					if(t<0){
						$(".days").css({"position":"absolute","right": "calc(50% - 473px)","top":"0px"});
					}
					else{
						$(".days").css({"top":t/2+"px"});
					}
				});
				$(window).scroll(function(){
					var scrollTop = $(this).scrollTop();               //滚动条距离顶部的高度
				    var scrollHeight = $(document).height();           //当前页面的总高度
				    var windowHeight = $(this).height();               //当前可视的页面高度
				    activeMenuDay();
				    
				    if (scrollTop + windowHeight + 10 >= scrollHeight) {
				    	if (currentLoad) {
					    	$("#load_day").show();
				    		setTimeout(function(){
				    			module.load(currentLoad + 1);
						    	$("#load_day").hide();
				    		},300);
						}
				    }
				});
				//点击事件.第几天
				$menuDay.on("click", "li",function(){
					var day = parseInt($(this).attr("day"));
					module.load(day - 1);
					
					var top = $(".daily_trip[data-index="+(day-1)+"]").offset().top;
					top -= offset - 50;
					$("html,body").animate({scrollTop:top}, 500);
				}); 
				
				$(".order").click(function(){
					 
					var content = "<ul class='sortable' style='overflow-x:hide;overflow-y:scroll;height:500px;width:200px;'>";
					for(var i=0 ; i<Tour.current.data.dailyTrips.length ;i++){
						content += '<li class="ui-state-default" index="{index}"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>第{day}天</li>'.template({"index" : i+"","day":toCNNumber(i+1)});
					}
					content +="</ul>";
					var d = $.dialog({
						title: "拖动调整行程顺序",
						content: content,
						isOuterBoxShadow: false,
						//show: false,
						isClose: false,
						lock: true,
						fixed: true,
						resize: false,
						opacity: .4,
						isClickShade: false,
						init:function(){
							$(".sortable",this.content()).sortable();
						},
						ok: function(){
							Tour.current.jsondom.refresh($body);
							var idx = 0;
							var oldarr = Tour.current.data.dailyTrips;
							var newarr = new Array();
							
							$("li",this.content()).each(function(){
								var oldidx = parseInt($(this).attr("index"));
								newarr.push(oldarr[oldidx]);
							});
							Tour.current.data.dailyTrips = newarr;
							module.clear();
							module.init({
								init_jsondom_event : false
							});
						},
						okCssClass: "btn-save",
						cancel: $.noop,
						cancelCssClass: "btn-cancel"
					});
				});
				
				
				
				
				
				var $content = $(".step_trip", $body);
				$($content).on("click",".stepBtn", Tour.nextStep)
							.on("click",".addDay", function(){
								if (Tour.current.data.dailyTrips.length == 30) {
									Tour.utils.showError($(this),"最多添加30天行程");
									return false;
								}
								//加载全部天数
								module.load(Tour.current.data.dailyTrips.length);
								var $tar = service.getDailyTrip({index : Tour.current.data.dailyTrips.length + 1});;
								$(".step_tripBody").append($tar);
//								
//								
								$("textarea[tag=edit]",$tar).each(function(){
									initKindEditor($(this), null, null, Tour.current.lineId);
								});
								Tour.current.jsondom.refresh($tar);
								currentLoad = currentLoad != null && currentLoad >=0 ? currentLoad + 1 : 0;
								//菜单移动到最后一页
								pager.load(pager.lastPage());
								
								$("li:last", $menuDay).click();
								
								//添加天数
								$(".all_days").text(Tour.current.data.dailyTrips.length);
							})
							//餐饮
							.on("click",".eat .__click", function(){
								var li = $(this);
								if (li.hasClass("eat_active")) {
									li.removeClass("eat_active");
									li.find("input").val(0);
								} else {
									li.addClass("eat_active");
									li.find("input").val(1);
								}
							})
							//酒店
							.on("click", ".hotels .__grade", function(){
								var li = $(this);
								var item = li.closest(".daily_trip_item");
								$("li.__hotel", item).removeClass("active_checkbox");
								var hotelInfo = item.find(".hotelInfo");
								
								if (li.hasClass("active_checkbox")) {
									li.removeClass("active_checkbox")
									hotelInfo.empty();
									$("input[name='custom']", item).val("");
								} else {
									li.addClass("active_checkbox")
									hotelInfo.html(service.getGradeHotel());
									$("input[name='custom']", item).val(1);
								}
								// 设置几天几晚
								service.setNightNumber();
							})
							//酒店星级事件
							.on("click",".daily_trip_item .unconfirmedHotel li",function(){
								
								var li = $(this);
								$("li", li.parent()).removeClass("active_checkbox");
								li.addClass("active_checkbox");
								li.closest(".unconfirmedHotel").find("input[name='grade']").val(li.attr("tag"));
							})
							//指定酒店
							.on("click", ".hotels .__hotel", function(){
								var li = $(this);
								var item = li.closest(".daily_trip_item");
								$("li.__grade", item).removeClass("active_checkbox");
								var hotelInfo = item.find(".hotelInfo");
								
								if (li.hasClass("active_checkbox")) {
									li.removeClass("active_checkbox")
									hotelInfo.empty();
									$("input[name='custom']", item).val("");
								} else {
									li.addClass("active_checkbox")
									hotelInfo.html(service.getHotel());
									$("input[name='custom']", item).val(0);
									
									//默认添加一条
									$(".__add_hotel_item", item).click();
									$("[data-del-action]", hotelInfo).hide();
								}
								// 设置几天几晚
								service.setNightNumber();
							}).on("click",".daily_trip_item .specificHotel .__add_hotel_item",function(){
								var hotel = $(this).closest(".specificHotel").find(".items");
								if ($("li[data-name=items]", hotel).length >= 5) {
									Tour.utils.showError($(this),"至多填写5个酒店");
								} else {
									hotel.append(service.getHotelItem());
									$("[data-del-action]", hotel).show();
								}
								
							})
							//交通
							.on("click", ".__add_traffics",function(){
								$item = $(this).closest(".daily_trip_item");
								if ($("[data-name=traffics]", $item).length >= 5) {
									Tour.utils.showError($(this),"至多填写5条交通方式");
								} else {
									var $tar = service.getTraffic();
									$(".updateBtn", $tar).hide();
									$item.find(".__traffics").append($tar);
								}
							});
							//日程安排
							
						

				//至顶
				$(".control .top").click(function(){	
					$("html,body").animate({scrollTop:0}, 500);
				});
				
				
				
				
				
				//加载每天日程
				if (Tour.current.data && Tour.current.data.dailyTrips) {
					module.load(2);
				} else {
					for (var i = 0; i < 3; i++) {
						var html = service.getDailyTrip({index:i+1});;
						$(".step_tripBody").append(html);
					}
					Tour.current.jsondom.refresh($body);
					currentLoad = 2;
					pager.load(1);
				}
				$("textarea[tag=edit]").each(function(){
					initKindEditor($(this), null, null, Tour.current.lineId);
				});

				
				//jsondom 事件
				if (config.init_jsondom_event) {
					Tour.current.jsondom.event.beforeRemove.push(function(action, target){
						if (target.attr("data-del-target") == "hotel") {
							if ($("[data-del-target=hotel]",target.parent()).length == 1) {
								Tour.utils.showError($(action),"至少保留1个酒店");
								return false;
							} else if ($("[data-del-target=hotel]",target.parent()).length == 2) {
								$("[data-del-action]", target.parent()).hide();
							}
						};
						return true;
					});
					
					
					Tour.current.jsondom.event.beforeRemove.push(function(action, target){
						if (target.attr("data-del-target") == "schedule") {
							if ($("[data-del-target=schedule]",target.parent()).length == 1) {
								Tour.utils.showError($(action),"至少保留一日安排");
								return false;
							}
						};
						return true;
					});
					
					Tour.current.jsondom.event.beforeRemove.push(function(action, target){
						if (target.attr("data-del-target") == "trip") {
							if (Tour.current.data.dailyTrips.length == 1) {
								Tour.utils.showError($(action),"至少保留1天行程");
								return false;
							}
						};
						return true;
					});
					
					
					Tour.current.jsondom.event.afterRemove.push(function(action, target){
						if (target.attr("data-del-target") == "trip") {
							$("[data-name=dailyTrips]",$body).each(function(){
								var n = parseInt($(this).attr("data-index")) + 1;
								var day = toCNNumber(n);
								$(".__day", this).text('第'+day+'天');
							});
							//当前加载天数减1天
							currentLoad -= 1;
							// 设置几天几晚
							service.setNightNumber();
							
							if (currentLoad < 3){
								module.load(2);
							}
							pager.load(pager.currentPage());
							$(".all_days").text(Tour.current.data.dailyTrips.length);
						}
					});
				}
				
				
				pager.load(1);
				activeMenuDay();
				//几天几晚
				var nights = Tour.current.data.nights;
				$(".all_days").text(Tour.current.data.dailyTrips.length);
				$(".nights").val(nights >= 0 ? nights : "");
			},
			submit : function(){
				var vaild = Tour.utils.vaildDatas();
				
				$("[data-name=departurePlace] [name=id],[data-name=destination] [name=id]").each(function(){
					var $this = $(this);
					if ($this.val() == "") {
						vaild = false;
						Tour.utils.showError($("[name=cnName]", $this.parent()), "请选中列表中的区域.");
					}
				});
				
				if(!vaild) return false;
				
				$("textarea[tag=edit]").each(function(){
					KindEditor.removePlaceholder($(this));
				});
				var day = Tour.current.data.dailyTrips.length;
				var nights = $(".nights").val();
				if("" == nights || null == nights){
					Tour.utils.showError($(".nights"), "此项不能为空");
					return false;
				}
				var temp=/^\d+(\.\d+)?$/;
				if(temp.test(nights) == false){
					Tour.utils.showError($(".nights"), "只能填写数字");
					return false;
				}
				nights = "" == nights || null == nights ? 0 : nights*1;
				if (day > nights && nights >= (day - 3) && nights >= 0) {
					Tour.current.jsondom.refresh($body);
					return true;
				} else {
					var msg = "住宿信息有误，请调整后重试<br>（至少为" + (day + "天" + ((day - 3) > 0 ? (day - 3) : 0)) + "晚，当日添加酒店，则自动+1晚）";
					Tour.utils.showError($(".nights"), msg);
					return false;
				}
			}
	}
	
	w.Tour = w.Tour || {};
	w.Tour.module = w.Tour.module || {};
	w.Tour.module.trip = w.Tour.module.trip || {};
	$.extend(w.Tour.module.trip, module);
}))(jQuery, window);