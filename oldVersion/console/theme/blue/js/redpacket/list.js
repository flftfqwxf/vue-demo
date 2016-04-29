var globleorginal;
var searchbynames;
var hasdata = true;
var createStartTimePick;
var createEndTimePick;
function autoComplete(dom,callback){
	dom.parent().css({"position":"relative"});
	dom.unautocomplete().autocomplete("/airline-select.json?_="+Math.random(), {
			minChars: 0,
			clickFire: true,
			requestParamName: "name",
			showOthers: false,
			pagination: false,
			width: 90,
			parse: function(data){
				var parsed = [];
				var rows = $.isArray(data) ? data : data.list;
				if(rows && rows.length){
					for (var i=0; i < rows.length; i++) {
						var row = rows[i];
						parsed.push({
							data: row,
							value: row.code+","+row.name,
							result: row.code+","+row.name
						})
					}
				}
				
				return parsed;
			},
			formatItem: function(row, i, max) {
				if(!row.name){
					return "";
				}
				return row.code+","+row.name;
			}
		}).result(callback || $.noop);
	
	
}
function isChinese(val){
	  var myReg = /^[\u4e00-\u9fa5]+$/g;
      if (myReg.test(val)) {
    	  return true;
      }
      return false;
}
function initPage(){
	var datepicker_CurrentInput;
	$.datepicker.setDefaults({
		showButtonPanel: true,
		closeText: '清空',
		beforeShow: function(input, inst) {
			datepicker_CurrentInput = input;
		}
	});
	
	var subForm = $("#subForm");
	$(document).on("click", ".ui-datepicker-close", function (){  
		datepicker_CurrentInput.value="";
        var id = $(datepicker_CurrentInput).prop("id");
        if(id=="setoffdate"){
        	subForm.find("input[name=months]").val("");
        }else if(id=="createStartTime"){
        	subForm.find("input[name=timeBegin]").val("");
        }else if(id=="createEndTime"){
        	subForm.find("input[name=timeEnd]").val("");
        }
        subform("true");
    });
	
	var maxDate = new Date();
	// var maxValue = $('#createEndTime').val().replace(/\./g, '/');
	// if(maxValue!="" && !isChinese(maxValue)){
	// 	maxDate = new Date(maxValue);
	// }
	
	createStartTimePick =$("#createStartTime").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate: maxDate,
		dateFormat: "yy.mm.dd",
		onClose:function(selectDate,e,event){
			subForm.find("input[name=timeBegin]").val(selectDate);
			subform();
		}
	});
	
	
	createEndTimePick  = $("#createEndTime").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate:new Date(),
		minDate: $('#createStartTime').datepicker('getDate'),
		dateFormat: "yy.mm.dd",
		onClose:function(selectDate){
			subForm.find("input[name=timeEnd]").val(selectDate);
			subform();
		}
	});
	
	
	$(document).on('click','.item-dl .J_show',function(){
		var value = $(this).attr('data-value');		
		var ddHeight = $(".conten-list").height();
		if (value == 1 ){			
			if(ddHeight >=37 ){
				$(this).parents('.item-dl').find('.conten-list').addClass('conten-list-oth');
				$(this).html('收起<i class="upjt jiantouup">');
				$('.list-box-content').css({'min-height':'90'});
				$(this).parents(".list-box").find('.J_hidenlist').show();
			};
			$(this).attr('data-value', 2);
		}else {				
			if( ddHeight=45){
				$(this).parents('.item-dl').find('.conten-list').removeClass('conten-list-oth');				
				$(this).text('');
				$(this).html('更多<i class="jiantoudown">');
				$(this).parents(".list-box").find('.J_hidenlist').hide();
			};
			$(this).attr('data-value', 1);
		}
	})
	// .on('mouseenter','.items-box',function(){
	// 	$(this).addClass('items-box1');
	// }).on('mouseleave','.items-box',function(){
	// 	$(this).removeClass('items-box1');
	
	// });	
		
	/* 列表 有效性  未来天数内过期  */
	$("#expired").on('mouseenter','.setdate-box',function(){		
		$(this).addClass('on');		
	});
	
	$("#expired").on('mouseleave','.setdate-box',function(){		
		$(this).removeClass('on');		
	});
	
	$("#expired").on('click','.day-ensure',function(){		
		$(this).parent().removeClass('on');
		subForm.find("input[name=onShelf]").val("");
		subform();
	});
	
	
		$(".J_showmore").click(function(){
			var val = $(this).find('i').attr('data-value');
			if( val == 1 ){
				$(this).parents(".list-box").find('.J_hidenlist').show();
				//$(this).parents(".list-box").find('.list-box-content').toggleClass("auto-height");
				$(this).html('收起选项 (出发时间，天数)<i class="jiantouup">');
				$(this).find('i').attr('data-value', 2);
			}else{
				$(this).parents(".list-box").find('.J_hidenlist').hide();
				//$(this).parents(".list-box").find('.list-box-content').toggleClass("auto-height");
				$(this).html('更多选项 (出发时间，天数)<i class="jiantoudown">');
				$(this).find('i').attr('data-value', 1);				
			}
			
		});
}


 	var len = $(".list-box-content").length;
 	



