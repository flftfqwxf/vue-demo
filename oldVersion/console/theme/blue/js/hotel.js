$(function(){
	// 页面最小高度设置
	$('.sight_main,.sight_left,.sight_right').css('min-height', $('#rightBody').innerHeight()-$('.ct_title_search').innerHeight()-$('.ct_title_fff').height());
	// 显示操作
	$('body').on('mouseover','.sight_item, .image_item',function(e){
		$(this).find('div#sightOperate').show();
	}).on('mouseout', '.sight_item, .image_item', function(){
		$(this).find('div#sightOperate').hide();
	});
	initMap($('input[name="hotel.coordinate"]'));
	$('input[name="coordinate"]') && initMap($('input[name="coordinate"]'));
});


function sort(sortParam) {
   $('#sortInput').val(sortParam);
   $('#searchForm').submit();
}

function deleteHotel(id) {
	//id = 19127;
	var func_remove = function(){
		$.ajax({
			url:"/hotel/"+id + "?format=json",
			type: "DELETE",
			async:false,
			dataType: "json",
			success:function(json){
				showmsg(null, json, 'flush_now');
			}
		});
	}
	
	var noProduct = function(){
		$.confirm(
				"确定删除此酒店？", 
				"确认提示", 
				func_remove, 
				function(){}
			)
	}
	var hasProduct = function(list,count){
		var content = (function(list, count){
			
			var html = "<h3>该酒店删除后，将会从以下{count}个行程中消失,请务必谨慎.<br/>删除后不可恢复,是否确认?</h3><ul>".template({"count" : count});
			var productTmp = "<li><a href='/tour/input?id={id}' target='_blank'>{name}</a></li>\n";
			for (var i=0; i < list.length; i++) {
					html += productTmp.template(list[i]);
			}
			html += "</ul>";
			return html;
		})(list, count);
		
		$.confirm(
				content, 
				"确认提示", 
				func_remove, 
				function(){}
			);
		 
	}
	

	$.ajax({
		url : "/tour/byhotel/{id}.json".template({"id": id}),
		dataType : "json",
		success : function(res){
			if (res.list.length > 0) {
				
				hasProduct(res.list, res.count);
			} else {
				noProduct();
			}
		}
	});
	
	
}

function recommend(id) {
	$.confirm(
		"确定推荐此酒店？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/hotel/"+id + "/recommend?format=json",
				type: "POST",
				async:false,
				dataType: "json",
				success:function(json){
					showmsg(null, json, 'flush_now');
				}
			});
		}, 
		function(){}
	)
}

function cancelRecommend(id) {
	$.confirm(
		"确定取消推荐此酒店？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/hotel/"+id + "/cancel-recommend?format=json",
				type: "POST",
				async:false,
				dataType: "json",
				success:function(json){
					showmsg(null, json, 'flush_now');
				}
			});
		}, 
		function(){}
	)
}

function addHotel(areaId) {
	if(areaId == undefined || areaId == '') {
		$.gmMessage("请选择一个区域", false);
		return;
	} else {
		window.location.href = '/hotel/input?areaId=' + areaId;
	}
}


function singleUpPic(obj) {
	var url = '/gallery.json?operateType=hotelAdd';
	simpleUpload(obj, function(data) {
        $('.img_up_block').find('img').attr('src', data.url);
    	$('.img_up_block').find('input[name="coverImage.url"]').val(data.url);
        $('.img_up_block').find('input[name="coverImage.width"]').val(data.width);
        $('.img_up_block').find('input[name="coverImage.height"]').val(data.height);
        $('.img_up_block').find('input[name="coverImage.size"]').val(data.size);
    }, url);
}

function singleUpPicEdit(obj, hotelId) {
	var url = '/gallery.json?operateType=hotelEditCover&holderId=' + hotelId;
	simpleUpload(obj, function(data) {
		window.location.reload();
    }, url);
}

function multipeUpPic() {
	var url = '/gallery.json?operateType=hotelAdd';
	multiUpload('uploadUe',
							function(t, args){
							        var imgItem = '';
							        $.each(args, function(k, v){
							        	imgItem  += '<div class="image_item">'
						                    +           '<img src="'+ v.src +'" />'
						                    +           '<input type="hidden" name="images['+k+'].url" value="'+v.src+'"/>'
						                    +           '<input type="hidden" name="images['+k+'].width" value="'+v.width+'"/>'
						                    +           '<input type="hidden" name="images['+k+'].height" value="'+v.height+'"/>'
						                    +           '<input type="hidden" name="images['+k+'].size" value="'+v.size+'"/>'
						                    +           '<div id="sightOperate">'
						                    +               '<div class="sight_pic_operate">'
						                    +                   '<a href="javascript:deleteImage(\''+k+'\',\'add\')">删除</a>'
						                    +               '</div>'
						                    +               '<div class="sight_pic_operate_opacity"></div>'
						                    +           '</div>'
						                    +       '</div>';
							        });
							        $("#images").append(imgItem);
							        updateImageItemIndex("add");
							        
								}, 
						   url);
}

function multipleUpPicEdit(id) {
	var url = '/gallery.json?operateType=hotelEdit&holderId='+id;
	multiUpload('uploadUe',
							function(t, args){
							        //window.location.reload();
							        var imgItem = '';
							        $.each(args, function(k, v){
							        	imgItem  += '<div class="image_item">'
						                    +           '<img src="'+ v.src +'" />'
						                    +           '<div id="sightOperate">'
						                    +               '<div class="sight_pic_operate">'
						                    +                   '<a href="javascript:deleteImage(\''+v.data_id+'\',\'edit\')">删除</a>'
						                    +               '</div>'
						                    +               '<div class="sight_pic_operate_opacity"></div>'
						                    +           '</div>'
						                    +       '</div>';
							        });
							        $("#images").append(imgItem);
							        updateImageItemIndex("add");
							},
						   url);
}

function deleteImage(id, type) {
	
	$.unbindbeforeout();
	
	$.confirm(
		"确定删除此图片？", 
		"确认提示", 
		function(){
			if(type=='edit'){
				$.ajax({
					url:"/gallery/"+id + "?format=json",
					type: "DELETE",
					async:false,
					dataType: "json",
					success:function(json){
						showmsg(null, json, 'flush_now');
					}
				});
			} else {
				$('#images .image_item:eq('+id+')').remove();
				updateImageItemIndex(type);
			}
		}, 
		function(){}
	)
}

//更新图片列表的name属性
function updateImageItemIndex(type){
	if(type=='add'){
		$.each($('#images .image_item'), function(k,v){
			var that = this;
			$.each($(that).find('input[name*=images]'), function(i, v1){
				$(this).attr('name', $(this).attr('name').replace(/\d+/, k));
			});
			$(this).find('a').attr('href', $(this).find('a').attr('href').replace(/\d+/, k));
		});
	}
}