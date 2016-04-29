var editor;
function distributorOperate(url, title, options, flushNow, callback){
	var opts = {
	        title   :   title,
	        isClose :   false,
	        fixed   :   true,
	        lock    :   true
    };
    return openDialog(url, $.extend({}, opts, options), flushNow, callback);
}
//定义弹出层
var showDialog= function(options) {
	var h=$(window).height()-200;
	var init=options.init,close = options.close,title=options.title;
	var showDialog = $.dialog({
		title: title,
        width:900,
        isOuterBoxShadow: false,
        isClose: false,
        padding:"0px",
        content: options.content,
        lock: true,
        fixed: true,
		isClickShade : false,			
		resize: false,
		esc: false,
        button: [{
			name:'取消',
			cssClass:'btn-cancel',
			callback: function(){
				// return false;
				showDialog.close();
			}
		},{
			name:'确定',
			cssClass:'btn-save',
			callback: function(){


			//操作
            var valid = isValid();
            	if(valid){
				  $("#input_information").submit();
			    }			
			return valid;				     				        
			}
		}],
        init:function(here){
        	$(".aui_main .input_information").height(h);
        	$(".aui_main .input_information").css({"overflow-y":"scroll","max-height":"580px"});
        	init && init();
        },
        close : function() {
        	//close && close();
			//destoryuploadpic();
		}
	});
	return showDialog;
}
function delInformation(id){
	var delinformation=$.confirm("删除后不可恢复，是否确认？","确认提示", function(){
		//删除操作
		$.ajax({
			url:"/news/"+id+"?format=json",
			type:"DELETE",
			async:false,
			dataType:"json",
			success:function(json){
				showmsg(null, json);
				if(json.result.success){
					window.location.href="/news";
				}
			}
		})
		delinformation.close();
	},function(){
		//取消
	});
}
function upInformation(id){
	var upinformation=$.confirm("确定替换当前置顶资讯吗？","确认提示", function(){
		//置顶操作
		$.ajax({
			url:"/news/"+id+"/top?format=json",
			type:"PUT",
			async:false,
			dataType:"json",
			success:function(json){
				showmsg(null, json, 'flush_now');
			}
		})
		upinformation.close();
	},function(){
		//取消
	});
}


function fresh(id,fromView){
	var upinformation=$.confirm("确定刷新当前资讯吗？","确认提示", function(){
		//置顶操作
		$.ajax({
			url:"/news/"+id+"/fresh?format=json",
			type:"PUT",
			async:false,
			dataType:"json",
			success:function(json){
				if(fromView){
					showmsg(null, json);
				}else{
					showmsg(null, json, 'flush_now');
				}
			}
		})
		upinformation.close();
	},function(){
		//取消
	});
}


