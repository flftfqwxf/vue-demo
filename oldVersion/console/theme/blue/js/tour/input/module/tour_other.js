((function($, w){
	function addTips(data){
		var ids = [],type = this;
		$.each(data||[],function(){
			ids.push(this.id);
		});
		if(null != Tour.current.lineId && Tour.current.lineId > 0){
			$.getJSON("/"+type+"/list.json?line="+Tour.current.lineId,function(d){
				var h = "";
				$.each(d[(type=="visa"?"visaArea":type)+"s"]||[],function(){
					if($.inArray(this.id,ids)>-1){
						this.selected = true;
					}
					h += template("tmp_"+type+"s",this);
				})
				h && $("#custom-tips-list").append($(h)).show().next(".notation-tips").show();
			});
		}
	}
	$body = $(".input_body #other");
	var submitFormStatus = true;
	var inited = false;
	var module = {
			hide : function(){
				$("#nextBtn").show();
				$("#btnSave").hide();
				$body.hide();
			},
			show : function(){
				$("#nextBtn").hide()
				$("#btnSave").show();
				$body.show();
			},
			clear : function(){
				inited = false;
				$body.html("");
			},
			isInit : function(){
				return inited;
			},
			init : function(){
				inited = true;
				// 设置页面模板内容
				var data = $.extend({}, Tour.current.data, {"random" : Math.random()});
				var $content = $(template("tmp_step_other", data));
				$body.html($content);
				$("#nextBtn").hide();
				$("#btnSave").click(function(){
					Tour.current.module.submitForm();
				}).css({"display":"inline-block"});
				// 初始化编辑器
				$content.find("textarea[tag=edit]").each(function(){
					var editor = initKindEditor($(this), $(this).attr("maxlength")? $(this).attr("maxlength"):20000, null, Tour.current.lineId);
				});
				$.each(["tip","visa"],function(i){
					$("#custom-tips-list").html("");
					addTips.call(this,data[this+(i==1?"Area":"")+"s"]);
				});
				// 初始化事件
				$this_content = $(".step_other");
				$this_content.on("click", ".info_set>.set-status", function(){
					setTableOrTaxtarea($(this));
				})
				.on("click", ".addBtn", addTr)
				.on("click", ".set-notation", function(){
					var checkbox = $(this).find("i");
					var field = $(this).attr("set-data-name");
					var name = checkbox.attr("attr_name");
					var value = checkbox.attr("value");
					var isCheck = $(this).attr("attr_check").Trim();
					var index = -1;
					$.each(Tour.current.data[field]||[],function(i){
						if(this.id == value*1){ index = i; }
					});
					if("checked" == isCheck){
						$(this).attr("attr_check", "");
						$(this).removeClass("eat_active");
						checkbox.removeClass("active");
						// 改变数据
						Tour.current.data[field].splice(index, 1);
					}else{
						$(this).attr("attr_check", "checked");
						$(this).addClass("eat_active");
						checkbox.addClass("active");
						// 改变数据
						if(index == -1){
							Tour.current.data[field] = Tour.current.data[field] ? Tour.current.data[field] : [];
							Tour.current.data[field].push({id : value*1});
						}
					}
				});
				
				// 初始化自费项目、购物点;默认一行
				$.each("customSelfPaid,customShop".split(","),function(){
					if(data && data[this]){
						$($("#"+this+"Input").find(".info_set").find(".checkbox[value=1]").parent()).click();
						var nameStr = this + 'Description';
						KindEditor.html($("#"+this+"Input").find(".consInfoDesc").find("textarea"), data[nameStr]);
					}else{
						var nameStr = this == 'customSelfPaid'? 'selfPaids': 'shops';
						if(data[nameStr]){
							for(var i = 0; i < data[nameStr].length; i++){
								var this_data = data[nameStr][i];
								this_data.initIndex = i;
								addTr.call($("#"+this+"Input").find(".addBtn"), this_data);
							}
						}
						$($("#"+this+"Input").find(".info_set").find(".checkbox[value=0]").parent()).click();
					}
				});
			},
			submitForm : function(){
				if(submitFormStatus) {
					submitFormStatus = false;
					// 删除空白的自费项目和购物点
					var vaildSt = Tour.utils.vaildDatas();
					if(0 == $("input[name=customSelfPaid]").val()) {
						$("tr[data-name='selfPaids']").each(function(){
							var name = $(this).find("input[name='name']").val();
							var stayTime = $(this).find("input[name='stayTime']").val();
							var price = $(this).find("input[name='price']").val();
							var description = $(this).find("input[name='description']").val();
//							if(("" == name || null == name ) 
//									&& ("" == stayTime || null == stayTime )
//									&& ("" == price || null == price )
//									&& ("" == description || null == description )){
//								Tour.utils.showError($(this).find("input[name='description']"), "添加了自费项目就必须填写");
//								vaildSt = false;
//								return false;
//							}
						});
					}
					if(0 == $("input[name=customShop]").val()) {
						$("tr[data-name='shops']").each(function(){
							var time = $(this).find("input[name='time']").val();
							var name = $(this).find("input[name='name']").val();
							var stayTime = $(this).find("input[name='stayTime']").val();
							var description = $(this).find("input[name='description']").val();
//							if(("" == time || null == time ) 
//									&& ("" == stayTime || null == stayTime )
//									&& ("" == name || null == name )
//									&& ("" == description || null == description )){
//								Tour.utils.showError($(this).find("input[name='description']"), "添加了购物点就必须填写");
//								vaildSt = false;
//								return false;
//							}
						});
					}
					if(!vaildSt){
						submitFormStatus = true;
						return false;
					}
					
					if(window.Placeholders && !window.Placeholders.nativeSupport)
						window.Placeholders.disable(Tour.current.docForm);
					
					Tour.current.jsondom.refresh();
					var jsonData = Tour.current.jsondom.data();
					var submitData = Tour.current.jsondom.formData();
					// formData 后删除不需要的数据 如：飞机名称
					for(var i = submitData.length-1 ; i >= 0; i--){
						var nameString = submitData[i].name;
						var nameArray = nameString.split(".flight.");
						if ( nameArray.length > 1 ) {
							if(nameArray[1] != 'id' || "" == submitData[i].value || null == submitData[i].value){
								submitData[i] = null;
								submitData.splice(i, 1);
							}
						}
						var nameHotelArray = nameString.split(".hotel.");
						if ( nameHotelArray.length > 1 ) {
							if(nameHotelArray[1] == 'id' && ("" == submitData[i].value || null == submitData[i].value)){
								submitData[i] = null;
								submitData.splice(i, 1);
							}
						}
					}
					var dialog = $.dialog({
						isClose: false,
					    title: false,
					    //lock:true,
					    zIndex:12000,
					    content: '正在提交，请稍候。。。'
					});
					$.post('/tour/group-tour/input.json',submitData,function(d){
						if(typeof d == "string")
							d = eval('(' + d + ")");
						if(d.result && d.result.success == false){
							$.gmMessage(d.result.message,true);
							return;
						}
						$.unbindbeforeout();
						$.gmMessage("操作成功",true);
						setTimeout(function(){
							submitFormStatus = true;
							window.close();
						},1000);
						// 老版本关闭当前窗口，回调修改前打开页面的状态
						//opener && opener.Plan.afterAddTour(d.tour);
					}).fail(function(){
						$.gmMessage("保存失败，请稍后重试");
					}).always(function(){
						Placeholders.enable(Tour.current.docForm);
						dialog.close();
					});
				}
			},
			submit : function(){
				var vaildSt = Tour.utils.vaildDatas();
				if(!vaildSt) return false;
				// 记录数据
				$("textarea[tag=edit]").each(function(){
					KindEditor.removePlaceholder($(this));
				});
				Tour.current.jsondom.refresh($body);
				
				// 清除
				return true;
			}
	}
	
	w.Tour = w.Tour || {};
	w.Tour.module = w.Tour.module || {};
	w.Tour.module.other = w.Tour.module.other || {};
	$.extend(w.Tour.module.other, module);
}))(jQuery, window);

