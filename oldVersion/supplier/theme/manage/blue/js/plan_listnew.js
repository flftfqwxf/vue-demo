Date.prototype.format = function(fmt) {
	if (!fmt)
		fmt = "yyyy-MM-dd";
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
template.helper('dateFormat', function(date) {
	if (!date || date.length < 10)
		return "";
	var d = new Date(date.substring(0, 10).replace(/-/g, "/"));
	return d.format("yyyy年MM月dd日")
});
template.helper('priceFormat', function(price) {
	return parseInt(price || "0");
});
template.helper('join', function(array, separator) {
	return array.join(separator);
});

var Plan = {};
function showBannerImage(obj) {
	obj.find("img").show();
}
function hideBannerImage(obj) {
	obj.find("img").hide();
}

$(function() {
	$(".menu-line").tabUI({
		subElement : "span",
		selectStyle : "selected",
		tabElement : ".tab-content",
		hideStyle : "hide",
		_event : "click"
	});
	$(".mod-select").mgSelect();
	var tabmenu=$("#tabmenu"),bar = tabmenu.height(),barW=tabmenu.closest('.page-main').width(), top = $(".top_info").height(), windowHeight = $(window).height(),
	documentHeight = $(document).outerWidth(true), h = tabmenu.position() + 36,
        isFixed=false;
   // $(window).resize(function () {
   //     if (isFixed) {
   //         barW=tabmenu.closest('.page-main').width();
   //         tabmenu.css({'width':barW});
   //     }

   // })
	var scrolls = function(){
        h = tabmenu.position().top + 46;
		if ($(window).scrollTop() > h && !isFixed) {
            tabmenu.addClass("bar-scroll").css({'width':barW});
			$("#msg").css({
				"position" : "fixed",
				"top" : "50px",
				"background" : "#fff"
			});
            isFixed=true;
		}
		if ($(window).scrollTop() <= h && isFixed) {
            tabmenu.removeClass("bar-scroll").css({'width':'auto'});
			$("#msg").css({
				"position" : "absolute",
				"top" : "200px"
			});
            isFixed=false;
		}
		if (windowHeight == documentHeight) {
			return false;
		}
	}
	if ($(window).scrollTop() > h) {
		$("#tabmenu").addClass("bar-scroll");
		$("#msg").css({
			"position" : "fixed",
			"top" : "50px"
		});
	}
	//$(window).on("scroll", scrolls);
	// add by wuxing 2015-7-30.
	var myDialog, baseInfoTop, groupPriceTop, travelSetTop, addSetTop,
	// 出团计划弹框.
	tourPlanDialog = function(options) {
		var api, wrap, init = options.init, close = options.close, defaults = {
			id : 'tourPlanDialog',
			title : false,
			fixed : true,
			lock : true,			
			minWidth : 940,
			padding : "0px 0px",
            cancel: function(){
            	//return false;
            },
            content : "加载中...",
            button: [
                {
                    name: '保存',
                    className: 'btn-process J_planSave',
                    focus: true,
                    callback: function () {
                        return false;
                    }
                },
                {
                    name: '取消',
                    className: 'btn btn-default J_planCancel',
                    focus: true,
                    callback: function(){
                        return false;
                    }
                }

            ],
			init : function(here) {
				api = this;
				wrap = api.DOM.wrap;
				wrap.find('.aui_content').css({
					'min-width' : '120px',
					'text-align' : 'center',
					//'margin':'-5px',
					'text-align':'left'
				});
				wrap.find('.aui_main').css({
					'padding-top' : '0px'
				});
				wrap.find('.aui_buttons').prepend(' <div class="tip">系统将<strong>优先选择信息更完善的计划</strong>给同行展示,未添加行程、广告的计划显示排名会靠后哦！</div>');
				init && typeof init === 'function' && init();
			},
			close : function() {
				wrap.find('.aui_content').removeAttr("style");
				wrap.find('.aui_main').removeAttr("style");
				wrap.find('.aui_footer').removeAttr("style");
				close && typeof close === 'function' && close();
			}
		}, _tourPlanDialog = artDialog.get('tourPlanDialog');
		if (_tourPlanDialog) {
			_tourPlanDialog.close();
		}
		options.init = undefined;
		options.close = undefined;
		_tourPlanDialog = artDialog($.extend(defaults, options));
		return _tourPlanDialog;
	}, $table = $("#planList"), $lines = $("#menu-line"), params = {}, //page = $(":input[id='curentPage']").val(), 
	$d_price = $("#dialog_price"), $d_price_c = $d_price.find(".J_timeContent"), c = "selected", 
	$planDialog, u = Plan.u, $form, delArr = [], _title;

	$(document).on("click", ".tcpage-content .side-l a", function(e) {
		$(this).siblings("." + c).removeClass(c);
		$(this).addClass(c);
		//$planDialog.find(".listMain").mCustomScrollbar("scrollTo", $("#" + $(this).attr("href").substring(1)));
		$planDialog.find(".listMain").off("scroll", scolls);
	}).on("mouseout", ".tcpage-content .side-l a", function(e) {
		$planDialog.find(".listMain").on("scroll", scolls);
	}).on("click", ".J_add", function(e) {
		e.preventDefault();
		var lineId = $(":input[name='lineId']").val();
		if (!lineId) {
			u.showError($("i",this), "请选择一条专线");
			return false;
		}
		planDialog($(template("planDialog", {lineId : lineId})), {lineId : lineId},'新建出团计划');
	}).on("click", ".J_edit", function(e) {
		e.preventDefault();
		var id = $(this).closest("tr").attr("plan_id");
		$.getJSON("/supplier/tour-plan/" + id + ".json?_=" + Math.random(), function(d) {
			var planData = d && d.plan || {};
			planData["lineId"] = $(":input[name='lineId']").val();
            var planStr=$(template("planDialog", planData)),
                title=$(planStr).find('.tcpage-tilte').html(),
                curTab=$('#menu-line-list li.active a').attr('title');
			planDialog(planStr, planData,'修改出团计划—<span id="touristLineTitle">'+curTab+'</span>');
		})
	}).on("click", ".J_add_tour", function(e) {
		e.preventDefault();
		var id = $(this).closest("tr").attr("plan_id");
		$.getJSON("/supplier/tour-plan/" + id + ".json?_=" + Math.random(), function(d) {
			var planData = d && d.plan || {},curTab=$('#menu-line-list li.active a').attr('title');
			planData["lineId"] = $(":input[name='lineId']").val();
			planDialog($(template("planDialog", planData)), planData,'修改出团计划—<span id="touristLineTitle">'+curTab+'</span>','addTour');
			//$planDialog.find(".listMain").mCustomScrollbar("scrollTo", myDialog.DOM.wrap.find(".J_set_tour"));

		});
	}).on("mouseover", ".get-focus", function() {
		$(this).find(".J_del_plan").show();
	}).on("mouseout", ".get-focus", function() {
		$(this).find(".J_del_plan").hide();
	}).on("click", ".search-btn", function() {
//		$(":input[name='lineId']").val("");  // 2015-11-01 wfq 修改默认选中当前已选中的专线
		//$("#curentPage").val("1");
		//params['page'] = 1;
		u.search();
	}).on("click", ".J_clearSearch", function() {
		$(":input[name='lineId']").val("");
		$(":input[name='name']").val("");
		//$("#curentPage").val("1");
		//params['page'] = 1;
		u.search();
	}).on("click", "#menu-line li:not('.dropdown')", function() {
		var lineId = $(this).find("a").attr("data-line-id");
		if (lineId) {
			$(":input[name='lineId']").val(lineId);
			$(".J_add").attr("data-line-id", lineId);
			$("#curentLineName").text($(this).find("a").attr("data-title"));
		} else {
			$(":input[name='lineId']").val("");
		}
		//$("#curentPage").val("1");
		//params['page'] = 1;
		var parent = $(this).parent();
		if(parent.hasClass("dropdown-menu")) {
			var datas = {
				'lineId': $(":input[name='lineId']").val()
			};
			sortLine(datas);
		} else {
			loadData();
		}
	}).on("click", ".J_charter .J_option", function() {
		var $items = $(this).closest(".dataItems");
		//$charter.find("input[type='radio']").attr("checked", false);
		var val = $(this).find("input[type='radio']").attr("checked", "checked").val();
		$items.find("input[name='charter']").val(val);
	}).on("click", ".J_add_group", addGroup).on("click", ".del_group", function() {
		var curr = $(this).closest(".group");
		if (curr.parent().find("div.group").length == 1) {
			Plan.u.showMsg($(this), {
				msg : "至少添加一组报价"
			})
		} else {
			$.confirm("确认要删除该组报价吗？", "确认提示", function() {
				travelSetTop -= curr.height();
				addSetTop -= curr.height();
				curr.remove();
			}, function() {});
		}
	}).on("click", ".J_del_plan", function() {
		var _this = $(this), data = [];
		$.dialog({
			title: false,
			width: 400,
			height: 120,
			padding : '0 20px',
			isOuterBoxShadow: false,
			content: '<p>计划删除后不可恢复，是否确认?</p>',
			lock: true,
			fixed: true,
			ok: false,
			zIndex: 1000,
			//cancelCssClass: 'btn-process',
			cancel: function () {},
			cancelVal: '取消',
			button: [
				{
					name: '删除',
					className: 'btn-important',
					callback: function () {
						var $tr = _this.closest("tr"), id = $tr.attr("plan_id");
						if (id) {
							delArr.push(id);
						}
						$.each(delArr, function(i) {
							data.push({
								name : "deletes[" + i + "].id",
								value : this
							});
						})
						u.submitForm("/supplier/tour-plan.json", data, function() {
							delArr = [];
							$.cookie('message', '"true_计划删除成功"', {path:'/'});
							u.search();
						});
					}
				}
			]
		});
	}).on("click", ".linkGmServiceThis", function() {
		showLinkGmService(999);//.position('50%', (window.screen.availHeight - 280) / 2 - 100);
	}).on("click", "#pagination .pagenumber a", function(e) {
		// 将分页连接跳转调整为ajax请求
		/*$(window).off("scroll", scrolls);
		e.preventDefault();
		var pageUrl = $(this).attr("href");
		var re = /.*&page=(\d+)/ig;
		var r = re.exec(pageUrl);
		r && r[1] ? params['page'] = r[1] : params['page'] = 1;
		r && r[1] ? $("#curentPage").val(r[1]) : $("#curentPage").val(1);
		loadData();*/
	}).on("keydown", "#searchForm", function(e){
		var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
        	$(":input[name='lineId']").val("");
    		//$("#curentPage").val("1");
    		//params['page'] = 1;
        }
	}).on("mouseover", "div[show-title],a[show-title],i[show-title]", function(d){
		_title = $(this).attr('show-title');
        $("body").append('<div id="tooltip"><pre style="white-space: pre-wrap!important;break-word:break-all;word-wrap:break-word;border:none;background:#000;color:#fff;">' + _title + "</pre></div>"); //创建提示框,添加到页面中
        var left= (d.pageX + 30) + "px",top=d.pageY + "px";
        if ($(this).hasClass('advert')) {
            left=(d.pageX -230) + "px";
            top=(d.pageY -130) + "px";
        }
        $("#tooltip").css({
            'z-index':3,
        	position: "absolute",
        	//maxWidth: "400px",
            //maxHeight: "400px",
            left: left,
            top: top,
            padding: '10px',
            //opacity: "0.8",
            background: "#000",
            breakWord: "break-all",
            wordWrap: "break-word",
            'white-space': "pre-wrap!important",
            'border-radius': '5px',
            'border': '1px solid #ccc'
        }).show() //设置提示框的坐标，并显示
	}).on("mouseout", "div[show-title],a[show-title],i[show-title]", function(d){
		//this.title = _title; //重新设置title
        $("#tooltip").remove() //移除弹出框
	}).on("mousemove", "div[show-title],a[show-title],i[show-title]", function(d){
        var left=(d.pageX + 30) + "px",top=d.pageY + "px";
        if ($(this).hasClass('advert')) {
            left=(d.pageX -230) + "px";
            top=(d.pageY -130) + "px";
        }
		$("#tooltip").css({
            left: left,
            top: top
        })
	});
	
	$('.base-info').click(function(){
		$('.J_main').scrollTop($('#base-info').position().top);
	});
	
	$('.group-price').click(function(){
		$('.J_main').scrollTop($('#group-price').position().top);
	});
	
	$('.travel-set').click(function(){
		$('.J_main').scrollTop($('#travel-set').position().top);
	});
	
	$('.add-set').click(function(){
		$('.J_main').scrollTop($('#add-set').position().top);		
	});
	function planDialog(dialogObj, planData,title,type) {
		$planDialog = dialogObj;
		//var screenHeight = document.documentElement ? document.documentElement.clientHeight : window.screen.availHeight;
		myDialog = tourPlanDialog({
			height : "auto",
			isClickShade : false,
			fixed : true,
            title:title,
			//top:'52%',
			resize: true,
            cancel: function(){
                var cls = $table.find("tr." + c).attr("class");
                if (isFormChanged()) {
                    $.confirm("确认要关闭窗口吗？<br>关闭后您填写数据不会被保存", "确认提示", function() {
                        cls && $table.find("." + cls.replace(c, "").replace(" ", ".")).css({background : "#fff"});
                        myDialog.close();
                    }, function() {});
                    return false;
                } else {
                    cls && $table.find("." + cls.replace(c, "").replace(" ", ".")).css({background : "#fff"});
                    myDialog.close();
                }
            },
            cancelVal: '取消',
            esc: false,
			init : function() {
				$.bindbeforeout();
				//$('body').css('overflow', 'hidden');
				//$planDialog.find(".listMain").css({
				//	position: 'relative',
				//	maxHeight : screenHeight - 220,
				//	overflowX : 'hidden',
				//	overflowY : 'scroll'
				//});
				$d_price = $planDialog.find("#dialog_price");
				$d_price_c = $d_price.find(".J_timeContent");
				$form = $("#planForm").validationEngine({
					validateNonVisibleFields : true,
					validationEventTrigger : "",
					showOneMessage : false,
					maxErrorsPerField : 1,
					promptPosition : "bottomLeft",
					autoHidePrompt: true,
					scroll : true,
					scrollOffset : 100,
					autoHideDelay : 8000,
					focusFirstField : true
				});
				$('#fromcity').querycity({
					defaultText : "",
					data : citysFlight,
					tabs : labelFromcity,
					hotList : hotList,
					selector : $("#choiceCity"),
					callback : function(d) {
						$("#fromcity").val(d.inputText).css('color', '#000');
						$("#cityId").val(d.inputId);
					}
				});
				$("#pop_city_fromcity .close").click(function() {
					$("#pop_city_fromcity").hide()
				});
				inituploadpic();
                //当前为添加行程时，滚动到行程设置的地方
                if (type==='addTour') {
                    $("a[href='#travel-set']").click();
                    $(".aui_content").scrollTo("#travel-set");
                }else{
                    $(".aui_content").scrollTop(0);
                }

			},
			close : function() {
				$('body').css('overflow', 'auto');
				$.unbindbeforeout();
				destoryuploadpic();
			},
			content : $planDialog && $planDialog.length && $planDialog[0],
			zIndex : 201
		});
		myDialog.DOM.wrap.on("change", ":radio[name=type]", function(e, data) {
			$d_price_c.find(".group").remove();
			var type = this.value;
			$.each(data || [ false ], function(k, v) {
				var $new = buildGroupContent(this);
				if (type == "date") {
					$d_price.find(".J_add_group").show();
					// 渲染截止收客模板。
					buildCloseOffDeadline(planData);
					$("#closedOffDeadlineDL").show();
				} else {
					$new.find(".show-date").hide();
					$new.find(".show-everyday").show().find(".cols4").html(template("tpl_price_everyday", this || {}));
					$d_price.find(".J_add_group").hide();
					$("#closedOffDeadline").empty();
					$("#closedOffDeadlineDL").hide();
					$new.find(".cols2 .input.flight").remove();
					var len = $d_price_c.find(".group").length;
					u.hideError($new.find("#extraPrice-" + (len - 1)));
				}
				new Plan.Group($new, this);
				// 去除第一个价格/团期的删除按钮
				if ($d_price_c.find(".group").length > 0) {
					$($d_price_c.find(".group")[0]).find('.del_group').remove();
				}
			})
		}).on("change", "input[type='radio'][name='isSetClosedOffDeadline']", function(){
			if ($(this).val() == 1) {
				$("input[name='closedOffDeadline']").focus();
				$("input[name='closedOffDeadline']").attr("disabled", false);
				var lineOffDeadline = $("input[name='touristLine.id']").attr('data-deadline') || $("select[name='touristLine.id']").find("option:checked").attr("data-deadline");
				$("input[name='closedOffDeadline']").val(lineOffDeadline);
			} else {
				$("input[name='closedOffDeadline']").attr("disabled", "disabled");
			}
		}).on("blur", "#fromcity", function() {
		}).on("focus", "select[name='touristLine.id']", function() {
			$(this).attr("old_val", $(this).val());
		}).on("change", "select[name='touristLine.id']", function() {
			if ($("input[name='tour.id']").val()) {
				var old_val = $(this).attr("old_val");
				var self = $(this);
				$.confirm("确认要更换专线吗？<br>更换后您之前设置的行程数据将会丢失", "确认提示", function() {
					$(":input[name='lineId']").val(self.val());
					$("#touristLineTitle").text(self.find("option:checked").attr("data-name"));
					myDialog.DOM.wrap.find(".tour-plan-edit").hide();
					myDialog.DOM.wrap.find("[name='tour.id']").val("");
					myDialog.DOM.wrap.find(".tour-plan-add").show();
					myDialog.DOM.wrap.find(".tour-plan-edit .tour-plan-name").text("");
				}, function() {
					self.val(old_val);
				});
			}
		}).on("click", ".aui_close,.J_planCancel", function() {
			//var cls = $table.find("tr." + c).attr("class");
			//if (isFormChanged()) {
			//	$.confirm("确认要关闭窗口吗？<br>关闭后您填写数据不会被保存", "确认提示", function() {
			//		cls && $table.find("." + cls.replace(c, "").replace(" ", ".")).css({background : "#fff"});
			//		myDialog.close();
			//	}, function() {});
			//} else {
			//	cls && $table.find("." + cls.replace(c, "").replace(" ", ".")).css({background : "#fff"});
			//	myDialog.close();
			//}
		}).on("click", ".J_planSave", function() {
			if (!isValid()) {
				return false;
			}
			var type = $d_price.find(":radio[name=type]:checked").val(), data = [], valid = true, plan = u.inputToJson($("#planForm .plan")), items = [];
			$(".group", $d_price_c).each(function(k, v) {
				var d = u.inputToJson($(".dataItems", this)), dates = [], prices = [];
				if (type == "date") {
					$(".cols3", this).find(".dataItem").each(function() {
						var t = u.inputToJson($(this))
						dates.push(t);
					});
					if (dates.length == 0) {
						//$d_price_c.mCustomScrollbar("scrollTo", this);
						u.showError($(".dates", this), "至少添加一个日期");
						valid = false;
						return false;
					}
					d.dates = dates;
				}
				var prices = [];
				$(".cols2", this).find(".J_price_table").find(".input-group").each(function() {
					var t = u.inputToJson($(this));
					prices.push(t);
				});
				d.prices = prices;
				d.type = type;
				items.push(d);
			});
			plan.items = items;
			data = u.jsonToInput(plan, "saves[0]");
			if (!valid) {
				return false;
			}
			if (data.length == 0) {
				u.showMsg(e, {msg : "请修改后再保存"});
				return false;
			}
			u.submitForm("/supplier/tour-plan.json", data, function(d) {
				delArr = [];
				var tourId = $planDialog.find(":input[name='id']").val();
				$.cookie('message', '"true_'+ (tourId ? "计划修改成功" : "计划创建成功") +'"', {path:'/'});
				//!tourId && $("#curentPage").val("1");
				u.search(true);
			});
			myDialog.close();
		}).on("click", ".J_set_tour a", function() {
			//$.unbindbeforeout();
			if (!isValid()) {
				return false;
			}
			var dataUrl = $(this).attr("data-url");
			if (dataUrl == "/tour/input?id=") {
				dataUrl += myDialog.DOM.wrap.find("[name='tour.id']").val();
			} else if (dataUrl == "/tour/input?lineId=") {
				dataUrl += myDialog.DOM.wrap.find("[name='touristLine.id']").val() + "&name=" + encodeURIComponent(myDialog.DOM.wrap.find(".plan input[name='name']").val());
			} else {
				dataUrl += myDialog.DOM.wrap.find("[name='touristLine.id']").val();
			}
			window.open(dataUrl);
		}).on("click", ".pop_city a, .list_city a", function(e) {
			e.preventDefault();
		});
		if (planData && planData.items && planData.items[0].type == "everyday") {
			$d_price.find(":radio[value=everyday]")[0].checked = true;
		} else {
			$d_price.find(":radio[value=date]")[0].checked = true;
		}
		
		$d_price.find(":radio:checked").trigger("change", planData && [ planData.items ]);
		// 去除第一个价格/团期的删除按钮
		if ($d_price_c.find(".group").length > 0) {
			$($d_price_c.find(".group")[0]).find('.del_group').remove();
		}
		updateScroll();
		$planDialog.find(".listMain").on("scroll", scolls);
		
		$("input, select, textarea", myDialog.DOM.wrap).each(function(){
			$(this).attr("_value", $(this).val());
		});
		
		// 判断当前form是否有修改。
		var isFormChanged = function(){
			var isChanged = false;
			$("input, select, textarea", myDialog.DOM.wrap).each(function(){
				var _val = $(this).attr("_value");
				if (typeof _val === 'undefined') {
					_val = '';
				}
				if (_val != $(this).val() && $(this).val() != $(this).attr('placeholder')) {
					isChanged = true;
				}
			});
			return isChanged;
		}
	}

	function scolls() {
		if (this.scrollTop >= baseInfoTop) {
			$(".side-l").find("." + c).removeClass(c);
			$(".side-l").find("a[href='#base-info']").addClass(c);
		}
		if (this.scrollTop >= groupPriceTop) {
			$(".side-l").find("." + c).removeClass(c);
			$(".side-l").find("a[href='#group-price']").addClass(c);
		}
		if (this.scrollTop >= travelSetTop) {
			$(".side-l").find("." + c).removeClass(c);
			$(".side-l").find("a[href='#travel-set']").addClass(c);
		}
		
		if (this.scrollTop >= addSetTop) {
			$(".side-l").find("." + c).removeClass(c);
			$(".side-l").find("a[href='#add-set']").addClass(c);
		}
	}
	// 渲染截止收客模板。
	function buildCloseOffDeadline(planData, isOnlyTouristLine) {
		var $closeOffDeadline = myDialog.DOM.wrap.find("#closedOffDeadline");
		var $lineObj = myDialog.DOM.wrap.find("[name='touristLine.id']");
		var recommonDeadLine = $lineObj.attr('data-deadline') || $lineObj.find("option:selected").attr('data-deadline');
		planData && !planData.hasOwnProperty('closedOffDeadline') && (planData['closedOffDeadline'] = recommonDeadLine);
		planData && isOnlyTouristLine && (planData['closedOffDeadline'] = recommonDeadLine);
		var closeOffDeadlineNew = template("tpl_closed_off_deadline", planData || {});
		$closeOffDeadline.html(closeOffDeadlineNew);
	}
	
	function updateScroll(){
		baseInfoTop = $("#base-info").offset().top - $planDialog.find(".listMain").offset().top;
		groupPriceTop = $("#group-price").offset().top - $planDialog.find(".listMain").offset().top;
		travelSetTop = $("#travel-set").offset().top - $planDialog.find(".listMain").offset().top;
		addSetTop = $("#add-set").offset().top - $planDialog.find(".listMain").offset().top;
	}
	// 渲染团期报价模板。
	function buildGroupContent(d) {
		var $lineObj = myDialog.DOM.wrap.find("[name='touristLine.id']");
		var recommendExtraPrice = $lineObj.attr('data-price') || $lineObj.find("option:selected").attr('data-price');
		var len = $d_price_c.find(".group").length;
		d = d && $.extend(d, {recommendExtraPrice : recommendExtraPrice, prideIndex : len}) || {recommendExtraPrice : recommendExtraPrice, prideIndex : len};
		var $new = $(template("tpl_price_group", d || {}));
		$d_price_c.append($new);
		if (!d.extraPrice && d.extraPrice != 0) {
			u.showError($new.find("#extraPrice-" + len), '已根据市场行情自动设置加价金额，若不满意可自行修改', undefined, 'msg');
		}
		//$planDialog.find(".listMain").mCustomScrollbar("update");
		return $new;
	}
	function addGroup(e, d) {
		if (!isValid()) {
			return false;
		}
		var dateItemLen = $($d_price_c.find(".group")[$d_price_c.find(".group").length - 1]).find('.dataItem').length || 0;
		if (dateItemLen < 1) {
			u.showError($($d_price_c.find(".group")[$d_price_c.find(".group").length - 1]).find(".dates"), "至少添加一个日期");
			return false;
		}
		if ($d_price_c.find(".group").length == 10) {
			u.showMsg(e, {msg : "最多可以添加10组报价"});
		} else {
			var $new = buildGroupContent(d);
			new Plan.Group($new, d);
			//$planDialog.find(".listMain").mCustomScrollbar("scrollTo", $new);
			travelSetTop += $new.height();
			addSetTop += $new.height();
			$planDialog.find(".listMain").scrollTo(travelSetTop-450);
		}
	}

	$table.on("click", "tr:gt(0)", function() {
		$table.find("tr." + c).removeClass(c);
		$(this).addClass(c);
	}).on("mouseover", "tr:gt(0)", function() {
		var cls = $(this).attr("class");
		$(this).closest("tbody").find("tr").css({
			background : "#fff"
		});
		$(this).closest("tbody").find("." + cls.replace(c, "").replace(" ", ".")).css({
			background : "#e6e7e9"
		});
	}).on("mouseout", "tr:gt(0)", function() {
		var cls = $(this).attr("class");
		$(this).closest("tbody").find("." + cls.replace(c, "").replace(" ", ".")).css({
			background : "#fff"
		});
	});

	function plan(e, d) {
		if (e && !isValid()) {
			return false;
		}
		var $new = $(template("tpl_plan", d || {}));
		$table.append($new);
		if (d) {
			$new.data("plan", d);
		}
		$(window).scroll();
	}
	
	function line(d) {
		$lines.empty();
		var lines = $(template("tpl_line", d || {}));
		$lines.html(lines);
		$lines.find(".mod-select").mgSelect();
	}
	
	function sortLine(data) {
		$.post("/supplier/tour-plan/line-sort.json?_=" + Math.random(), data, function(d) {
			if (d && d.result && d.result.success) {
				loadData();
			}
		});
	}
	
	function loadData() {
		u.search();
		/*params['lineId'] = $(":input[name='lineId']").val();
		params['name'] = $(":input[name='name']").val() === $(":input[name='name']").attr("placeholder") ? "" : $(":input[name='name']").val();
		$table.find("tr:gt(0)").remove();
		$.getJSON("/supplier/tour-plan.json?_=" + Math.random(), params, function(d) {
			d && line(d);
			d && $.each(d.plans || [ false ], function() {
				plan(false, this);
			});
			d && $("#pageContent").html(d.paginationHtml);
			showAddBtn();
			$(window).on("scroll", scrolls);
			$(window).scroll();
		});*/
	}
	// loadData();
	function isValid() {
		if (window.Placeholders && !Placeholders.nativeSupport) {
			Placeholders.disable($form[0]);
		}
		var flag = $form.validationEngine('validate');
		if (window.Placeholders && !Placeholders.nativeSupport) {
			Placeholders.enable($form[0]);
		}
		return flag;
	}

	function showAddBtn() {
		var len = $table.find("tr").length;
		if (len > 1) {
			$("#addSbtn").show();
			$("#addBbtn").hide();
		} else {
			$("#addBbtn").show();
			$("#addSbtn").hide();
		}
	}
	showAddBtn();
	// 添加行程后的回调函数.
	Plan.afterAddTour = function(tour) {
		//$.bindbeforeout();
		myDialog.DOM.wrap.find("[name='tour.id']").val(tour.id);
		myDialog.DOM.wrap.find(".tour-plan-add").hide();
		var name = tour && tour.name || "";
		name = name.length > 34 ? (name.substr(0, 34) + "...") : name;
		myDialog.DOM.wrap.find(".tour-plan-edit .tour-plan-name").attr("title", tour && tour.name || "");
		myDialog.DOM.wrap.find(".tour-plan-edit .tour-plan-name").text(name);
		myDialog.DOM.wrap.find(".tour-plan-edit").show();
	}
});

