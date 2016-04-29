(function($,w){
	var $dailyTrips = $("#dailyTrips"), $dailyTripItemCtn = $("#dailyTripItems"),$tripsStat = $("#tripsStat");
	$dailyTrips.on("click",".del_trip_item",function(){
		if(getItemLength() == 1){
			alert("必须包含一天行程！");
			return false;
		}
		var index = parseInt($(this).attr("index"));
		if(confirm("确定删除第"+index+"天行程吗？")){
			delItem(index);
			updateAllIndex();
			updateStatInfo();
		}
	}).on("click",".cateing_list>a",function(){
		$(this).closest(".foods_option").find("input").val($(this).text()).next("div").hide();
	}).on("focus",".foods_option input",function(){
		$(this).next("div").show();
	}).on("blur",".foods_option input",function(){
		var $this = $(this);
		setTimeout(function(){
			$this.next("div").hide();
		},300);
	}).on("click",".nohotel",function(){
		$(this).parent().prevAll("input").val("").attr("disabled",this.checked);
		updateStatInfo();
	})
	var $infoMenus = $("#info_menus").on("click",".dailytrip_sort",function(){
		showSortDialog();
	}).on("click",".day",function(){
		scrollTo($(this).attr("index"));
		return false;
	}).on("click","a[rel]",function(){
		scrollTo(0,$("div[rel="+$(this).attr("rel")+"]"))
	}).on("click",".bottom_return",function(){
		scrollTo(0,true,1);
	})
	function scrollTo(index,$tar,pos){
		if(!$tar){
			$tar = $(">[index="+index+"]",$dailyTripItemCtn);
		}
		pos = pos || ($tar.offset().top-60);
        $("html,body").animate({scrollTop:pos}, 500);
	}
	function getAllItem(){
		return $dailyTripItemCtn.find(".dailyTripItem");
	}
	function getItemLength(){
		return getAllItem().length;
	}
	function delItemMenu(index){
		_delByIndex($infoMenus.find(".travel_num_li[index]"),index);
	}
	function _delByIndex($arr,index){
		$arr.each(function(i){
			if(i+1 == index){
				$(this).remove();
			}else if(i >= index){
				$(this).attr("index",i).find("[index_show]").html(i);
			}
		})
	}
	function updateAllIndex(){
		getAllItem().each(function(i, e){
			$(this).attr("index",i+1);
			//index隐藏域，取第一个，由于index较多如：交通，景点。之前那种方式都修改了则有BUG
			$(this).find("input:eq(0)").val(i+1);
			
			$(this).find("b[index_show]").text(i+1);
			$(this).find(".del_trip_item").attr("index", i+1);
		})
		
		$(".travel_num_li",$infoMenus).each(function(i, e){
				$("[index]",this).attr("index",i+1);
				$("[index_show]",this).text(i+1);
		});
	}
	function updateStatInfo(){
		var len = getItemLength();
		var nohotel = $(".nohotel:checked",$dailyTripItemCtn).length;
		$tripsStat.find("b").text(len).end().find("input").val(len - nohotel)
	}
	function buildItemMenu(index){
		return'<div class="travel_num_li day" index="'+index+'"><a href="javascript:void(0)" >第&nbsp;<b index_show="true">'+index+'</b>&nbsp;天</a></div>';
	}
	function addItemMenu(index){
		$(buildItemMenu(index)).insertBefore($(".dailytrip_add",$infoMenus))
	}
	function delItem(index){
		_delByIndex(getAllItem(),index);
		delItemMenu(index);
	}
	function addItem(data, scroll){
		scroll = scroll != false;
		var tpl = $("#tmpl_dailyTripItem").html();
		var index = getItemLength() + 1;
		if(data){
			data["index"] = index;
		}else{
			data = {"index":index};
		}
		data.dailyRemark = data.remark;
		data["random"]=new Date().getTime();
		addItemMenu(index);
		if(data.hotels){
			data.hotelId=data.hotels[0].hotel ? data.hotels[0].hotel.id : "";
			data.hotelName=data.hotels[0].hotelName;
			delete data.hotels;
		}
		
		tpl = Product.utils.tmpl(tpl,data);
		var $new = $(tpl).appendTo($dailyTripItemCtn);
		if(data.includeHotel){
			setTimeout(function(){
				$(".nohotel",$new).click();
			},100);
		}
		setFoodsValue($new,data.foods);
		var traffic = new Product.traffic($new[0]);
		$.each(data.traffics||[],function(){
			traffic.addItem(this);
		})
		var sight = new Product.sight($new[0]);
		if(data.sights){
			$.each(data.sights||[],function(){
				sight.addItem(this);
			})
		}else if(index>1 && scroll){
			scrollTo(index);
		}
		updateStatInfo();
		//景点排序
		$dailyTripItemCtn.find("table[class*=sortable][class*=sights]").sortable({items:"tr", beforeStop : function(event, ui){
			$(ui.item).parent().find("tr[pname]").each(function(i, e){
				$(this).attr("index",i + 1);
				$(this).find("input[name=index]").val(i + 1);
				$(this).find("span:first").text(i+1);
			});
		}});
		
		initSight($new.find(".sight").get(0),null,function(id,name){
			sight.addItem({id:id,sightName:name});
			$new.find(".sight").val("").blur();
		});
		initHotel($new.find(".hotel").get(0));
		
		initUEditor($new.find("textarea").attr("id"));
	}
	function setFoodsValue(ctx,data){
		data && $.each(data,function(i){
			if(this.included){
				$("input[name='foods["+i+"].description']",ctx).val(this.description).parent().show();
				$("input[name|='foods["+i+"].included'][value=1]",ctx).attr("checked",true);
			}
		})
	}
	function showSortDialog(){
		var content = "<ul class='sortable'>";
		for(var i=0;i<getItemLength();i++){
			content += '<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>第&nbsp;<b index_show="true">'+(i+1)+'</b>&nbsp;天</li>';
		}
		content +="</ul>";
		var d = $.dialog({
			title: "拖动调整行程顺序",
			content: content,
			isOuterBoxShadow: false,
			//show: false,
			isClose: false,
			lock: true,
			fixed: true,
			resize: false,
			opacity: .4,
			isClickShade: false,
			init:function(){
				$(".sortable",this.content()).sortable();
			},
			ok: function(){
				$("li",this.content()).each(function(i){
					var old = $("b",this).text();
					var $tar = $(">[index="+old+"]",$dailyTripItemCtn);
					$dailyTripItemCtn.append($tar);
					var id = $tar.find(".gm-UEditor").attr("id");
					UE.getEditor(id).destroy();
					initUEditor(id);
				})
				updateAllIndex();
			},
			okCssClass: "btn-save",
			cancel: $.noop,
			cancelCssClass: "btn-cancel"
		});
	}
	w.Product = w.Product || {};
	w.Product.dailyTrip = {
			addItem : addItem
	}
})(jQuery,window);