$(function(){
	initPage();
	hideMore();
	$("#validateform").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topRight:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 1000,
		focusFirstField : true
	});
	searchbynames = $("#searchbynames").attr("title");
	globleorginal = getorginal();
	
	if($(".plan_table").children().length==0){
		hasdata = false;
	}
	
	var subForm =$("#subForm");
	var linedom = $("#lineconditon li a");
	var playdom = $("#playOption li a");
	var monthsdom = $("#months li a");
	var daysdom = $("#days li a");
	var domsupplier = $("#supplier li a");
	var $redPacketRule= $("#redPacketRule li a");
	var $tourType = $("#tourType li a");
	var orderdom = $("select[name=orderStatus]");
	var expireddom =  $("#expired a");
	var editordom =  $("#editor a")
	
	 var line = subForm.find("input[name=line]").val();
	 var play = subForm.find("input[name=playOption]").val();
	 var months = subForm.find("input[name=months]").val();
	 var days = subForm.find("input[name=days]").val();
	 var supplier = subForm.find("input[name=supplier]").val();
	 var redPacketRule = subForm.find("input[name=redPacketRule]").val();
	 var tourType = subForm.find("input[name=tourType]").val();
	 var onShelf = subForm.find("input[name=onShelf]").val();
	 var expired = subForm.find("input[name=expired]").val();
	 var editorId = subForm.find("input[name=editorId]").val();
	 
	 if(line!="" && line !="0"){
		 css($("#tiaojian_line"));
	 }
	 
	 if(play!="" && play !="0"){
		 css($("#tiaojian_play"));
	 }
	 
	 if(months!="" && months !="0"){
		 css($("#tiaojian_month"));
	 }
	 if(days!="" && days !="0" && days !="-1"){
		 css($("#tiaojian_days"));
	 }
	 if(supplier!="" && supplier !="0"){
		 css($("#tiaojian_supplier"));
	 }
	 if(onShelf!="" || expired!=""){
		 css($("#tiaojian_expired"));
	 }
	 
	 if(editorId!=""){
		 css($("#tiaojian_editor"));
	 }
	 if (redPacketRule != "") {
		 css($("#tiaojian_redPacketRule"));
	 }
	 
	 if (tourType != "") {
		 css($("#tiaojian_tourType"));
	 }
	 
	 
	 $(".items-boxcont, .items-boxcontplan").delegate("input", "keyup", function() {
			var val = $(this).val();
			var orig = $(this).attr("data-origin-value");
			if(val!=""){
				if(orig == val){
					$(this).parent().parent().find(".clearthis").text("清除");
				}else{
					$(this).parent().parent().find(".clearthis").text("确定");
				}
			}else{
				$(this).parent().parent().find(".clearthis").text("确定");
			}
	});
	 
	$("#setoffdate").datepicker({
	    changeMonth: true,
	    changeYear: true,
	    minDate:new Date(),
	    dateFormat: "yy.mm.dd",
	    onClose: function( selectedDate) {
	    	if(selectedDate && selectedDate!="指定日期"){
	    		subForm.find("input[name=months]").val(selectedDate);
	    		delClass(monthsdom);
	    		subform();
	    	}
	    }
    });
	
	
	$(".tiaojian").css("cursor","pointer");
	$(".tiaojian").each(function(i,e){
		$(this).on("click",null,function(){
			//下面有选中的,执行查询，否则说明当前也是该条件查询
			var len = $(this).next().find(".sele").length;
			var this_id = $(this).attr("id");
			//如果有指定日期
			var lenDate =  $(this).next().find(".setdateover").length;
			if(len>0 || lenDate>0){
				if(this_id=="tiaojian_line"){
					subForm.find("input[name=line]").val(0);
					subForm.find("input[name=supplier]").val(0);
					subForm.find("input[name=playOption]").val(0);
					delClass(linedom);
					delClass(playdom);
					delClass(domsupplier);
				}else if(this_id=="tiaojian_play"){
					subForm.find("input[name=playOption]").val(0);
					delClass(playdom);
				}else if(this_id=="tiaojian_month"){
					subForm.find("input[name=months]").val(0);
					delClass(monthsdom);
				}else if(this_id=="tiaojian_days"){
					subForm.find("input[name=days]").val(0);
					delClass(daysdom);
				}else if(this_id=="tiaojian_supplier"){
					subForm.find("input[name=supplier]").val(0);
					delClass(domsupplier);
				}else if(this_id=="tiaojian_expired"){
					subForm.find("input[name=onShelf]").val("");
					subForm.find("input[name=expired]").val("");
					delClass(expireddom);
				}else if(this_id=="tiaojian_editor"){
					subForm.find("input[name=editorId]").val("");
					delClass(editordom);
				} else if (this_id == "tiaojian_redPacketRule") {
					subForm.find("input[name=redPacketRule]").val("");
					delClass($redPacketRule);
				} else if (this_id == "tiaojian_tourType") {
					subForm.find("input[name=tourType]").val("");
					delClass($tourType);
				}
				subform();
			}
			
		}).on("mouseover",null,function(){
				cssbg($(this));
		}).on("mouseout",null,function(){
				var len = $(this).next().find(".sele").length;
				if(len>0){
					//下面有选中的,清除当前样式
					css($(this));
				}
		})
	});
	
	
	linedom.each(function(i,e){
		$(this).on("click",null,function(){
			if(!$(this).hasClass("sele")){
				var line_id = $(this).attr("attr_id");
				subForm.find("input[name=line]").val(line_id);
			}else{
				subForm.find("input[name=line]").val("");
			}
			subForm.find("input[name=playOption]").val(0);
			subForm.find("input[name=supplier]").val(0);
			delClass(linedom,i);
			$(this).toggleClass("sele")
			//$(this).parent().parent().find(".tiaojian").removeClass("sele");
			subform();
		})
	})
	
	playdom.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=playOption]").val(playOption_id);
				}else{
					subForm.find("input[name=playOption]").val("");
				}
				delClass(playdom,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
	expireddom.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=onShelf]").val(playOption_id);
				}else{
					subForm.find("input[name=onShelf]").val("");
				}
				subForm.find("input[name=expired]").val("");
				delClass(expireddom,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
	monthsdom.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=months]").val(playOption_id);
				}else{
					subForm.find("input[name=months]").val("");
				}
				delClass(monthsdom,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
	daysdom.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=days]").val(playOption_id);
				}else{
					subForm.find("input[name=days]").val("");
				}
				delClass(daysdom,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
		
	domsupplier.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=supplier]").val(playOption_id);
				}else{
					subForm.find("input[name=supplier]").val("");
				}
				delClass(domsupplier,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
	$redPacketRule.each(function(i,e){
		$(this).on("click",null,function(){
			if(!$(this).hasClass("sele")){
				var attr = $(this).attr("attr_id");
				subForm.find("input[name=redPacketRule]").val(attr);
			}else{
				subForm.find("input[name=redPacketRule]").val("");
			}
			delClass($redPacketRule, i);
			$(this).toggleClass("sele")
			subform();
		})
	})
	$tourType.each(function(i,e){
		$(this).on("click",null,function(){
			if(!$(this).hasClass("sele")){
				var attr = $(this).attr("attr_id");
				subForm.find("input[name=tourType]").val(attr);
			}else{
				subForm.find("input[name=tourType]").val("");
			}
			delClass($tourType, i);
			$(this).toggleClass("sele")
			subform();
		})
	})
	
		
	editordom.each(function(i,e){
			$(this).on("click",null,function(){
				if(!$(this).hasClass("sele")){
					var playOption_id = $(this).attr("attr_id");
					subForm.find("input[name=editorId]").val(playOption_id);
				}else{
					subForm.find("input[name=editorId]").val("");
				}
				delClass(editordom,i);
				$(this).toggleClass("sele")
				subform();
			})
		})
		
	
		
		orderdom.on("change",function(){
				if(hasdata){
					var order = $(this).val();
					if(!$(this).hasClass("sele")){
						subForm.find("input[name=order]").val(order)
						subform();
					}
				}else{
					$(this).validationEngine('showPrompt',"当前没有数据，请重新筛选",'error',null,true);
				}
		});
	
	var floatdom =$(".g-clearfix .condition");
	
	floatdom.each(function(i,e){
		//价格
		var this_name = $(this).attr("name");
		if(this_name=="minPrice" || this_name=="maxPrice"){
			$(this).on("keyup",null,function(){
				$(this).val($(this).val().replace(/\D/g,''));
			}).on("afterpaste",null,function(){
				$(this).val($(this).val().replace(/\D/g,''));
			})
		}
	})
	
	$("input[name=expiredDays]").on("keyup",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
		subForm.find("input[name=expired]").val($(this).val());
	}).on("afterpaste",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
		subForm.find("input[name=expired]").val($(this).val());
	}).on("keydown",null,function(e){
		if(e.keyCode==13){
			//if($.trim($(this).val())!=""){
				$(this).val($(this).val().replace(/\D/g,''));
				subForm.find("input[name=onShelf]").val("");
				subForm.find("input[name=expired]").val($(this).val());
				subform();
			//}
			return false;
		}
	}).on("blur",null,function(e){
			if($.trim($(this).val())!=""){
				$(this).val($(this).val().replace(/\D/g,''));
				subForm.find("input[name=expired]").val($(this).val());
			}
	})/**.on("mouseenter",null,function(){
		$(this).parent().addClass("on");
	})**/;
	
	//$(".setdate-box").on("mouseout",null,function(){
	//	$(this).removeClass("on");
	//})
	
	var preChecked = $(".tripdayscheckbox").prop("checked");
	//仅显示有行程的计划
	$(".tripdayscheckbox").on("click",null,function(){
		var checked = $(this).prop("checked");
		if(!hasdata && !preChecked){
			$(this).validationEngine('showPrompt',"当前没有数据，请重新筛选",'error',null,true);
		}else{
			var val = subForm.find("input[name=days]").val();
			val = $.trim(val);
			if(checked){
				if(val=="" || val=="0"){
					subForm.find("input[name=days]").val(-1)
				}
			}else{
				if(val=="-1"){
					subForm.find("input[name=days]").val(0)
				}
			}
			subform();
		}
	})
	
	$("select[name=timetype]").on("change",null,function(){
		subForm.find("input[name=time]").val($(this).val())
		subform();
	})
	var subfloat=function(){
		var min=0;
		var max=0;
		var maxdom;
		floatdom.each(function(k,ele){
			var val = $(ele).val();
			var name = $(this).attr("name");
			if(name=="minPrice"){
				min =val;
			}else if(name=="maxPrice"){
				max =val;
				maxdom = $(this);
			}else if(name=="airline"){
			    val = subForm.find("input[name="+name+"]").val();
			}
			var inputdom = subForm.find("input[name="+name+"]");
			inputdom.val(val);
		});
		
		var sub = true;
		if(min!="" && max!=""){
			min = parseInt(min);
			max = parseInt(max);
			if(min>max){
				maxdom.validationEngine('showPrompt',"最高价不能低于最低价",'error',null,true);
				$(".g-clearfix .clearthis:eq(0)").text("清除");
				sub = false;
			}
		}
		if(sub){
			subform();
		}
	};
	
	floatdom.each(function(index){
		var name = $(this).attr("name");
			$(this).keydown(function(e){
				if(e.keyCode==13){
					subfloat();
				}
			});
			
			if(name=="airline"){
				autoComplete($(this),function(e, d){
		    		if (d && d.id) {
		    			subForm.find("input[name=airline]").val(d.id);
		    			subfloat();
		    		}else{
		    			//$(this).validationEngine('showPrompt',"没有该航空公司",'error',null,true);
		    		}
				});
			
			}
	})
	
	$(".g-clearfix .clearthis").each(function(k){
		$(this).on("click",null,function(){
			var text = $.trim($(this).text());
			var textvalue = $(this).parent().parent().find("input").val();
			if(k==0){
				textvalue += $(this).parent().parent().find("input:eq(1)").val();
				textvalue=textvalue.replace(/\D/g,'');
			}else if(k==1){
				textvalue=textvalue.replace(searchbynames,'');
			}else if(k==2){
				textvalue=subForm.find("input[name=airline]").val();
			}
			if(textvalue!=""){
				if(text=="清除"){
					if(k==0){
						$(".g-clearfix .condition:lt(2)").val("");
						subForm.find("input[name=minPrice]").val("");
						subForm.find("input[name=maxPrice]").val("");
					}else if(k==1){
						$(".g-clearfix .condition:eq(2)").val("");
						subForm.find("input[name=supplierOrPlanName]").val("");
					}else if(k==2){
						subForm.find("input[name=airline]").val("");
					}
					$(this).text("确定")
				}else if(text=="确定"){
					if(k==2){
						var val = subForm.find("input[name=airline]").val();
						var dataid =subForm.find("input[name=airline]").attr("data-id");
						if(val!=dataid){
							$(this).text("清除")
						}
					}else{
						$(this).text("清除")
					}
				}
			}else{
				$(this).text("确定")
			}
			subfloat();
		})
	})
	
	
	$(".pageview").click(function(){
		var data_value = $(this).attr("data-value");
		var data_asc = $(this).attr("data-asc");
		var data_desc = $(this).attr("data-desc");
		
		if(data_value==data_asc){
			$(this).children("span").eq(0).text("↓");
			$(this).attr("data-value",data_desc);
			subForm.find("input[name=order]").val(data_desc);
			subform();
		}else if(data_value==data_desc){
			$(this).children("span").eq(0).text("↑");
			$(this).attr("data-value",data_asc);
			subForm.find("input[name=order]").val(data_asc)
			subform();
		}else{
			$(this).children("span").eq(0).text("↓");
			$(this).attr("data-value",data_desc);
			subForm.find("input[name=order]").val(data_desc);
			subform();
		}
	})
});