(function($) {
	var c = "selected";
	function Group(ctx, data) {
		ctx.on("click", ".J_add_priceitem", addPriceItem).on("click", ".J_price_table .del_tr", function() {
			var curr = $(this).closest("div");
			if (curr.parent().find(">div").length == 1) {
				Plan.u.showMsg($(this), {
					msg : "至少添加一条价格"
				})
			} else {
				curr.remove();
			}
		});
		var $datepicker = ctx.find(".datepicker"), $dates = ctx.find(".dates");
		function addPriceItem(e, d) {
			var $tar = ctx.find(".J_price_table"), len = $tar.find(">div").length;
			if (len >= 5) {
				Plan.u.showMsg(e, {
					msg : "最多可以添加5个价格"
				})
				return false;
			}
			if (!d || !d.prices) {
				d = {
					prices : [ {
						type : len ? "" : "成人价"
					} ]
				}
			}
			var $tpl_price_item = $(template("tpl_price_item", d));

			$tar.append($tpl_price_item);
			// 去除第一个价格的删除按钮
			if ($tar.find('>div').length > 0) {
				$($tar.find('>div')[0]).find('.del_tr').remove();
			}
		}
		function addDateItem(d) {
			$dates.append(template("tpl_price_date_item", d));
			$dates.validationEngine('hide');
		}
		function toDay(m) {
			$datepicker.datepicker("setDate", m);
			$datepicker.find(".ui-state-active").removeClass("ui-state-active");
			$dates.find(".dataItem").each(function() {
				var d = this.id.split("-"), day = parseInt(d[2]);
				$datepicker.find("td[data-month=" + (parseInt(d[1]) - 1) + "][data-year=" + d[0] + "]").each(function() {
					$.trim($(this).text()) == day ? $(this).find("a").addClass(c) : "";
				})
			})
		}
		var datepicker_cfg = function(cfg) {
			return $.extend($.datepicker.regional["zh-CN"], {
				dateFormat : "yy-mm-dd",
				disabled : true,
				showOtherMonths : true,
				selectOtherMonths : true,
				changeAllMonth : true,
				minDate : new Date()
			}, cfg);
		}
		addPriceItem(false, data);
		addDateItem(data);
		var isCharter = data && data.charter || false;
		isCharter = isCharter ? 1 : 0;
		var charterContent = template("tpl_charter", {
			'charter' : isCharter
		});
		ctx.find("[name='airline.name']").autocomplete("/flight/airlines.json", {
			minChars : 0,
			clickFire : true,
			requestParamName : "code",
			showOthers : false,
			pagination : false,
			hotType : charterContent, // 设置头部
			width : 168,
			top : 34,
			noDataShow : true,
			extraParams : {
				size : 100,
				count : 100
			},
			parse : function(data) {
				var parsed = [];
				var rows = $.isArray(data) ? data : data.airlines;
				if (rows && rows.length) {
					for (var i = 0; i < rows.length && i < 6; i++) {
						var row = rows[i];
						parsed.push({
							data : row,
							value : row.name,
							result : row.name
						})
					}
				}
				return parsed;
			},
			formatItem : function(row, i, max) {
				if (!row.name)
					return "";
				return row.code + " " + row.name;
			},
			renderCallback : function(data){
				var rows = $.isArray(data) ? data : new Array();
				var $hot = $(this).parent().find(".ac_results");
				var $tips = "<span class='tips' style='margin: 5px 6px;text-align:center;color:#757575;'>*点击航空公司名称完成选择</span>";
				//if (rows.length > 0) {
				//	$hot.find(".hottip").show();
				//} else {
				//	$hot.find(".hottip").hide();
				//}
				if (rows.length > 0 && $hot.find(".tips").length == 0) {
					$hot.append($tips);
				} else if (rows.length == 0){
					$hot.find(".tips").remove();
				}
			}
		}).result(function(v, d) {
			var $itemsObj = $(this).closest(".dataItems");
			$itemsObj.find(":input[name='airline.id']").val(d && d.id || "");
			$itemsObj.find(":input[name='airline.code']").val(d && d.code || "");
			if (!d) {
				$itemsObj.find(":input[name='airline.id']").val("");
				$itemsObj.find(":input[name='airline.code']").val("");
				$(this).css("color", "#a3a3a3");
			}

		});
		$datepicker.each(function(i) {
			var $self = $(this);
			if ($self.is("input")) {
				$self.datepicker(datepicker_cfg({
					disabled : false,
					onSelect: function(){
						$(this).removeClass("placeholdersjs");
					}
				}));
			} else {
				$self.on("mousedown", "a", function(e) {
					var $t = $(this), h = $t.attr("data-handler");
					if (h) {
						var t = $self.find(".ui-datepicker-calendar").find("td:eq(10)"), date = getDateByStr(t);
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						if (h == "next")
							date.setMonth(date.getMonth() + 1);
						else if (h == "prev")
							date.setMonth(date.getMonth() - 1);
						toDayShow($self, date.format(), defaultValues);
					} else if ($t.parent().attr("data-year") && $t.parent().attr("data-month")) {
						var date = getDateByStr($t.closest("td"));
						if ($t.hasClass(c)) {
							$t.removeClass(c);
							$("#" + date.format(), $dates).remove();
						} else {
							if ($dates.find(".dataItem").length > 29) {
								Plan.u.showMsg(e, {
									msg : "最多可以添加30个日期"
								})
								return false;
							}
							$t.closest("td").attr("date-id", date.format());
							$t.addClass(c);
							addDateItem({
								dates : [ {
									date : date.format()
								} ]
							});
						}
					}
				}).datepicker(datepicker_cfg({
					monthSetCallBack : function(inst) {
						var str = (inst.selectedYear
								+ "-"
								+ (inst.selectedMonth + 1)
								+ "-"
								+ inst.selectedDay + " 00:00:00")
								.replace(/-/g, "/");
						var dateThis = new Date(str);
						inst.input.datepicker("setDate", dateThis.format());
						inst.dpDiv.find(".ui-state-active").removeClass("ui-state-active");
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						$.datepicker._selectDiyDays(inst, defaultValues);
					}
				}));
				var defaultValues = new Array();
				$dates.find(".dataItem").each(function() {
					defaultValues.push(this.id);
				});
				toDayShow($self, $dates.find(".dataItem:eq(0)").attr("id") || new Date().format(), defaultValues);
			}
		});

		// 团期删除按钮绑定事件
		$dates.on("click", "i.del_date_item", function() {
			var dateItemLen = $dates.find('.dataItem').length;
			if (dateItemLen <= 1) {
				Plan.u.showMsg($dates, {
					msg : "至少添加一个日期"
				});
				return false;
			}
			$($datepicker.find("td[date-id='" + $(this).closest(".dataItem").attr("id") + "']")).find("a." + c).removeClass(c);
			$(this).closest(".dataItem").remove();
		});
	}
	Plan.Group = Group;

})(jQuery);

