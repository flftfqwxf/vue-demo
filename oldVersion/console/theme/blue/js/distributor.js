function distributorOperate(url, title, options, flushNow, callback){
	var opts = {
	        title   :   title,
	        isClose :   false,
	        fixed   :   true,
	        lock    :   true
    };
    return openDialog(url, $.extend({}, opts, options), flushNow, callback);
}

function auditedView(id, isFromUser, detailLi){
	var auditedView = distributorOperate('/distributor/audited/'+id + "?liIndex=" + detailLi + "&_=" + Date.parse(new Date()), '分销商详情',{
		isOuterBoxShadow: false,
		cancel: function(){
			isFromUser && window.close();
		}
	}, "flush_now", function(){
		setBelongMain($("#mainCert"));
		setBelong($("#other_qualifications"));
		isFromUser && window.history.replaceState({}, '', '/distributor/audited');
		return true;
	});
}

function pendingView(id, isFromUser){
	var pendingView = distributorOperate('/distributor/pending/'+id, '分销商审核',{
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
										url:"/distributor/"+id + "/audit/disable",
										type: "POST",
										async:false,
										dataType: "json",
										data: {format:'json',reason:value},
										success:function(json){
											isFromUser && window.history.replaceState({}, '', '/distributor/pending');
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
							var outbound = $("input[name='outbound']").is(':checked');
							var salerId = $("select[name='salerId']").val();
							var editorId = $("select[name='editorId']").val();
							var uri = "/distributor/" + id + "/audit/enable?outbound=" + outbound + "&salerId=" + salerId + "&editorId=" + editorId;
							
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
											isFromUser && window.history.replaceState({}, '', '/distributor/pending');
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