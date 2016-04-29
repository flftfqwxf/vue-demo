(function($, w) {
	var ctx = $("#step1").on("hide", function() {
		Product.utils.setIndex.call($(this));
		var data = Product.utils.getFormData.call(this);
		if($("#coverImageId").val()==""){
			Product.utils.showError($("#coverImage"),"请选择一张封面图片！");
			data = false;
		}
		return data;
	}).on("show", function() {
		$("#btnSave").text("下一步");
	}).on("click",".add_destination",addDestination)
	.on("click",".del_destination",function(){
		$(this).closest(".place_item").remove();
		addDestination();
		
	}).on("click",".del_file",function(){
		$(this).closest(".attachment_item").remove();
	})
	function addDestination(idx,d){
		if($("#destinations").find(".place_item").length>14){
//			$.alert("目的地最多添加15个");
			$(".add_destination").hide();
			return false;
		}else{
			$(".add_destination").show();
		}
		var h = template("tpl_destination_item",d || {});
		initAc($(h).insertBefore("#destinations .bottom"));
	}
	function initAc(c){
		Product.utils.initAutocomplete($(".ac_area",c || ctx).attr("ac_url","area-select"),{hotType:null},function(e,d){
			$(this).prev("input").val(d && d.id || "");
		});
	}
	Product.step1 = {
		init : function(data) {
			//lineId = Product.utils.getValue(data,"product.touristLine.id");
			$("#touristLineId").attr("disabled", false).change(function() {
				var $this = $(this),v = Product.lineId || this.value,$other = $("#other_info");
				/*
				if(Product.lineId && Product.lineId !=v){
					$.confirm(
							"您修改了专线信息，<br/>必须清空已填写的全部数据才能生效，是否确认？", 
							"确认提示", 
							function(){
								$other.add("#step2,#step3").empty();
								Product.lineId = v;
								$this.change();
							}, 
							function(){$this.val(Product.lineId);}
						)
					return false;
				}
				Product.lineId = v;
				*/
				$other.empty().html(template('tpl_other_info', data)).slideDown();
				//initAc();
				//$.each(data.destinations||[false],addDestination);
				
				$("textarea",ctx).each(function(){
					var id = "brightSpot"+$.now();
					$(this).attr("id",id);
					initUEditor(id,false,false,Product.lineId,650);
				});
				$("#upload_img_but").gmgallery({touristLineId:v,multiSelect:false,onOk:function(image){
					$("#coverImage").attr("src",image.url).next("input").val(image.id);
				}})
				
				$.getJSON(Product.path + '/line/play/' + v + ".json?_="+Math.random(), function(res){
		            	var options = "<option value=''>请选择线路</option>";
		            	var playList = res.list;
		            	for(var i = 0; i < playList.length; i++){
		            		options += '<option value="'+playList[i].id+'">'+playList[i].name+'</option>';
		            	}
		            	$('#playOptionId').html(options).val(data.playOption && data.playOption.id);
		            });
			})
			if(Product.lineId){
				$("#touristLineId").val(Product.lineId).change().closest(".row").hide();
			}
		}
	}
})(jQuery, window)