function css(dom){
	dom.removeClass("sele")
}
function cssbg(dom){
	dom.addClass("sele")
}

function delClass(dom,i){
	$(dom).each(function(j,e1){
		if(i){
			if(i!=j){
				$(this).removeClass("sele");
			}
		}else{
			$(this).removeClass("sele");
		}
	});
}


function getHeight(){
	var sh = "";
	$(".item-dl .J_show").each(function(i,e){
		var h = $(".oth-ul:eq("+i+")").height();
		if(!h){
			h = 0;
		}
		sh += h+"#";
	})
	return sh;
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
		if(name=="time"){
			if(form.find("input[name=timeBegin]").val()!="" || form.find("input[name=timeEnd]").val()!=""){
				orginal += destvalue;
			}
		}else{
			orginal += destvalue;	
		}
	})
	return orginal;
}

//取消更多的显示
function hideMore(){
	var playOption = $('#playOption');
	var plold = playOption.height();
	var plH = $("#playOption .listitem").height();
	if(plH>plold){
		playOption.next().css("display","inline-block");
	}
	$(".listitem").each(function(){
		if($(this).height()>$(this).parent(".conten-list").height()){
			$(this).parent(".conten-list").next(".J_show").show();
		}
	})
	
	var suppliers = $('#supplier');
	var shold = suppliers.height();
	var supplierH = $("#supplier .listitem").height();
	if(supplierH>shold){
		suppliers.next().css("display","inline-block");
		$("#supplier .listitem").append("<div><span>* 已为您过滤没有相关计划的供应商</span></div>");
	}
}
function subform(clear){
	if(!clear){
		var start = createStartTimePick.datepicker('getDate');
		var end = createEndTimePick.datepicker('getDate');
		var val = $("#createStartTime").val();
		if(start && end && start>end){
			$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
			return false;
		}
	}
	if(globleorginal!=getorginal()){
		if(window.Placeholders && !Placeholders.nativeSupport){
			Placeholders.disable($("#validateform")[0]);
		}
		var form = $("#subForm");
		//form.find("input[name=sh]").val(getHeight());
		var ah = $(".J_hidenlist").css("display");
		if(ah && ah=="block"){
			form.find("input[name=sh]").val(1);
		}else{
			
		}
		form.find("input").each(function(i,e){
			var destvalue = $.trim($(this).val()) ;
			var name = $(this).attr("name");
			//IE处理
			if(name=="minPrice" || name=="maxPrice" || name=="airline" || name=="expired"){
				destvalue=destvalue.replace(/\D/g,'');
			}
			if(name=="supplierOrPlanName" && (destvalue==searchbynames)){
				destvalue = "";
			}
			if(destvalue=="" || destvalue=="0"){
				if(destvalue=="0"){
					if(name!="expired" && name!="order" && name != "redPacketRule"){
						$(this).remove();
					}
				}else{
					$(this).remove();
				}
			}
		})
		$(".content_body").hide();
		$("#waitprocess").show();
		form.submit();
	}else{
		
	}
}







