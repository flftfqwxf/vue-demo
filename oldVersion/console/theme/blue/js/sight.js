$(function(){
	// 页面最小高度设置
	$('.sight_main,.sight_left,.sight_right').css('min-height', $('#rightBody').innerHeight()-$('.ct_title_search').innerHeight()-$('.ct_title_fff').height());
	// 显示操作
	$('body').on('mouseover','.sight_item, .image_item',function(e){
		$(this).find('div#sightOperate').show();
	}).on('mouseout', '.sight_item, .image_item', function(){
		$(this).find('div#sightOperate').hide();
	});
	
	// 排序选中状态
	if($('#orderWord').hasClass('ord_down')){
		$('#orderWord').hover(function(){
			$(this).removeClass('ord_down').addClass('ord_up');
		},function(){
			$(this).removeClass('ord_up').addClass('ord_down');
		});
	} else if ($('#orderWord').hasClass('ord_up')){
		$('#orderWord').hover(function(){
			$(this).removeClass('ord_up').addClass('ord_down');
		},function(){
			$(this).removeClass('ord_down').addClass('ord_up');
		});
	} else {
		$('#orderWord').hover(function(){
			$(this).addClass('ord_up');
		},function(){
			$(this).removeClass('ord_up');
		});
	}
	
	if($('#orderDate').hasClass('ord_down')){
		$('#orderDate').hover(function(){
			$(this).removeClass('ord_down').addClass('ord_up');
		},function(){
			$(this).removeClass('ord_up').addClass('ord_down');
		});
	} else if($('#orderDate').hasClass('ord_up')){
		$('#orderDate').hover(function(){
			$(this).removeClass('ord_up').addClass('ord_down');
		},function(){
			$(this).removeClass('ord_down').addClass('ord_up');
		});
	} else {
		$('#orderDate').hover(function(){
			$(this).addClass('ord_down');
		},function(){
			$(this).removeClass('ord_down');
		});
	}
	
    $('#btnSave').click(function(){
    	$.unbindbeforeout();
        form.submitForm(false, $("#addForm").attr('action'));
    });
    
//    $('input[name="sight.coordinate"]').focus(function(){
//    	var that = this;
//    	mapCoordinate('mapUe', function(t, e){
//    		$(that).val(e.point.lng + "|" + e.point.lat);
//    	}, $(that).val());
//    });
    initMap($('input[name="sight.coordinate"]'));
});


function singleUpPic(obj, type, sightId) {
	var url = type=='add' ? '/gallery.json?operateType=sightAdd' : '/gallery.json?operateType=sightEdit&holderId=' + sightId;
	simpleUpload(obj, function(data){
        $('.img_up_block').find('img').attr('src', data.url);
        if (type=='add'){
        	$('.img_up_block').find('input[name="sightCoverImage.url"]').val(data.url);
            $('.img_up_block').find('input[name="sightCoverImage.width"]').val(data.width);
            $('.img_up_block').find('input[name="sightCoverImage.height"]').val(data.height);
            $('.img_up_block').find('input[name="sightCoverImage.size"]').val(data.size);
            $('.img_up_block').find('input[name="sightCoverImage.url"]').blur();
        } else {
        	$('.img_up_block').find('input[name="sight.coverImageUrl"]').val(data.url);
            $('.img_up_block').find('input[name="sight.coverImage.id"]').val(data.id);
            $('.img_up_block').find('input[name="sight.coverImage.id"]').blur();
        }
        
    }, url);
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

//多图片上传
function multiUpic(type, sightId) {
	var url = type=='add' ? '/gallery.json?operateType=sightAdd' : '/gallery.json?operateType=sightEdit&holderId=' + sightId;
	multiUpload('uploadUe', function(t, args){
        var imgItem = '';
        $.each(args, function(k, v){
        	if (type=='add'){
        		imgItem  += '<div class="image_item">'
                    +           '<img src="'+ v.src +'" />'
                    +           '<input type="hidden" name="images['+k+'].url" value="'+v.src+'"/>'
                    +           '<input type="hidden" name="images['+k+'].width" value="'+v.width+'"/>'
                    +           '<input type="hidden" name="images['+k+'].height" value="'+v.height+'"/>'
                    +           '<input type="hidden" name="images['+k+'].size" value="'+v.size+'"/>'
                    +           '<div id="sightOperate">'
                    +               '<div class="sight_pic_operate">'
                    +                   '<a href="javascript:deleteImage(\''+k+'\',\''+type+'\')">删除</a>'
                    +               '</div>'
                    +               '<div class="sight_pic_operate_opacity"></div>'
                    +           '</div>'
                    +       '</div>';
        	} else {
        		imgItem  += '<div class="image_item">'
                    +           '<img src="'+ v.src +'" />'
                    +           '<div id="sightOperate">'
                    +               '<div class="sight_pic_operate">'
                    +                   '<a href="javascript:deleteImage(\''+v.data_id+'\',\''+type+'\')">删除</a>'
                    +               '</div>'
                    +               '<div class="sight_pic_operate_opacity"></div>'
                    +           '</div>'
                    +       '</div>';
        	}
        });
        $("#images").append(imgItem);
        updateImageItemIndex(type);
    }, url);
}

function addSight(){
	var area = $('input[name="areaId"]').val();
	if (!area || area == '' || area == 0) {
		$.gmMessage('请选择一个区域',false);
		return;
	}
	window.location.href = '/sight/input?areaId=' + area;
}

function sort(sortParam) {
   $('#sortInput').val(sortParam);
   $('#searchForm').submit();
}

function deleteImage(id, type) {
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

function deleteSight(id) {
	var func_remove = function(){
		$.ajax({
			url:"/sight/"+id + "?format=json",
			type: "DELETE",
			async:false,
			dataType: "json",
			success:function(json){
				showmsg(null, json, 'flush_now');
			}
		});
	}
	
	$.confirm(
			"确定删除此景点？", 
			"确认提示", 
			func_remove, 
			function(){}
		);
	
	
}

function cancelRecommend(id) {
	$.confirm(
		"确定取消推荐？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/sight/"+id + "/cancel-recommend?format=json",
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

function recommend(id) {
	$.confirm(
		"确定推荐此景点？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/sight/"+id + "/recommend?format=json",
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