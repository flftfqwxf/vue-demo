;!function(controller){
	//use strict
	'use strict';

	controller.using("bootstrap");
	controller.using("eDate");
	controller.using("dialog");
	controller.using("tinytooltip");
	controller.using("tools");


	controller.modules={
		staticVars:function(){
			this.staticVars={
				com:$('.comparison .fixed_item'),
				table:$('.comparison .table_item'),
				len:$('.comparison .fixed_item').find('.fixed_pic').size()
			}
		},
		init:function(){

			/*部分td文字部分置顶显示*/
			$("#J-prices td").css("vertical-align","top");
			$("#J-specialised td").css("vertical-align","top");
			$(".shopping_information .table_item td").css("vertical-align","top");
			/*data_number天数div位置向左移动距离*/
			$('.comparison .table_item .data_number').parent().css('padding-left', '20px');

			//static vars
			this.staticVars();

			//事件处理
			this.event();

			//判断景点数量的初始状态
			this.status();

			//发团日期与价格交互
			this.dateAndPrices();

			/*data_number天数中item_line线的长度、BUG处理以及定位*/
			this.dataLine();

			this.pro_hei();
		},
		status:function(){
			var i = this,
				vars = this.staticVars,
				_len = vars.len;
			if (_len == 3) {
				$('.comparison .fixed_item .left_btn').removeAttr('disabled').eq(0).attr('disabled', 'disabled');
				$('.comparison .fixed_item .right_btn').removeAttr('disabled').eq(2).attr('disabled', 'disabled');
			}else{
				$('.comparison .fixed_item .left_btn').removeAttr('disabled').eq(0).attr('disabled', 'disabled');
				$('.comparison .fixed_item .right_btn').removeAttr('disabled').eq(1).attr('disabled', 'disabled');
			}
			
			//左右移动后，对发团日期的数据重新绑定
			i.dateAndPrices(false);
		},
		dataLine:function(){
			/*data_number天数中item_line线的长度、BUG处理以及定位*/
			$('.comparison .table_item tbody').each(function(index, el) {
				/*data_number天数只有一个的时候BUG处理*/
				var num = $('.data_number',$(this)).size();
				if (num == 1) {
					$('.data_number',$(this)).next().remove();
				}
				/*线条进行定位*/
				$(this).find('tr:last-child .item_line').css('top', '0');
				$(this).find('tr:first-child .item_line').css('bottom', '0');
				/*线条的长度*/
				$('tr',$(this)).each(function(index, el) {
					var hei = $(this).height()/2;
					$('.item_line',$(this)).css('height', hei);
				});
				
			});
		},
		stateCancel:function(){
			if($(".sites_information .info_title i").hasClass("gm-open")){
				$(".sites_information .info_title").parents('.title-box').next('.table_item').show();
				$(".sites_information .info_title i").removeClass('gm-open').addClass('gm-retracted');
			}
		},
		dateAndPrices:function(init){
			//init
			var dates=$("#J-dates td"),
				prices=$("#J-prices td"),
				averagePrice=$("#J-average-price td"),
				data=[];
			$("input",dates).attr("readonly",true);
			
			$(dates).each(function(i){
				var item={},
					days=$("option",$(this));
				item["totalDay"]=parseInt($("select",$(this)).attr("days"))||0;
				days.each(function(j){
					var value=$(this).attr("value"),
						text=$.trim($(this).text()),
						price=$("[data-id="+value+"]",prices.eq(i)).map(function(){return parseInt($(".number",$(this)).text());}).get();
					
					//初始化发团日期、费用信息
					if((init!=false)&&j==0){
						$("input",dates.eq(i)).attr("value",text);
						$("[data-id="+value+"]",prices.eq(i)).show();
						
						var average=parseInt(Math.min.apply(null,price)/item["totalDay"]);
						$(".number",averagePrice.eq(i)).text(average?average:"");
					}
					item[value]=price;
				});
				
				if(days.size()>0){
					data[data.length]=item;
				}
			});

			//event
			$("#J-dates .new_form_control").each(function(i){
				var td=$(this).parents("td"),
					days=data[td.index()-1];
				
				$(this).eDate({
					months:2,
					//side:"right",
					//columnHeaderFormat:"ddd",
					//direction:'future',
					disablePreviousYear:true,
			    	disableNextYear:true,
					format:"YYYY年MM月DD日",
					disabled: function (date) {
						var day=eDate.moment(date).format('t_YYYYMMDD');
						return (days[day]?0:1);
					},
					onSelected:function(date){
						var date=date.replace("年","-").replace("月","-").replace("日",""),
						day=eDate.moment(date).format('t_YYYYMMDD');
						$("input",dates.eq(i)).attr("value",eDate.moment(date).format('YYYY年MM月DD日'));
						$(".price",prices.eq(i)).hide();
						$("[data-id="+day+"]",prices.eq(i)).show();
						
						var average=parseInt(Math.min.apply(null,days[day])/days["totalDay"]);
						$(".number",averagePrice.eq(i)).text(average?average:"");
					}
				});
			});
		},
		showDemoDialog:function(withTitle) {
	    	var _con = $('#scenic-content-box').html();
	        $.dialog({
	            title:withTitle||false,
	            //title: false,
	            width: 478,
	            height: 340,
	            padding: 0,
	            isOuterBoxShadow: false,
	            //isClose: false,
	            init:function(){
	            	$(".aui_buttons button:first()").before("<div class=\"dialog-tip fl\">以上信息由港马负责统一维护和管理，若发现错误，<a href=\"javascript:;\" class=\"linkGmService\">欢迎指正</a></div>");
	            },
	            content: _con,
	            lock: true,
	            fixed: true,
	            ok: false,
	            //cancelCssClass: 'btn-process',
	            cancel: function () {
	            },
	            cancelVal: '关闭',
	        });
	    },
	    dialoginfo:function(obj,title,info,imgs){
	    	var m = this;
	    	/*dialog弹窗参数传递*/
	    	obj.find('.scenic-font').find('.title').text(title);
	    	obj.find('.scenic-font').find('.font-content').html(info);
	    	var _len = imgs.length;
	    	if (_len == 0) {
	    		return false;
	    	}else{
	    		for (var i = 0; i < _len; i++) {
	    			obj.find('.scenic-pic-box').find('.scenic-ul').append('<li><img src="'+imgs[i].url+'@50w_20h_1e" data-src="'+imgs[i].url+'@210w_120h_1e"><span class="icon"></span></li>');
	    		}
	    		if (imgs) {
	    			m.dialogClick(obj);
	    		}
	    		obj.find('.scenic-pic').find('img').attr({
	    			src: imgs[0].url+'@210w_120h_1e',
	    			"data-src": imgs[0].url+'@210w_120h_1e'
	    		});
	    		obj.find('.scenic-ul li').eq(0).addClass('selected');
	    	}
	    },
	    dialogClick:function(obj){
			/*dialog弹窗图片点击事件*/
			var $this = obj.find('.scenic-pic-box li');
			var src = $this.eq(0).find('img').attr('data-src');
			$('.scenic-pic-box .scenic-pic').append('<img src="'+src+'">');
			$this.on('click', function(event) {
				var _src = $(this).find('img').attr('data-src');
				$('.scenic-pic-box .scenic-pic').find('img').attr('src', _src);;
				$(this).addClass('selected').siblings().removeClass('selected');
			});
		},
		pro_hei:function(){
			/*产品特色高度判定*/
			$(".pro_txt",$(".basic_information .table_item tr")).each(function(index, el) {
				 var pro_txt_hei = $(this).height();
				if (pro_txt_hei>133) {
					$(this).addClass("txt_css");
					$(this).tinytooltip({message: function(tip) {
						return $(this).text();
					}});
				}
			});
			/*购物点高度判断*/
			if ($(".shopping_information .table_item tr td div").hasClass("shopping_txt_list")) {
				$(".shopping_txt_list",$(".shopping_information .table_item tr")).each(function(){
				var shop_list_hei = $(this).parent().height();
				$(".shopping_txt",$(".shopping_information .table_item tr")).each(function(){
					var shop_txt_hei = $(this).height();
					if (shop_txt_hei>shop_list_hei||shop_txt_hei==null) {
						$(this).addClass("txt_css");
						$(this).tinytooltip({message: function(tip) {
							return $(this).text();
						}});
					}
				});
			})
			}else{
				$(".shopping_txt",$(".shopping_information .table_item tr")).each(function(){
					var shop_txt_hei = $(this).height();
					if (shop_txt_hei>133) {
						$(this).addClass("txt_css");
						$(this).tinytooltip({message: function(tip) {
							return $(this).text();
						}});
					}
				});
			}
		},
		event:function(){
			var i = this,
				vars = this.staticVars,
				com = vars.com,
				table = vars.table,
				len = vars.len;
			$(document).on('click', '.comparison .fixed_item .left_btn', function() {
				/*左移的点击事件*/
				var num = $(this).index('.left_btn');
				var htm1 = com.eq(num).html();
				var htm2 = com.eq(num-1).html();
				if (num == 0) {
					return false;	
				}else{
					table.each(function(index, el) {
						$('tr',$(this)).each(function(index, el) {
							var tds = $('td',$(this));
							var temp1 = tds.eq(num).html();
							var temp2 = tds.eq(num-1).html();
							tds.eq(num).html(temp2);
							tds.eq(num-1).html(temp1);
						});
					});
					com.eq(num).html(htm2);
					com.eq(num-1).html(htm1);
					i.status();
					$(".basic_information .table_item tr .pro_txt").removeClass("txt_css");
					$(".shopping_information .table_item tr .shopping_txt_list").removeClass("txt_css");
					i.pro_hei();
				}

			}).on('click', '.comparison .fixed_item .right_btn', function() {
				/*右移的点击事件*/
				var num = $(this).index('.right_btn');
				var htm1 = com.eq(num).html();
				var htm2 = com.eq(num+1).html();
				if (num == len) {
					return false;
				}else{
					table.each(function(index, el) {
						$('tr',$(this)).each(function(index, el) {
							var tds = $('td',$(this));
							var temp1 = tds.eq(num).html();
							var temp2 = tds.eq(num+1).html();
							tds.eq(num).html(temp2);
							tds.eq(num+1).html(temp1);
						});
					});
					com.eq(num+1).html(htm1);
					com.eq(num).html(htm2);
					i.status();
					$(".basic_information .table_item tr .pro_txt").removeClass("txt_css");
					$(".shopping_information .table_item tr .shopping_txt_list").removeClass("txt_css");
					i.pro_hei();
				}

			}).on('mouseenter', '.comparison .table_item tbody tr', function() {
				/*页面table中鼠标经过的效果bug处理*/ 
				var index = $(this).index();
				$(this).prev('tr').addClass('hover_color');
				if(index == 0){//判断tr在tbody中的第一个位置
					$(this).parent().siblings('thead').find('tr').addClass('hover_color');
				}

			}).on('mouseleave', '.comparison .table_item tbody tr', function() {
				/*页面table中鼠标经过的效果bug处理*/ 
				$(this).prev('tr').removeClass('hover_color');
				$(this).parent().siblings('thead').find('tr').removeClass('hover_color');

			}).on('click', '.comparison .info_title h2 i', function() {
				/*对比页面点击显示与隐藏功能*/ 
				if ($(this).hasClass('gm-retracted')) {
					$(this).parents('.title-box').next('.table_item').hide();
					
					var box=$(this).parents('.title-box');
					$(this).removeClass('gm-retracted').addClass('gm-open');
					
					if(box.parent().hasClass("fixed")){
						box.parent().removeClass("fixed");
						$(window).scrollTop(box.parent().offset().top-157);
						
					}
				}else if($(this).hasClass('gm-open')){
					$(this).parents('.title-box').next('.table_item').show();
					$(this).removeClass('gm-open').addClass('gm-retracted');
				}

			}).scroll(function (){
				/*页面顶部位置下拉的时候获取绝对定位*/ 
				var box = $('.fixed_box');
				var hei = $(window).scrollTop();/*获取滚动条距离顶端的高度*/
				if(hei>=110){
					box.addClass('fixed_css');
				}else{
					box.removeClass('fixed_css');
				}
				
				//滚动时标题浮动处理
				var title_fixed=$(".comparison>div");
				for(var i=0;i<title_fixed.size();i++){
					var dom=title_fixed.eq(i),
						top=dom.offset().top,
						domH=dom.outerHeight(true),
						end=top+domH;
					
					if(!dom.hasClass("box-con")){
						if(hei-(top-157)>=0&&hei<=(end-157-61)&&$(window).height()-157<domH){
							dom.addClass("fixed");
						}
						else{
							dom.removeClass("fixed");
						}
					}
				}
			}).on('click', '#J-scenics .cancel_hl', function() {
				//景点高亮显示不同点
				i.stateCancel();
				if($.trim($(this).text())=="高亮显示不同点"){
					$(this).text("取消高亮不同点");
					
					var othersDataTemp={};
					$("#J-scenics .hasData").each(function(){
						var othersDom=[],
							othersData=[],
							index=($(this).index()-1),
							length=$("[data=true]").size()-1;
						
						if(othersDataTemp[index]){
							othersData=othersDataTemp[index];
						}
						else{
							for(var i=0;i<=length;i++){
								if(index!=i){
									othersDom[othersDom.length]="#J-scenics .col"+i+" a";
								}
							}
			
							//获取当前产品以外的其他产品所有景点数据
							othersData=$(othersDom.join(",")).map(function(){return parseInt($(this).attr("data-id"));}).get();	
						}

						//当前列中的景点数据与其他产品所有的景点数据对比，如果其他景点均无该景点，增加高亮样式
						$("a",$(this)).each(function(){
							var dataId=parseInt($(this).attr("data-id"));
							
							if(othersData.indexOf(dataId)<0){
								$(this).addClass("highlight");
							}
						});
					});
				}
				else{
					$(this).text("高亮显示不同点");
					$("#J-scenics .highlight").removeClass("highlight");
				}

			}).on("click",".comparison .sites_information a[data-id]",function () {
		    	/*景点点击事件*/
		    	var _sites_id = $(this).attr('data-id');
		        i.showDemoDialog("景点详情");
		        /*弹窗ajax*/
				$.ajax({
					url: '/sight/'+_sites_id+'.json',
					type: 'GET',
					dataType: 'json',
					success:function(data){
						var dialogDiv = $('.scenic-content');
						i.dialoginfo(dialogDiv,data.sight.cnName,data.sight.description,data.sight.sightImages);
					},
					error:function(){

					}
				});
		    }).on('click', '.comparison .hotel_information a[data-id]', function() {
		    	/*酒店点击事件*/
		    	var _hotel_id =$(this).attr('data-id');
		    	if(!_hotel_id) return false;
		    	
		        i.showDemoDialog("酒店详情");
		        /*弹窗ajax*/
				$.ajax({
					url: '/hotel/'+_hotel_id+'.json',
					type: 'GET',
					dataType: 'json',
					success:function(data){
						var dialogDiv = $('.scenic-content');
						i.dialoginfo(dialogDiv,data.hotel.name,data.hotel.description,data.hotel.hotelImages);
					},
					error:function(){

					}
				});
		    });
		}
	}
	controller.call();

}(new this.jSharp.controller());	

	