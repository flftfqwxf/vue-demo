$(function() {			
    /* 初始化验证框架  */
	$form=$("#specialForm").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 1000,
		focusFirstField : true
	});
	/* 开始日期与结束日期比较 */
	var dateresult=null;    //判断日期选择是否正确的全局变量
	// var nowdate=null;
	var $startDate =$("#createStartTime").datetimepicker({
		showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    language: 'zh-CN',
		onSelect  : function(){		
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endtDate.datepicker('getDate');
			if(endDate != null && endDate < startDate){
				dateresult=false;
				$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				return false;
			}else{
				dateresult=true;
			}
			// if(new Date()-startDate>=0){
   //             nowdate=false;
   //             $("#createStartTime").validationEngine('showPrompt',"请选择当前之后的日期",'error',null,true);
			// }else{
			// 	 nowdate=true;
			// }					
		}
	});
	var $endtDate = $("#createEndTime").datetimepicker({
		showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    language: 'zh-CN',
		onSelect  : function(){		
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endtDate.datepicker('getDate');
			if(startDate != null && endDate < startDate){
				dateresult=false;
				$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				return false;
			}else{
				dateresult=true;
			}
		}	
	});
	//初始化图片上传(活动封面)
    webUpload({
    	"target":".choice_img",
    	"operateType":"other_image",
    	allowWidth:750,
    	allowHeight:-1,
    	allowType:"EQ",
    	accept:{
            title: '图片',
            extensions: 'JPG,PNG',
            mimeTypes: 'image/*'
        },
    	success:function(response,target){
			$(target).prev(".cover").find(".choiceImg_src").attr("src", response.url + "@100h_100w_1e_1c").end().find("input[name='mobileTopUrl']").val(response.url);
	    },
		error:function(id,message){
			$(id).validationEngine('showPrompt',message,'error',null,true);
		}, 
		label : "选择图片"
	});	
	 //初始化图片上传(微网站首页弹层)
    webUpload({
    	"target":".wx_choice_img",
    	"operateType":"other_image",
    	allowWidth:680,
    	allowHeight:940,
    	allowType:"EQ",
    	accept:{
            title: '图片',
            extensions: 'JPG,PNG',
            mimeTypes: 'image/*'
        },
    	success:function(response,target) {
			$(target).prev(".cover").find(".choiceImg_src").attr("src", response.url + "@100h_100w_1e_1c").end().find("input[name='mobileWindowUrl']").val(response.url);
	    },
		error:function(id,message){
			$(id).validationEngine('showPrompt',message,'error',null,true);
		}, 
		label : "选择图片"
	});
	// //初始化图片上传(微网站首页入口)
	webUpload({
    	"target":".enter_choice_img",
    	"operateType":"other_image",
    	allowWidth:750,
    	allowHeight:400,
    	allowType:"EQ",
    	accept:{
            title: '图片',
            extensions: 'JPG,PNG',
            mimeTypes: 'image/*'
        },
    	success:function(response,target) {
			$(target).prev(".cover").find(".choiceImg_src").attr("src", response.url + "@100h_100w_1e_1c").end().find("input[name='mobilePortalUrl']").val(response.url);
	    },
		error:function(id,message){
			$(id).validationEngine('showPrompt',message,'error',null,true);
		}, 
		label : "选择图片"
	});
	// //初始化图片上传(pc站顶部通栏)
	webUpload({
    	"target":".top_choice_img",
    	"operateType":"other_image",
    	allowWidth:1920,
    	allowHeight:100,
    	allowType:"EQ",
    	accept:{
            title: '图片',
            extensions: 'JPG,PNG',
            mimeTypes: 'image/*'
        },
    	success:function(response,target) {
			$(target).prev(".cover").find(".choiceImg_src").attr("src", response.url + "@100h_100w_1e_1c").end().find("input[name='pcPortalUrl']").val(response.url);
	    },
		error:function(id,message){
			$(id).validationEngine('showPrompt',message,'error',null,true);
		}, 
		label : "选择图片"
	});


	var common={
		init:function(){
           this.changImg();
           this.eitor();
           this.actionChange();
		},
		isValid:function(){
			var flag = $form.validationEngine('validate'),
			a=$(".group_lists").find(".group_number").size();
			if (window.Placeholders && !Placeholders.nativeSupport) {
				Placeholders.disable($("#specialForm"));
			}				
			if (window.Placeholders && !Placeholders.nativeSupport) {
				Placeholders.enable($("#specialForm"));
			}
			if(flag && dateresult===false){
                $("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);   //日期判断
                flag=false;
			}
			// if(flag && nowdate===false){
			// 	$("#createStartTime").validationEngine('showPrompt',"请选择当前之后的日期",'error',null,true);
			// 	flag=false;
			// }
			if(flag && $(".cover_input").val()===''){
				$(".choice_img").validationEngine('showPrompt',"请选择活动封面图片",'error',null,false);   //判断封面图片是否已经添加
	            flag=false;
			}
			if(flag && a<=0){
				$(".keep_button").validationEngine('showPrompt',"请至少添加一组产品",'error',null,false);
	            flag=false;
			}
			if(flag){
				$(".group_number").each(function(index,value){
                    if($(this).find(".products_lists").size()<=0){
						$(this).validationEngine('showPrompt',"请至少添加一个产品",'error',null,false);
	                    flag=false;
                    }
				})				
			}
			if(flag){
				if(!$("input[name='mobileWindowUrl']").val() && !$("input[name='mobilePortalUrl']").val()){
					$("#one_form_two").validationEngine('showPrompt',"微网站首页弹层和微网站首页入口，请选填一个",'error',null,false);
					$("body").scrollTop($("#specialForm").height()-1500)
					flag=false;
				}
			}
			if(flag){
               $(".imageUrl").each(function(){
               	     var _self=$(this);
	               	 if(_self.val==="" || _self.val===null || _self.next("img").attr("src")==="" || _self.next("img").attr("src")===null){
	                     _self.parent().parent().prev('.lists_header').find(".pro_id").validationEngine('showPrompt',"图片不能为空，请选择图片",'error',null,false).focus();
	                     flag=false;
	               	 }
               });
			}			
			return flag;
		},
		eitor:function(){
			$("textarea[tag=edit]").each(function(){
				editor = initKindEditor($(this),null, null,"",null,null,function(){
					var statusBar = this.statusbar.get();
			    	var limitNum = this.maxTextLength;
			    	var textLength = common.getInputLen(this.html());
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
		},
		getInputLen:function(val){
            var count = val.length;
			var arr = val.match(/\n/g);
			if(arr){
				count += arr.length;
			}
			return count;
		},
		changImg:function(){    //初始化图库插件（更换图片）
            $(".change_img").each(function(){
            	var _self=$(this);
				_self.gmgallery({
		    	multiSelect:false,
		    	operateType:"other_image",
		    	options_id:new Date().getTime(),
		    	onOk:function(data){
					 _self.prev("img").attr("src",data.url).end().siblings(".imageUrl").val(data.url).end().siblings(".wutu").hide();

				},zIndex:'999'})
		    });
		},
		actionChange:function(){
			var a=$("input[name='activityId']").val();
			var b=$(".type_decide").val();
            if(b==="update"){
                $("#specialForm").attr("action","/activity/"+a+"").prepend('<input type="hidden" value="PUT" name="_method">');

            }
		},
		resetForm:function(){
			$(".group_number").each(function(index){
				var _self=$(this),
				    i=index;
				    _self.find(".group_Id").attr('name','recommendGroup['+i+'].id');
				    _self.find(".content_group").eq(0).find(".group_header").attr('name','recommendGroup['+i+'].groupName');
				    _self.find(".content_group").eq(1).find(".group_header").attr('name','recommendGroup['+i+'].subtitle');
				    _self.find(".content_group").eq(2).find(".indate").attr('name','recommendGroup['+i+'].defaultShowNum');
				    _self.find(".products_box").find(".products_lists").each(function(index){
                         var _taget=$(this),
                             j=index;
                             _taget.find(".products_Id").attr('name','recommendGroup['+i+'].recommendProduct['+j+'].id');
                             _taget.find(".lists_header").find("input").eq(0).attr('name','recommendGroup['+i+'].recommendProduct['+j+'].product.id');
                              _taget.find(".lists_detail").find(".imageUrl").attr('name','recommendGroup['+i+'].recommendProduct['+j+'].productImg');

				    });

			})
		}

	}
	common.init();

	
	$(document).on("click",".del_group",function(){//删除组

		var _self=$(this)
        var delgroup=$.confirm("确认删除该组，删除后将不可恢复？","确认提示", function(){
        	_self.parent(".content_group").parent(".group_number").remove();
		    delgroup.close();
		},function(){
			//取消
		});	

	}).on("click",".del_product",function(){//删除单个产品

        var _self=$(this)
        var dellist=$.confirm("确认删除该产品，删除后将不可恢复？","确认提示", function(){
        	_self.parent("div").parent(".products_lists").remove();
		    dellist.close();
		},function(){
			//取消
		});
		
	}).on("click",".add_group",function(){//新建一组

       $(this).parent("div").prev(".group_lists").append(template("group_model"));
       $(".J_official_number").each(function(index){
       	  $(this).html("第"+(index+1)+"组产品");
       })

	}).on("click",".add_product",function(){//增加一个产品

       $(this).parent("div").prev(".products_box").append(template("product_model"));

	}).on("click","#goback",function(e){
       if(window.confirm("取消将清空已录入的内容，是否确认？")){
	       return true; 
 	    }else{
           return false;
 	    }
	}).on("input propertychange",".pro_id",function(){
		var _taget=$(this);
		var productId=_taget.val();       
        var regs=/^[1-9]\d*$/;
        if(regs.test(_taget.val())){
        	_taget.parent(".lists_header").append(template("loading"));
        	$.ajax({
        	url:"/recommend/product/"+productId,
			type:"GET",
			async:false,
			dataType:"json"
            }).done(function(response){
                if(response.product){ 
                    _taget.parent(".lists_header").find(".query_loading").remove();             	
                	_taget.parent(".lists_header").next(".lists_detail").html(template("list_temp",response)).end().end().next(".title_ip").val(response.product.name).attr("title",response.product.name);        	  
            	    common.changImg();  
                }else{
                	_taget.parent(".lists_header").find(".query_loading").remove();  
                    _taget.parent(".lists_header").next(".lists_detail").html("无数据");
                }
            }).fail(function(res){
            	_taget.validationEngine('showPrompt',"未查询出结果",'error');
            	// var response=a;
            	_taget.parent(".lists_header").find(".query_loading").remove();
            	         
            })
        }else{
          _taget.validationEngine('showPrompt',"请输入正确格式的产品ID",'error');
        }            
	}).on("click",".keep_button",function(){ //提交表单
		
		var valid = common.isValid();			
		if(valid){
			common.resetForm();  //重置表单
			$("#specialForm").submit();
		}
		return valid;

	})


                       	
})