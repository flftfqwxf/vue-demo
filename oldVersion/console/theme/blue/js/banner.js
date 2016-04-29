function deleteImage(id) {
	$.confirm(
		"确定删除此图片？", 
		"", 
		function(){
			$.ajax({
				url:"/banner/" + id + "?format=json",
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
	
$(function() {
	$("#touristlineType").change(function(){
		var val = $(this).val();
		$.ajax({
			url: "/line-by-type/" + val + ".json" ,
			type: "GET",
			async:false,
			dataType: "json",
			success:function(json){
				$("#touristlineId").html("").append('<option value="">全部专线</option>');
				var list = json.list;
				for(var i = 0 ; i < list.length ; i++){
					$("#touristlineId").append('<option value="'+list[i].id+'">'+list[i].name+'</option>');
				}
			}
		});
	});
});