var $form;
function isValid() {
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.disable($("#input_information"));
	}
	var flag = $form.validationEngine('validate');
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.enable($("#input_information"));
	}
	if($("input[name='imageUrl']").val()==""){
		$(".choice_img").validationEngine('showPrompt',"请选择图片",'error',null,true);
		flag = false;
	}
	var summary = $("#input_information textarea[name=summary]");
	if(flag && $.trim(summary.val())=="")
	{
		$(".summary").validationEngine('showPrompt',"请输入摘要",'error',null,false);
		flag = false;
	}else{
		if(flag){
			 var count = getInputLen(summary.val());
			 if(count>summary.attr("maxlength")){
				 $(".summary").validationEngine('showPrompt',"摘要不能超过"+summary.attr("maxlength")+"个",'error',null,false);
				 flag = false;
			 }
		}
	}
	
	if(flag && !editor.html()){
		$(".information_content_tip").validationEngine('showPrompt',"请输入正文",'error',null,false);
		flag = false;
	}else{
		var max = 20000;
		if(flag){
			 var count = getInputLen(editor.html());
			 if(count>max){
				 $(".information_content_tip").validationEngine('showPrompt',"正文不能超过"+max+"个",'error',null,false);
				 flag = false;
			 }
		}
	}
	//2.5关联产品编号验证
		var $products_id=$("input[name=products]");
		$products_id.each(function(){
			var self = $(this);
			if(flag && self.val()!=""){				    					     
				 $.ajax({
					type:"GET",
					url:"/product/"+self.val()+"/valid.json",					
					dataType:"json",
					async:false,
					success:function(response){				         				          
							if(response.product!=null && !response.product.deadline && !response.product.expired && !response.product.offShelf && !response.product.expiredShelf && response.product.onShelf && response.product.available){
	                    	 flag = true;
	                    }else{
	                    	if(response.product==null){
								self.validationEngine('showPrompt',"此产品不存在，请更换产品编号",'error',null,false);	   
					        }else if(!response.product.available){
		                    	self.validationEngine('showPrompt',"此产品已被删除，请更换产品编号",'error',null,false);
		                    }else if(response.product.deadline){
					        	self.validationEngine('showPrompt',"此产品已过截止收客日期，请更换产品编号",'error',null,false);
					        	self.next(".products_items").addClass("waring");
					        	setTimeout(function(){
									self.next(".products_items").removeClass("waring");
								},3500);
		                    }else if(response.product.expired){
		                    	self.validationEngine('showPrompt',"此产品已过期，请更换产品编号",'error',null,false);							
		                    }else if(response.product.offShelf){
		                    	self.validationEngine('showPrompt',"此产品已下架，请更换产品编号",'error',null,false);
		                    }else if(response.product.expiredShelf){
		                    	self.validationEngine('showPrompt',"此产品已过期下架，请更换产品编号",'error',null,false);
		                    	self.next(".products_items").addClass("waring");
					        	setTimeout(function(){
									self.next(".products_items").removeClass("waring");
								},3500);
		                    }else if(!response.product.onShelf){
		                    	self.validationEngine('showPrompt',"此产品还未上架，请更换产品编号",'error',null,false);
		                    }
		                    flag = false;
	                    }                  
					}
				 });
			}
		});                  
  	return flag;	
}

//修改资讯
function updateDialog(dialogObj,informationData,update_view) {
	var $updateDialog = dialogObj;
	var screenHeight = window.screen.availHeight;
	var title="新增资讯";
	if(informationData){
		title="修改资讯";
	}
	var myDialog = showDialog({
		title:title,
		content : $updateDialog && $updateDialog.length && $updateDialog[0],
		zIndex : 600,
		init : function() {
			var orginurl =  $("#showchose_image").attr("src");
			 $(".choice_img").gmgallery({multiSelect:false,operateType:"other_image",options_id:new Date().getTime(),onOk:function(data){
				 $(".show_img").removeClass("hidden");
				 $("#showchose_image").attr("src",data.url)
				 $("input[name='imageUrl']").val(data.url);
			 },zIndex:'900999'});
			 
			 $(".show_img").find(".delImg").on("click",null,function(){
				 $(".show_img").addClass("hidden");
				 $("#showchose_image").attr("src",orginurl);
				 $("input[name='imageUrl']").val("");
			 })
			 
			 $(".summary").on("keyup",null,function(){
				 var count = getInputLen($(this).val());
				 $(this).next().text(count+"/"+$(this).attr("maxlength"));
			 });			 
             //增加资讯弹窗点击取消提示框
			 $(".btn-cancel").click(function(){
			 	if(title=="新增资讯"){
				 	var a = window.frames[0].document;
					var b=a.getElementsByTagName('body')[0].innerHTML;
				 	if($("input[name='title']").val()!="" || $("input[name='imageUrl']").val() || $("textarea[name='summary']").val()!="" || b!=""){
				 	  if(window.confirm("取消将清空已录入的内容，是否确认？")){
	                      return true; 
				 	  }else{
	                      return false;
				 	  }
				 	}
			 	}			 	 
			 });					           

			 //2.5关联产品编号验证
			 // $(".btn-save").click(function(){
	   //            if($("input[name=products]").val()==""){
			 //          $("input[name=products]").removeClass("validate[required]");		 
		  //          }
	   //       });
                         					
			 var input_form =  $("#input_information");
			 if(informationData){
				 $(".show_img").removeClass("hidden");
				 input_form.attr("action","/news/"+informationData);
				 if(update_view){
					 input_form.append("<input type='hidden' name='fromView' value='true'/>")
				 }
			 }else{
				 $("input[name=_method]").remove();
			 }
			 
			$form = input_form.validationEngine({
				validateNonVisibleFields : true,
				validationEventTrigger : "",
				showOneMessage : false,
				maxErrorsPerField : 1,
				promptPosition : "topLeft:0,6",
				scroll : true,
				scrollOffset : 100,
				autoHidePrompt : true,
				autoHideDelay : 3000,
				focusFirstField : true
			});
			
			//初始化编辑器
			$("textarea[tag=edit]").each(function(){
				editor = initKindEditor($(this),null, null,"",null,null,function(){
					var statusBar = this.statusbar.get();
			    	var limitNum = this.maxTextLength;
			    	var textLength = getInputLen(this.html());
			    	var pattern = '还可以输入' + limitNum + '字';
			    	if(textLength > limitNum) {
			    		pattern = '你输入的字符个数已经超出最大允许值,最多输入'+limitNum+'个字符';
			    	}else{
			    		var result = limitNum - textLength;
			    	    pattern = '还可以输入' +  result + '字符';
			    	}
			    	$(statusBar).find(".status-text").text(pattern);
			    	this.sync();
				});
			});
			
		}
	});
}

