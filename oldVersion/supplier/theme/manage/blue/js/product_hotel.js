(function($, w) {
	Product.hotel = function(ctx,data){
		ctx.on("change",".option :checkbox",function(){
			ctx.find(".arrow").hide();
			if(this.checked){
				ctx.find("."+this.value).show();
				ctx.find(":checkbox").not(this).attr("checked",false);
			}
			Product.step2.updateStatInfo();
		}).on("click",".del",function(){
			$(this).closest(".item").remove();
		}).on("change",":radio",function(){
			$(this).closest("div").find(":text")[this.value=="自定义"?"show":"hide"]()
		}).on("click","[hotel_id]",function(e){
			addItem(e,{id:$(this).attr("hotel_id"),cnName:$(this).text()});
		})
    	
    	this.init = function(){
			var isNew = !data;
			if(isNew) {
				data = {
					custom : true,
					grade  : "自定义"
				}
			}
			
    		var h = template("tpl_hotel", data || {});
    		ctx.html(h);
    		ctx.find(".options").html(function(){
    			var options="当地3星,当地4星,当地5星,当地经济型,当地商务型,准4星,准5星,国际5星,自定义".split(",");
    			var grade = data && data.grade;
    			grade = !data.grade || data.grade == "" ? "自定义" : data.grade;
    			var d = {random:$.now(),options:options,selected:grade,description:data && data.description};
    			return template("tpl_hotel_option_item",d);
    		});
    		var $tar = $(".hotel_input",ctx);
    		Product.utils.initAutocomplete($tar,{hotType:"热门酒店",noResultSetNull:false,minChars:2},function(e,d){
    			if(d){
    				addItem(e,d);
    				this.value = "";
    			}
    			// 设置未清空时添加酒店
//    			else{
//    				var val = $tar.val();
//    				if("" != val && null != val){
//        				d = {name:$tar.val(),id:""};
//        				addItem(e,d);
//    					this.value = "";
//        			}
//    			}
    			
    		});
    		$.getJSON("/hotel/"+Product.lineId+"/hots.json?_="+Math.random(),function(d){
    			$tar.nextAll(".hot").html(template("tpl_hotel_hot",d || {}))
    		});
    		
			var custom = isNew ? 1 : data.custom;
    		if (isNew) {
    			custom == 1;
    		} else if (data.custom != null) {
    			custom = data.custom ? 1 : 0;
    		}
    		ctx.find(":checkbox[value="+custom+"]").attr("checked",true).change();
    		if (data.hotels) {
    			$.each(data.hotels,addItem)
    		}
    		
    	}
    	function addItem(e,data){
    		if(ctx.find(".item").length>4){
    			$.alert("酒店最多添加5个");
    			return false;
    		}
    		var d = data || {};
    		var h = template("tpl_hotel_item",d);
    		ctx.find(".selected").append($(h)).show();
    	}
	}
})(jQuery, window)
