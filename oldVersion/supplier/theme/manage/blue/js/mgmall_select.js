
(function($){
	
	$.fn.mgSelect = function(options){
		var selectEle = $(this);
		selectEle.options = $.extend({}, $.fn.mgSelect.options, options );
		
		methods = {
			
			init : function(){
				var selectOptions 	= selectEle.options;
				
				this.type			= selectOptions.type;
				this.element 		= selectEle.find(selectOptions.element);
				this.elementClass 	= selectOptions.elementClass;
				this.showEle 		= selectEle.find(selectOptions.showEle);
				this.events 		= selectOptions.events;
				this.selectedClass 	= selectOptions.selectedClass;
				this.inputName		= selectOptions.inputName;
				this.dataPraName	= selectOptions.dataPraName
				this.ajax			= selectOptions.ajax;
				this.ajaxType		= selectOptions.ajaxType;
				this.ajaxDataType	= selectOptions.ajaxDataType;				
				this.ajaxLink		= selectOptions.ajaxLink;
				this.ajaxUrl		= selectOptions.ajaxUrl;
				this.ajaxPra		= selectOptions.ajaxPra;
				
				this.selectEle		= this.element.find('.selected');
				
				this.type ==1 ? this.ajax = false : this.ajax = true;
				
				this.defaultIn();
				this.action();
				this.select();
				
			},
			
			//显示下拉框
			showSelect : function(ele){
				var _this = this;				
				ele.addClass(_this.elementClass).css({zIndex:99999});					
			},
			//隐藏下拉框
			hideSelect : function(ele){
				var _this = this;			
				ele.removeClass(_this.elementClass).removeAttr('style');
			},
			
			//触发事件
			action : function(){
				var _this = this, mouseType=Array();				
				_this.events!=='click' ? mouseType=['mouseenter','mouseleave'] : mouseType=['click','mouseleave'];
				
				_this.element.on(mouseType[0],function(){
					_this.showSelect($(this).parents('.mod-select'));		
				});
				
				selectEle.on(mouseType[1],function(){
					_this.hideSelect($(this));				
				});
			
			},
			
			//选择触发事件
			select : function(){
				var _this = this;	
				this.showEle.on('click','li',function(e){
					_this.datePro($(this).find('a'));			
					$(this).addClass(_this.selectedClass).siblings().removeClass(_this.selectedClass);
					_this.hideSelect($(this).parents('.mod-select'));					
				});
				
				
			},

			//获取数据值
			getDate: function(ele){
				var _this = this, dataValue = new Array(), dataPraName = _this.dataPraName;				
				if(dataPraName.length > 0){
					for(var i=0; i < dataPraName.length; i++){
						dataValue.push(ele.attr(dataPraName[i]));						
					};
				};
				return 	dataValue;															
			},
			
			//参数处理
			datePro: function(ele){			
				var _this = this, dataValue = _this.getDate(ele);
				ele.parents('.mod-select').find(_this.inputName).val(dataValue);
				ele.parents('.mod-select').find('.option-selected .selected').html(dataValue[0]);
			},
			
			//默认选择项
			defaultIn: function(){
				var _this = this;
				_this.showEle.find('li').each(function(index) {
				  	if(_this.getDate($(this).find('a')) == $(this).parents('.mod-select').find(_this.inputName).val()){
				  		$(this).addClass(_this.selectedClass);
				  		return false;
				  	};
				  	return ;
				});
			}
			
			
			//获取AJAX数据
			//ajaxData: function(thisUrl,domId,code){									
//					$.getJSON(thisUrl,function(data){
//
//						var html='', _sData= new Array();
//						if( code !== '0'){
//							var _code = code.substring(0,3);
//							$.each(data,function(i,val){
//								if(val.code.substring(0,3) == _code){
//									_sData.push(val);	
//								};																				
//							});
//						}else{							
//							_sData = data;
//						}
//						$.each(_sData,function(i,val){
//							html = html + '<li><a href="javascript:;" data-title="'+val.name+'" data-code="'+val.code+'">'+val.name+'</a></li>';																			
//						});
//						$(domId).find('.option-list').html(html);
//						
//					});
//			
//			}
			
		};
		
		methods.init();
		
	
		
	};
	
	//默认配置参数
	$.fn.mgSelect.options = {
		
		type			: 1, //type:1 普通下拉, type:2 城市地址		
		element			: '.option-selected', //触发元素
		elementClass	: 'event',			//外部框架 样式
		showEle			: '.option-list-box',//要显示元素
		events 			: 'click',   //触发动作类型
		selectedClass	: 'selected',//选中的样式,
		inputName		: '.option-selected input',// 隐藏INPUT
		dataPraName		: ['data-title','data-value'],//要获取的数值类
		ajax			: false,	//是否异步操作,
		ajaxType		: 'POST',
		ajaxDataType	: 'json',
		ajaxLink		: false,	//是否读取A标签的地址为 ajaxurl dataType: JSONP
		ajaxUrl			: '',		//异步操作地址
		ajaxPra			: ''		//请求参数
	};
		
})(jQuery);