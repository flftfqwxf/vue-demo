/*
调用：
$("#focus").dcecCarousel({
	effects : 'fade',
	navClass: 'focusNav',
	thisNum : 'selected',
	hasNav 	: true
});
 
参数：
	effects : 'horizontal',	//效果：fade 淡入淡出，horizontal 水平滚动，vertical 垂直滚动, loop 循环
	showDisplay: 'block', //显示时 display 的样式；
	page	: 1,		//滚动块数 默认1
	showPage: 1,		//显示个数
	prev	: '.mg-prev',	//左滚动
	next	: '.mg-next',	//右滚动
	hasSelected:'selected',//当前状态
	subPrev	: '.sub-prev',//缩略图左滚动
	subNext	: '.sub-next',//缩略图右滚动
	hasNav	: false,	//是否有状态导航
	hasImgNav: false,   //是否有小图片导航
	imgNavMove:true,	//是否小图片导航移动
	eventNav: 'click',	//改变当前页 事件类型：click , hover;
	navClass: 'numNav',	//导航容器Class
	subImg  : '.subImg', //缩略图片容器
	subImgUl: 'dl',    //缩略图片元素父级
	subImgList:'dd',    //缩略图片元素
	subPage :1,		    //显示缩略图个数
	thisNum	: 'selected',//选中状态
	speed	: 800,		//切换速度（毫秒）
	delay	: 4000,		//切换时间（毫秒）
	animateLoop: true	//自动滚动 
 
 
 
*==================================== */
(function($){
	
	$.fn.dcecCarousel = function(options){
		var slider = $(this);
		var _index = 0;
	
		var interval = null;
		slider.options = $.extend({}, $.fn.dcecCarousel.options, options);
		var length = slider.find("li").length;
		methods = {};
		
		//滑块方法
		methods = {
			init : function(){
				this.effects = slider.options.effects;
				this.display = slider.options.showDisplay;
				this.animateLoop = slider.options.animateLoop;
				this.hasNav = slider.options.hasNav;
				this.hasImgNav = slider.options.hasImgNav;
				this.imgNavMove = slider.options.imgNavMove;
				this.eventNav = slider.options.eventNav;
				this.prev = slider.find(slider.options.prev);
				this.next = slider.find(slider.options.next);
				this.hasSelected = slider.options.hasSelected;
				this.subPrev = slider.find(slider.options.subPrev);
				this.subNext = slider.find(slider.options.subNext);
				this.subPage = slider.options.subPage;
				this.page = slider.options.page;
				this.showPage = slider.options.showPage;
				this.speed = slider.options.speed;
				this.delay = slider.options.delay;
				this.hover = slider.options.thisNum;
				this.navListClass = slider.options.navClass;
				this.subImg  = slider.find(slider.options.subImg);
				this.subImgUl = slider.find(slider.options.subImgUl);
				this.subImgList = slider.find(slider.options.subImgList);
				this.initEffects();
				
				//是否添加状态导航
				if(this.hasNav){
					this.setNav();	
				}
				
				if(this.hasImgNav){
					if(this.imgNavMove == true){
						this.subImgList.eq(0).addClass(this.hover);
						this.subImgUl.css({'position':'absolute','width':this.subImgList.outerWidth(true)*this.subImgList.length*2});
					}
					this.clickImgNav();
				};
				
				this.bind();
				if(this.animateLoop){
					this.autoPlay();
				}
			},
			
			initEffects : function(){
				//效果初始化
				switch(this.effects){
					case 'fade' :
						slider.css('position','relative');
						slider.find('li').css({'position':'absolute','left':0,'top':0,'display':'none'}).eq(0).css({'display':this.display}).addClass(this.hasSelected);
						
					break;
					
					case 'horizontal' :
						var _sliderUl = slider.find('ul');
						var	_sliderLi = _sliderUl.find('li');
						var	_sliderLiW = _sliderLi.outerWidth(true);
						_sliderLi.eq(0).addClass(this.hasSelected);
						_sliderUl.css({'position':'absolute','width':_sliderLiW*length });
					
					break;
					
					case 'vertical' :
						var _sliderUl = slider.find('ul');
						var	_sliderLi = _sliderUl.find('li');
						var	_sliderLiH = _sliderLi.outerHeight(true);
						_sliderLi.eq(0).addClass(this.hasSelected);
						_sliderUl.css({'position':'absolute','height':_sliderLiH*length });
					break;
					
					case 'loop' :
						var _sliderUl = slider.find('ul');
						var	_sliderLi = _sliderUl.find('li');
						var	_sliderLiW = _sliderLi.outerWidth(true);
						_sliderLi.eq(0).addClass(this.hasSelected);
						_sliderUl.css({'width':_sliderLiW*length });
					break;
					
				}
				
			},
			
			//添加数字状态导航
			setNav : function(index){
				var navText="";
				var _this = this;
				for(var i=0; i< Math.ceil(length/_this.page); i++){
					navText = navText + "<a href='javascript:;'>"+(i+1)+"</a>";
				};
				var navHtml = "<div class="+this.navListClass+">"+navText+"</div>";
				slider.append(navHtml);
				slider.find("."+this.navListClass).find("a").eq(0).addClass(this.hover);
				this.changeNav();
			},
			
			classNav : function(index){
				slider.find("."+this.navListClass).find('a').eq(index).addClass(this.hover).siblings().removeClass(this.hover);
			},
			
			changeNav : function(){
				var _this = this;
				var _timer;
					if(_this.eventNav=="hover"){
						slider.find("."+this.navListClass).find("a").bind({
							mouseenter:function(){
								var _thisElem = this;
								if(!$(this).hasClass(_this.hover)){
									_timer = setTimeout(function(){
										$(_thisElem).addClass(_thisElem.hover).siblings().removeClass(this.hover);
										_this.play($(_thisElem).index());
										_index = $(_thisElem).index();	
									},200);
								}
							},
							mouseleave:function(){
								clearTimeout(_timer);
							}
						})
					}else{
						slider.find("."+this.navListClass).find('a').bind(_this.eventNav,function(){
							var _timer;
							if(!$(this).hasClass(_this.hover)){
								$(this).addClass(this.hover).siblings().removeClass(this.hover);
								_this.play($(this).index());
								_index = $(this).index();
							}
						})
					}
			},
			//缩略图状态导航
			imgNav : function(index){
				var _this = this;
				_this.subImgList.eq(index).addClass(_this.hover).siblings().removeClass(_this.hover);
				
				if(length < _this.subPage || _this.imgNavMove == false){return false}
				
				var	_sliderImgW = _this.subImgList.outerWidth(true);
				
				if(index==0){
					_this.subImgUl.stop().animate({'left':0},_this.speed);
				}else if(index >= length-_this.subPage+1){
					_this.subImgUl.stop().animate({'left':-_sliderImgW*(length-_this.subPage)},_this.speed);
				}else{		
					_this.subImgUl.stop().animate({'left':-_sliderImgW*(index-1)},_this.speed);
				}
			},
			clickImgNav :function(){
				var _this = this;
				_this.subImgList.bind(_this.eventNav,function(){
					if(!$(this).hasClass(_this.hover)){
						_this.play($(this).index());
						_this.imgNav($(this).index());
						_index = $(this).index();
					};
				});
				
			},
			
			play : function(index,rotation){
				//if(_index==$(this).index()){}
				switch(this.effects){
					case 'fade' :
						this.fade(index);
					break;
					
					case 'horizontal' :
						this.horizontal(index);
					break;
					
					case 'vertical' :
						this.vertical(index);
					break;
					
					case 'loop' :
						this.loop(index,rotation);
					break;
				}
			},
			
			//淡出淡入效果
			fade : function(index){
				this.classNav(index);
				var _sliderList = slider.find('li');
				_sliderList.stop().fadeOut(this.speed).removeClass(this.hasSelected).eq(index).stop(true,true).fadeIn(this.speed).addClass(this.hasSelected).css('display',this.display);
			},
			
			//水平滚动
			horizontal : function(index){
				var _this = this;
				this.classNav(index);
				var _sliderUl = slider.find('ul');
				var	_sliderLi = _sliderUl.find('li');
				var	_sliderListW = _sliderLi.outerWidth(true);
				
				if(index==0){
					_sliderUl.stop().animate({'left':0},_this.speed);
				}else if(index >= (Math.ceil(length/_this.showPage)-1)){
					_sliderLi.removeClass(this.hasSelected).eq(index).addClass(this.hasSelected);
					_sliderUl.stop().animate({'left':-_sliderListW*(length-_this.showPage)},_this.speed);
					
				}else{
					_sliderLi.removeClass(this.hasSelected).eq(index).addClass(this.hasSelected);
					_sliderUl.stop().animate({'left':-_sliderListW*index*_this.page},_this.speed);
				};
			},
			
			//垂直滚动
			vertical : function(index){
				var _this = this;
				this.classNav(index);
				var _sliderUl = slider.find('ul');
				var	_sliderLi = _sliderUl.find('li');
				var	_sliderListH = _sliderLi.height();
				_sliderLi.removeClass(this.hasSelected).eq(index).addClass(this.hasSelected);
				
				if(index==0){
					_sliderUl.stop().animate({'top':0},_this.speed);
				}else if(index >= (Math.ceil(length/_this.showPage)-1)){
					_sliderUl.stop().animate({'top':-_sliderListH*(length-_this.showPage)},_this.speed);
					
				}else{
					_sliderUl.stop().animate({'top':-_sliderListH*index*_this.page},_this.speed);
				};
				
				
				
			},
			
			//循环滚动
			loop: function(index,rotation){
				var _this = this;
				var _sliderUl = slider.find('ul');
				var	_sliderLi = _sliderUl.find('li');
				var	_sliderListW = _sliderLi.outerWidth(true);
				
				if(rotation=="left"){
					_this.classNav(index);
					_sliderUl.find("li:last").prependTo(_sliderUl);
					_sliderUl.css('marginLeft',-_sliderListW);
					_sliderUl.stop().animate({'marginLeft':0},_this.speed);
					
				}else{
					_this.classNav(index);
					_sliderUl.stop().animate({'marginLeft':-_sliderListW},_this.speed,function(){
						_sliderUl.css('marginLeft',0);
						_sliderUl.find("li:first").appendTo(_sliderUl);
					});
				}
			},
			
			bind : function(){
				var _this = this;
				
				_this.prev.click(function(){
					_this.trun("left");	
				})
				_this.next.click(function(){
					_this.trun("right");	
				})
				
				_this.subPrev.click(function(){
					_this.trun("left");	
				})
				_this.subNext.click(function(){
					_this.trun("right");	
				})
				
				if(this.animateLoop){
					
					slider.mouseover(function(){
						_this.stopPlay();	
					});
					
					slider.mouseleave(function(){
						_this.autoPlay();	
					});
					
				}
					
			},
			//左右滚动按钮事件
			trun : function(dir){
				if(dir=='right'){
					_index++;
					if(_index > Math.ceil(length/this.page)-1){ _index = 0; }
					
				}else{
					_index--;
					if(_index<0){ _index = Math.ceil(length/this.page)-1; }	
				};
				
				this.play(_index,dir);
				if(this.hasImgNav){
					this.imgNav(_index);
				}
			},
			
			//自动播放
			autoPlay : function(){
				var _this = this;
				interval = setInterval(function(){
					_index++;
					if(_index > Math.ceil(length/_this.page)-1){ _index = 0; }
					_this.play(_index);
					if(_this.hasImgNav){
						_this.imgNav(_index);
					}
				},_this.delay)
			},
			//清除队列
			stopPlay : function(){
				clearInterval(interval);
			}
		};
		
		methods.init();
		
	}
	
	//默认设置
	$.fn.dcecCarousel.options = {
		effects : 'horizontal',	//效果：fade 淡入淡出，horizontal 水平滚动，vertical 垂直滚动, loop 循环
		showDisplay: 'block', //显示时 display 的样式；
		page	: 1,		//滚动块数 默认1
		showPage: 1,		//显示个数
		prev	: '.mg-prev',	//左滚动
		next	: '.mg-next',	//右滚动
		hasSelected:'selected',//当前状态
		subPrev	: '.sub-prev',//缩略图左滚动
		subNext	: '.sub-next',//缩略图右滚动
		hasNav	: false,	//是否有状态导航
		hasImgNav: false,   //是否有小图片导航
		imgNavMove:true,	//是否小图片导航移动
		eventNav: 'click',	//改变当前页 事件类型：click , hover;
		navClass: 'numNav',	//导航容器Class
		subImg  : '.subImg', //缩略图片容器
		subImgUl: 'dl',    //缩略图片元素父级
		subImgList:'dd',    //缩略图片元素
		subPage :1,		    //显示缩略图个数
		thisNum	: 'selected',//选中状态
		speed	: 800,		//切换速度（毫秒）
		delay	: 4000,		//切换时间（毫秒）
		animateLoop: true	//自动滚动
	};
	
})(jQuery);