$(window).load(function(){
	// 页面最小高度设置
	$('.sight_main,.sight_left,.sight_right').css('min-height', $('#rightBody').innerHeight()-$('.ct_title_search').innerHeight());
	// 显示操作
	$('.sight_item').hover(function(){
		$(this).find('div#sightOperate').show();
	},function(){
		$(this).find('div#sightOperate').hide();
    })
    $(".sight_list").tooltip({
	      items: ".sight_item",
	      position: { my: "left top",at: "right+5 top-5"},
	      content: function() {
	        var element = $( this ).find("img");
	        var html = "<div class='img'><img style='max-width: 500px' src='"+element.attr("data-original")+"'></div>";
	        if(element.attr("showInfo") == 'true') {
	        	html +=	"<div class='info'>" +
	        		"<P>图片分辨率：" + element.attr("imageWidth") + "*" +  element.attr("imageHeight") + "   " + element.attr("remark") + "</p>" +
    				"<p>用户：" + element.attr("creator") +"   上传时间:："+element.attr("uploadTime")+"</p></div>";
	        }
	        return html;
	      }
	});
});

function recommend(id) {
	$.confirm(
		"确定推荐此图片？", 
		"", 
		function(){
			$.ajax({
				url:"/gallery/"+id + "/recommend?format=json",
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
		"确定取消推荐此图片？", 
		"", 
		function(){
			$.ajax({
				url:"/gallery/"+id + "/cancel-recommend?format=json",
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

function deleteImage(id) {
	$.confirm(
		"确定删除此图片？", 
		"", 
		function(){
			$.ajax({
				url:"/gallery/"+id + "?format=json",
				type: "DELETE",
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

function uploadImage(areaId) {
	if(areaId == undefined || areaId == '') {
		$.gmMessage("请选择一个区域", false);
		return;
	} else {
		var viewPath = "";
		$.ajax({
			url:"/area/"+areaId + "?format=json",
			type: "GET",
			async:false,
			dataType: "json",
			success:function(json){
				viewPath = json.area.viewPath;
				multiUpload('uploadUe', function(t, args){
					window.location.reload();
		        }, "/gallery?format=json&areaId="+areaId+"&operateType=gallerys&_=" + Date.parse(new Date()), viewPath, 100);
			}
		});
	}
}

function updateImage(id) {
	openDialog(
		'/gallery/'+id+'/input', 
		{
		    title   :    '上传图片',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true
		}
	);
}

function auditReject(id) {
	$.confirm(
		"确定拒绝此图片？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/gallery/audition-reject?imageId="+id + "&format=json",
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

function audit(id) {
	updateImage(id);
}