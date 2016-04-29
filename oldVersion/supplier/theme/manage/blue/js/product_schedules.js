(function($, w) {
	Product.schedules = function(ctx,data){
		ctx.on("change",".option :radio",function(){
			ctx.find(".bottom")[this.value=="CUSTOM"?"hide":"show"]();
			var $tar = $(this).closest(".schedules").find(".hide").hide().end().find("."+this.value).show();
			if($tar.find(".fw").length == 0)
				addItem();
		}).on("change",".option select",function(){
			$(this).prev("label").find("input").val($(this).val());
			fillCol1(ctx.find(".TIME:visible").find(".col1"));
		}).on("click",".del_trip",function(){
			$(this).closest(".rl").remove();
		}).on("click",".add_trip",addItem)
    	function buildOption(len){
			var h = "";
			for(var i=0;i<len;i++){
				var t = (i<10?"0":"")+i;
				h += "<option value="+t+">"+t+"</option>"
			}
			return h;
		}
		var hourOption = buildOption(24), minOption = buildOption(60);
    	this.init = function(){
    		var d = {};
    		d.random = $.now();
    		if(data && data.length){
    			var time = data[0].time;
    			d.timeType = "TIME";
    			if(time === null){
    				d.timeType = "CUSTOM";
    			}else if(time.indexOf(":")>0){
    				d.time = true;
    			}
    		}
    		var h = template("tpl_trip", d);
    		ctx.html(h);
    		
    		$.each(data||[false],addItem);
    		ctx.find(":radio:checked").change();
    	}
    	function addItem(idx,data){
    		var d = data || {};
    		var selected = ctx.find(":radio:checked").val(),$tar = ctx.find("."+selected);
    		if($tar.find(">div").length>9){
    			$.alert("最多添加10条日程安排");
    			return false;
    		}
    		var $new = $(template("tpl_trip_"+(selected == "CUSTOM"?selected:"default"),d));
    		$tar.append($new);
    		
    		fillCol1($new.find(".col1"),d.time);
    		$("textarea",$new).each(function(){
    			var id = "descr"+new Date().getTime();
    			$(this).attr("id",id).height(100);
    			initUEditor(id,false,false,Product.lineId,495);
    		});
    	}
    	function fillCol1($col1,time){
   			$col1.length && $col1.html(template("tpl_trip_"+ctx.find(":radio:checked").val(),{hourOption:hourOption,minOption:minOption}))
   			if(time){
   				time = time.split(":");
   				$col1.find("select").each(function(i){
   					this.value = time[i];
   				});
   			}
    	}
	}
})(jQuery, window);
