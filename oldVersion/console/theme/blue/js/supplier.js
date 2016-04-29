function supplierOperate(url, title, options, flushNow, callback){
	var opts = {
	        title   :   title,
	        isClose :   false,
	        fixed   :   true,
	        lock    :   true,
	        resize  :   true
    };
    return openDialog(url, $.extend({}, opts, options), flushNow, callback);
}

function auditedView(id, isFromUser, detailLi){
	var auditedView = supplierOperate('/supplier/audited/' + id + "?liIndex=" + detailLi + "&_=" + Date.parse(new Date()), '供应商详情',{
		isOuterBoxShadow: false,
		padding: '0',
		cancel: function(){
			isFromUser && window.close();
		}
	}, "flush_now", function(){
		setBelongMain($("#belong_main_settings"));
		setBelong($("#blongs-setting"));
		isFromUser && window.history.replaceState({}, '', '/supplier/audited');
		return true;
	});
	
}

function setBelong(obj){
	var fileList = obj.find(".fileList");
	fileList.html("");
	obj.find(".belongLis").each(function(i){
		var bli = $(this);
		var imgStr = bli.find(".belongMainFileMessage_sub").text();
		var data = {};
		data.index = i;
		data.travelAgencyId = bli.find(".belong_main").val();
		if (imgStr && "" != imgStr && null != imgStr) {
			data.attas = eval('(' + imgStr + ')');
		}
		fileList.append($(template("qualifications-setting", data)));
	});
}
function setBelongMain(obj){
	var appendToObj = obj.find("input[name=belongMain]").parent().parent();
	var $belongMainSettting = appendToObj.find(".belong-main-file-setting");
	var imgStr = obj.find("input[name=belongMain]").parent().find(".belongMainFileMessage_sub").text();
	var data = {};
	if (imgStr && "" != imgStr && null != imgStr) {
		data.attas = eval('(' + imgStr + ')');
	}
	$belongMainSettting.html($(template("belong-main-file-setting", data)));
}
//自定义弹出层
function showDialog(url, options, flushNow, callback){
	var opts = {
	        title   :   false,
	        isClose :   false,
	        fixed   :   true,
	        lock    :   true,
	        padding:"0px 20px"
    };
    return openDialog(url, $.extend({}, opts, options), flushNow, callback);
}
function expiredPlanList(id){
	var planList = showDialog('/supplier/'+id+'/expired-plan',{
		isOuterBoxShadow: false,
		isClearBtn: true,
		button: [
					{
						name:'关闭',
						cssClass:'btn-sm-common',
						callback: function(){
							planList.close();
							return false;
						}
					}
				]
	});
}

function pendingView(id, isFromUser){
	var pendingView = supplierOperate('/supplier/pending/' + id + "?_=" + Date.parse(new Date()), '供应商审核',{
		isOuterBoxShadow: false,
		isClearBtn: true,
		button: [
					{
						name:'关闭',
						cssClass:'btn-sm-common',
						callback: function(){
							$.confirm("您确认要离开此页面？","确认提示", function(){
								isFromUser && window.close();
								pendingView.close();
							},function(){
							});
							return false;
						}
					},{
						name:'不通过',
						cssClass:'btn-sm-cancel',
						callback: function(){
							$.prompt('<span style="font-size:14px;">将会短信通知用户审核结果，确认不通过？</span>', '审核不通过', function(value){
								value = value.replace(/(^\s*)|(\s*$)/g, "");
								var size = value.length;
								if (size > 15 || size == 0) {
									$.gmMessage("请输入不通过原因，限15字以内", false);
									return false;
								} else {
									$.ajax({
										url:"/supplier/"+id + "/audit/disable",
										type: "POST",
										async:false,
										dataType: "json",
										data: {format:'json',reason:value},
										success:function(json){
											isFromUser && window.history.replaceState({}, '', '/supplier/pending');
											showmsg(null, json, 'flush_now');
										}
									});
								}
							}, '', '输入原因/附言，限15字');
							return false;
						}
					},{
						name:'审核通过',
						cssClass:'btn-save',
						callback: function(){
							var salerId = $("select[name='salerId']").val();
							var editorId = $("select[name='editorId']").val();
							var editorInfo = $("[name=editorInfo]").is(":checked");
							var uri = "/supplier/"+id + "/audit/enable?salerId=" + salerId + "&editorId=" + editorId + "&editorInfo=" + editorInfo;
							
							var formObj = $("[id$=Form]").Validform({tiptype:4});
							var subflag = formObj.getUtil().submitForm.call($(formObj.forms[0]),$(formObj.forms)[0].settings,false,uri);
							subflag === undefined && (subflag=true);
							
							if(subflag===true){
								$.confirm('<span style="font-size:14px;">将会短信通知用户审核结果，<br/>确认审核通过？</span>','审核通过', function(){
									$.ajax({
										url: uri,
										type: "POST",
										async:false,
										dataType: "json",
										data: {format:'json'},
										success:function(json){
											isFromUser && window.history.replaceState({}, '', '/supplier/pending');
											showmsg(null, json, 'flush_now');
										}
									});
								},function(){
								});
							}
							
							return false;
						}
					}
				]
	});
}

