$(window).load(function(){
	// 页面最小高度设置
	$('.sight_main,.sight_left,.sight_right').css('min-height', $('#rightBody').innerHeight()-$('.ct_title_search').innerHeight());
	// 显示操作
	$('.sight_item').hover(function(){
		$(this).find('div#sightOperate').show();
	},function(){
		$(this).find('div#sightOperate').hide();
    });
});

function deleleLocalFeature(id) {
	$.confirm(
		"确定删除此当地特色？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/local-feature/"+id + "?format=json",
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

function recommend(id) {
	$.confirm(
		"确定推荐此当地特色？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/local-feature/"+id + "/recommend?format=json",
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
		"确定取消推荐此当地特色？", 
		"确认提示", 
		function(){
			$.ajax({
				url:"/local-feature/"+id + "/cancel-recommend?format=json",
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

function selectType(typeId) {
	$('#typeInput').val(typeId);
    $('#searchForm').submit();
}

function manageType() {
	openDialog(
		'/local-feature/type', 
		{
		    title   :    '分类管理',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true,
		    isClearBtn : true,
		    button : [
				{
					name:"关闭",
					callback:function(){},
					cssClass: 'btn-cancel'
				}
            ]
		}
	);
}

function updateType(id) {
	openDialog(
		'/local-feature/type/'+id+'/input', 
		{
		    title   :    '分类管理',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true,
		    isClearBtn : true,
		    button : [
						{
							name:"关闭",
							callback:function(){},
							cssClass: 'btn-cancel'
						}
		            ]
		}
	);
}

function deleteType(id) {
	$.confirm(
			"确定删除此类别？", 
			"确认提示", 
			function(){
				$.ajax({
					url:"/local-feature/type/"+id + "?format=json",
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

function addLocalFeature(areaId) {
	if(areaId == undefined || areaId == '') {
		$.gmMessage("请选择一个区域", false);
		return;
	} else {
		openDialog(
				'/local-feature/input?areaId='+areaId, 
				{
				    title   :    '新建当地特色',
				    isClose :   false,
				    fixed   :   true,
				    lock    :   true
				}
			);
	}
}

function updateLocalFeature(id) {
	openDialog(
		'/local-feature/'+id+'/input', 
		{
		    title   :    '修改当地特色',
		    isClose :   false,
		    fixed   :   true,
		    lock    :   true
		}
	);
}
