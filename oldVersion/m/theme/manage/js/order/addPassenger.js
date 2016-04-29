$(function(){
	//后端报错提示和隐藏
	if ($(".waring_info")) {
		var waring_txt = $(".waring_desc").html();
		if (waring_txt !== "") {
			$(".waring_info").show();
		}
		setTimeout(function(){
			$(".waring_info").hide();
		},1500);
	};

	var nameReg = {
		reg:/^[\u4e00-\u9fa5]{2,16}$/,//姓名的匹配
		obj:$("input[name=\"name\"]"),//$(".name-input")
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	}
	var enLastNameReg = {
		reg:/^[a-zA-Z\ \']+$/,//英文名正则
		obj:$("input[name=\"lastName\"]"),
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	};
	var enFirstNameReg = {
		reg:/^[a-zA-Z\ \']+$/,//英文名正则
		obj:$("input[name*=\"firstName\"]"),
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	}
	var telReg={
		reg:/^1[3|4|5|7|8][0-9]{9}$/,//电话号码判断
		obj:$("input[name=\"contact\"]"),//$(".tel-input")
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	};
	var identityCardReg = {
		reg:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证判断
		obj:$("input[name=\"idCard\"]"),//$(".card-input")
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	};
	var passportReg = {
		reg:/^[a-zA-Z0-9]{5,17}$/,//护照正则
		obj:$("input[name=\"passport\"]"),//$(".card-input")
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	};
	var HKMacPasserReg = {
		reg:/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,//港澳通行证
		obj:$("input[name=\"gangAoPermit\"]"),//$(".card-input")
		callback:function(errorMsg){
			$(".waring_desc").append(errorMsg);
		}
	};
	var TaiwanPassReg = {
		reg:/^([0-9]{8}|[0-9]{10})$/,//入台通行证
		obj:$("input[name=\"taiwanPermit\"]"),//$(".card-input")
		callback:function(errorMsg){

			$(".waring_desc").append(errorMsg);

		}
	};
	var nameMsgObj={
		nullMsg:'请输入姓名',
		regMsg:'请输入正确姓名'
	};
	var enLastNameMsgObj={
		nullMsg:'请输入英文姓氏',
		regMsg:'请输入正确英文姓氏'
	};
	var enFirstNameMsgObj = {
		nullMsg:'请输入英文名',
		regMsg:'请输入正确英文名'
	}
	var telMsgObj={
		nullMsg:'请输入电话号码',
		regMsg:'请输入正确电话号码'
	};
	var identityCardMsgObj={
		nullMsg:'请输入身份证号码',
		regMsg:'请输入正确身份证号码'
	};
	var passportMsgObj={
		nullMsg:'请输入护照号码',
		regMsg:'请输入正确护照证号码'
	};
	var HKMacPasserMsgObj={
		nullMsg:'请输入港澳通行证号码',
		regMsg:'请输入正确港澳通行证号码'
	};
	var TaiwanPassMsgObj={
		nullMsg:'请输入台湾通行证号码',
		regMsg:'请输入正确台湾通行证号码'
	};
	function regValidation(el,msg){
		//正则匹配函数
		var _value = el.obj.val();
		if (_value == "") {
			$(".waring_info").show();
			warginInfo();
			el.callback.call(this,msg.nullMsg);
			return false;
		}
		var reg=el.reg; 
		if(!reg.test(_value)){
			$(".waring_info").show();
			warginInfo()//提示方法调用 
			if ($.isFunction(el.callback)) {
				el.callback.call(this,msg.regMsg);
			}
			return false;
		}
		return true;
	};
	var timer;
	function warginInfo(obj){
		/*隐藏提示信息*/
		clearTimeout(timer);
		timer = setTimeout(function(){
			$(".waring_info").hide();
		},1000);
	};
	function chinaTra(){
		var result = true;
		if(nameReg.obj){
			result= regValidation(nameReg,nameMsgObj);
			if (!result) {
				return false;
			}
		}
		if(identityCardReg.obj){
			result= regValidation(identityCardReg,identityCardMsgObj);
			if (!result) {
				return false;
			}
		}
		if(telReg.obj && telReg.obj.val() !== ""){
			result= regValidation(telReg,telMsgObj);
			if (!result) {
				return false;
			}
		}
	}
	function foreignTra(){
		var result = true;
		if(nameReg.obj){
			result= regValidation(nameReg,nameMsgObj);
			if (!result) {
				return false;
			}
		}
		if(passportReg.obj){
			result= regValidation(passportReg,passportMsgObj);
			if (!result) {
				return false;
			}
		}
		if (HKMacPasserReg.obj.is(':visible')) {
			result=regValidation(HKMacPasserReg,HKMacPasserMsgObj);
			if (!result) {
				return false;
			}
		}else if (TaiwanPassReg.obj.is(':visible')) {
			result=regValidation(TaiwanPassReg,TaiwanPassMsgObj);
			if (!result) {
				return false;
			}
		}
		if(enLastNameReg.obj){
			result= regValidation(enLastNameReg,enLastNameMsgObj);
			if (!result) {
				return false;
			}
		}
		if(enFirstNameReg.obj){
			result= regValidation(enFirstNameReg,enFirstNameMsgObj);
			if (!result) {
				return false;
			}
		}
		if(telReg.obj && telReg.obj.val() !== ""){
			result= regValidation(telReg,telMsgObj);
			if (!result) {
				return false;
			}
		}
	}
	window.validate = function(){
		var result=true;
		$(".waring_desc").html("");
		if ($("#isType").val() == "true") {
			result = chinaTra();
			return result;
		}
		if($("#isType").val() == "false"){
			result = foreignTra();
			return result;
		}
		return result;
	};

	var val = $('.card-type option:selected').val();
	$(".card-input").each(function(index, el) {
		var dataValue = $(this).attr('data-value');
		if (val == dataValue) {
			$(this).show().siblings("input").hide();
		}else{
			$(this).hide().siblings("input").show();
		}
	});

	$(".card-type").change(function(){
		var _index = $('.card-type option:selected').val();
		$(".card-input").eq(_index-3).show().siblings("input").hide();
	})
	


});