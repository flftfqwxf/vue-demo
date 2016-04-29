Date.prototype.format = function (fmt) {
	if(!fmt)fmt = "yyyy-MM-dd";
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
template.helper('dateFormat', function (date) {
	if(!date || date.length<10)
		return "";
	var d = new Date(date.substring(0,10).replace(/-/g,"/"));
	return d.format("M月d日")
});
template.helper('priceFormat', function (price) {
	return parseInt(price || "0");
});
var Plan = {};
var tabs; // tab选项卡
$(function() {
	tabs = $( "#plan-prices" ).tabs();
	// 关闭图标：当点击时移除标签页
    tabs.delegate( "span.ui-icon-close", "click", function() {
    	var len = $d_price_c.find(".group").length;
    	if(len==1){
    		Plan.u.showMsg($(this),{msg: "至少添加一组报价"})
    	} else {
    	    var panelId = $(this).closest("li").remove().attr("aria-controls");
    	    $("#" + panelId).remove();
    	    $d_price_c.find(".group").each(function(k,v){
    	    	$(this).attr('id', $(this).attr('id').replace(/\d+/, k+1));
    	    });
    	    $d_price_tab.find('.ui-state-default').each(function(k,v){
    	    	$(this).find('a').attr('href', $(this).find('a').attr('href').replace(/\d+/, k+1));
    	    	$(this).find('a').text($(this).find('a').text().replace(/\d+/, k+1));
    	    });
    	    tabs.tabs("refresh");
    		if(len<=10) {
    			$d_price_tab.find('.add_group').remove();
    			$d_price_tab.append($add_group);
    		}
    	}
    });
	var c = "selected",$table = $("#planList"), delArr = [], u = Plan.u,
		$form = $("#form").validationEngine({validateNonVisibleFields:false,maxErrorsPerField:1,promptPosition:"bottomLeft:-20,0",scroll:true,scrollOffset:100,autoHidePrompt:false,autoHideDelay:10000,focusFirstField:true});
	var dialog_cfg = function(cfg){
		return $.extend({
			appendTo:$form,
			resizable : false,
			position: { my: "center top", at:"center top",of:"#form"},
			autoOpen : false,
			dialogClass: "dialog_custom",
			modal : true,
			width : 900
		},cfg);
	}
	
	$(document).on("mouseover","a[tip]",function(e){
		u.showMsg(e,{msg:$(this).attr("tip")},100000)
	}).on("mouseout", "a[tip]", function(e) {
		u.showMsg(e,{msg:$(this).attr("tip")},1)
	}).on("click", ".add_price", function() {
		if(!isValid())
			return false;
		var $tar = $(this).closest("tr");
		var recommendExtraPrice = $tar.find("[name='touristLine.id']").attr('data-price') || $tar.find("[name='touristLine.id']").find("option:selected").attr('data-price');
		if ($table.find("tr."+c).data() && $table.find("tr."+c).data('items')) {
			$table.find("tr."+c).data('items')['recommendExtraPrice'] = recommendExtraPrice;
		} else {
			$table.find("tr."+c).data('items', {recommendExtraPrice: recommendExtraPrice});
		}
		$d_price.dialog("open");
	}).on("click",".del_plan",function(){
		var _this = $(this);
		$.confirm("确认删除吗?", "操作提示", function(){
			var $tr = _this.closest("tr"),id = $tr.attr("plan_id"); 
			if(id){
				u.showMsg($("#saveBtn"),{msg:"删除计划后，需要点击保存才会生效哦~"})
				delArr.push(id);
			}
			$tr.remove();
		},function(){});
		return false;
	}).on("click",".add_plan",addPlan).on("click",".add_ad",function(){
		if(!isValid())
			return false;
		$d_ad.dialog("open");
	}).on("click",".add_group",addGroup).on("click",".preview_link",function(){
		if(!isValid())
			return false;
		$d_preview.dialog("open");
	}).on("click",".save_btn",function(e){
		if(!isValid())
			return false;
		var data = [],valid = true;
		$table.find("tr.changed").each(function(i){
			var d = getTRData.call(this);
			if(d.items && d.items.length){
				data = data.concat(u.jsonToInput(d,"saves["+i+"]"));
			}else{
				valid = false;
				u.showMsg($(".add_price",this),{msg:"请添加发团日期 及 报价信息"})
				return false;
			}
		})
		if(!valid)
			return false;
		$.each(delArr,function(i){
			data.push({name:"deletes["+i+"].id",value:this});
		})
		if(data.length == 0){
			u.showMsg(e,{msg:"请修改后再保存"});
			return false;
		}
		u.submitForm("/supplier/tour-plan/input.json",data,function(){
			delArr = [];
			loadData();
		})
	}).on("click",".add_tour",function(e){
		var $tar = $(this).closest("tr");
		var lineId = $tar.find("[name='touristLine.id']").val();
		if(!lineId){
			u.showMsg(e,{msg:"请先选择专线"})
			return false;
		}
		window.open("/supplier/tour/input?lineId="+lineId+"&planId="+($tar.attr("plan_id")||"")+"&id="+($tar.attr("tour_id")||"")+"&choosed="+($tar.attr("choosed")||"0"))
		return false;
	}).on("focus", "input[id^='extraPrice-']", function(){
		u.hideError($(this));
	}).on("click", ".charter .option", function(){
		var charter = $(this).closest(".charter");
		$("input[type=radio]",charter).attr("checked", false);
		var val = $("input[type=radio]",this).attr("checked","checked").val();
		$('input[type=hidden]', charter).val(val);
	});
	
	$(window).on('beforeunload', function(){
		if($table.find("tr.changed").length || delArr.length){
			return "您未保存的内容将会丢失！";
		}
	});
	
	
	var lineId;
	$table.on("click","tr",function(){
		$table.find("tr."+c).removeClass(c);
		$(this).addClass(c);
	}).on("mod","tr.org",function(){
		$(this).addClass("changed").removeClass("org");
	}).on("change",".org :input",function(){
		$(this).closest("tr").trigger("mod");
	}).on("change","select",function(){
		var $this = $(this), $tr = $this.closest("tr"),$tour = $tr.find("[name='tour.id']");
		var tourId = $tour.val();
		if(tourId && lineId != $this.val()){
			$.confirm(
					"若修改专线，您将需要重新添加行程，是否确认？", 
					"确认提示", 
					function(){
						$tour.val("");
						$tr.find(".add_tour").text("添加行程");
					}, 
					function(){$this.val(lineId);}
				)
			return false;
		}
		lineId = $this.val();
	})
	
	function getTRData(){
		var $t = $(this),t = u.inputToJson($t), items = $t.data("items"), ads = $t.data("ad");
		return $.extend(ads,t,items);
	}
	function addPlan(e,d){
		if(e && !isValid())
			return false;
		var $new = $(template("tpl_plan",d || {}));
		$table.append($new);
		if(d){
			$new.data("items",{items:d.items})
			$new.data("ad",d);
		} else {
			// 新添加的计划，专线列表默认打开
			var elem = $new.find("[name='touristLine.id']");
			setTimeout(function(){
				if (document.createEvent) {
			        var e = document.createEvent("MouseEvents");
			        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			        elem[0].dispatchEvent(e);
			    } else if (element.fireEvent) {
			    	elem[0].fireEvent("onmousedown");
			    }
			}, 10);
		}
	}
	function loadData(){
		$table.find("tr:gt(0)").remove();
		$.getJSON("/supplier/tour-plan/list.json?_="+Math.random(),function(d){
			d && $.each(d.plans || [false],function(){
				addPlan(false,this);
			})
		})
	}
	loadData();
	
	
	var $d_preview = $("#dialog_preview"),$d_preview_c = $d_preview.find(".content");
	$d_preview.dialog(dialog_cfg({
			width:940,
			open:function(){
				$d_preview_c.find("tr:gt(0)").remove();
				var $tar = $d_preview_c.find("table");
				$table.find("tr:gt(0)").each(function(){
					var data = getTRData.call(this);
					$tar.append(template("tpl_preview",data));
				})
				$d_preview.find("li[index="+($d_preview.attr("bgIndex") || 1)+"]").click();
				$d_preview_c.mCustomScrollbar();
			},
			close:function(){
				$d_preview_c.mCustomScrollbar("destroy");
			}
		})).on("click",".imagebar li",function(){
			var $t = $(this);
			$t.siblings("."+c).removeClass(c);
			$t.addClass(c);
			var path = $t.find("img").attr("src").replace(".png","_.png");
			$d_preview_c.css("background","url("+path+")")
		}).on("click",".save",function(){
			var id = $d_preview.find("li."+c).attr("index");
			u.submitForm("/supplier/tour-plan/background/"+id+".json",null,function(){
				$d_preview.attr("bgIndex",id);
			})
			$d_preview.dialog("close");
		}).on("click",".cancel",function(){
			$d_preview.dialog("close");
		})
	

	var $d_ad = $("#dialog_ad").dialog(dialog_cfg({
		width:700,
		height:430,
		open:function(){
			var data = $table.find("tr."+c).data("ad");
			$d_ad.find(".content").html(template("tpl_ad",data || {}))
			//u.initUploader($d_ad);
			/**add by zlm**/
			 var doingUp = $(".doingUp");
			 $(".success").hide();
			 inituploader002("#beforeUpbtd",doingUp,function(response){
				 $(".success").show();//显示成功
				 doingUp.html("");//清空上传进度
				 //alert(response.url);
				 var img = $(".col1").find(".pic").find("img");
				 if(img.html()){
					 img.attr("src",response.url);
					}else{
						$(".col1").find(".pic").append("<img src='"+response.url+"' />")
				}
				 setTimeout(function() {
			 			$(".success").hide();
				 }, 3000);
			 });
			 /*****end****/
		},
		close:function(){
			//$table.find("tr."+c).removeClass(c);
		}
	})).on("click",".cancel",function(){
		$d_ad.dialog("close");
	}).on("click",".save",function(){
		if(!isValid())
			return false;
		Placeholders.disable(document.getElementById("form"));
		var t = u.inputToJson($d_ad);
		$table.find("tr."+c).data("ad",t).trigger("mod").find(".add_ad").html("<i><img src='/supplier/theme/manage/blue/images/tourplan/edit.png'></i>已添加，点击修改");
		Placeholders.enable(document.getElementById("form"));
		$d_ad.dialog("close");
	})
	
	var $d_price = $("#dialog_price");$d_price_c = $d_price.find(".content"),$d_price_tab = $d_price.find('.plan-prices-tabs'),
		$add_group= $(template("tpl_price_add_group",{}));
	$d_price.dialog(dialog_cfg({
		width:900,
		open:function(){
			$d_price_c.empty().mCustomScrollbar({theme:"dark"});
			$d_price_tab.empty();
			var data = $table.find("tr."+c).data("items");
			if(data && data.items && data.items[0].type == "everyday"){
				$d_price.find(":radio[name=type][value=everyday]")[0].checked = true;
			}else{
				$d_price.find(":radio[name=type][value=date]")[0].checked = true;
			}
			$d_price.find(":radio[name=type]:checked").trigger("change",data);
		},
		close:function(){
			//$table.find("tr."+c).removeClass(c)
			$d_price_c.mCustomScrollbar("destroy");
		}
	})).on("change",":radio[name=type]",function(e,data){
		$d_price_c.find(".group").remove();
		$d_price_tab.empty();
		var type = this.value;
		$.each(data && data.items || [false],function(k, v){
			var $new = buildGroupContent(this);
			if(type == "date"){
				$d_price_tab.show();
				//$d_price.find(".add_group").show();
				$d_price.find(".everyday_tip").hide();
			}else{
				$d_price_tab.hide();
				$new.find(".col1").html(template("tpl_price_everyday",this || {})).height(150)
				//$d_price.find(".add_group").hide();
				$d_price.find(".everyday_tip").show();
			}
			new Plan.Group($new,this);
		})
	}).on("click",".cancel",function(){
		$d_price.dialog("close");
	}).on("click",".del_tr",function(){
		var curr = $(this).closest("tr");
		if (curr.parent().find("tr").length == 1) {
			Plan.u.showMsg($(this),{msg: "至少添加一条价格"})
		} else {
			curr.remove();
		}
	}).on("click",".save",function(){
		if(!isValid())
			return false;
		var type = $d_price.find(":radio[name=type]:checked").val(),items = [], data = {type:type}, valid = true;
		$(".group",$d_price_c).each(function(k, v){
			var d = u.inputToJson($(".input",this)), dates = [], prices = [];
			if(type == "date"){
				$(".col1",this).find(".item").each(function(){
					var t = u.inputToJson($(this))
					dates.push(t);
				})
				if(dates.length == 0){
					$d_price_c.mCustomScrollbar("scrollTo",this);
					tabs.tabs({active: k});
					u.showError($(".dates",this),"至少添加一个日期");
					valid = false;
					return false;
				}
				d.dates = dates;
			}
			var prices = [];
			$(".col2",this).find("tr").each(function(){
				var t = u.inputToJson($(this))
				prices.push(t);
			})
			d.prices = prices;
			
			d.type = type;
			items.push(d);
		})
		if(!valid)
			return false;
		data.items = items;
		$table.find("tr."+c).data("items",data).trigger("mod").find(".add_price").text("已添加，点击修改")
		$d_price.dialog("close");
	})
	
	function buildGroupContent(d){
		var recommendExtraPrice = $table.find("tr."+c).data('items')['recommendExtraPrice'] || 0;
		var len = $d_price_c.find(".group").length;
		d = d && $.extend(d, {recommendExtraPrice:recommendExtraPrice,prideIndex:len}) || {recommendExtraPrice:recommendExtraPrice,prideIndex:len};
		var $new = $(template("tpl_price_group",d||{}));
		$d_price.find(".mCSB_container").append($new);
		$d_price_tab.find('.add_group').remove();
		$d_price_c.mCustomScrollbar("update");
		if (!d.extraPrice && len==0) {
			u.showError($new.find("#extraPrice-"+len),'已根据市场行情自动设置加价金额，若不满意可自行修改',undefined,'msg');
		}
		// 给tab 的内容加上id.
		$new.attr('id', "plan-price-" + (len+1));
		// 加tab标签.
		$d_price_tab.append($(template("tpl_price_tab",{len:len+1})));
		$d_price_tab.append($add_group);
		return $new;
	}
	function addGroup(e,d){
		if(!isValid()){
			return false;
		}
		var groupId = $(this).prev('li').find('a').attr('href').replace('#', '');
		var dateItemLen = $('#' + groupId).find('.dates .item').length;
		tabs.tabs({active: $('#' + groupId).index()});
		if (dateItemLen < 1) {
			u.showError($('#' + groupId).find('.dates'),"至少添加一个日期");
			return false;
		}
		var len = $d_price_c.find(".group").length;
		if(len==10){
			u.showMsg(e,{msg:"最多可以添加10组报价"});
		}else{
			var $new = buildGroupContent(d);
			new Plan.Group($new,d);
			$d_price_c.mCustomScrollbar("scrollTo",$new);
		}
	}
	
	function isValid(){
		return $form.validationEngine('validate');
	}
	
	Plan.afterAddTour = function(tour){
		var $tar = $table.find("tr."+c).addClass("changed");
		$tar.find("[name='tour.id']").val(tour.id);
		$tar.attr("tour_id",tour.id).attr("choosed",1);
		$tar.find("span").text("修改行程");
		u.showMsg($tar.find(".add_tour"),{msg:"行程添加成功<br>点这里可以修改"});
	}
});










(function($){
	var c = "selected";
	function Group(ctx,data){
		ctx.on("click",".add_priceitem",addPriceItem)
		var $dates = ctx.find(".dates"),$datepicker = ctx.find(".datepicker");
		function addPriceItem(e,d){
			var $tar = ctx.find(".price_table"),len = $tar.find("tr").length;
			if(len == 10){
				Plan.u.showMsg(e,{msg:"最多可以添加10个价格"})
				return false;
			}
			if(!d || !d.prices){
				d = {prices:[{type:len?"":"成人价"}]}
			}
			var $tpl_price_item = $(template("tpl_price_item",d));
			
			$tar.append($tpl_price_item);
			// 去除第一个价格的删除按钮
			if ($tar.find('tr').length > 0) {
				$($tar.find('tr')[0]).find('.del_tr').remove();
			}
		}
		function addDateItem(d){
			$dates.append(template("tpl_price_date_item",d));
			$dates.validationEngine('hide');
		}
		function toDay(m){
			$datepicker.datepicker("setDate",m);
			$datepicker.find(".ui-state-active").removeClass("ui-state-active");
			$dates.find(".item").each(function(){
				var d = this.id.split("-"),day = parseInt(d[2]);
				$datepicker.find("td[data-month="+(parseInt(d[1])-1)+"][data-year="+d[0]+"]").each(function(){
					$.trim($(this).text()) == day ? $(this).find("a").addClass(c):""; 
				})
			})
		}
		
		var datepicker_cfg = function(cfg){
			return $.extend($.datepicker.regional["zh-CN"],{
				dateFormat:"yy-mm-dd",
				disabled:true,
				showOtherMonths: true,
			    selectOtherMonths: true,
			    changeAllMonth: true,
			    minDate: new Date()
			},cfg);
		}

		addPriceItem(false,data);
		addDateItem(data);
		if($datepicker.is("input")){
			$datepicker.datepicker(datepicker_cfg({disabled:false}))
		}else{
			
			var isCharter = data && data.charter || false;
			isCharter = isCharter ? 1 : 0;
			var charterContent = template("tpl_charter", {'charter' : isCharter});
			ctx.find("[name='airline.name']").autocomplete("/flight/airlines.json", {
				minChars: 0,
				clickFire:true,
				requestParamName: "code",
				showOthers: false,
				pagination: false,
				hotType: charterContent,  // 设置头部
				width:210,
				noDataShow: true,
				extraParams:{size:100,count:100},
				parse:function(data){
					var parsed = [];
					var rows = $.isArray(data) ? data : data.airlines;
					if(rows && rows.length){
						for (var i=0; i < rows.length && i < 6; i++) {
							var row = rows[i];
							parsed.push({
								data: row,
								value: row.name,
								result: row.name
							})
						}
					}
					
					return parsed;
				},
				formatItem: function(row, i, max) {
					if(!row.name)
						return "";
					return row.code+" "+row.name;
				}
			}).result(function(v,d){
				var prevHiddenInput = $(this).prev("input");
				prevHiddenInput.val(d && d.id || "");
				prevHiddenInput.prev("input").val(d && d.code || "");
			});
			
			$datepicker.on("mousedown","a",function(e){
				var $t = $(this),h = $t.attr("data-handler");
				if(h){
					var t = $datepicker.find(".ui-datepicker-calendar").find("td:eq(10)"),date = getDateByStr(t);
					var defaultValues = new Array();
					$dates.find(".item").each(function(){
						defaultValues.push(this.id);
					});
					if(h == "next") date.setMonth(date.getMonth()+1);
					else if(h == "prev") date.setMonth(date.getMonth()-1);
					toDayShow($datepicker, date.format(), defaultValues);
				}else if($t.parent().attr("data-year") && $t.parent().attr("data-month")){
					var date = getDateByStr($t.closest("td"));
					if($t.hasClass(c)){
						$t.removeClass(c);
						$("#"+date.format(),$dates).remove();
					}else{
						if($dates.find(".item").length>29){
							Plan.u.showMsg(e,{msg:"最多可以添加30个日期"})
							return false;
						}
						$t.addClass(c);
						addDateItem({dates:[{date:date.format()}]});
					}
				}
			}).datepicker(datepicker_cfg());
			$datepicker.on("click", ".show-all-month-li", function(){
				if(!this.getAttribute("month-disabled")){
					var defaultValues = new Array();
					$dates.find(".item").each(function(){
						defaultValues.push(this.id);
					});
					dpAllMonthLi($datepicker, this.getAttribute("data-month")*1, defaultValues);
				}
			});
			var defaultValues = new Array();
			$dates.find(".item").each(function(){
				defaultValues.push(this.id);
			});
			toDayShow($datepicker, $dates.find(".item:eq(0)").attr("id")||new Date().format(), defaultValues);
//			toDay($dates.find(".item:eq(0)").attr("id")||new Date().format());
		}
		// 新加一组价格，刷新tab标签.
		tabs.tabs("refresh");
		var len = $d_price_c.find(".group").length;
		//去除第一个tab的删除按钮.
		if (len==1) {
			$d_price_tab.find('.ui-plan-price-tab .ui-icon-close').remove();
		}
		// 去除添加按钮.
		if(len==10) {
			$d_price_tab.find('.add_group').remove();
		}
		tabs.tabs({active: len>0 ? (len-1) : 0});
	}
	Plan.Group=Group;
	$("tbody").on("mouseover",".get-focus",function(){
		$(this).parents("tr").css({background:"#e6e7e9"});
		$(this).parents("tr").children().find("textarea").css({"background":"rgba(230,231,230,0.4)"});
	}).on("mouseout",".get-focus",function(){
		$(this).parents("tr").css({background:"#fff"});
		$(this).parents("tr").children().find("textarea").css({"background":"#fff"});
	});
})(jQuery);








;(function($,w){
	$(".loading-wrap").hide();
	function inputToJson($s){
		var t = {};
		$s.find("select,textarea,:text,input:hidden").each(function(){
			if(this.value == "" && $(this).attr("notempty"))
				return;
			var arr = this.name.split(".");
			if(arr.length>1){
				if(!t[arr[0]])
					t[arr[0]] = {};
				t[arr[0]][arr[1]] = this.value;
			}else{
				t[this.name]=this.value;
			}
		})
		return t;
	}
	function jsonToInput(json,p){
		var data = [];
		$.each(json,function(k,v){
			if(v == null)
				return;
			var o = {},n = p+"."+k.replace("_",".");
			if($.isArray(v)){
				$.each(v,function(i){
					data = data.concat(jsonToInput(this,n+"["+i+"]"))
				})
			}else if($.isPlainObject(v)){
				data = data.concat(jsonToInput(this,n))
			}else{
				o.name = n;
				o.value = v;
				data.push(o);
			}
		})
		return data;
	}
	function initUploader($selecter){
		var $progress = $selecter.find('.progress'), $res = $selecter.find(".res");
		var option = {
				url : '/gallery?format=json&operateType=tourPlanBannerEdit',
				dataType: 'json',
			    sequentialUploads: false,
			    formData:{format:"json",operateType:"tourPlanBannerEdit"},
			    maxFileSize: 2 * 1024 * 1024,
			    done: function (e, d) {
					var data = d.result, id = d.index;
			    	if (typeof data === "string") {
						data = eval('(' + data + ')');
					}
			    	if(data.url){
						$progress.width(0).text("");
						var $pic = $selecter.find(".pic").css("border","0");
						$pic.find("img").remove();
						$pic.append("<img src='"+data.url+"'/>")
						$selecter.find("input[name='bannerImage.url']").val(data.url);
						$selecter.find("input[name='bannerImage.id']").val(data.id);
					} else {
						showInfo("上传失败：" + data.message);
					}
				},
				fail:function(){
					showInfo("上传失败")
				}
			};
		if (_IE <= 9) {
			option.contentType="text/html;charset=utf-8";
		}
		$selecter.find(".upload_btn").fileupload(option).bind('fileuploadadd', function (e, data){
			//$res.html("<div class='bar'><div class='progress'></div></div>");
		}).bind('fileuploadprogress', function (e, data) {
			var text = Math.min((data.loaded/data.total)*100,100)+"%"
			$progress.width(text).text(text);
		});
		
		function showInfo(info,right){
			$res.html("<span class='"+(right?"success":"error")+"'>"+info+"</span>");
		}
	}
	var timer = null;
	function showMsg(e,msg,time){
		if(!e.pageX){
			var p = e.offset();
			e.pageX = p.left+(e.width()/2);
			e.pageY = p.top + e.height();
		}
		var $msg = $("#msg");
		$msg.length && hide();
		$msg = $(template("tpl_msg",msg)).appendTo("body");
		$msg.css({top:e.pageY+10+"px",left:e.pageX-10+"px"}).show().on("mouseover",function(){
			timer && clearTimeout(timer);
		}).on("mouseout setTimer",function(){
			timer = setTimeout(function(){
				hide();
			},time || 3000);
		}).trigger("setTimer");
		function hide(){
			timer && clearTimeout(timer);
			$msg.remove();
		}
	}
	function submitForm(url,data,callback){
//		var dialog = $.dialog({
//			width:200,
//			height:200,
//			isClose: false,
//		    title: false,
//		    lock:true,
//		    zIndex:1200,
//		    content:"正在保存，请稍等..."
//		});
		$.post(url,data,function(d){
			if (d.result && !d.result.success) {
				$.gmMessage(d.result.message, true);
			} else {
	//			$.unbindbeforeout();
				$.gmMessage("操作成功",true);
				callback && callback(d);
			}
		}).fail(function(){
			$.gmMessage("保存失败，请稍后重试");
		}).always(function(){
				$(".loading-wrap").show();
				setTimeout(function(){$(".loading-wrap").hide();},700);
		})
	}
	function showError($tar,msg,pos,type){
		$tar.validationEngine('showPrompt',msg, type || 'error',pos,true);
	}
	
	function hideError($tar){
		$tar.validationEngine('hide');
	}
	w.u = {
			inputToJson:inputToJson,
			jsonToInput:jsonToInput,
			initUploader:initUploader,
			showMsg:showMsg,
			showError:showError,
			hideError:hideError,
			submitForm:submitForm
	}
})(jQuery,Plan)