function addTr(data){
	var $tar = $(this).prev("table").find("tbody");
	if($tar.find("tr").length>49){
		$.alert("最多添加50条");
		return false;
	}
	var tr = $(template($(this).attr("rel"),data || {}));
	$tar.append(tr);
	if($tar.find("tr").length == 1){
		$(tr).find(".selfTr").remove();
	}
}
function setTableOrTaxtarea(obj){
	obj.parent().find(".set-status").each(function(){
		$(this).removeClass("eat_active");
		$(this).find(".checkbox").removeClass("active");
	});
	var setStatus = obj.find(".checkbox").attr("value");
	obj.parent().find(".checkbox-value").val(setStatus);
	obj.addClass("eat_active");
	obj.find(".checkbox").addClass("active");
	if(setStatus == 1){
		obj.parent().parent().find(".consInfoDesc").show();
		obj.parent().parent().find(".consInfo").hide();
	}else{
		obj.parent().parent().find(".consInfo").show();
		var defLi = obj.parent().parent().find(".consInfo").find("table").find("tbody");
		if(defLi.find("tr").length < 1){
			obj.parent().parent().find(".consInfo").find(".addBtn").click();
		}
		obj.parent().parent().find(".consInfoDesc").hide();
	}
}

function getSelfpaidTyping(){
	var dialog_Selfpaid = $.artDialog({
		title: '最近使用',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	if(data.custom){
        		$($("#customSelfPaidInput").find(".info_set").find(".checkbox[value=1]").parent()).click();
        		KindEditor.html($("#customSelfPaidInput").find(".consInfoDesc").find("textarea"), data.text);
        	}else{
        		$($("#customSelfPaidInput").find(".info_set").find(".checkbox[value=0]").parent()).click();
        		var dataList = data.list;
        		$(".consInfo table tbody tr", $("#customSelfPaidInput")).each(function(){
        			Tour.current.jsondom.remove($(this));
        		});
        		for(var i = 0; i < dataList.length; i++){
        			addTr.call($("#customSelfPaidInput").find(".addBtn"), dataList[i]);
        		}
        	}
        },
        okVal: '确认',
        okCssClass: 'btn-save',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'btn-cancel'
	});
	setDialogSearch("/typing/selfpaid", dialog_Selfpaid);
}

