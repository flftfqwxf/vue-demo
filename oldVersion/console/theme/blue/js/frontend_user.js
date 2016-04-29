function sort(sortParam) {
   $('#sortInput').val(sortParam);
   $('#searchForm').submit();
}

function disable(id) {
	$.confirm(
		"停用后，该用户将无法登录，但其相关数据不会被删除", 
		"停用账户", 
		function(){
			$.ajax({
				url:"/user/"+id + "/disable?format=json",
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

function resume(id) {
	$.confirm(
		"确定启用此账户？", 
		"启用账户", 
		function(){
			$.ajax({
				url:"/user/"+id + "/resume?format=json",
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

function view(id){
	$.ajax({
		url:'/user/'+id,
		type: "GET",
		async:false,
		dataType: "html",
		success:function(resch){
			var dialog = $.dialog({
		        title: '用户详情',
		        width:450,
		        height: 'auto',
		        padding: '0px 0px 4px 0px',
		        isOuterBoxShadow: false,
		        isClose: false,
		        content: resch,
		        lock: true,
		        fixed: true,
		        button: [
					{
						name:'删除账户',
						callback: function () {
							$.confirm(
								"该用户所有资料、信息均被删除，且不可恢复，请慎重！", 
								"删除账户", 
								function(){
									$.ajax({
										url:"/user/"+id + "?format=json&_method=DELETE",
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
							return false;
						},
						cssClass:'btn-sm-common'
					}
		        ],
		        
		        cancel: function () {},
		        cancelVal: '关闭',
		        cancelCssClass: 'btn-cancel'
		    });
		}
	});
}