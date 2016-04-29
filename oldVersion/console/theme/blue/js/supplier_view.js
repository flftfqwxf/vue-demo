var maxTravel = 10;
$(function() {
	var scope = $("#empAdd");
	// 初始化地区
	$("#supplierSelectArea").selectZone({
		textContainer : '#supplierShowArea',
		valContainer : $('#supplierAreaId'),
		defaultText:"四川成都",
		zIndex : 12,
		callBack : function(data){
			$("#supplierAreaId").val(data.id);
		}
	});
	updateForm = $("#supplierForm").Validform({ tiptype:2});
	// 初始化文件上传 
	initFileUp($(".belongMainUpload"), $(".belongMainUpload").text(), function(response){
		updateForm.check(false, $(".belongMainUpload").parent().parent().find(".belong_img"));
	});
	$(".beforeUp").each(function(){
		initFileUp($(this), $(this).text(), function(response){
			updateForm.check(false, $(".beforeUp").parent().parent().find(".belong_img"));
		});
	});
	scope.find(".belong_main").select2({zIndex : 9999});
	
	scope.off('change', '.belong_main');
	scope.on("change", ".belong_main",function(){
		var thisV = $(this).val();
		if(null != thisV && "" != thisV){
			var setV = scope.find("#setBelongs").val();
			var setVs = (null != setV && "" != setV)?setV.split(","):new Array();
			if(setVs.length > 0 && setVs.in_array(thisV) > -1){
				$(this).closest(".mb5").find(".Validform_checktip").eq(0).text("不能选择相同的旅行社").addClass("Validform_wrong");
				$(this).val("");
				$(this).parent().find(".select2-selection__rendered").text("请选择旅行社");
			}else{
				$(this).closest(".mb5").find(".Validform_checktip").eq(0).text("").removeClass("Validform_wrong");
			}
		}
		setBelongVal(scope);
	});
	
	$('#add_qual').unbind('click').click(function(){
		var otherDiv = $("#other_qualifications");
		var childNum = (otherDiv.children().length*1);
		var tempData = {};
			
		if(childNum < maxTravel*1){
			//tempData.inputname = 'belong';
			tempData.inputNameClass = 'belong_main';
			tempData.inputNameValid = 'belong'+childNum;
			//tempData.fileInputName = 'belongFile';
			tempData.fileInputClass = 'belong_img';
			tempData.fileInputValid = 'belongFile'+childNum;
			var $newEle = $(template("default-qualifications", tempData));
			var newDiv = document.createElement("div");
			$(newDiv).addClass("mb5");
			$(newDiv).addClass("belongLis");
			$(newDiv).addClass("upload-file-obj");
			$(newDiv).hide();
			otherDiv.append(newDiv);
			$(newDiv).append($newEle);
			$(newDiv).show();

			$(newDiv).find("select").select2({zIndex : 9999});
			
			if((otherDiv.children().length*1) >= maxTravel){
				$("#add_qual").hide();
				$(".add_qual_max_tips").show();
			}
			
			initFileUp( $(newDiv).find(".beforeUp"), "合作协议", function(response){
				updateForm.check(false, $(newDiv).find(".belong_img"));
			});
		}else{
			$("#add_qual").hide();
			$(".add_qual_max_tips").show();
		}
	});
	
	$(".tourist_li").unbind('click').click(function(e) {		
		var vals = $("#touristSet").val();
		var strs = (null != vals && "" != vals) ? vals.split(",") : new Array();
		var thisV = $(this).find("input").val();
		var index = strs.in_array(thisV);
		if (-1 == index || strs.length < 1) {
			$(this).find("input").attr("checked", "checked").prop("checked", "checked");
			strs.push(thisV);
		} else {
		    if($(this).find("input").attr("checked")=="checked"){							    
	            if(window.confirm("取消后会删除该专线下全部产品，务必慎重。")){
	                $(this).find("input").removeAttr("checked"); 
	                strs.splice(index, 1);
	            }else{
	                e.preventDefault();
	            }
            }			
		}
		$("#touristSet").val(strs.join(","));		
	});
	
	$(document).off('click','span.del_item');
	$(document).on('click','span.del_item',function(){
		var that = this;
		var certId = $(that).attr('data-cert-id');
		var supplierId = $(that).attr('data-supplier-id');
		if("" != certId && null != certId && "" != supplierId && null != supplierId){
			$.confirm('您确定要删除此资质(不可恢复)？','确认提示',function(){
				$.ajax({
					url:'/supplier/' + supplierId + '/cert/' + certId,
					type: "POST",
					async:false,
					dataType: "json",
					data: {format:'json',_method: 'DELETE'},
					success:function(json){
						showmsg(null, json);
						$(that).parent().remove();
						setBelongVal(scope);// 重置已选的旅行社
						if($("#other_qualifications").children().length < maxTravel){
							$("#add_qual").show();
							$(".add_qual_max_tips").hide();
						}
					}
				});
			},function(){});
		} else {
			$(that).parent().remove();
			setBelongVal(scope);// 重置已选的旅行社
			if($("#other_qualifications").children().length < maxTravel){
				$("#add_qual").show();
				$(".add_qual_max_tips").hide();
			}
		}
	});
	
	$('input.touristSet').unbind('change');
	$('input.touristSet').change(function(){
		var set = $(this).val();
		var vals = $("#touristSet").val();
		var strs = (null != vals && "" != vals) ? vals.split(",")
				: new Array();
		if ($(this).is(':checked')) {
			$(".tourist_" + set).show();
			$(".tourist_" + set).each(function() {
				var thisV = $(this).attr("attr_id");
				var index1 = strs.in_array(thisV);
				console.log($(this).find("input").eq(0).is(':checked'));
				console.log(index1);
				console.log(thisV);
				if($(this).find("input").eq(0).is(':checked') && -1 == index1){
					strs.push(thisV);
				}
				if (-1 != index1 && strs.length > 0) {
					$(this).addClass("on");
				}
			});
		} else {
			$(".tourist_" + set).each(function() {
				$(this).hide();
				var thisV = $(this).attr("attr_id");
				var index2 = strs.in_array(thisV);
				if (-1 != index2 && strs.length > 0) {
					strs.splice(index2, 1);
					$(this).removeClass("on");
				}
			});
		}
		$("#touristSet").val(strs.join(","));
	});
	$("#add_address").click(function(){
		var addressLength = $("#address-list").children().length;
		if(addressLength < 5){
			var newDiv = document.createElement("div");
			$(newDiv).hide();
			$("#address-list").append( newDiv );
			$(newDiv).addClass("mb5");
			$(newDiv).append('<input type="text" class="theme_input address-input" style="width:350px;" name="address" valid_id="address'+addressLength+'" value="" placeholder="详细地址" maxlength="100" datatype="st1-100" nullmsg="请输入详细地址" title="详细地址">'+
					'<span class="belongClose" title="删除地址">X</span><span class="address'+addressLength+'_Validform_checktip Validform_checktip"></span>');
			$(newDiv).show();
			$(newDiv).find(".belongClose").click(function(){
				$(this).parent().remove();
				setAddressStatus($("#address-list").parent());
			});
		}
		setAddressStatus($("#address-list").parent());
	});
	$(".belongClose").click(function(){
		$(this).parent().remove();
		setAddressStatus($("#address-list").parent());
	});
	
	$(".touristSet").each(function(){
		var set = $(this).val();
		if($(this).is(':checked')){
			$(".tourist_" + set).show();
		}
	});


	var defaultLintIds = $("#touristSet").val();//默认专线id
	defaultLintIds = (null != defaultLintIds && "" != defaultLintIds) ? defaultLintIds.split(",") : new Array();
	for(var i = 0; i < defaultLintIds.length ; i++){
		$("input[value="+defaultLintIds[i]+"]").attr("checked", "checked").prop("checked", "checked");
	}

	setBelongVal(scope);
	setAddressStatus($("#address-list").parent());
	if($("#other_qualifications").children().length < maxTravel){
		$("#add_qual").show();
		$(".add_qual_max_tips").hide();
	}else{
		$("#add_qual").hide();
		$(".add_qual_max_tips").show();
	}

    //3.1新增功能
    var businessId=$("#supplierForm").attr("action").split("/")[2];
	// 1.选项卡切换
	$(".view_nav ul li").on("click",function(){
		 $(".view_nav ul li").each(function(){
		 	$(this).removeClass("select");
		 });
		 $(this).addClass("select");
		 if($(this).index()===0){
		 	$(".account_detail").show();
		 	$(".return_record").hide();
		 	$(".sign_record").hide();
		 }else if($(this).index()===1){//回访记录
		 	$(".account_detail").hide();
		 	$(".return_record").show();
		 	$(".sign_record").hide();
		 	//回访记录列表(ajax)	
			$.ajax({
				url:"/visit-log/"+businessId+".json?_=" + Date.parse(new Date()),
				type:"GET",
				async:false,
				dataType:"json",
				success:function(response){
					//回访记录总条数
					$(".return_count").find("span").text(response.pagination.count)
					//回访记录列表
					// var responseList=response.visits;
					// $(".return_list").html('');
					// for(var i=0;i<responseList.length;i++){
     //                    $(".return_list").append('<div class="list_detail" delid='+responseList[i].id+'>'+
					//     '<span class="time">• '+responseList[i].createTime+'&nbsp;'+responseList[i].user.name+'：</span>'+
					//     '<div><span>'+responseList[i].visitMethodCn+',</span><span>'+responseList[i].typeCn+',</span><span>'+responseList[i].content+'</span>&nbsp;<span class="del_information">[删除]</span></div></div>')										        
     //                }				                
	                //问题属性列表
	                $(".return_selec").find("select").eq(0).html('<option value="">选择问题属性</option>');
	                for(var j=0;j<response.types.length;j++){
                        $(".return_selec").find("select").eq(0).append('<option value='+response.types[j].id+'>'+response.types[j].name+'</option>')
	                }
	                //回访方式列表
	                $(".return_selec").find("select").eq(1).html('<option value="">回访方式</option>');
	                for(var k=0;k<response.visitMethods.length;k++){
                        $(".return_selec").find("select").eq(1).append('<option value='+response.visitMethods[k].id+'>'+response.visitMethods[k].name+'</option>')
	                }	                	              
				}
			});
			//分页函数
		    $("#pagination").pagination({
				dataSource:"/visit-log/"+businessId+".json?_=" + Date.parse(new Date()),
				pageSize: 5,
			    showGoInput: true,
			    showGoButton: true,
				locator: 'visits',
				triggerPagingOnInit:true,
				alias:{
					 pageNumber: 'page',
					 pageSize: 'size'
				},
				getTotalPageByResponse: function (data) {
		            return data.pagination.pageCount;
		        },
				hideWhenLessThanOnePage:false,
				beforePaging:function(){
					$(".return_list").html("<li>正在加载...</li>");
				},
				callback:function(data,p){
					$("#pagination")[data.length ? 'show' : 'hide']();
					$(".return_list").html('').html(genreturnList(data));
					var a=$(".return_list").find(".tuserId");
                    for(var i=0;i<a.length;i++){
                        if(a.eq(i).val()===THIS_USER_ID){
                           a.eq(i).parent(".time").next("div").find(".del_information").show();
                        }else{
                           a.eq(i).parent(".time").next("div").find(".del_information").hide();
                        }
                    }
				}
		    });
		 }else if($(this).index()===2){
            $(".account_detail").hide();
            $(".return_record").hide();
		 	$(".sign_record").show();
		 	//录入员列表(ajax)
		 	$.ajax({
				url:"/editors.json?_=" + Date.parse(new Date()),
				type:"GET",
				async:false,
				dataType:"json",
				success:function(response){
                     $(".record_selec").html('<option value="">请选择</option><option value="1">陈浩南</option>');
					for(var i=0;i<response.editors.length;i++){
					  $(".record_selec").append('<option value='+response.editors[i].id+'>'+response.editors[i].name+'</option>');
					}
				}
			});
		 	//签单记录列表(ajax)	
			$.ajax({
				url:"/signing/"+businessId+".json?_=" + Date.parse(new Date()),
				type:"GET",
				async:false,
				dataType:"json",
				success:function(response){
					if (response && response.signing) {
						$("#sign").val(response.signing.signingTime);//签约时间
						$("#useful_start").val(response.signing.effectiveStart);//有效期开始时间
						$("#useful_end").val(response.signing.effectiveEnd);//有效期结束时间
						var signingnameId=response.signing.signing.id;//签约人
						var signingnameList=$(".record_selec").find("option");
						for(var j=0;j<signingnameList.length;j++){
							if(signingnameList.eq(j).val()==signingnameId){
	                            signingnameList.eq(j).attr("selected","selected");
							}
						}
						$(".record_money").val(response.signing.payType);//付费形式
						$("#contract_number").val(response.signing.agreement);//合同编号
						$("#record_content").val(response.signing.content);//备注信息
						$("#signId").val(response.signing.id);//备注信息
						//合同上传信息
						var files = response.signing.businessSigningFiles;
						if (null != files && files.length > 0) {
							$(".sign-file-list-show").html("");
							for (var j=0; j<files.length; j++) {
								$(".sign-file-list-show").append('<a href="' + files[j].attachment.url + '" target="_blank">附件' + (j + 1) + '</a>');
							}
						}
					}
					//3.合同上传
					var st = $("#uploadInitStatus").attr("status");
					if ("" == st || null == st) {
						$("#uploadInitStatus").attr("status", "true");
					    $uploading = false;
					    webUpload({
							id : "#signAgreement",
							label : $("#signAgreement").text(),
							process : function(percent) {
								$uploading = true;
								$("#signMessage").text("");
							},
							button : $("#signAgreement"),
							success : function(response){
								$uploading = false;
								var filename = response.name;
								if (!filename) {
									Tour.utils.showError($("#signMessage"), "文件格式错误");
									return ;
								} else {
									var maxname = 25;
									if (filename.length >= maxname) {
										var lastIdx = filename.lastIndexOf(".");
										var staff = filename.substring(lastIdx);
	
										if (staff.length >= maxname) {
											Tour.utils.showError($("#signMessage"), "文件格式错误");
											return ;
										}
										filename =  filename.substring(0, 25 - staff.length) + staff;
									}
									//附件名字
									var fileData = [];
									var attchment = {};
									attchment.url = response.url;
									attchment.name = filename;
									attchment.size = response.size;
									var fileInfo = $(".signFileMessage_sub");
									var imgStr = fileInfo.text();
							    	if (imgStr && "" != imgStr && null != imgStr) {
							    		fileData = eval('(' + imgStr + ')');
							    	}
							    	fileData.push(attchment);
							    	fileInfo.text(fileData && fileData.length > 0 ? JSON.stringify(fileData) : "");
							    	var number = $(".sign-file-list-show").children().length;
							    	$(".sign-file-list-show").append('<a href="' + response.url + '" target="_blank">附件' + (number+1) + '</a>');
								}
							},
							error : function(id,msg){
								$uploading = false;
								alert(msg);
							},
							cancelsuccess : function(){
								$uploading = false;
							},
							positionable:true,
							tipmessage:"<small class='upload-tips'>最多5个jpg、office文件供用户下载（若没有不可传）</small>",
							corver:'<div class="cover hidden"><span class="upBtn">合同上传</span></div>',
							messagejson:true,
							operateType : "tour_attach",
							useDefault:1,
							accept:{ 
								title: 'Images',
					            extensions: 'png,jpg,docx,xlsx,doc,xls'
					           },
							cancel : null
						});
					}
				}
			});
		 }
	});
    function genreturnList(data){
        var c = "";
		$.each(data,function(){
			c += '<div class="list_detail" delid='+this.id+'>'+
		    '<span class="time">• '+this.createTime+'&nbsp;'+this.user.name+'：<input value='+this.user.id+' type="hidden" class="tuserId"/></span>'+
		    '<div><span>'+this.visitMethodCn+',</span><span>'+this.typeCn+',</span><span>'+this.content+'</span>&nbsp;<span class="del_information">[删除]</span></div></div>';
		})
		return c?c:"<li>暂无数据</li>";
    }
	//2.日期选择
	$('#sign').datetimepicker({
        showSecond: true,
	    timeFormat: 'hh:mm:ss'
	});
    $('#useful_start').datetimepicker({
		showSecond: true,
	    timeFormat: 'hh:mm:ss'
    });
    $('#useful_end').datetimepicker({
		showSecond: true,
	    timeFormat: 'hh:mm:ss'
    });
	//4.删除回访信息(二次提示框)
	$(document).on("click",".del_information",function(){
		//参数传资讯的ID
		delInformation($(this).parent().parent().attr("delid"));        
	});
	function delInformation(id){
		var delinformation=$.confirm("删除后不可恢复，是否确认？","确认提示", function(){
			//删除操作
			$.ajax({
				url:"/visit-log/"+id+".json?_=" + Date.parse(new Date()),
				type:"DELETE",
				async:false,
				dataType:"json",
				success:function(response){
					alert((response && response.result) && response.result.message);
					// 刷新列表
					$(".view_nav ul li.select").click();
				}
			})
			delinformation.close();
		},function(){
			//取消
	    });
    }
    //保存回访记录备注 .
    $("#supplier-visit-content").on("click", function(){
    	var returncontent=$("#text_remark").val();
    	if(returncontent!=="" && returncontent!==null){
	    	$.ajax({
				url:"/business/"+businessId+"/content.json?_=" + Date.parse(new Date()),
				type:"POST",
				async:false,
				dataType:"json",
				data:{visitContent:returncontent},
				success:function(response){
	                alert((response && response.result) && response.result.message);
				}
			});
        }else{
        	alert("不能留白");
        }
    });
    //回访记录新增保存
    $(".return_selec").find("button").on("click",function(){
    	var content=$(".return_selec").find("textarea").val();
    	var type=$(".return_selec").find("select").eq(0).val();
    	var visitMethod=$(".return_selec").find("select").eq(1).val();
    	console.log(type + "===" + visitMethod);
    	if(content!=="" && content!==null && type!=="" && type!==null && visitMethod!=="" && visitMethod!==null){
    		var visitLogForm = {};
    		visitLogForm.content = content;
    		visitLogForm.type = type;
    		visitLogForm.visitMethod = visitMethod;
    		visitLogForm.businessId = businessId;
    		$.post('/visit-log.json?_=' + Date.parse(new Date()),visitLogForm,function(response){
    			alert((response && response.result) && response.result.message);
    			$(".view_nav ul li.select").click();
    		});
//    		$.ajax({
//				url:"/visit-log.json",
//				type:"PUT",
//				async:false,
//				data:{content:content,type:type,visitMethod:visitMethod,businessId:businessId},
//				dataType:"json",
//				success:function(response){
//					alert((response && response.result) && response.result.message);
//					// 刷新列表
//					$(".view_nav ul li.select").click();
//				}
//		    });
    	}else{
    		alert("不能留白");
    	}  	
    })
    // 签单记录新增或修改
    $("#signSubmit").click(function(){
    	var signTime = $("#sign").val();//签约时间
    	var signTimeStart = $("#useful_start").val();//有效期开始时间
    	var signTimeEnd = $("#useful_end").val();//有效期结束时间
		var signingnameId = $(".record_selec").val();
		var signPay = $(".record_money").val();//付费形式
		var signCode = $("#contract_number").val();//合同编号
		var signContent = $("#record_content").val();//备注信息
		var signId = $("#signId").val();//备注信息
		if ("" == signTime || null == signTime || null == signingnameId || "" == signingnameId) {
			alert("签约时间和签单人不能为空");
			return;
		}
		var signingForm ={};
		signingForm.signId = signId;
		signingForm.businessId = businessId;
		signingForm.signingTime = signTime;
		signingForm.effectiveStart = signTimeStart;
		signingForm.effectiveEnd = signTimeEnd;
		signingForm.signing = signingnameId;
		signingForm.payType = signPay;
		signingForm.agreement = signCode;
		signingForm.content = signContent;
		var fileInfo = $(".signFileMessage_sub");
		var imgStr = fileInfo.text();
    	if (imgStr && "" != imgStr && null != imgStr) {
    		fileData = eval('(' + imgStr + ')');
    		signingForm.businessSigningFiles = [];
    		for(var i = 0 ; i < fileData.length; i++){
    			var attachment = {};
    			attachment = fileData[i];
    			attachment.filePath = fileData[i].url;
    			signingForm['businessSigningFiles['+i+'].attachment.name'] = fileData[i].name;
    			signingForm['businessSigningFiles['+i+'].attachment.url'] = fileData[i].url;
    			signingForm['businessSigningFiles['+i+'].attachment.size'] = fileData[i].size;
    			signingForm['businessSigningFiles['+i+'].attachment.filePath'] = fileData[i].url;
        	}
    	}
    	
		$.post('/signing.json?_=' + Date.parse(new Date()),signingForm,function(response){
			alert((response && response.result) && response.result.message);
			return;
		});
    });
    $("#signDel").click(function(){
    	var signId = $("#signId").val();
    	if (null != signId && "" != signId && signId > 0) {
    		$.confirm("删除后不可恢复，是否确认？","确认提示", function(){
		    	$.ajax({
					url:"/signing/" + signId + ".json?_=" + Date.parse(new Date()),
					type:"DELETE",
					async:false,
					dataType:"json",
					success:function(response){
		                alert((response && response.result) && response.result.message);
					}
				});
    		});
    	} else {
    		alert("没有可删除的签单项");
    	}
    });
    
    // 初始化最后执行选中标签
    var liIndex = $("#liIndex").val();
    if ("" != liIndex && null != liIndex && liIndex >= 0) {
    	$(".view_nav ul li").eq((liIndex > 2 ? 2 : liIndex)).click();
    }
});

