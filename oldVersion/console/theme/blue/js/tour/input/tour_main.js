((function($, w){
		var toCNNumber = function(n){
			return  0 < n && n <= 10 ? ["01","02","03","04","05","06", "07", "08", "09", "10"][n - 1] : n;
		}
		template.helper('toCNNumber',toCNNumber);
		
		template.helper('formatFlightTime', function (n) {
			if (!n) {
				return "";
			} else {
				return n.length >= 5 ? n.substring(0, 5) : n;
			}
		});
		
		var isNew = Tour.utils.getUrlParam("id") == null; 
		//init  step
		$(".step").on("click", function(){
			var ref = $(this).attr("ref");
			var $this = $(this);
			//行建行程时。需要进入下一步需要校验
			if (Tour.current.module) {
				var $current = $(".step[ref="+Tour.current.ref+"]");
				if(isNew) {
					var $prev = $this.prev(".step");
					if ($prev.length == 1 && ($this.index() - $current.index() != 1) ) {
						if (!$prev.hasClass("validate")) {
							return;
						}
					}
				} 
				
				if (isNew && $this.index() <= $current.index()) {
					Tour.current.module.hide();
					Tour.module[ref].show();
					$this.nextAll(".step").removeClass("validate");
				} else {
					var ok = Tour.current.module.submit();
					if (!ok) {
						return;
					} else {
						$(".step[ref="+Tour.current.ref+"]").addClass("validate");
						Tour.current.module.hide();
					}
				}
			}
			
			
			$(".step").removeClass("active");
			$this.addClass("active");
			$(window).scrollTop(0);
			setNav();
			w.Tour.current.ref = ref;
			w.Tour.current.module = w.Tour.module[ref];
			if (!w.Tour.current.module.isInit()) {
				w.Tour.current.module.init();
			}
			w.Tour.current.module.show();
		});
		

		w.init_step_top = function(){
			$(window).scroll(function(){
				setNav();
			});
		}
		//顶部浮动
		init_step_top();
		function setNav(){
			var bar=$(".nav_step").height();
			var h=bar + 200;
			var fixedObj=$(".nav_step").parent();
			var scrollTop=$(window).scrollTop();
			if(scrollTop >h ){
				fixedObj.css({left:fixedObj.parent().offset().left}).addClass("top_step");
			}else if(scrollTop<=h){
				fixedObj.css({left:0}).removeClass("top_step");
			}
		}
		

		var $form = $("#form").validationEngine({validateNonVisibleFields:false,scroll:true,scrollOffset:100,autoHidePrompt:true,autoHideDelay:5000,focusFirstField:true});
		var docForm = document.getElementById("form");
		
		//行程服务.已经参数配置等信息
		var tourService = {
				//加载行程
				//tour: 行程ID, 当ID为NULL时.为新建
				//copy: true:为根据行程ID的属性拷贝.  false:为修改行程.默认为true
				load : function(tourId, copy){
					if (tourId) {
						$(".step").addClass("validate");
					} else {
						$(".step").removeClass("validate");
					}
					
					Tour.module.other.clear();
					Tour.module.trip.clear();
					Tour.module.base.clear();
					Tour.current.copy = copy;
					Tour.current.ref= null;
					Tour.current.module = null;
					Tour.current.data = null;					
					Tour.current.jsondom && Tour.current.jsondom.destory();

					if (tourId != null) {
						$(".mask").show();
						$(".loading-wrap").show();
						//load
						$.ajax({
							type : "GET",
							dataType : "json",
//							async : false,
							url : "/tour/{id}.json?{random}".template({"id" : tourId, "random" : new Date().getTime()}),
							success : function(json) {
								$(".mask").hide();
								$(".loading-wrap").hide();
								Tour.current.data = json.tour;
								Tour.current.lineId = Tour.current.lineId || json.tour.touristLine.id;
								if (copy) {
									//COPY 行程删除行程ID.
									delete json.tour.id; 
									json.tour.touristLine.id = Tour.current.lineId;
								} else {
									Tour.current.lineId = json.tour.touristLine.id;
								}
								Tour.current.jsondom = $.jsondom.bind(Tour.current.data, $form);
								
								
								
								$(".step[ref=base]").click();
								//Tour.module.base.init();
								
							},
							error : function(){
								$(".mask").hide();
								$(".loading-wrap").hide();
							}
						});
					} else {
						Tour.current.data  = {};
						Tour.current.jsondom = $.jsondom.bind(Tour.current.data, $form);
						$(".step[ref=base]").click();
						//Tour.module.base.init();
						//alert("新建");
					}
					$(".step").removeClass("active");
					$(".step[ref=base]").addClass("active");
					//页面隐藏的专线元素赋值
					$("#touristLineId").val(Tour.current.lineId);
				},
				
				nextStep : function(){
					var next = $(".step[ref="+Tour.current.ref+"]").next(".step");
					if (next.length == 1) {
						next.click();
					} else {
						alert("提交数据");
					}
				},
				
				//模版
				template : null,
				
				current : {
					lineId :  $("#urlTourLineId").val(),
					//引用模块
					ref : null,
					//模块
					module : null,
					
					//是否为copy
					copy : false, 
					
					//当前行程数据
					data : null,
					
					//当前表单
					form : $form,
					
					docForm : docForm,
					
					jsondom : null
				}
		};
	
	w.Tour = w.Tour || {};
	$.extend(w.Tour, tourService);
	$("#nextBtn").on("click", Tour.nextStep);
	$.bindbeforeout();
}))(jQuery, window);

$(function(){
	var id = Tour.utils.getUrlParam("id");
	Tour.load(id);
});