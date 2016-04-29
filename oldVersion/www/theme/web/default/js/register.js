$(function() {
	$.bindbeforeout();
	$("#travel_main,.belong_main,#belong_area").select2();
	$(".touristSet").click(function() {
		var set = $(this).val();
		var vals = $("#touristSet").val();
		var strs = (null != vals && "" != vals) ? vals.split(",") : new Array();
		if ($(this).is(':checked')) {
			$(".tourist_" + set).show();
		} else {
			$(".tourist_" + set).each(function(){
				$(this).hide();
				var thisV = $(this).attr("attr_id");
				var index = strs.in_array(thisV);
				if (-1 != index && strs.length > 0) {
					strs.splice(index, 1);
					$(this).removeClass("on");
				}
			});
			$("#touristSet").val(strs.join(","));
		}
	});
	$("#mydistributor").click(function() {
		$("#newBusiness").show();
		$("#putBusineww,#newSupplier").hide();
		$("#registerType").val(2);
		$("#applyRemark").val("");
		$(".next_but").show();
		setTitleClass($(this));
	});
	$("#mysupplier").click(function() {
		$("#newSupplier").show();
		$("#putBusineww,#newBusiness").hide();
		setDefaultToutist();
		
		$("#registerType").val(1);
		$("#applyRemark").val("");
		$(".next_but").show();
		setTitleClass($(this));
		setDefaultSelectTourist();
	});
	$("#myyoung").click(function() {
		$("#newBusiness,#newSupplier").hide();
		$("#putBusineww").show();
		$("#registerType").val(3);
		$("#buisnessPhone").val("");
		$("#buinessId").val("");
		$("#serach_no_tips,#serach_supp_tips,#serach_supp_check").hide();
		setTitleClass($(this));
	});
	$(".add_qual").click(function() {
		var otherDiv = $(this).parent().parent();
		var childNum = (otherDiv.children().length*1 - 1);
		var maxLength = $(this).attr("attr_length") ? $(this).attr("attr_length") : 5;
		var tempData = {};
		tempData.type = $(this).attr("attr_id");
		
		if(childNum < maxLength*1){
			tempData.inputname = 'belong';
			tempData.inputNameClass = 'belong_main';
			tempData.inputNameValid = 'belong'+childNum;
			tempData.fileInputName = 'belongFile';
			tempData.fileInputClass = 'belong_img';
			tempData.fileInputValid = 'belongFile'+childNum;
			
			var $newEle = $(template("default-qualifications", tempData));
			var newDiv = document.createElement("div");
			$(newDiv).addClass("mb5");
			$(newDiv).addClass("belongLis");
			$(newDiv).hide();
			otherDiv.find(".add_qual_div").before(newDiv);
			$(newDiv).append($newEle);

			if(childNum > 0){
				$(newDiv).find(".question_alert").parent().remove();
			}
			
			tempData.type == 'supplier' && $(newDiv).find("select").select2();
			
			$(newDiv).css({"display":"inline-block"});
			$(newDiv).on("click", ".belongCloass", function(){
				var newDivParent = $(newDiv).parent();
				$(this).parent().parent().remove();
				if((otherDiv.children().length*1 - 1) < maxLength){
					otherDiv.find(".add_qual").show();
					otherDiv.find(".add_qual_max_tips").hide();
				}
				setBelongVal(newDivParent);
			});
			setQuest($(newDiv).find(".question_alert"));  // ? hover事件
			if((otherDiv.children().length*1 - 1) >= maxLength){
				otherDiv.find(".add_qual").hide();
				otherDiv.find(".add_qual_max_tips").show();
			}
			
			/***add by zlm***/
			initFileUp( $(newDiv).find(".beforeUp"), "上传合作协议");
		}else{
			otherDiv.find(".add_qual").hide();
			otherDiv.find(".add_qual_max_tips").show();
		}
		
	});
	$(".tourist_li").click(function() {
		var vals = $("#touristSet").val();
		var strs = (null != vals && "" != vals) ? vals.split(",") : new Array();
		var thisV = $(this).find("input").val();
		var index = strs.in_array(thisV);
		if (-1 == index || strs.length < 1) {
			$(this).find("input").attr("checked", "checked");
			strs.push(thisV);
		} else {
			$(this).find("input").removeAttr("checked");
			strs.splice(index, 1);
		}
		$("#touristSet").val(strs.join(","));
	});
	$(".add_address").click(function(){
		var addressListBody = $(this).parents(".addressListBody");
		var addressList = addressListBody.find(".addressList");
		if(addressList.children().length < 5){
			var newDiv = document.createElement("div");
			$(newDiv).hide();
			addressList.append( newDiv );
			$(newDiv).addClass("mb5");
			$(newDiv).append('<input type="text" class="theme_input" name="address" value="" placeholder="详细地址" datatype="st1-100" nullmsg="请输入详细地址" title="详细地址">'+
					'<span class="belongCloass removeAddress" title="删除地址">X</span><span class="address_Validform_checktip Validform_checktip" style="display:none"></span>');
			$(newDiv).show();
			$(newDiv).find(".removeAddress").click(function(){
				$(this).parent().remove();
				setAddressStatus(addressListBody);
			});
		}
		setAddressStatus(addressListBody);
	});
	//分销商
	$("#selectArea").click(function(){
		$("#selectArea").selectZone({
			textContainer : '#showArea',
			valContainer : $('#areaId'),
			defaultText:"四川成都",
			callBack : function(data){
				$("#areaId").val(data.id);
			}
		});	
	});
	$("#selectArea").selectZone({
		textContainer : '#showArea',
		valContainer : $('#areaId'),
		defaultText:"四川成都",
		callBack : function(data){
			$("#areaId").val(data.id);
		}
	});
	if($("#areaId").val()===""){
         $("#showArea").text("请选择地区");
	}else{
		for(var i=0;i<hostArea.childrens.length;i++){
			for(var j=0;j<hostArea.childrens[i].childrens.length;j++){
                if(hostArea.childrens[i].childrens[j].id==$("#areaId").val()){
                	$("#showArea").text(hostArea.childrens[i].cn_name+hostArea.childrens[i].childrens[j].cn_name);
                }
			}
		}
	}
	//供应商
	$("#supplierSelectArea").click(function(){
		$("#supplierSelectArea").selectZone({
			textContainer : '#supplierShowArea',
			valContainer : $('#supplierAreaId'),
			defaultText:"四川成都",
			callBack : function(data){
				$("#supplierAreaId").val(data.id);
			}
		});
	});
	$("#supplierSelectArea").selectZone({
		textContainer : '#supplierShowArea',
		valContainer : $('#supplierAreaId'),
		defaultText:"四川成都",
		callBack : function(data){
			$("#supplierAreaId").val(data.id);
		}
	});
	if($("#supplierAreaId").val()===""){
         $("#supplierShowArea").text("请选择地区");
	}else{
		for(var i=0;i<hostArea.childrens.length;i++){
			for(var j=0;j<hostArea.childrens[i].childrens.length;j++){
                if(hostArea.childrens[i].childrens[j].id==$("#supplierAreaId").val()){
                	$("#supplierShowArea").text(hostArea.childrens[i].cn_name+hostArea.childrens[i].childrens[j].cn_name);
                }
			}
		}
	}
	
	$("#DistributorForm,#SupplierForm").each(function(){
		var scope = $(this);
		$(this).on("change", ".belong_main",function(){
			var thisV = $(this).val();
			if(null != thisV && "" != thisV){
				var setV = scope.find(".setBelongs").val();
				var setVs = (null != setV && "" != setV)?setV.split(","):new Array();
				if(setVs.length > 0 && setVs.in_array(thisV) > -1){
					$(this).parent().find(".Validform_checktip").text("不能选择相同的旅行社");
					$(this).val("");
					$(this).parent().find(".select2-selection__rendered").text("请选择旅行社");
				}else{
					$(this).parent().find(".Validform_checktip").text("");
				}
			}
			setBelongVal(scope);
		});
		var maxLength = scope.find(".add_qual").attr("attr_length") ? scope.find(".add_qual").attr("attr_length") : 5;
		var travelList = scope.find(".add_qual_div").parent();
		if((travelList.children().length*1 - 1) < maxLength){
			travelList.find(".add_qual").show();
			travelList.find(".add_qual_max_tips").hide();
		}else{
			travelList.find(".add_qual").hide();
			travelList.find(".add_qual_max_tips").show();
		}
		$(".removeBelong").click(function(){
			var otherDivThis = $(this).parent().parent().parent();
			$(this).parent().parent().remove();
			setBelongVal(otherDivThis);
			if((otherDivThis.children().length*1 - 1) < maxLength){
				otherDivThis.find(".add_qual").show();
				otherDivThis.find(".add_qual_max_tips").hide();
			}
		});
		setAddressStatus(scope.find(".addressListBody"));
		$(".removeAddress").click(function(){
			var addressBody = $(this).parents(".addressListBody");
			$(this).parent().remove();
			setAddressStatus(addressBody);
		});
	});
	setQuest($(".question_alert"));
	
	// form提交和验证
	var SupplierForm = $("#SupplierForm").Validform({ tiptype:4 });
	var DistributorForm = $("#DistributorForm").Validform({ tiptype:4 });
	var BusinessUserForm = $("#BusinessUserForm").Validform({ tiptype:4 });
	var SupplierFormEle = document.getElementById("SupplierForm");
	var DistributorFormEle = document.getElementById("DistributorForm");
	var BusinessUserFormEle = document.getElementById("BusinessUserForm");
    $('.next_but').focus();
    $('.next_but').click(function(){
    	$.unbindbeforeout();
    	if (2 == $("#registerType").val()) {
    		// 分销商
    		Placeholders.disable(DistributorFormEle);
    		// 设置belongMain
    		setBelongMain($("#DistributorForm"));
    		// 设置belongs
    		setBelong($("#other_qualifications"));
    		DistributorForm.submitForm(false, '/register-distributor');
    		Placeholders.enable(DistributorFormEle);
    	} else if (1 == $("#registerType").val()) {  	
    		// 供应商
    		Placeholders.disable(SupplierFormEle);
    		// 设置belongMain
    		setBelongMain($("#newSupplier"));
    		// 设置belongs
    		setBelong($("#newSupplier"));
    		SupplierForm.submitForm(false, '/register-supplier');
    		Placeholders.enable(SupplierFormEle);
    	} else {
    		Placeholders.disable(BusinessUserFormEle);
    		BusinessUserForm.check(false, $("#buisnessPhone"));
    		BusinessUserForm.submitForm(false, '/register-staff');
    		Placeholders.enable(BusinessUserFormEle);
    	}
    });
    $("#newBusiness,#SupplierForm").on("change", ".belong_main", function(){
    	var belongId = $(this).val();
    	DistributorForm.check(false, $(this).parent().parent().find(".belong_main"));
    	if(null != belongId && "" != belongId){
    		$(this).parent().find(".gmUploadBut").show();
    	}else{
    		$(this).parent().find(".gmUploadBut").hide();
    	}
    });

    function setBelong(obj){
    	var fileList = obj.find(".fileList");
    	fileList.html("");
    	obj.find(".belongLis").each(function(i){
    		var bli = $(this);
			var imgStr = bli.find(".belongMainFileMessage_sub").text();
			var data = {};
			data.index = i;
			if(1 == $("#registerType").val()){
				data.travelAgencyId = bli.find(".belong_main").val();
			}else{
				data.travelAgencyName = bli.find("input[name=belong]").val();
			}
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
});
function initFileUp(uploadObj, label){
	var belongImg = uploadObj.parent().parent().find(".belong_img");
	var belongMainFileMessage = uploadObj.parent().parent().find(".belongMainFileMessage_sub");
	var fileObj = "" != belongMainFileMessage.text() && null != belongMainFileMessage.text() && eval( '(' + belongMainFileMessage.text() + ')') || [];
	webUpload({
		id:  uploadObj,
		operateType : 'other_image',
		label : label,
		multifile : true,
		fileNumLimit : 10,
		showFileCount : true,
		changetext : label,
		data : fileObj ? fileObj : [],
		resetwidth:true,
		pickwidth : "120px",
		accept : {title : "title", extensions : "jpg,jpeg,png"},
		success : function(response){
			var value = [];
	    	for(var i = 0 ; i < response.length; i++){
	    		var jsonmessage = {};
				jsonmessage.url=response[i].url;
				jsonmessage.fileName=response[i].name;
				jsonmessage.name=response[i].name;
				jsonmessage.size=response[i].size;
				jsonmessage.width=response[i].width;
				jsonmessage.height=response[i].height;
				
				value.push(jsonmessage);
	    	}
	    	belongImg.val(value && value.length > 0 ? JSON.stringify(value) : "");
	    	belongMainFileMessage.text(JSON.stringify(value));
		}
	});
}
function setAddressStatus(obj){
	if(obj.find(".addressList").children().length >= 5){
		obj.find(".add_address").hide();
		obj.find(".max-address").show();
	}else{
		obj.find(".add_address").show();
		obj.find(".max-address").hide();
	}
}
function setQuest(obj){
	obj.hover(function(){
		$(this).parent().css({position:"relative"});
		$(this).parent().append('<span class="belongFileTipsCursor" style="left:'+(($(this).position().left)*1+($(this).width())/2)+'px;top:'+($(this).height())*1+'px;"></span>'+
					'<span class="belongFileTips" style="top:'+(($(this).height())*1+14-1)+'px;">请上传你的资质文件，如授权合同等。大小2M内。</span>');
	},function(){
		$(this).parent().find(".belongFileTips").remove();
		$(this).parent().find(".belongFileTipsCursor").remove();
	});
}
function setBelongVal(scope){
	var setVs = new Array();
	scope.find(".belong_main").each(function(){
		if(null != $(this).val() && "" != $(this).val()){
			setVs.push($(this).val());
		}
	});
	scope.find(".setBelongs").val(setVs.join(","));
}
function setTitleClass(Obj) {
	$(".reg_set_li").each(function() {
		$(this).removeClass("on");
	});
	Obj.addClass("on");
}
function upLogo(obj) {
	var upObj = $(obj).parent().find(".gmUploadDiv");
	fileUpload($(upObj).find(".gmUploadBut"), function(data) {
		$(obj).parent().find(".belong_img").val(data.id);
	}, '/attachment/image?format=json&type=b', 0);
	$(obj).parent().find(".gmUploadBut").click();
}
function getBuisness(){
	var BusinessUserForm = $("#BusinessUserForm").Validform({ tiptype:4 });
	var BusinessUserFormEle = document.getElementById("BusinessUserForm");
	Placeholders.disable(BusinessUserFormEle);
	var phone = $("#buisnessPhone").val();
	var checkST = BusinessUserForm.check(false, $("#buisnessPhone"));
	if(checkST){
		if(null == phone || "" == phone || phone.length != 11){
			$("#buisnessPhone").focus();
			return ;
		}
		$.ajax({
			url: '/reg-get-buisness/'+phone + "?vt="+Date.parse(new Date()),
			type: 'GET',
			dataType: "json",
			success : function(data){
				if (typeof data === "string") {
					data = eval('(' + data + ')');
				}
				if(data.status){
					$("#buinessId").val(data.id);
					$("#buisnessNmaeShow").text(data.name);
					$("#serach_supp_tips,#serach_supp_check").show();
					$(".next_but").show();
					$("#serach_no_tips").hide();
				}else{
					$("#serach_no_tips").show();
					$("#serach_supp_tips,#serach_supp_check").hide();
					$(".next_but").hide();
				}
			}
		});
	}else{
		$("#serach_no_tips").show();
		$("#serach_supp_tips,#serach_supp_check").hide();
		$(".next_but").hide();
	}
	Placeholders.enable(BusinessUserFormEle);
}
function initRegType(t){
	switch (t) {
		case '2':
			$("#mydistributor").click();
			break;
		case '3':
			$("#myyoung").click();
			break;
			
		default:
			$("#mysupplier").click();
			break;
	}
}
function setDefaultToutist(){
	$(".touristSet").each(function(){
		if($(this).attr("checked")){
			var touristSetScope = $(this).val();
			$(".tourist_"+touristSetScope).show();
		}
	});
}
function setDefaultSelectTourist(){
	var vals = $("#touristSet").val();
	var strs = (null != vals && "" != vals) ? vals.split(",") : new Array();
	for(var i = 0 ; i < strs.length; i++){
		$(".tour_select").find("input[value="+strs[i]+"]").attr("checked", "checked");
	}
}