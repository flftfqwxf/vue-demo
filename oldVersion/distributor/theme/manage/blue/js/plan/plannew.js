var globleorginal;
var searchbynames;
var hasdata = true;


//初始化激活条件项
$($("#subForm").serializeArray()).each(function(i,v){
	if(v.value){
		$(".all a",$("tr[name=\""+v.name+"\"]")).removeClass("active");
	}
	else $(".all a",$("tr[name=\""+v.name+"\"]")).addClass("active");
});

$(".table .info").each(function(){
	var title=$("h2 b:last()",$(this)).attr("title");
	if(title){
		title=title.replace(/(\n)+|(\r\n)+/g, "");
		if(title.length>300) title=title.substring(0,300)+"...";
		$("h2 b",$(this)).attr("title",title);
	}
});
//同行计划自定义天数和价格输入字符限制
$(".input-sm[name=definedDays]").attr("maxlength",3);
$(".price-input input[name=minPrice]").attr("maxlength",6);
$(".price-input input[name=maxPrice]").attr("maxlength",6);
$(".airplane input[name=airlineCode]").attr("maxlength",20);
//同行计划列表线框bug修改
$(".list-box .table tr").hover(function(){
	var prev=$(this).prev("tr");
	if(prev.size()>0){
		var color=$(this).find("td").css("border-bottom-color");
		$("td",prev).attr("style","border-bottom-color:"+color+"!important;");
	}
},function(){
	var prev=$(this).prev("tr");
	if(prev.size()>0) $("td",prev).removeAttr("style");
});