function getInputLen(value){
	 var count = value.length;
	 var arr = value.match(/\n/g);
	 if(arr){
		 count += arr.length;
	 }
	 return count;
}

$(function(){
	/*定义返回顶部的位置*/
	var left=0;
	left=($(window).width()-1200)/2-45;
	var return_top=$(".return_top"),isShow=false;
	$(window).resize(function(){
		left=($(window).width()-1200)/2-45;
		$(".return_top").css({"right":left+"px"});
	});
	$(window).scroll(function(){
		var top=$(window).scrollTop();
		if(top>80 && !isShow){
			return_top.css({display:"block"});
			isShow=true;
		}
		else if(top<80 && isShow){
			return_top.css({display:"none"});
			isShow=false;
		}
	});
	$(".return_top").css({"right":left+"px"});
	//删除资讯
	$(".del_information").click(function(){
		//参数传资讯的ID
		delInformation($(this).attr("delete_id"));
	});
	//置顶资讯
	$(".up_information").click(function(){
		//参数传资讯的ID
		upInformation($(this).attr("up_id"));
	});
	
	//置顶资讯
	$(".fresh_information").click(function(){
		//参数传资讯的ID
		fresh($(this).attr("fresh_id"));
	});
	
	//置顶资讯
	$(".freshview_information").click(function(){
		//参数传资讯的ID
		fresh($(this).attr("fresh_id"),true);
	});
	
	
	$(".update_information").click(function(){
		var informationId=$(this).attr("update_id");
		var update_view = $(this).attr("update_view");
		//根据资讯的ID请求修改的数据
		$.ajax({
			type:"GET",
			dataType:"json",
			url:"/news/"+informationId+"/input?format=json&m="+Math.random(),
			success:function(result,response){
				var information = result.information;
				information.url =information.imageUrl;
				information.sumarylen = information.summary.length;
				updateDialog($(template("information_input", information)), informationId,update_view);
			}
		})
	})
	$(".add_information").click(function(){
		updateDialog($(template("information_input", {url:WEB_STATIC_CONSOLE+"/theme/blue/images/information/img_default.png",sumarylen:0})));
	})	
})