//3.5新增功能
var recordFiltrAll = false;
var csEnabled;
var csgiveas;
var common={
	init:function(){

	},
	artone:function(josn){
		$.dialog({
			title: '设置规则',
			width: 600,
			height:"auto",
			padding : '5px 20px',
			content:'',
			lock: true,
			fixed: true,
			resize: false,
			button: [
			    {
			    	name: '还原为系统规则',
					callback: function(){
						$("input[name='discount']").val("");
						$("input[name='rebate']").val("");
						var Enabled=$(".Enabled").val(),
						    giveas=$(".give_as").val(),
						    id=$(".myproductId").val();
						common.oneajax(id,Enabled,giveas);
					}
			    },
				{
					name: '取消',
					callback: function(){}
				},
				{
					name: '保存',
					className: 'btn_process',
					callback: function(){
						var regs=/^([1-9]\d|\d)*$/,
						    Enabled=$(".Enabled").val(),
						    giveas=$(".give_as").val(),
						    id=$(".myproductId").val(),
						    isclose;                         
						if(Enabled!=="" && regs.test(Enabled) || giveas!=="" && regs.test(giveas) && Enabled!==csEnabled || giveas!==csgiveas){
                             isclose=common.oneajax(id,Enabled,giveas);
						}else{
							if(window.confirm("请填写下单可用红包和下单赠送红包，必须是0-99整数，值不可以和初始值一样，否则不可提交")){
                                return false;
							}else{
                                return true;
							}
						}
						return isclose;
					}
				}
			],
		    init:function(){
	        	$(".aui_content").html(template("onesetform",josn));
	        	if($(".Enabled").val()==="" && $(".give_as").val()===""){
	        	   $(".aui_buttons button").eq(0).attr("disabled","disabled");
	        	}
	        	csEnabled=$(".Enabled").val();
	        	csgiveas=$(".give_as").val();
        	}
	    })
	},
	oneajax:function(id,Enabled,giveas){
		var isclose;
        $.ajax({
			url:"/redpacket/rule.json",
			type:"POST",
			data:"productId="+id+"&discount="+Enabled+"&rebate="+giveas+"", 
			async:false,
			dataType:"json",
			success:function(json){
			   if(json.success){
			   	   isclose=true;
                   $.gmMessage(json.message,true);
                   window.location.reload();
			   }else{
			   	   isclose=false;
			   	   $.gmMessage(json.message,false);
			   }
                              
			},
			error:function(json){

			}
        });
        return isclose;
	},
	artmore:function(pagearr,condition){
		$.dialog({
			title: '批量设置规则',
			width: 600,
			height:"auto",
			padding : '5px 20px',
			content:'',
			lock: true,
			fixed: true,
			resize: false,
			button: [
			    {
			    	name: '还原为系统规则',
					callback: function(){
                        $("input[name='discount']").val("");
						$("input[name='rebate']").val("");
						var Enabled=$(".Enabled").val(),
						    giveas=$(".give_as").val();						   
						if(!$(".currentProduct").is(":hidden")){
                            var pageurl="/redpacket/rule-batch";
							var data="productIds="+pagearr+"&discount="+Enabled+"&rebate="+giveas+"";
                                common.moreajax(pageurl,data);
						}else{
                            var moreurl="/redpacket/rule-batch-conditions";
							var data={"discount":Enabled,"rebate":giveas,"line":condition.line,"playOption":condition.playOption,"months":condition.months,
							  			  "days":condition.days,"supplier":condition.supplier,"order":condition.order,"minPrice":condition.minPrice,"maxPrice":condition.maxPrice,
							  			  "airline":condition.airline,"editorId":condition.editorId,"supplierOrPlanName":condition.supplierOrPlanName,"timeBegin":condition.timeBegin,
							  			  "timeEnd":condition.timeEnd,"time":condition.time,"tourType":condition.tourType,"redPacketRule":condition.redPacketRule,"productIdOrDestination":condition.productIdOrDestination} 							  	  							  	  

                            common.moreajax(moreurl,data);
						}						
					}
			    },
				{
					name: '取消',
					callback: function(){}
				},
				{
					name: '保存',
					className: 'btn_process',
					callback: function(){
						var regs=/^([1-9]\d|\d)*$/,
						    Enabled=$(".Enabled").val(),
						    giveas=$(".give_as").val(),
						    isclosemore;
						if(Enabled!=="" && regs.test(Enabled) || giveas!=="" && regs.test(giveas) && Enabled!==csEnabled || giveas!==csgiveas){			 
							  if(!$(".currentProduct").is(":hidden")){
							  	  var pageurl="/redpacket/rule-batch";
							  	  var data="productIds="+pagearr+"&discount="+Enabled+"&rebate="+giveas+"";
                                  isclosemore=common.moreajax(pageurl,data);
							  }else{
							  	  var moreurl="/redpacket/rule-batch-conditions";
							  	  var data={"discount":Enabled,"rebate":giveas,"line":condition.line,"playOption":condition.playOption,"months":condition.months,
							  			  "days":condition.days,"supplier":condition.supplier,"order":condition.order,"minPrice":condition.minPrice,"maxPrice":condition.maxPrice,
							  			  "airline":condition.airline,"editorId":condition.editorId,"supplierOrPlanName":condition.supplierOrPlanName,"timeBegin":condition.timeBegin,
							  			  "timeEnd":condition.timeEnd,"time":condition.time,"tourType":condition.tourType,"redPacketRule":condition.redPacketRule,"productIdOrDestination":condition.productIdOrDestination} 							  	  							  	  

                                  isclosemore=common.moreajax(moreurl,data);
							  }
                              
						}else{
							if(window.confirm("请填写下单可用红包和下单赠送红包，必须是0-99整数，值不可以和初始值一样，否则不可提交")){
                                return false;
							}else{
                                return true;
							}
						}
						return isclosemore;
					}
				}
			],
		    init:function(){
	        	$(".aui_content").html(template("moresetform"));
	        	if($(".currentProduct").is(":hidden")){
                    $(".product_num span").html($(".filterTotal").val());
	        	}else{
	        		$(".product_num span").html($(".currentProduct em").html());
	        	}
	        	csEnabled=$(".Enabled").val();
	        	csgiveas=$(".give_as").val();
	        	
        	}
	    })	    
	},
	moreajax:function(url,data){
    	var isclosemore;
        $.ajax({
			url:""+url+".json",
			type:"POST",
			data:data, 
			async:false,
			dataType:"json",
			success:function(json){
			   if(json.success){			   	    			   	    
			   	    isclosemore=true;
                    $.gmMessage(json.message,true);

		   	    	setTimeout(function(){
                   	   window.location.reload();
                    },1500);  
                                                     
			   }else{
			   	   isclosemore=false;
			   	   $.gmMessage(json.message,false);
			   }                             
			},
			error:function(json){
               
			}
        });
        return isclosemore;
	}
}
common.init();