$(function(){
	/*重构代码开始*/
		
		//输入限制
		$("#validateform [name=airline]").attr("maxlength","15");
	
		//对比栏功能
		if($.fn.compare){
			var box=$(".list-box");
			box.compare({
				addBtn:"compare",
				actionUrl:"http://www.gmmtour.com/product-compare",
				postDataName:"productsId",
				productUrl:"http://www.gmmtour.com/product/",
				direction:(box.attr("type")=="manage"?"right":"center")
			});
		}
		
		//显示价格详细
		$(".price-word em").hover(function(){
			var box=$(this).next(".price-show-box"),
				offset=$(this).offset(),
				winH=$(window).height(),
				boxH=box.outerHeight(true),
				top=offset.top-$(window).scrollTop()+20,
				x=0,
				y=23;
			if(boxH>winH-top){
				y=-boxH;
			}
			box.css({"top":y+"px","left":x+"px"}).show();
	
		},function(){
			var box=$(this).next(".price-show-box");
			box.hide();
		});
		
		//resize
		/*$(window).resize(function(){
			//如果是分销商同行计划管理页面
			if($("#sidebar").size()>0){
				var width=$(".list-search").outerWidth()-441-300;
				$(".list-box .info").css("max-width",width+"px");
			}
		}).resize();*/
		
		//事件绑定
		$(".search-box").on("click","a",function(){
			//点击条件项事件
			if($(this).hasClass("disabled")) return false;
			
			var value=$(this).attr("attr_id"),
				name=$(this).parents("tr[name]").attr("name");
			
			if($(this).hasClass("active")){
				if(!value) return false;
				value="";
				$(this).removeClass("active");
			}
			else{
				if (name =="months") {
					subForm.find("input[name=endDate]").val("");
					subForm.find("input[name=startDate]").val("");
					$(this).parents("tr").find("a.active").removeClass("active");
					$(this).addClass("active");
				}else{
					$(this).parents("tr").find("a.active").removeClass("active");
					$(this).addClass("active");
				}
				
			}
			
			var shipLineId=$("tr[name=line]").attr("shiplineid");
			
			
			
			//点击专线清除线路数据
			if(name=="line") {
				//游轮专线时处理
				if(value==shipLineId){
					$("tr[name=tourType] a").removeClass("active");
					$("tr[name=tourType] a[attr_id=ship]").addClass("active");
					$("#subForm input[name=\"tourType\"]").val("ship");
				}
				else{
					$("#subForm input[name=\"tourType\"]").val("");
					$("tr[name=tourType] a").removeClass("active");
					$("tr[name=tourType] .all a").addClass("active");
					
				}
				
				$("#subForm input[name=\"playOption\"]").val("");
				$("#subForm input[name=\"supplier\"]").val("");
			}
			
			if(value=="ship"){
				$("a[attr_id="+shipLineId+"]").addClass("active");
				$("#subForm input[name=\"line\"]").val(shipLineId);
				$("#subForm input[name=\"playOption\"]").val("");
				$("#subForm input[name=\"supplier\"]").val("");
			}
			
			$("#subForm input[name=\""+name+"\"]").val(value?value:"");
			subform();
			
		}).on("click",".gm-arrow",function(){
			//更多点击事件
			var parent=$(this).parent();
			if(parent.hasClass("box-open")){
				parent.removeClass("box-open");
			}
			else{
				parent.addClass("box-open");
			}
		});
		
		//列表查询框事件
		$("#validateform .price-input, #validateform .airplane,#validateform .name").hover(function(){
			$("input:first()",$(this)).focus();
		},function(){
			$("input:first()",$(this)).blur();
		});
		
		$(".list-search").on("click",".search-select li",function(){
			//排序
			var value=$(this).attr("attr_id");
			$("#subForm input[name=sort]").val((value?value:""));
			subform();
		}).on("click",".clear",function(){
			//清除条件
			$("input",$(this).parent()).each(function(){
				$("#subForm input[name=\""+$(this).attr("name")+"\"]").val("");
			});
			subform();
		}).on("click","button",function(){
			//确定按钮
			$("input",$(this).parent()).each(function(){
				$("#subForm input[name=\""+$(this).attr("name")+"\"]").val($(this).val());
			});
			subform();
		}).on("click","label.btn",function(){
			//仅有行程的计划
			if($(this).hasClass("disabled")) return false;
			if($(this).hasClass("active")){
				$("#subForm input[name=days").val("");
			}
			else{
				$("#subForm input[name=days]").val("-1");
			}
			subform();
		});
		
		//显示条件
		$(".search-box tr").each(function(){
			if($(".gm-arrow",$(this)).size()>0){
				var cWidth=0,
					td=$("td:last()",$(this));
				$("a",td).each(function(){
					cWidth+=$(this).outerWidth(true);
				});
				
				if(td.width()<cWidth){
					$(".gm-arrow",$(this)).show();
				}
			
				if($(".active",$(this)).size()>0&&(!$(".active",$(this)).parent().hasClass("all"))&&($(".active",$(this)).offset().top>$("a:first()",$(this)).offset().top)){
					$(".gm-arrow",$(this)).click();
				}
			}
		});
		
		//默认打开专线
		if(!$("tr[name=line] .show-box").hasClass("box-open")){
			$("tr[name=line] .gm-arrow").click();
		}
		
		//自定义天数查询
		/*$("#J_definedDays button").click(function(){
			var value=$.trim($(this).prev().val());
			if(value&&(!isNaN(value))){
				$("#subForm input[name=days").val(value);
				subform();
			}
		});*/
		
		//列表查询验证
		$("#validateform input[name=minPrice], #validateform input[name=maxPrice], #J_definedDays input").keyup(function(){
			$(this).val($(this).val().replace(/\D/g,''));
		});
		$("#validateform button").click(function(){
			var item=$(this).parent(),
				input=$("input",item);
			
			//最小价与最大价验证
			if(input.size()==2){
				var minPrice=$.trim($("#validateform input[name=minPrice]").val()),
					maxPrice=$.trim($("#validateform input[name=maxPrice]").val());
				
				if(isNaN(minPrice)){
					input.eq(0).validationEngine('showPrompt',"请输入正整数",'error',null,true);
				}
				else if(isNaN(maxPrice)){
					input.eq(1).validationEngine('showPrompt',"请输入正整数",'error',null,true);
				}
				else if(parseFloat(minPrice)>parseFloat(maxPrice)){
					input.eq(0).validationEngine('showPrompt',"最小价不能大于最大价",'error',null,true);
				}
				if(item.find(".formError").size()>0) return false;
			}
			
		});
		
		if($("#validateform input[name=airline]").size()>0&&$(".plan-list-view").size()==0){
			autoComplete($("#validateform input[name=airline]"),function(e, d){
	    		if(d) {
	    			$("#subForm input[name=airline]").val(d.id);
	    			subform();
	    		} 
			});
		}
		
	/*重构代码结束*/
	globleorginal = getorginal();
		
	var datepicker_CurrentInput,
		subForm =$("#subForm");
	$.datepicker.setDefaults({
			showButtonPanel : true,
			closeText : '清空',
			beforeShow : function(input, inst) {
				datepicker_CurrentInput = input;
			}
	});

	/*日历控件*/
	$("#startSetoffdate,#endSetoffdate").prev(".value").click(function(){
		$(this).next().focus();
		$("#ui-datepicker-div").attr('form-value',$(this).attr('form-value'));
	});
	if($("#subForm input[name=startDate]").size>0){
		if($("#subForm input[name=startDate]").val().length !==0||$("#subForm input[name=endDate]").val().length !==0){
			$(".search-box tr[name=months] a").removeClass("active");
		}
	}
	
	$(document).on("click", ".ui-datepicker-close", function() {
			datepicker_CurrentInput.value = "";
			var val = $("#ui-datepicker-div").attr('form-value');
			if (val == "startDate") {
				$("#startSetoffdate").prev().text("最早出发").css("color","#999");
				subForm.find("input[name=startDate]").val("");
			}else{
				$("#endSetoffdate").prev().text("最晚出发").css("color","#999");
				subForm.find("input[name=endDate]").val("");
			}
			
	}).on("click", ".ui-datepicker-current", function() {
			var today=new Date();
				y=today.getFullYear();
				m=today.getMonth()+1;
				if (m<10) {
					m = "0"+m
				}
				d=today.getDate();
				if (d<10) {
					d = "0"+d;
				}
			datepicker_CurrentInput.value = y+"-"+m+"-"+d;
			var val = $("#ui-datepicker-div").attr('form-value');
			if (val == "startDate") {
				$("#startSetoffdate").prev().text(y + "-" + m + "-" +d).css('color', '#666666');
				subForm.find("input[name=startDate]").val(datepicker_CurrentInput.value);
				$("#ui-datepicker-div").hide();
			}else{
				$("#endSetoffdate").prev().text(y + "-" + m + "-" +d).css('color', '#666666');
				subForm.find("input[name=endDate]").val(datepicker_CurrentInput.value);
				$("#ui-datepicker-div").hide();
			}
			
	});

	function date_onclose(element,input_name,selectedDate){
		if (selectedDate) {
			var _ints = selectedDate.split("-");
			element.prev().text(_ints[0] + "-" + _ints[1] + "-" + _ints[2]).css('color', '#666666');;
			subForm.find("input[name="+input_name+"]").val(selectedDate);
		}
	}

	$("#startSetoffdate,#endSetoffdate").datepicker({
			changeMonth : true,
			changeYear : true,
			minDate : new Date(),
			dateFormat : "yy-mm-dd",
			onClose : function(selectedDate){
				date_onclose($(this),$(this).prev().attr("form-value"),selectedDate)
			}
	});
	/*日历选择确定按钮提交事件*/
	if($('.J_date_btn').size()>0){
		if($("#subForm input[name=startDate]").val()||$("#subForm input[name=endDate]").val()){
			$(".table-bordered tr[name=months] a").removeClass("active");
		}
	}
	$(".J_date_btn").click(function(){
		var startDate=$("#subForm input[name=startDate]").val(),
			endDate=$("#subForm input[name=endDate]").val();
			if (startDate.length !==0&&endDate.length !==0) {
				if (startDate>endDate) {
					$(this).validationEngine('showPrompt',"日历选择有误",'error',null,true);
				}else{
					subForm.find("input[name=months]").val("");
					subform();
				}
			}else if (startDate.length !==0||endDate.length !==0) {
				subForm.find("input[name=months]").val("");
				subform();
			}
			else{
				$("#startSetoffdate").focus();
			}
			
	})
	/*日历控件时间清空按钮*/
	$(".search-box .date_btn a").click(function(){
		subForm.find("input[name=endDate]").val("");
		subForm.find("input[name=startDate]").val("");
		subform();
	})

	$("#validateform").validationEngine({
			validateNonVisibleFields : true,
			validationEventTrigger : "",
			showOneMessage : false,
			maxErrorsPerField : 1,
			promptPosition : "topLeft:0,20",
			scroll : true,
			scrollOffset : 100,
			autoHidePrompt : true,
			autoHideDelay : 1000,
			focusFirstField : true
	});
	/*icon的显示与隐藏*/
	icon_state();
	function icon_state(){
		if($(".J_search_txt").size()>0){
			if ($(".J_search_txt").val().length !== 0) {
				$(".J_icon_close").show();
			}else{
				$(".J_icon_close").hide();
			}
		}
	}
	/*热门目的地点击事件*/
	$(".J_city_con_right li a").click(function(event) {
		var _val = $(this).text();
		$(".search_input input").val(_val);
		/*$(".search_box .hot_city").slideUp();*/
		$(".J_search_btn").click();
		icon_state();
	});
	/*搜索icon清空内容*/
	$(".J_icon_close").click(function(event) {
		$(this).siblings(".search_txt").val("");
		icon_state();
	});
	/*搜索栏热门目的地显示与隐藏*/
	function search_state(){
		var search_val = $(".J_search_txt").val();
		if (search_val.length == 0) {
			$(".search_box .hot_city").slideDown();
		}else{
			$(".search_box .hot_city").slideUp();
		}
		icon_state();
	};
	var interval;
	$(".J_search_txt").focus(function(event) {
		interval= setInterval(function(){
			search_state();
		},300);
	}).blur(function(){
		clearInterval(interval);
	});
	$(document).click(function(target){
		if($(target.target).parents(".J_search_txt").size()==0&&$(target.target).parents(".search_input").size()==0){
			$(".search_box .hot_city").slideUp();
		}
	});
	$(".J_share_error").click(function(){
		$.showMsg("    限港马分销商登录后使用，客人将在产品页面看到您的名称及设置的对应报价");
	})
	/*发给直客点击事件*/
	$(".J_share_btn").on('click', function(event) {
		$.ajax({
            type: "POST",
            dataType: "json",
            url: "/product/send/"+$(this).parents("tr").attr("data-id")+"?format=json",
            data:{m:Math.random()},
            success: function (response) {
            	 //$.gmMessage(response.message);
                if (response.success) {
                	showDemoDialog("发送给直客");
                	$("#qrcode-m").attr("src","/qrcode?text="+response.message+"&width=120&height=120&m="+new Date().getTime());
            		$(".scenic-content input").val(response.message);
                } else {
                	$.showMsg(response.message,"danger");
                }
            },
            error: function () {
            	$.showMsg("服务器错误!","danger");
            }
        })
	});
	/*城市选择交互*/
	$(".search_box .dropdown-menu li a").click(function(event) {
		var _txt = $(this).text()+"出发";
		var attr_val = $(this).attr('data-value');
		$("#province").html(_txt);
		$("#province").attr('data-value', attr_val);
		$(".J_city_dropdown").removeClass('select');
		$(".J_city_dropdown").find("ul").hide();
	});
	$(".J_city_dropdown").on('click', 'button', function(event) {
		if ($(".J_city_dropdown").hasClass('select')) {
			$(this).parent().removeClass('select');
			$(this).siblings("ul").hide();
		}else{
			$(this).parent().addClass('select');
			$(this).siblings("ul").show();
		}
		
	});

	$(document).click(function(target){
		if($(target.target).parents(".J_city_dropdown").size()==0){
			$(".J_city_dropdown").removeClass('select');
			$(".J_city_dropdown").find("ul").hide();
		}
	});

	/*搜索框*/
	$(document).keydown(function(event){
		if(event.keyCode == 13){ 
			$(".J_search_btn").click();
		}
	});
	$(".J_search_btn").click(function(event) {
		subForm.find("input").val("");
		var departurePlaceId = $("#province").attr('data-value');
		var keyWord = $(".J_search_txt").val();
		if(keyWord){
			subForm.find("input[name=departurePlaceId]").val(departurePlaceId);
			subForm.find("input[name=keyWord]").val(keyWord);
			subform();
		}else{
			return false;
		}
	});
});	

	$.fn.copy=function(){
		var $this=$(this);
		$this.zclip({
			path:"http://static.gmmtour.com/common/plugins/zclip/ZeroClipboard.swf",
			copy:function(){
				return $(this).parent().find('.input').val();
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
	
	function showDemoDialog(withTitle) {
    	var _con = $('#scenic-content-box').html();
        $.dialog({
            title:withTitle||false,
            //title: false,
            width: 462,
            height: "auto",
            padding: 0,
            isOuterBoxShadow: false,
            //isClose: false,
            init:function(){
            	$(".aui_buttons button:first()").before("<div class=\"dialog-tip\"><p>• 直客看到的将是您微网站内对应产品的介绍页，并显示您设置的直客价</p><p>• 供应商、同行价等敏感信息直客不会看到，请放心</p></div>");
            	$(".aui_buttons button").remove();
            	
            	/*一键复制点击事件*/
				$(".J_clone").copy();
				
				/*弹窗组件样式修改*/
				$(".aui_footer").css({
					"height":'auto',
					"width":"462px"
				});
				$(".aui_outer td tr:last-child").css('display', 'block');
				$(".aui_buttons").css({
					"text-align": 'left',
					"padding-left": '23px',
					"padding-right": '19px',
				});
				$(".dialog-tip").css({
					"margin-top": '15px',
					"margin-bottom": '20px'
				}).find('p').css({
					margin: '0',
					"line-height": '22px',
					"font-size":"12px"
				});
				$(".aui_inner").css("background-color","#fff")
				$(".aui_title").css({
					height: '48px',
					"line-height":'48px',
					"font-weight":'700',
					"text-shadow":'none',
					"text-indent":'0',
				});
				$(".aui_close").css('text-indent', '0');
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
    }
    //var submiting=false;
	function subform() {
		//if(submiting==true) return false;

		//submiting=true;
		if (globleorginal != getorginal()) {
			var form = $("#subForm");
			form.find("input").each(
					function(i, e) {
						var destvalue = $.trim($(this).val());
						var name = $(this).attr("name");
						// IE处理
						if (name == "minPrice" || name == "maxPrice"
								|| name == "airline") {
							destvalue = destvalue.replace(/\D/g, '');
						}
						if (name == "supplierOrPlanName"
								&& (destvalue == searchbynames)) {
							destvalue = "";
						}
						if (destvalue == "" || destvalue == "0") {
							$(this).remove();
						}
					})
			$(".content_body").hide();
			$("#waitprocess").show();
			form.submit();
		}
	}
	function getorginal(){
		var orginal="";
		var form = $("#subForm");
		form.find("input").each(function(i,e){
			var destvalue = $.trim($(this).val()) ;
			var name = $(this).attr("name");
			//IE处理
			if(name=="minPrice" || name=="maxPrice" || name=="airline"){
				destvalue=destvalue.replace(/\D/g,'');
			}
			if(name=="supplierOrPlanName" && (destvalue==searchbynames)){
				destvalue = "";
			}
			orginal += destvalue;
		})
		return orginal;
	}
	
	function autoComplete(dom, callback) {
		dom.unautocomplete().autocomplete(
				"/product/airline-select.json?_=" + Math.random(), {
					minChars : 0,
					clickFire : true,
					requestParamName : "name",
					showOthers : false,
					pagination : false,
					width : 153,
					parse : function(data) {
						var parsed = [];
						var rows = $.isArray(data) ? data : data.list;
						if (rows && rows.length) {
							for (var i = 0; i < rows.length; i++) {
								var row = rows[i];
								parsed.push({
									data : row,
									value : row.code + "," + row.name,
									result : row.code + "," + row.name
								})
							}
						}

						return parsed;
					},
					formatItem : function(row, i, max) {
						if (!row.name) {
							return "";
						}
						return row.code + "," + row.name;
					}
				}).result(callback || $.noop);
	}
	
	//提示信息
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
