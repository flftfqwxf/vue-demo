function deleteTheme(id) {
	$.confirm(
			"确定删除此主题？", 
			"确认提示", 
			function(){
				$.ajax({
					url:"/tour/theme/"+id + "?format=json",
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

function updateTheme(id) {
	openDialog(
		'/tour/theme/'+id+'/input', 
		{
		    title   :    '修改线路主题',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true
		}
	);
}

function addTheme() {
	openDialog(
		'/tour/theme/input', 
		{
		    title   :    '新建线路主题',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true
		}
	);
}