function oneSet(id){ //单个设置规则弹框
   if(id){
	   $.ajax({
			url:"/redpacket/rule.json",
			type:"GET",
			data:"productId="+id+"",
			async:false,
			dataType:"json",
			success:function(json){
                common.artone(json);               
                if(json.errMsg){		
  			      $(".aui_close").click();	   	
                    $.gmMessage(json.errMsg,true);
  			   	}
			},
			error:function(json){
			   				
			}
	   });	
   }else{
   	  alert("此条数据无效");
   }
}




$(".batchmore").on("click",function(){  //批量设置弹框
	//如果是只设置本页，则穿整页面的id
	var pagearr=[];
	$(".m-btn-w").not(":first").each(function(){
		pagearr.push($(this).text().trim());
	});
	//如果是设置全部则把所有的筛选条件传过去
    var line=$("input[name='line']").val();
	var playOption=$("input[name='playOption']").val();
	var months=$("input[name='months']").val();
	var days=$("input[name='days']").val();
	var supplier=$("input[name='supplier']").val();
	var order=$("input[name='order']").val();
	var minPrice=$("input[name='minPrice']").val();
	var maxPrice=$("input[name='maxPrice']").val();
	var airline=$("input[name='airline']").val();
	var editorId=$("input[name='editorId']").val();
	var supplierOrPlanName=$("input[name='supplierOrPlanName']").val();
	var timeBegin=$("input[name='timeBegin']").val();
	var timeEnd=$("input[name='timeEnd']").val();
	var time=$("input[name='time']").val();
	var tourType=$("input[name='tourType']").val();
	var redPacketRule=$("input[name='redPacketRule']").val();
	var productIdOrDestination=$("input[name='productIdOrDestination']").val();
	var condition={
		"line":line,
		"playOption":playOption,
		"months":months,
		"days":days,
		"supplier":supplier,
		"order":order,
		"minPrice":minPrice,
		"maxPrice":maxPrice,
		"airline":airline,
		"editorId":editorId,
		"supplierOrPlanName":supplierOrPlanName,
		"timeBegin":timeBegin,
		"timeEnd":timeEnd,
		"time":time,
		"tourType":tourType,
		"redPacketRule":redPacketRule,
		"productIdOrDestination":productIdOrDestination,
	};
	common.artmore(pagearr,condition);
});








