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
	var title=$("h2 b",$(this)).attr("title");
	if(title){
		title=title.replace(/(\n)+|(\r\n)+/g, "");
		if(title.length>300) title=title.substring(0,300)+"...";
		$("h2 b",$(this)).attr("title",title);
	}
});

//同行计划列表线框bug修改
$(".list-box .table tr").hover(function(){
	var prev=$(this).prev("tr");
	if(prev.size()>0) $("td",prev).attr("style","border-bottom-color:#78a7ff!important;");
},function(){
	var prev=$(this).prev("tr");
	if(prev.size()>0) $("td",prev).removeAttr("style");
});

$(function(){
	/*重构代码开始*/
		//对比栏功能
		if($.fn.compare){
			$(".list-box").compare({
				addBtn:"compare"
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
		//列表查询框事件
		$("#validateform .price-input, #validateform .airplane,#validateform .name").hover(function(){
			$("input:first()",$(this)).focus();
		},function(){
			$("input:first()",$(this)).blur();
		});
		
		$(".nav-tabs li a").each(function(){
			$(this).on("click",null,function(){
				$("#subForm input[name=line]").val($(this).attr("data-line-id"));
				subform();
			})
		})
		$(".list-search").on("click",".search-select li",function(){
			//排序
			var value=$(this).attr("attr_id");
			$("#subForm input[name=order]").val((value?value:""));
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
		
		//自定义天数查询
		$("#J_definedDays button").click(function(){
			var value=$.trim($(this).prev().val());
			if(value&&(!isNaN(value))){
				$("#subForm input[name=days").val(value);
				subform();
			}
		});
		
		//列表查询验证
		$("#validateform input[name=minPrice], #validateform input[name=maxPrice]").keyup(function(){
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

	$(document).on("click", ".ui-datepicker-close", function() {
			datepicker_CurrentInput.value = "";
			$("#setoffdate").prev().text("指定日期").css("color","#999");
			subForm.find("input[name=months]").val("");
			subform();
	});
	
	$("#setoffdate").prev(".value").click(function(){
		$("#setoffdate").focus();
	});
	
	$("#setoffdate").datepicker({
			changeMonth : true,
			changeYear : true,
			minDate : new Date(),
			dateFormat : "yy.mm.dd",
			onClose : function(selectedDate) {
				if (selectedDate) {
					var _ints = selectedDate.split(".");
					$("#setoffdate").prev().text(_ints[0] + "年" + _ints[1] + "月" + _ints[2] + "日");
					subForm.find("input[name=months]").val(selectedDate);
					subform();
				}
			}
	});
		
	$("#validateform").validationEngine({
			validateNonVisibleFields : true,
			validationEventTrigger : "",
			showOneMessage : false,
			maxErrorsPerField : 1,
			promptPosition : "topLeft:0,5",
			scroll : true,
			scrollOffset : 100,
			autoHidePrompt : true,
			autoHideDelay : 1000,
			focusFirstField : true
	});
	
});	

function subform() {
		if (globleorginal != getorginal()) {
			var form = $("#subForm");
			form.find("input").each(
					function(i, e) {
						var destvalue = $.trim($(this).val());
						var name = $(this).attr("name");
						// IE处理
						if (name == "minPrice" || name == "maxPrice") {
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
			//$("#waitprocess").show();
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
			if(name=="minPrice" || name=="maxPrice"){
				destvalue=destvalue.replace(/\D/g,'');
			}
			if(name=="supplierOrPlanName" && (destvalue==searchbynames)){
				destvalue = "";
			}
			orginal += destvalue;
		})
		return orginal;
}
