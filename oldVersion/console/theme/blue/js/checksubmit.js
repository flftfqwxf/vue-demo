/**
 * 显示错误提示
 * 
 * @param dom 提示对象
 * @param TIP 提示内容
 * @param type 提示类型 1：弹出层+指定区域提示;2：指定区域提示；3：弹出层提示
 */
function submit_error(dom, TIP, type){
	var doms_name = $(dom).attr("name");
	switch (type) {
		case 1:
			$("#"+doms_name+"_sub_error").html(TIP);
			break;
		case 2:
			$.alert(TIP, "输入错误提示", "warning");
			$("#"+doms_name+"_sub_error").html(TIP);
			break;
		default:
			$.alert(TIP, "输入错误提示", "warning");
			break;
	}
	$(dom).focus();
}
function getTitle(doms_name){
	var title = $("#"+doms_name+"_msg_title").html();
	if(!title){
		title = '';
	}
	if(title.substr(title.length-1,title.length)==':'){
		title = title.substr(0,title.length-1);
	}
	return title;
}

/**
 * 验证函数
 * type int 提示类型
 */
function sub_ck_require(type){
	// 为空
	var cks = true;
	var doms = $(".require");
	$.each(doms,function(i, dom){
		if($.trim($(dom).val())=='' || $(dom).val()=='0'){
			if($(dom).val()==''){ TIP = "请填写 "; }
			if($(dom).val()=='0'){ TIP = "请选择 "; }
			submit_error(dom, TIP+getTitle($(dom).attr("name")), type);
			return cks = false;
		}
	});
	return cks;
}
//邮箱
function sub_ck_email(type){
	var cks = true;
	var doms = $(".email");
	reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	$.each(doms,function(i, dom){
		if("" != $.trim($(dom).val()) && !reg.test($.trim($(dom).val()))){
			TIP = "请输入正确的 ";
			submit_error(dom, TIP+getTitle($(dom).attr("name")), type);
			return cks = false;
		}
	});
	return cks;
}
// 长度验证
function sub_ck_strlen(type){
	var cks = true;
	var doms = $(".strlen");
	var maxlen = 0;
	var minlen = 0;
	$.each(doms,function(i, dom){
		maxlen = $(dom).attr("maxlength")*1;
		minlen = $(dom).attr("minlength")*1;
		if($.trim($(dom).val()).length < minlen || $.trim($(dom).val()).length > maxlen){
			TIP = "请输长度在"+minlen+"到"+maxlen+"的 ";
			submit_error(dom, TIP+getTitle($(dom).attr("name")), type);
			return cks = false;
		}
	});
	return cks;
}
// 相同验证
function sub_ck_same(type){
	var cks = true;
	var doms = $(".same");
	$.each(doms,function(i, dom){
		var cofim_f = $(dom).attr("samefield");
		if($.trim($(dom).val()) != $.trim($("#"+cofim_f).val())){
			submit_error(dom, getTitle($(dom).attr("name"))+" 与 "+getTitle($("#"+cofim_f).attr("name"))+" 不一致", type);
			check_ok = false;
			return cks = false;
		}
	});
	return cks;
}
//mobile手机验证
function sub_ck_mobile(type){
	var cks = true;
	var doms = $(".mobile");
	reg = /^[1][358][0-9]{9}$/;
	$.each(doms,function(i, dom){
		if("" != $.trim($(dom).val()) && !reg.test($.trim($(dom).val()))){
			TIP = "请输入正确的 ";
			submit_error(dom, TIP+getTitle($(dom).attr("name")), type);
			return cks = false;
		}
	});
	return cks;
}
function sub_ck_idcard(type){
	var cks = true;
	var doms = $(".idcard");
	reg = /^\d{15}(\d{2}[\dXx]){0,1}$/;
	$.each(doms,function(i, dom){
		if("" != $.trim($(dom).val()) && !reg.test($.trim($(dom).val()))){
			TIP = "请输入正确的 ";
			submit_error(dom, TIP+getTitle($(dom).attr("name")), type);
			return cks = false;
		}
	});
	return cks;
}
$(window).load(function(){
	// 提交验证
	var flag = true;
	var TIP = "";
	$("form").bind("submit",function(){
		// 清空提示
		var doms;
		var reg;
		doms = $(".sub_error_info");
		$.each(doms,function(i, dom){
			$(dom).html("");
		});
		check_ok = sub_ck_require(2);
		if(!check_ok){ return false; }
		check_ok = sub_ck_email(2);
		if(!check_ok){ return false; }
		check_ok = sub_ck_strlen(2);
		if(!check_ok){ return false; }
		// datetime时间日期验证
		
		// same相同字段验证
		check_ok = sub_ck_same(2);
		if(!check_ok){ return false; }
		check_ok = sub_ck_mobile(2);
		if(!check_ok){ return false; }
		// idcard身份证验证
		check_ok = sub_ck_idcard(2);
		if(!check_ok){ return false; }
		
		if(!(check_ok && flag)){
            if(check_ok){
            	$.alert('请检查页面是否填写无误', "错误提示", "warning");
            }
            return false;
        }
	});
});