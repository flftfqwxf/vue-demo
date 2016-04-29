$(function(){
	initSupplier("supplier_name");
	initDistributor("distributorName");
	initAreas("departurePlaceName");
	//目的地与专线关联
	initAreas("destinationName", {lineSet:true ,lineObjId: "touristLineId", def_data:{areaParent: ''}});
	initAreas("dismissPlaceName");
	var selectedLine = false;
	var $touristLine = $("#touristLineId").attr("disabled",false).change(function(){
		var v = this.value;
		if(v == ""){
			showError($(this),"必须选择专线！");
			return false;
		}
		if(selectedLine){
			$.confirm(
					"您修改了专线信息，<br/>必须清空已填写的全部数据才能生效，是否确认？", 
					"确认提示", 
					function(){
						$.unbindbeforeout();				
						location.href = location.pathname + "?"+v;
					}, 
					function(){}
				)
		}
		selectedLine = true;
		$(":input").attr("disabled",false);
		$.getJSON("/tip/list.json?line="+v,function(d){
			addTips(d.tips);
		});
		// 设置玩法选项
		setPlay(v);
	})
	function addTips(data){
		var h = "";
		$.each(data||[],function(){
			h +='<label class="radios"><input type="checkbox" class="radio_check" value="'+this.id+'" name="tips" />'+this.title+'</label>';
		})
		h && $("#tipsInfo").html(h).closest(".hide").show();
	}
	var dailyTrip = Product.dailyTrip;	
	function isSelectedLine(){
		if($touristLine.val()==""){
			showError($touristLine,"请先选择专线！");
			$touristLine.focus();
			return false;
		}
		return true;
	}
	$(document).on("click",".add_prices",function(){
		addPrice();
	}).on("click",":radio",function(){
		var $this = $(this);
		var $tar = $this.parent().nextAll(".hide"); 
		if($this.attr("role") == "show"){
			$tar.show().focus();
		}else{
			$tar.hide();
		}
	}).on("click.confirmimg",".upload_img_but",function(){
		if(isSelectedLine()){
			var touristLineId = $touristLine.val();
			$(document).off("click.confirmimg");
			$(this).gmgallery({touristLineId:touristLineId,multiSelect:false,onOk:function(image){
				$("#coverImage").attr("src",image.path).next("input").val(image.path).next("input").val(image.id);
			}}).click();
		}
	}).on("click.confirm",function(e){
		if($(e.target).is("#touristLineId,a"))
			return true;
		if(isSelectedLine()){
			$(document).off("click.confirm");
		}else{
			return false;
		}
	}).on("click",".dailytrip_add",function(){
		dailyTrip.addItem();
	}).on("click",".del_price_item",function(){
		$(this).closest("tr").remove();
	})
	var $highlight = $("#info_menus"),
		$ct_title_fff = $(".ct_title_fff").css("width", $(".ct_title_fff").width());
	
	function initFormEvents(){
		var $f = $("#form").validationEngine({validateNonVisibleFields:false,scroll:true,scrollOffset:100,autoHidePrompt:true,autoHideDelay:10000,focusFirstField:false});
		var submitForm = function(url){
			var valid = $f.validationEngine('validate');
			if($('#playOptionId').val()==null || $('#playOptionId').val() == ""){
				showError($('#playOptionId').next("span"),"* 请选择玩法");
				valid = false;
			}
			$("textarea").each(function(){
				var max = $(this).attr("maxlength") || 2000;
				var $tar = $(this).prev("div.edui-default");
				var editor = UE.getEditor($tar.attr("id"));
				if(editor.getContentLength(true)>max){
					showError($tar,"* 最多 "+max+" 个字符")
					valid = false;
				}
			})
			if($("#coverImageId").val()==""){
				showError($("#coverImage"),"请选择一张封面图片！");
				valid = false;
			}
			/*
			$(".dailyTripItem").each(function(){
				if($("table.sights tr",this).length==0){
					showError($(".sight_add",this),"请添加或者创建至少一个景点！");
					valid = false;
				}
			})
			*/
			if(!valid) {
				//$("#infobar").html("校验失败，请检查输入").show();
				setTimeout(function(){
					$("#infobar").html("").hide();
				},5000)
				return false;
			}
			/*
			if($("#chosentheme").val()==""){
				$("#chosentheme").next("div").validationEngine('showPrompt','请选择线路主题','error',false,true);
				return false;
			}
			*/

			//var $tar = form;
			//$(form).html("");
			var data = [];
			$f.find(":input[name]").each(function(){
				if($(this).is(":radio,:checkbox") && !this.checked)
					return;
				var $p = $(this).parents("[pname]");
				var n = $(this).attr("name");
				if(n.indexOf("-")>0){
					n = n.substring(0, n.indexOf("-"));
				}
				$p.each(function(){
					n = $(this).attr("pname")+"["+($(this).attr("index")-1)+"]."+n;
				})
				//$("<input name='"+n+"'>").attr("value",this.value).appendTo(form);
				data.push({name:n,value:this.value});
			})
			var dialog = $.dialog({
				isClose: false,
			    title: false,
			    lock:true,
			    zIndex:12000,
			    content: '正在提交，请稍候。。。'
			});
			$.post(url,data,function(d){
				$.unbindbeforeout();
				dialog.content("保存成功");
				opener.reload();
				setTimeout(function(){
					window.close()
				},1000)
				console.log(d);
			}).fail(function(){
				dialog.content("保存失败，请稍后重试");
				console.log(arguments)
			}).always(function(){
				setTimeout(function(){
					dialog.close()
				},1000)
			})
			//form.submit();
		}
		
		$('#btnSave').click(function(){
			submitForm($('#actionUrl').val())
		});
		//预览
		$("#btnPreview").click(function(){
			submitForm('/tour/preview')
		});
	}
	
	var t;
	$(window).on("scroll",function() {
		var t = $(this).scrollTop();
		var scrollHeight = $(document).height();
	    var windowHeight = $(this).height();
	    if(t + windowHeight == scrollHeight){
	    	t = $(".scrollhandler").eq(-2).offset().top + 50;
	    }
		if(t > 50){
			t += $ct_title_fff.addClass("div_static").height();
		}else{
			$ct_title_fff.removeClass("div_static");
		}
		$(".scrollhandler").each(function(i) {
			var h = $(this).offset().top;
			if (t < h) {
				var $this = $(".scrollhandler").eq(Math.max(0,i-1));
				var key = $this.attr("index")?"index":"rel";
				var $tar = $highlight.find("["+key+"=" + $this.attr(key) + "]");
				$highlight.find(".on").removeClass("on");
				$tar.addClass("on");
				if(key == "index"){
					$highlight.find("[rel=trip_info_start]").addClass("on");
				}
				return false;
			}
		})
	}).on("resize",function(){
		t && clearTimeout(t);
		t = setTimeout(function(){
			$highlight.css("right", $("#rightBody").offset().left)
		},100);
	}).resize();
	function addPrice(){
		var $table = $("#prices_table");
		var $new = $table.find("tr:last").clone();
		$new.attr("index",parseInt($new.attr("index"))+1);
		$new.find("input").val("").end().find(".relativetd").append('<span class="del_price_item">X</span>');
		$table.append($new);
		initDatepicker($new.find("input:eq(0)").removeAttr("id").removeClass("hasDatepicker"))
	}
	
	var productId = $("#productId").val();
	$(":input").not("#touristLineId").attr("disabled",true);
	
	if($('#jsonUrl')){
		$.ajax({
			url:$('#jsonUrl').val(),
			async:false,
			dataType:"json",
			success:function(d){
				console.log(d)
				addTips(d.tips);
				$(":input").attr("disabled",false);
				$touristLine.val(d.product.touristLine.id).attr("disabled",true);
				selectedLine = true;
				$.each(d.product,function(k,v){
//					try{
						if(v === false){
							v = 0;
						}else if(v === true){
							v = 1;
						}else if(v == null || v == "")
							return;
						
						if(k == "coverImageUrl"){
							$("#coverImage").attr("src",v)
						}
						if(k == "dailyTrips"){
							$.each(v,function(){
								dailyTrip.addItem(this);
							})
						}else if(k == "supplier" && v){
							$("#supplier_name").val(v.name).attr("disabled",true);
							$("#supplierId").val(v.id);
						}else if(k == "productPrices" && v && v.length > 0){
							var $table = $("#prices_table");
							for(var i=1;i<v.length;i++){
								addPrice();
							}
							$table.find("tr:gt(0)").each(function(i){
								var thiz = this;
								$.each(v[i],function(c,d){
									if(c == "startDate")
										d = d.substring(0,10);
									$("input[name="+c+"]",thiz).val(d)
								})
							});
						}else if(k == "touristLine"){
							
						}else if(k == "tips"){
							$.each(v,function(){
								$("input[name=tips][value="+this.id+"]").attr("checked",true);
							})
						}else if(k == "distributorCanViews"){
							if(v && v[0] && v[0].distributor){
								$("#distributorName").val(v[0].distributor.name).parent().show();
								if (v[0].distributor) {
									$("#distributorId").val(v[0].distributor.id)
								}
								$touristLine.val(v.id);
							}
						}else if(k=="destinations"){
							$("#destinationName").val(v[0].destinationName);
							if (v[0].destination) {
								$("#destinationId").val(v[0].destination.id);
							}
						}else if(k=="saleTime" || k=="stopTime"){
							if(v && v.length>10)
								v = v.substring(0,10);
							$(":input[name="+k+"]:eq(0)").val(v)//.parent(".hide").show();
						}else if(k == "playOption"){
							$("#playOptionId").val(v.id);
						}else {
							 $(":input[name='"+k+"']").each(function(i, e){
								 var $t = $(e);
								 if ($t.parents("[pname]").length == 0) {
										//console.log($t.attr("name") + ":" + $t[0].tagName + ":" + $t.attr("id") );
										if($t.is(":radio")){
											$(":input[name='"+k+"'][value='"+v+"']").attr("checked",true).click();
										}else if($t.is("textarea")){
											$t.val(unescape(v));
										}else{
											setTimeout(function(){
												$t.val(v)
											},k=="nights"?300:0);
										}
									}
							 });
							
						}
//					}catch(e){
//						console.log(e);
//					}
				});
			}
		});
	}
	
	if (!productId && !$("#useTemplate").val()) {
		//创建产品，或者模板，默认创建3天行程，不滑动index
		dailyTrip.addItem(null, false);
		dailyTrip.addItem(null, false);
		dailyTrip.addItem(null, false);
	}
	
	//不需要主题了
	//$("#chosentheme").gmchosentheme();//after setvalue
	initPlugins();
	$('#playOptionId').select2({placeholder: "请选择玩法",minimumInputLength: 0,allowClear: true}); // 初始化玩法选择
	
	$('.Wdate').datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd'
	}).attr('readonly',true);

	if(location.search){
		$touristLine.val(location.search.substring(1)).change();
	}
	function setPlay(v){
		$.ajax({
			url: '/line/play/' + v + ".json",  
            dataType: "json",
            type: "GET",
            success: function(res){
            	var options = "";
            	var playList = res.list;
            	for(var i = 0; i < playList.length; i++){
            		options += '<option value="'+playList[i].id+'">'+playList[i].name+'</option>';
            	}
            	$('#playOptionId').html("");
            	$('#playOptionId').append(options);
            	$('#playOptionId').select2({placeholder: "请选择玩法",minimumInputLength: 0,allowClear: true}); // 初始化玩法选择
            }
		});
	}
	initFormEvents();
});

	function showError($tar,msg,pos){
		$tar.validationEngine('showPrompt',msg,'error',pos,true);
	}
	$.bindbeforeout();