;(function($, w) {
	function inputToJson($s) {
		var t = {};
		$s.find("select:enabled,textarea:enabled,:text:enabled,input:hidden").each(function() {
			if (this.value == "" && $(this).attr("notempty") || this.name == "") {
				return;
			}
			if ($(this).val() == $(this).attr("placeholder")) {
				$(this).val("");
			}
			var arr = this.name.split(".");
			if (arr.length > 1) {
				if (!t[arr[0]]) {
					t[arr[0]] = {};
				}
				t[arr[0]][arr[1]] = this.value;
			} else {
				t[this.name] = this.value;
			}
		})
		return t;
	}
	function jsonToInput(json, p) {
		var data = [];
		$.each(json, function(k, v) {
			if (v == null) {
				return;
			}
			var o = {}, n = p + "." + k.replace("_", ".");
			if ($.isArray(v)) {
				$.each(v, function(i) {
					data = data.concat(jsonToInput(this, n + "[" + i + "]"));
				})
			} else if ($.isPlainObject(v)) {
				data = data.concat(jsonToInput(this, n));
			} else {
				o.name = n;
				o.value = v;
				data.push(o);
			}
		})
		return data;
	}

	var timer = null;
	function showMsg(e, msg, time) {
		if (!e.pageX) {
			var p = e.offset();
			e.pageX = p.left + (e.width() / 2);
			e.pageY = p.top + e.height();
		}
		var $msg = $("#msg");
		$msg.length && hide();
		$msg = $(template("tpl_msg", msg)).appendTo("body");
		$msg.css({
			top : e.pageY + 10 + "px",
			left : e.pageX - 10 + "px",
			zIndex : 999
		}).show().on("mouseover", function() {
			timer && clearTimeout(timer);
		}).on("mouseout setTimer", function() {
			timer = setTimeout(function() {
				hide();
			}, time || 3000);
		}).on("click", function() {
			$(this).remove();
		}).trigger("setTimer");
		function hide() {
			timer && clearTimeout(timer);
			$msg.remove();
		}
	}
	function submitForm(url, data, callback) {
		$.post(url, data, function(d) {
			if (d.result && !d.result.success) {
				$.cookie('message', '"false_操作失败，请稍后重试"', {path:'/'});
			} else {
				callback && callback(d);
			}
		}, 'json').fail(function() {
			$.gmMessage("操作失败，请稍后重试");
		}).always(function() {
			/*$(".loading-wrap").show();
			setTimeout(function() {
				$(".loading-wrap").hide();
			}, 700);*/
		});
	}
	function showError($tar, msg, pos, type) {
		$tar.validationEngine('showPrompt', msg, type || 'error', pos, true);
	}

	function hideError($tar) {
		$tar.validationEngine('hide');
	}

	function search(isClearName) {
		var $searchName = $("#searchForm").find("input[name='name']");
		if ($searchName.val() == $searchName.attr("placeholder") || isClearName) {
			$searchName.val("");
		}
		$("#searchForm").submit();
	}
	w.u = {
		inputToJson : inputToJson,
		jsonToInput : jsonToInput,
		showMsg : showMsg,
		showError : showError,
		hideError : hideError,
		submitForm : submitForm,
		search : search
	}	
})(jQuery, Plan)

