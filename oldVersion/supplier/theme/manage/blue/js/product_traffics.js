(function($, w) {
	Product.traffics = function(ctx,data){
		ctx.on("change",'.ts',function(e){
			var $tar = getCtx.call(this);
			$(".hide",$tar).hide();
			this.value && $("."+this.value,$tar).show();
			_showFlightTable($tar);
			return false;
		}).on("click",".add_traffic",addItem).on("click",".del_traffic",delItem)
		.on("click","tr[flight_id]",function(){
			if($(this).is(".selected")){
				$(this).removeClass("selected");
			}else{
				$(this).closest("tbody").find("tr.selected").removeClass("selected");
				$(this).addClass("selected");
			}
		}).on("click",".customize_link",function(){
			var $tar = $(".fc",getCtx.call(this))
			$tar[0].checked = true;
			$tar.change();
		}).on("click",".mod_flight",function(){
			_showFlightTable(getCtx.call(this));
		}).on("change",".fc",function(){
			var $tar = getCtx.call(this);
			var arr = "hide,show".split(",");
			this.checked ? "": arr.reverse();
			$(".tip",$tar)[arr[0]]();
			$(".customize",$tar)[arr[1]]();
			_showFlightTable($tar);
			return false;
		})
		function getCtx(){
			return $(this).closest(".traffic_item");
		}
		
		this.init = function(idx){
			var o = [];
    		$.each(data || o,addItem);
    	}
    	function addItem(idx,data,on){
    		if(ctx.find(".traffic_item").length>4){
    			$.alert("交通方式最多添加5个");
    			return false;
    		}
    		var d = data || {};
    		var h = template("tpl_traffic",d);
    		var $new = $(h).insertBefore(ctx.find(".add_traffic"));
    		
			Product.utils.initAutocomplete($(".area",$new),{hotType:null,extraParams:{lineId:""}},function(e,d){
				
				var hiddenInput = $(this).parent().find("input[tag=traffic]");
				var src = hiddenInput.val();
				if (src && src != "" && d && src == d.id) {
					return;
				} else {
					hiddenInput.val(d && d.id || "");
					_showFlightTable($new);
				}
			})
			var $tar = $new.find(".ts").val(d.transportation||"airplane");
			if($tar.val()=="airplane" && d.shift){
				$(".fc", $new).attr("checked",true).change().closest(".hide").show();
				$(".airplane", $new).eq(1).show();
			}else if(d.flight){
				_showFlightTable($new, d.flight);
				$(".hide.airplane",$new).show();
			}else
				$tar.change();
    	}
    	function delItem(){
    		getCtx.call(this).remove();
    	}
    	function _showFlightTable(ctx,flight){
			if($(".ts",ctx).val() == "airplane"){
				var depCityId = $(".depCityId",ctx).val();
				var arrCityId = $(".arrCityId",ctx).val();
				
				//自定航班
				if ($(".fc",ctx).is(":checked")){
					$(".tip",  ctx).hide();
					$(".customize", ctx).show();
				}
				
				if(depCityId && arrCityId && !$(".fc",ctx).is(":checked")){
					var $tar = $(".flight_table",ctx);
					$tar.closest(".hide").add($(".customize_link",ctx)).show();
					if(flight){
						flight.selected = true;
						buildFlightTBody($tar,[flight]);
					}else{
						
						$tar.parent().find(".pagination").remove();
						$tar.parent().append("<div class='pagination'></div>");
						$tar.parent().find(".pagination").empty().pagination({
							dataSource:"/flight?depCityId="+depCityId+"&arrCityId="+arrCityId+"&format=json&_"+Math.random(),
							locator:"flightList",
							triggerPagingOnInit:true,
							hideWhenLessThanOnePage:true,
							getTotalPageByResponse:function(d){return d.pagination.pageCount},
							alias:{
								 pageNumber: 'page',
								 pageSize: 'size'
							},
							totalNumber: 50,
							pageSize:5,
							callback:function(d,p){
								buildFlightTBody($tar,d)
							}
						})
					}
				}else{
					$(".flight_table",ctx).closest(".hide").add($(".customize_link",ctx)).hide();
				}
			}
		}
    	function buildFlightTBody($tar,d){
    		var h = "";
			$.each(d,function(){
				if(this.selected){
					$tar.next("div").html("<a class='button mod_flight'>修改航班信息</a>");
				}
				h += template("tpl_flight_table_tr",this)
			})
			$tar.find("tbody").html(h?h:$("#tpl_flight_table_nodata").html())
    	}
	}
})(jQuery, window)
