$(function() {
    $(".choice_site span").on("click",function(){
    	$(".site_city").removeClass("show");
    	//获取页面数据
    	var sitearr=new Array();
    	$(".site_name").each(function(){
    	   var a=$(this).attr("attr-area");
           if(a){
              sitearr.push(a);
           }
    	});
    	$.ajax({
			url:"/area/tree.json?parentId=11",
			type:"GET",
			async:false,
			dataType:"json",
			success:function(json){
				if(json.list){
                    common.art(json);
                    //已经选择添加样式
                    var b=sitearr.length;
                    var c=$(".art_province");
                    for(var i=0;i<b;i++){
                    	for(var j=0;j<c.length;j++){
                    		if(sitearr[i]===c.eq(j).attr("data-id")){
                               c.eq(j).addClass("art_active");
                               c.eq(j).prev("input").val(c.eq(j).attr("data-id"))
                    		}
                    	}
                    }
				}else{
				    alert("无地区数据");
				};				
			},
			error:function(){
				alert("错误");
			}
		});
    });
    var common={
    	init:function(){

    	},
    	art:function(json){
    		var siteInfo = $.dialog({
				title: '选择站点',
				width: 600,
				height:"auto",
				padding : '5px 20px',
				content:'',
				lock: true,
				fixed: true,
				resize: false,
				cancel:function(){
			 	 //    if(window.confirm("取消将清空已录入的内容，是否确认？")){
      //                 return true; 
				 	// }else{
	     //              return false;
				 	// };
				},
				okVal:"开通站点",
				ok: function(){
                    var arr=new Array();
                     $(".site_template li input").each(function(index,value){
                         if($(this).val()!=="" && $(this).val()!==""){
                            arr.push($(this).val());
                         };
                     });
                    if(arr.length>0){
                        $("#art_form").submit();
                    }else{
                        alert("请选择站点");
                    }
					
			    },
			    init:function(){
		        	if($(".aui_content").size()==1 || $(".aui_content").size()==2){
                       $(".aui_content").eq(0).html(template("siteChoice_template",json))
                    }
	        	}
		    })
    	},
        message:function(mes){
            $("body").append("<div class='mesbox'>"+mes+"</div>");
            setTimeout(function(){
                $(".mesbox").remove();
            },300);
        }

    }
    common.init();
    $(document).on("click",".art_province",function(){
    	var _self=$(this);
    	if(!_self.hasClass("active") && !_self.hasClass("art_active")){
            _self.addClass("active").prev("input").val(_self.data('id'));
            _self.prepend('<i class="gmIcon gm-right art_icon"></i>');            
    	}else{
           _self.removeClass("active").prev("input").val('');
           _self.find(".art_icon").remove();
    	};
    }).on("click",".site_name",function(){ 	
    	var _target=$(this);
        _target.find(".site_city").toggleClass('show');
    	_target.parent("li").siblings("li").find(".site_city").removeClass("show");  
    	var myArr=new Array();
    	_target.find(".site_city").find(".cityList").each(function(){ //全选按钮checked
            myArr.push($(this).prop("checked"));
    	});
    	var b=myArr.length;
    	var c=null;
    	for(var i=0;i<b;i++){
            if(myArr[i]===false){
               c=false;               
            }
    	}
	    if(c!==false){
            _target.find(".site_city").find(".select_all").prop("checked","checked");
	    }

    }).on("click",".site_city input",function(e){
        e.stopPropagation();
    }).on("click",".select_all",function(){
    	if($(this).prop("checked")){
           $(this).parent("span").nextAll("span").find("input:checkbox").prop("checked","checked");
    	}else{
           $(this).parent("span").nextAll("span").find("input:checkbox").removeAttr("checked");
    	}
    	
    }).on("click",".site_city_close",function(e){ //删除站点
    	 e.stopPropagation();
    	 $(".site_city").removeClass("show");
    	 var _self=$(this);
    	var delyetsite=$.confirm("确认删除已开通站点？","确认提示", function(){
    		var siteId = _self.attr("attr-value");
    		if (null == siteId || "" == siteId) {
    			alert("没有找到要删除的对象！请刷新！");
    			return;
    		}
    		$.ajax({
    			url:"/site/" + siteId + ".json?_method=DELETE",
    			type:"DELETE",
    			async:false,
    			dataType:"json",
    			success:function(json){
    				common.message(json.result.message);
    				_self.parent(".site_name").parent("li").remove();
    			    delyetsite.close();
    			},
    			error:function(){
    				alert("删除失败,请刷新！");
    			}
    		});
        	
		},function(){
			//取消
		});

    }).on("click",".site_city",function(e){
         e.stopPropagation();
    }).on("click",".choose_open",function(){//选择开通方法
         var _target=$(this);
         var parentId=_target.find("a").attr("attr-value");
         var arr=new Array();
         _target.parent(".site_city").find(".cityList").each(function(index,value){
             if($(this).prop("checked")){
             	arr.push($(this).attr("attr-value"));
             };
         });
         // if(arr.length>0 && arr instanceof Array){
         	$.ajax({
    			url:"/site.json",
    			type:"POST",
    			async:false,
    			data:"areaId="+arr+"&parent="+parentId,
    			dataType:"json",
    			success:function(json){
    				common.message(json.result.message)
    				window.location.reload();
    			},
    			error:function(json){
    				alert("开通失败！");
    			}
    		});
            
         // }else{
         // 	alert("请选择需要开通的城市");
         // }
    });
    // $(".site_city").hover(function(e){
    // 	 e.stopPropagation();
    //      $(this).next(".site_city_close").hide();       
    // });
    // $(".site_name").hover(function(){
    //      $(this).next(".site_city_close").show();       
    // },function(){
    // 	$(this).next(".site_city_close").hide();
    // });
   

})