function getShopsTyping(){
	var dialog_Shops = $.artDialog({
		title: '最近使用',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	if(data.custom){
        		$($("#customShopInput").find(".info_set").find(".checkbox[value=1]").parent()).click();
        		KindEditor.html($("#customShopInput").find(".consInfoDesc").find("textarea"), data.text);
        	}else{
        		$($("#customShopInput").find(".info_set").find(".checkbox[value=0]").parent()).click();
        		var dataList = data.list;
        		$(".consInfo table tbody tr", $("#customShopInput")).each(function(){
        			Tour.current.jsondom.remove($(this));
        		});
        		for(var i = 0; i < dataList.length; i++){
        			addTr.call($("#customShopInput").find(".addBtn"), dataList[i]);
        		}
        	}
        },
        okVal: '确认',
        okCssClass: 'btn-save',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'btn-cancel'
	});
	setDialogSearch("/typing/shop", dialog_Shops);
}
function setDialogSearch(uri, dialog){
	var thisUri = uri;
	$.ajax({
		url: (uri.indexOf("?") >0) ? uri + "&_="+Date.parse(new Date()) : uri + "?_="+Date.parse(new Date()),
		type:"GET",
		dataType: "html",
		success:function(objData){
			dialog.content(objData);
			$("#typing_query").on("click", function(){
				query_click();
			});
		},
		error: function(){
			dialog.close();
			$.alert("加载最近使用失败！请刷新重试", "提示", "warning", function(){ });
		}
	});
	function query_click(){
		if(uri.indexOf("?") >0){
			thisUri = uri + "&keyword=" + escape($("#typing_keyword").val());
		}else{
			thisUri = uri+"?keyword=" + escape($("#typing_keyword").val());
		}
		$.ajax({
			url: thisUri+"&_="+Date.parse(new Date()),
			type:"GET",
			dataType: "html",
			success:function(objData){
				dialog.content(objData);
				$("#typing_query").on("click", query_click);
			}
		});
	}
}
function getTypingData(){
	var data = {};
	data.custom = true;
	data.text = "";
	data.list = [];
	$("input[name='typing_set']:checked").each(function(){
		if($(this).val() == true || $(this).val() == "true"){
			data.custom = true;
			data.text = ($(this).parent().parent().find(".typing_info_body").html()).LTrim().RTrim();
		}else{
			data.custom = false;
			$(this).parent().parent().find(".data_li").each(function(){
				var shopLi = {};
				$(this).find("td").each(function(){
					shopLi[$(this).attr("title")] = $(this).text();
				});
				data.list.push(shopLi);
			});
		}
	});
	return data;
}