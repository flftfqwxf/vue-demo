function areaOperate(url, title){
    openDialog(url ? url : '/area/input', {
        title   :   title ? title : '添加区域',
        isClose :   false,
        fixed   :   true,
        lock    :   true
    });
}

function areaDel(id){
	$.confirm('确定删除此区域（删除之后与之关联的景点，酒店等数据不能根据此区域来检索）？',"",function(){
		$.ajax({
			url:"/area/"+id + "?format=json&_method=DELETE",
			type: "POST",
			async:false,
			dataType: "json",
			success:function(json){
				showmsg(null, json, 'flush_now');
			}
		});
	},function(){})
}

$(function(){
	$('#addArea').click(function(){
		areaOperate('/area/input?parentId='+$('input[name="areaId"]').val());
	});
	$('#editArea').click(function(){
		var area = $('input[name="areaId"]').val();
		if (!area || area == '' || area == 0) {
			$.gmMessage('请选择一个区域', false);
			return;
		}
		areaOperate('/area/input/'+area, '修改区域');
	});
	
	$('#delArea').click(function(){
		var area = $('input[name="areaId"]').val();
		if (!area || area == '' || area == 0) {
			$.gmMessage('请选择一个区域', false);
			return;
		}
		areaDel(area)
	});
});