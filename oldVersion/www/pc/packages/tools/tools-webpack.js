
//using plugins or packages
define(["jquery","dialog"],function(){

	//use use strict
	'use strict';

	//window
	$.fn.window=function(options){
		var content=$(this).html(),
			id=$(this).attr("id")+"_dialog";
			content=$(content).attr("id",id).prop('outerHTML');
			
		$.dialog({
			title:options.title||false,
            width: options.width||"auto",
            height: options.height||"auto",
            padding: 0,
            isOuterBoxShadow:false,
            init:function(){
            	var dialog=$("#"+id).parents(".aui_outer");
            	
            	$(".aui_title div",dialog).remove();
            	
            	if(options.footer==false){
            		$(".aui_footer",dialog).parent().hide();
            	}
            	else if(options.footer&&typeof options.footer=="string"){
            		if(options.title=="景点详情" ||options.title=="酒店详情"){           			                       
            			$(".aui_footer",dialog).parent().hide();
            			$(".aui_title",dialog).append(options.footer);
            		}else{
            			$(".aui_footer",dialog).parent().hide().show();
            			$(".aui_buttons",dialog).html(options.footer);
            		} 
            	}            	
            	if(typeof options.event=="function"){
            		options.event(dialog);
            	}
            	
            	if(options.lock==false){
            		dialog.css("box-shadow","1px 1px 10px #999");
            	}
            },
            content:content,
            lock: (options.lock==false?false:true),
            fixed: true,
            ok: false,
            cancel: function () {
            },
            cancelVal: '关闭',
		})
	};
	
	//showMsg
	$.showMsg=function(msg,type){
		 type=type?type:"warning";
		 var tpl=$('<span class="common-tips btn btn-'+type+'" type="msg" style="visibility: hidden;z-index:999999;">'+
	         		'<i class="gm-icon gm-info-remind"></i>'+msg+
	         	'</span>');
		 if($(".common-tips[type=msg]").size()==0){
			$("body").append(tpl);
			tpl.css({"position":"fixed","top":"3px","left":"50%","margin-left":"-"+(tpl.outerWidth(true)/2)+"px"});
			tpl.css("visibility","visible");
			setTimeout(function(){tpl.fadeOut("slow",function(){tpl.remove();})},2000);
		 }
	};

	//copy
	$.fn.copy=function(){
		var $this=$(this);
		$this.zclip({
			path:"http://static.gmmtour.com/common/plugins/zclip/ZeroClipboard.swf",
			copy:function(){
				return $(this).parent().find('input').val();
			},
			afterCopy:function(){
				var $this=$(this);
				$this.html("复制成功");
				setTimeout(function(){
					$this.html("一键复制");
					$this.copy();
				},2000);
			}
		});
	};


});

