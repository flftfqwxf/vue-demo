var afterAddTour = function(){
	window.location = '/product/selfsupport';
}
$(window).load(function(){
	// 下架提示详情
	$removePro = $("#dialog_removePro");
	$removeProList = $removePro.find(".remove_pro_list");
	$removePro.dialog({
		hide:true,
		title: false,
		width:500,
		autoOpen : false,
		lock: true,
		isOuterBoxShadow: true,
		dialogClass: "dialog_custom",
		modal : true,
		padding: "0px 0px",
		open:function(){
			$("#dialog_removePro").html($("#removePro_tpl").html());
			$removeProList = $removePro.find(".remove_pro_list");
			$removeProList.mCustomScrollbar({theme:"dark"});
		},
		close:function(){
			$removeProList.mCustomScrollbar("destroy");
		}
	}).on("click", ".cancel_but", function(){
		$removePro.dialog("close");
		$("#tipsClose").parent().hide();
		//changeRemoveInfo();
	});
	$("#showTips").click(function(){
		$removePro.dialog("open");
	});
	$("#tipsClose").click(function(){
		$(this).parent().hide();
		//changeRemoveInfo();
	});
	$("#saleStatus").select2({ width: 60 });
	$("#lineId").select2();
	$("#playOptionId").select2({ disabled:true });
	
	var itemForm = document.getElementById("itemForm");
	$(".list_search_but").click(function(){
		Placeholders.disable(itemForm);
		$("#itemForm").submit();
	});
	$(".list_search_but_cloes").click(function(){
		Placeholders.disable(itemForm);
		$("#keyword").val("");
		$("#itemForm").submit();
	});
	
	$("#saleStatus").change(function(){
		Placeholders.disable(itemForm);
		$("#itemForm").submit();
	});
	$("#lineId").change(function(){
		Placeholders.disable(itemForm);
		$("#playOptionId").val("");
		$("#itemForm").submit();
	});
	$("#playOptionId,#supplierId").change(function(){
		Placeholders.disable(itemForm);
		$("#itemForm").submit();
	});
	func_line_change();
	$(".add_Btn").click(function(){
		$.ajax({
			url : "/shop.json?_" + Date.parse(new Date()),
			type: "GET",
			async : false,
			dataType: "json",
			success:function(data){
				if(data.shop.acceptSelfSupport){
					window.open("/tour/input");
				} else {
					var api, wrap;
					$.dialog({
						title: false,
				        fixed: true,
				        lock: true,
				        minWidth: 120,
				        content: '<p style="width:100%;font-size:14px;">您创建的自营产品，将只会出现在您的微网站内</p><br/><p style="width:330px;line-height:20px;font-size:14px;">若由于自营产品产生纠纷或客户投诉，相关责任或损失由您自行承担和处理，港马不承担任何责任。</p>',
				        okVal : "同意并开始使用",
				        okCssClass: 'btn-save',
				        ok: function(){
				        	$.ajax({
								url : "/shop/accept/selfsupport.json?_" + Date.parse(new Date()),
								type: "POST",
								dataType: "json",
								success:function(data){
									if(data.result.success){
										window.open("/tour/input");
									} else {
										$.gmMessage(data.result.message, true);
									}
								}
							});
				        },
				        cancel: function(){},
				        cancelVal: "不同意",
				        cancelCssClass: 'btn-cancel',
				        init: function(here){
				            api = this;
				            wrap = api.DOM.wrap;
				            wrap.find('.aui_content').css({
				                    'min-width':'120px'
				            });
				        },
				        close: function(){
				        	wrap.find('.aui_content').removeAttr("style");
				        },
				        isClose: false
					});
				}
			},
			error: function(){
				$.gmMessage("请确认已正确完善网站设置");
			}
		});
	});
	$(".shelves").click(function(){
		var st = $(this).attr("attr_st");
		var id = $(this).attr("attr_id");
		var url = "";
		var confirm = "确认此操作？";
		if(null != id && "" != id){
			if(st && 'onshelves' == st){ // 上架状态，处理为下架。
				url = "/product/selfsupport/" + id + "/offshelves.json";
				confirm = "确定要下架？";
			} else {
				url = "/product/selfsupport/" + id + "/onshelves.json";
				confirm = "确定要上架？";
			}
			if("" != url && null != url){
				$.confirm(confirm, "确认提示", function(){
					$.ajax({
						url : url,
						type: "GET",
						dataType: "json",
						success:function(data){
							$.gmMessage(data.result.message, true);
							window.location.href = window.location.href;
						}
					});
				},function (){});
			}
		}
	});
	$(".delete").click(function (){
		var id = $(this).attr("attr_id");
		if(null != id && "" != id){
			$.confirm("删除后将无法恢复，确认删除？", "确认提示", function(){
				$.ajax({
					url : "/product/selfsupport/delete/" + id + ".json",
					type: "GET",
					dataType: "json",
					success:function(data){
						$.gmMessage(data.result.message, true);
						window.location.href = window.location.href;
					}
				});
			},function (){});
		}
	});
});
function func_line_change(){
	var line = $("#lineId").val();
	var po = $('#playOptionId');
	var disabled = true;
	var poDefualt = po.attr("attr_default");
	var html = "<option value=''>行程线路</option>";
	if (line == "") {
		po.html(html);
		po.select2({ disabled:disabled });
	} else {
		$.getJSON('/line/play/' + line + '.json?_='+Math.random(),{},function(json){
			$(json.list).each(function(i, e){
				html += "<option value="+e.id;
				if(null != poDefualt && "" != poDefualt && poDefualt == e.id){
					html += " selected='selected' ";
				}
				html += ">"+e.name+"</option>";
			});
			if(json.list.length > 0){
				disabled = false;
			}
			po.html(html);
			po.select2({disabled:disabled});
		});
	}
}