// 批量设置规则（效果）
$(".m-btn-w").on("click",function(){
	var t = $(".m-btn-w").eq(0).hasClass('active'),
	isFirst = $(this).hasClass('first-temp');
	if(!t && isFirst){
		$(".m-btn-w").addClass('active');
		$(".m-btn-w").find("input").prop("checked","checked");		
		$(".currentProduct").find('em').text($(".m-btn-w").find("input").length-1);
		$(".currentProduct").show();
		$(".batchmore").show();
		recordFiltrAll = false;
		$(".batch_check_modify").css({"border-bottom":"1px solid #c4c4c4","padding":"20px 0px"});
	}else{
		if(!isFirst){
			$(".m-btn-w").eq(0).removeClass('active');
			$(".m-btn-w").eq(0).find("input").removeAttr('checked');
		}else{
			$(".m-btn-w").removeClass('active');	
			$(".m-btn-w").find("input").removeAttr('checked');	
						
		}
		$(".batch_check_modify").css({"border-bottom":"none","padding":"0px 0px"});
		$(".totalProduct").hide();
		$(".currentProduct").hide();
		$(".batchmore").hide();	
		recordFiltrAll = false;	
	}
});
$(".currentProduct a").on("click",function(){	
	$(".currentProduct").hide();
	$(".totalProduct").show();
	recordFiltrAll = true;
});
$(".totalProduct a").on("click",function(){
	$(".currentProduct").show();
	$(".totalProduct").hide();
	recordFiltrAll = false;
});

$(".detail").hover(function(e){
    e.stopPropagation();
    $(this).find(".detail_span").show();
},function(){
	$(this).find(".detail_span").hide();
})	
