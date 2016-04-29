$(function() {
	var clientHeight = document.documentElement ? document.documentElement.clientHeight : $(window).height();
	$("#empAdd").css({
		height: clientHeight - 360
	});
	$("#empAdd").find('.input_body').css({
		minHeight: clientHeight - 400
	});
	// 初始化地区
	$("#distributorSelectArea").selectZone({
		textContainer : '#distributorShowArea',
		valContainer : $('#distributorAreaId'),
		defaultText:"四川成都",
		zIndex : 12,
		callBack : function(data){
			$("#distributorAreaId").val(data.id);
		}
	});
	// 初始化文件上传 
	$(".beforeUp").each(function(){
		initFileUp($(this), $(this).text());
	});
	var childCount = $("#other_qualifications").find(".belongLis").length;
	$('a#add_qual').unbind('click').click(function(){
		var otherDiv = $("#other_qualifications");
		var childNum = (otherDiv.find(".belongLis").length*1);
		var maxLength = 5;
		var tempData = {};
			
		if(childNum < maxLength*1){
			tempData.inputname = 'travelAgencyName';
			tempData.inputNameClass = 'belong_main';
			tempData.inputNameValid = 'belong'+childCount;
			tempData.fileInputClass = 'belong_img';
			tempData.fileInputValid = 'belongFile'+childCount;
			var $newEle = $(template("default-qualifications", tempData));
			otherDiv.append($newEle);
			childCount++;
			if((otherDiv.find(".belongLis").length*1) >= maxLength){
				$("#add_qual").hide();
				$(".add_qual_max_tips").show();
			}
			initFileUp($newEle.find(".beforeUp"), "合作协议");
		}else{
			$("#add_qual").hide();
			$(".add_qual_max_tips").show();
		}
	});
	
	$("#add_address").click(function(){
		var addressLength = $("#address-list").children().length;
		if(addressLength < 5){
			var newDiv = document.createElement("div");
			$(newDiv).hide();
			$("#address-list").append( newDiv );
			$(newDiv).addClass("mb5");
			$(newDiv).append('<input type="text" style="width:240px;" class="theme_input fl" name="address" valid_id="address'+addressLength+'" value="" datatype="st1-100" nullmsg="请输入详细地址" title="详细地址">'+
					'<span class="belongClose" title="删除地址">X</span><span style="line-height:28px;" class="address'+addressLength+'_Validform_checktip Validform_checktip"></span>');
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
	
	$('body').on('click','span.del_item',function(){
		var that = this;
		$.confirm('您确定要删除此资质(不可恢复)？','确认提示',function(){
			$(that).closest(".belongLis").remove();
			setZizhiStatus();
		},function(){});
	});
	
	$(".belong_main").select2({
		zIndex:2000
	});
	
	var hasoutbound = $("input[name=outbound]").attr("attr_bound");
	
	/**
	$("input[name=outbound]").on("click",null,function(){
		var outbound=$(this).prop("checked");
		if(hasoutbound=="true" && outbound==false){
			$.confirm('取消出境资质后所有的出境产品将被下架且不可恢复，确定吗？','确认提示',function(){
			},function(){
				$("input[name=outbound]").prop("checked","checked");
			});
		}
	})
	**/
	
	
	setAddressStatus($("#address-list").parent());
	setZizhiStatus();
	var updateForm = $("#updateForm").Validform({
                tiptype:2
    });
    //3.1新增功能
    var businessId=$("#updateForm").attr("action").split("/")[2];
	// 1.选项卡切换
	$(".view_nav ul li").on("click",function(){
		 $(".view_nav ul li").each(function(){
		 	$(this).removeClass("select");
		 });
		 $(this).addClass("select");
		 if($(this).index()===0){
		 	$(".account_detail").show();
		 	$(".return_record").hide();
		 }else if($(this).index()===1){//回访记录
		 	$(".account_detail").hide();
		 	$(".return_record").show();
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
	//2.删除回访信息(二次提示框)
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
    	}else{
    		alert("不能留白");
    	}  	
    });
    
    // 初始化最后执行选中标签
    var liIndex = $("#liIndex").val();
    if ("" != liIndex && null != liIndex && liIndex >= 0) {
    	$(".view_nav ul li").eq((liIndex > 2 ? 2 : liIndex)).click();
    }
});


function setZizhiStatus() {
	if($("#other_qualifications").find(".belongLis").length < 5){
		$(".add_qual_max_tips").hide();
		$("#add_qual").show();
	} else {
		$("#add_qual").hide();
		$(".add_qual_max_tips").show();
	}
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

function setBelong(obj){
	var fileList = obj.find(".fileList");
	fileList.html("");
	obj.find(".belongLis").each(function(i){
		var bli = $(this);
		var imgStr = bli.find(".belongMainFileMessage_sub").text();
		var data = {};
		data.index = i;
		data.travelAgencyName = bli.find("input[name=travelAgencyName]").val();
		if (imgStr && "" != imgStr && null != imgStr) {
			data.attas = eval('(' + imgStr + ')');
		}
		fileList.append($(template("qualifications-setting", data)));
	});
}

function setBelongMain(obj){
	var appendToObj = obj.parent();
	var $belongMainSettting = appendToObj.find(".belong-main-file-setting");
	var imgStr = appendToObj.find(".belongMainFileMessage_sub").text();
	var data = {};
	if (imgStr && "" != imgStr && null != imgStr) {
		data.attas = eval('(' + imgStr + ')');
	}
	$belongMainSettting.html($(template("belong-main-file-setting", data)));
}

function checkIsNull(){
	var flag = true;
	$('.belong_main').each(function(){
		if(!$(this).val()) {
			$.gmMessage("旅行社不能为空", false);
			flag = false;
		}
		if(!$(this).parent().find(".belong_img").val()) {
			$.gmMessage("资质不能为空", false);
			flag = false;
		}
	});
	return flag;
}

function getBelongVal(){
	var setVs = new Array();
	var mainTa = $('#mainCert').val();
	mainTa && setVs.push(mainTa);
	$.each($("#other_qualifications").children(),function(){
		var travelAgencyId = $(this).find('.del_item').attr('data-travelAgency-id');
		travelAgencyId && setVs.push(travelAgencyId);
	});
	return setVs;
}

function isRepeat(){ 
	var belongVals = getBelongVal();
	var hash = {}; 
	for(var i in belongVals) { 
		if(hash[belongVals[i]]) {
			return true; 
		} 
		hash[belongVals[i]] = true; 
	} 
	return false; 
}

function upLogo(obj) {
	var upObj = $(obj).parent().find(".gmUploadDiv");
	simpleUpload(upObj, function(data) {
		$(obj).parent().find(".belong_img").val(data.id);
	}, '/attachment/image?format=json&type=b', 2);
	$(obj).parent().find(".gmUploadBut").click();
}

function initFileUp(uploadObj, label){
	var belongImg = uploadObj.parent().parent().find(".belong_img");
	var belongMainFileMessage = uploadObj.parent().parent().find(".belongMainFileMessage_sub");
	var showImg = uploadObj.parent().parent().parent().find(".showImages");
	webUpload({
		id:  uploadObj,
		operateType : 'other_image',
		label : label,
		multifile : true,
		changetext : label,
		showFileCount: true,
		data : belongMainFileMessage.text() && eval("("+belongMainFileMessage.text()+")") || [],
		resetwidth:true,
		pickwidth : "100%",
		accept : {title : "title", extensions : "jpg,jpeg,png,gif"},
		success : function(response){
			var value = [];
			var images = '';
	    	for(var i = 0 ; i < response.length; i++){
	    		var jsonmessage = {};
				jsonmessage.url=response[i].url;
				jsonmessage.fileName=response[i].name;
				jsonmessage.name=response[i].name;
				jsonmessage.size=response[i].size;
				jsonmessage.width=response[i].width;
				jsonmessage.height=response[i].height;
				jsonmessage.id=response[i].id || "";
				jsonmessage.certificateId=response[i].certificateId || "";
				jsonmessage.certificateAttachmentId=response[i].certificateAttachmentId || "";
				value.push(jsonmessage);
				images += '<span style="float:left;margin-right:10px;display:inline-block;"><a href="'+response[i].url+'" target="_blank">图'+(i+1)+'</a></span>';
	    	}
	    	showImg.html(images);
	    	belongImg.val(value.length != 0 && JSON.stringify(value) || "");
	    	belongMainFileMessage.text(value.length != 0 && JSON.stringify(value) || "");
	    	belongImg.blur();
		}
	});
}