function sort(sortParam) {
   $('#sortInput').val(sortParam);
   $('#searchQuery').submit();
}

$(function() {
	$("#touristlineType").change(function(){
		var val = $(this).val();
		$.ajax({
			url: "/line-by-type/" + val + ".json" ,
			type: "GET",
			async:false,
			dataType: "json",
			success:function(json){
				$("#touristlineId").html("").append('<option value="">全部专线</option>');
				var list = json.list;
				for(var i = 0 ; i < list.length ; i++){
					$("#touristlineId").append('<option value="'+list[i].id+'">'+list[i].name+'</option>');
				}
			}
		});
	});
	//初始化省市
	var $province = $("#province"),
		$city = $("#city"),
		provinceVal = $("#provinceVal").val(),
		cityVal = $("#cityVal").val(),
		provinceList = hostArea['childrens'];
	$province.html("").append('<option value="">全部省</option>');
	$city.html("").append('<option value="">全部市</option>');
	var compare = function(key){
		return function(obj1, obj2){
			var value1 = obj1[key];
			var value2 = obj2[key];
			if (value2 < value1) {
				return 1;
			} else if (value2 > value1) {
				return -1;
			} else {
				return 0;
			}
		}
	};
	provinceList.sort(compare("pinyin"));
	if (provinceVal != 2293) {
		$province.append('<option value="2293">四川</option>');
	} else {
		$province.append('<option value="2293" selected="selected">四川</option>');
	}
	$.each(provinceList, function(k, v){
		if (v.id != 2293) { // 四川
			if (provinceVal != v.id) {
				$province.append('<option value="'+v.id+'">'+v.cn_name+'</option>');
			} else {
				$province.append('<option value="'+v.id+'" selected="selected">'+v.cn_name+'</option>');
			}
		}
	});
	$province.change(function(){
		$city.html("").append('<option value="">全部市</option>');
		var provinceId = $(this).val(),
			cityListTemp = $.grep(provinceList, function(n, i){
				return n.id == provinceId;
			}),
			cityList = cityListTemp[0] && cityListTemp[0]['childrens'] || [];
		cityList.sort(compare("pinyin"));
		if (provinceId != 2293) {
			$.each(cityList, function(k, v){
				if (cityVal != v.id) {
					$city.append('<option value="'+v.id+'">'+v.cn_name+'</option>');
				} else {
					$city.append('<option value="'+v.id+'" selected="selected">'+v.cn_name+'</option>');
				}
			});
		} else {
			if (cityVal != 2294) {
				$city.append('<option value="2294">成都</option>');
			} else {
				$city.append('<option value="2294" selected="selected">成都</option>');
			}
			$.each(cityList, function(k, v){
				if (v.id != 2294) { // 成都
					if (cityVal != v.id) {
						$city.append('<option value="'+v.id+'">'+v.cn_name+'</option>');
					} else {
						$city.append('<option value="'+v.id+'" selected="selected">'+v.cn_name+'</option>');
					}
				}
			});
		}
	});
	$province.trigger("change");
});