function setAddressStatus(obj){
	if(obj.find(".addressList").children().length >= 5){
		obj.find(".add_address").hide();
		obj.find(".max-address").show();
	}else{
		obj.find(".add_address").show();
		obj.find(".max-address").hide();
	}
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

function initFileUp(uploadObj, label, successCall){
	var belongImg = uploadObj.parent().parent().find(".belong_img");
	var belongMainFileMessage = uploadObj.parent().parent().find(".belongMainFileMessage_sub");
	var fileShow = uploadObj.parents(".upload-file-obj").find(".file-list-show");
	var fileObj = "" != belongMainFileMessage.text() && null != belongMainFileMessage.text() && eval( '(' + belongMainFileMessage.text() + ')') || [];
	webUpload({
		id:  uploadObj,
		operateType : 'other_image',
		label : label,
		multifile : true,
		fileNumLimit : 10,
		showFileCount : true,
		changetext : label.replace(/上传/g, ""),
		data : fileObj ? fileObj : [],
		resetwidth:true,
		pickwidth : "100%",
		accept : {title : "title", extensions : "jpg,jpeg,png"},
		success : function(response){
			var value = [];
			var filehtmls = "";
	    	for(var i = 0 ; i < response.length; i++){
	    		var jsonmessage = {};
				jsonmessage.url=response[i].url;
				jsonmessage.fileName=response[i].name;
				jsonmessage.name=response[i].name;
				jsonmessage.size=response[i].size;
				jsonmessage.width=response[i].width;
				jsonmessage.height=response[i].height;
				
				value.push(jsonmessage);
				filehtmls += '<span style="float:left;margin-right:10px;"><a href="'+response[i].url+'" target="_blank">图'+(i+1)+'</a></span>';
	    	}
	    	belongImg.val(value && value.length > 0 ? JSON.stringify(value) : "");
	    	belongMainFileMessage.text(JSON.stringify(value));
	    	fileShow && fileShow.html("").html(filehtmls);
	    	successCall && successCall(response);
		}
	});
}
function setBelongVal(scope){
	var setVs = new Array();
	scope.find(".belong_main").each(function(){
		if(null != $(this).val() && "" != $(this).val()){
			setVs.push($(this).val());
		}
	});
	scope.find("#setBelongs").val(setVs.join(","));
}