/**
 * jQuery.ScrollTo
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 9/11/2008
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * Tested with jQuery 1.2.6. On FF 2/3, IE 6/7, Opera 9.2/5 and Safari 3. on Windows.
 *
 * @author Ariel Flesler
 * @version 1.4
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 * @param {Number} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @dec Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @ Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */
;(function( $ ){
	
	var $scrollTo = $.scrollTo = function( target, duration, settings ){
		$(window).scrollTo( target, duration, settings );
	};

	$scrollTo.defaults = {
		axis:'y',
		duration:1
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function( scope ){
		return $(window).scrollable();
	};

	// Hack, hack, hack... stay away!
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn.scrollable = function(){
		return this.map(function(){
			// Just store it, we might need it
			var win = this.parentWindow || this.defaultView,
				// If it's a document, get its iframe or the window if it's THE document
				elem = this.nodeName == '#document' ? win.frameElement || win : this,
				// Get the corresponding document
				doc = elem.J_timeContentDocument || (elem.J_timeContentWindow || elem).document,
				isWin = elem.setInterval;

			return elem.nodeName == 'IFRAME' || isWin && $.browser.safari ? doc.body
				: isWin ? doc.documentElement
				: this;
		});
	};

	$.fn.scrollTo = function( target, duration, settings ){
		if( typeof duration == 'object' ){
			settings = duration;
			duration = 0;
		}
		if( typeof settings == 'function' )
			settings = { onAfter:settings };
			
		settings = $.extend( {}, $scrollTo.defaults, settings );
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.speed || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;
		
		if( settings.queue )
			// Let's keep the overall duration
			duration /= 2;
		settings.offset = both( settings.offset );
		settings.over = both( settings.over );

		return this.scrollable().each(function(){
			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch( typeof targ ){
				// A number will pass the regex
				case 'number':
				case 'string':
					if( /^([+-]=)?\d+(px)?$/.test(targ) ){
						targ = both( targ );
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ,this);
				case 'object':
					// DOMElement / jQuery
					if( targ.is || targ.style )
						// Get the real position of the target 
						toff = (targ = $(targ)).offset();
			}
			$.each( settings.axis.split(''), function( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					Dim = axis == 'x' ? 'Width' : 'Height',
					dim = Dim.toLowerCase();

				if( toff ){// jQuery / DOMElement
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

					// If it's a dom element, reduce the margin
					if( settings.margin ){
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;
					}
					
					attr[key] += settings.offset[pos] || 0;
					
					if( settings.over[pos] )
						// Scroll to a fraction of its width/height
						attr[key] += targ[dim]() * settings.over[pos];
				}else
					attr[key] = targ[pos];

				// Number or 'number'
				if( /^\d+$/.test(attr[key]) )
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max(Dim) );

				// Queueing axes
				if( !i && settings.queue ){
					// Don't waste time animating, if there's no need.
					if( old != attr[key] )
						// Intermediate animation
						animate( settings.onAfterFirst );
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});			
			animate( settings.onAfter );			

			function animate( callback ){
				$elem.animate( attr, duration, settings.easing, callback && function(){
					callback.call(this, target, settings);
				});
			};
			function max( Dim ){
				var attr ='scroll'+Dim,
					doc = elem.ownerDocument;
				
				return win
						? Math.max( doc.documentElement[attr], doc.body[attr]  )
						: elem[attr];
			};
		}).end();
	};

	function both( val ){
		return typeof val == 'object' ? val : { top:val, left:val };
	};	
	
	/*function changcolor(obj){
		if(obj.value !="test"){
			$('.search-box input').css({'color':'#000'});
		}else{
			$('.search-box input').css({'color':'#000'});
		}
	};*/
})( jQuery );