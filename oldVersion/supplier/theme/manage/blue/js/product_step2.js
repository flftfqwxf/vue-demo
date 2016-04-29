(function($, w) {
	var index = 0, $tripsStat,$infoMenus,$tripItemCtn, offset = 60, 
	ctx = $("#step2").on("hide", function() {
		$(".removed",this).remove();
		$(".hotel",this).each(function(){
			if($(".item",this).is(":hidden"))
				$(".item",this).remove();
		})
		$(".flight_table:visible",this).each(function(){
			$("tr.selected",this).each(function(){
				$(this).find("td:first").html(template("tpl_input_hidden",{name:'flight.id',value:$(this).attr("flight_id")}))
			})
		})
		$(".value_union:visible",this).each(function(){
			var n = $(this).attr("rel");
			var v = this.value + ($(this).attr("sep")||",") + $(this).next().val();
			$(template("tpl_input_hidden",{name:n,value:v})).insertBefore(this);
		})
		$(".schedules",this).find(".hide").filter(":hidden").empty();
		Product.utils.setIndex.call(getAllItem());
		var data = Product.utils.getFormData.call(this);
		//交通区域验证
		$("input[type=hidden][tag=traffic]").each(function(){
			var _this = $(this);
			if(_this.val() == "" && data) {
				data = false;
				var day = _this.closest(".trip_item").find(".index").text();
				$.alert(day + "有交通方出发/目的地为空");
				_this.next("input").validationEngine('showPrompt', '交通方式出发地目的地必填','error', null, true);
			}
		});
		if(data === false){
			return false;
		}else{
			$(w).off("scroll.step2");
			return data;
		}
	}).on("show", function() {
		$("#btnSave").text("下一步");
		$(w).on("scroll.step2",function() {
			var t = $(this).scrollTop() + offset;

			var scrollHeight = $(document).height();
		    var windowHeight = $(this).height();
		    if(t + windowHeight > scrollHeight){
		    	$infoMenus.parent().css("top",Math.max(t,260));
		    	$infoMenus.find(".on").removeClass("on");
				$(".day_link:last",$infoMenus).addClass("on");
				return false;
		    }
			if(t > 50){
				//t += $ct_title_fff.addClass("div_static").height();
			}else{
				//$ct_title_fff.removeClass("div_static");
			}
			$tripItemCtn && getAllItem().each(function(i) {
				var h = $(this).offset().top;
				if(i==0 && t>90){
					$infoMenus.parent().css("top",Math.max(t,260));
				}
				if (t < h) {
					var $this = getAllItem().eq(Math.max(0,i-1));
					var $tar = $infoMenus.find("[index=" + $this.attr("index") + "]");
					$infoMenus.find(".on").removeClass("on");
					$tar.addClass("on");
					return false;
				}
			})
		})
	}).on("click",".day_link",function(){
		scrollTo($(this).attr("index"))
	})
	.on("click",".add_day",addItem)
	.on("click",".sort",showSortDialog)
	.on("click","#back-top",function(){
		$("html,body").animate({scrollTop:0}, 500);
	})
	.on("click",".del_item",delItem);
	
	function scrollTo(index,$tar,pos){
		if(!$tar){
			$tar = $(">[index="+index+"]",$tripItemCtn);
		}
		pos = pos || ($tar.offset().top-offset);
        $("html,body").animate({scrollTop:pos}, 500);
	}
	function addItems(data){
		$.each(data || [false,false,false],addItem)
	}
	function addItem(idx,data,on){
		if(index>29){
			$.alert("行程最多只能添加30天");
			return false;
		}
		var d = data || {};
		d.index = ++index;
		var h = template("tpl_trip_item",d);		
		var $new = $(h).appendTo("#trip_items");
		var plugins = "traffics,hotel,schedules".split(",");
		$.each(plugins,function(){
			new Product[this]($("."+this+" .col2",$new),d[this]).init(index);
		})
		addItemMenu();
		updateStatInfo();
	}
	

	function getAllItem(){
		return $tripItemCtn.find(">.trip_item");
	}
	function delItemMenu(index){
		_delByIndex($infoMenus.find("a[index]"),index);
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
			$(this).find("b[index_show]").text(i+1);
		})
		
		$("a[index]",$infoMenus).each(function(i, e){
			$(this).attr("index",i+1).find("b").text(i+1);
		});
	}
	function updateStatInfo(){
		var num = 0;
		getAllItem().each(function(){
			num += $(".hotel :checkbox:checked",this).length%10;
		})
		$tripsStat.find("b").text(index).end().find("input").val(num);
	}
	function addItemMenu(){
		$infoMenus.append(template("tpl_day_link",{index:index}));
	}
	function delItem(idx){
		if(!$.isNumeric(idx)){
			idx = parseInt($(this).closest(".trip_item").attr("index"));
		}
		_delByIndex(getAllItem(),idx);
		delItemMenu(idx);
		index--;
		updateAllIndex();
		updateStatInfo();
	}
	function showSortDialog(){
		var content = "<ul class='sortable'>";
		for(var i=1;i<=index;i++){
			content += '<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>第&nbsp;<b index_show="true">'+i+'</b>&nbsp;天</li>';
		}
		content +="</ul>";
		var d = $.dialog({
			title: "拖动调整行程顺序",
			content: content,
			isOuterBoxShadow: false,
			//show: false,
			isClose: true,
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
					var $tar = $(">[index="+old+"]",$tripItemCtn);
					$tripItemCtn.append($tar);
					$tar.find(".gm-UEditor").each(function(){
						var id=$(this).attr("id");
						if(id){
							UE.getEditor(id).destroy();
							initUEditor(id,false,false,Product.lineId);
						}
					})
				})
				updateAllIndex();
			},
			okCssClass: "btn-process",
			cancel: $.noop,
			cancelCssClass: "aui_state_highlight"
		});
	}
	
	Product.step2 = {
		init : function(data) {
			index = 0;
			$infoMenus = $("#days");
			$tripItemCtn = $("#trip_items");
			$tripsStat = $("#tripsStat")
			addItems(data.dailyTrips);
			data.nights && $("#nights").val(data.nights)
		},
		updateStatInfo:updateStatInfo
	}




})(jQuery, window)
