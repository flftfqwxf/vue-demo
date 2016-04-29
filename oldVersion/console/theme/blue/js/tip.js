$(window).load(
		function() {
			// 页面最小高度设置
			$('.sight_main,.sight_left,.sight_right').css(
					'min-height',
					$('#rightBody').innerHeight()
							- $('.ct_title_search').innerHeight());
		});

function deleteTip(id) {
	var func_remove = function() {
		$.ajax({
			url : "/tip/" + id + "?format=json",
			type : "DELETE",
			async : false,
			dataType : "json",
			success : function(json) {
				showmsg(null, json, 'flush_now');
			}
		});
	}

	
	var hasProduct = function(list,count){
		var content = (function(list, count){
			var html = "<h3>该旅游提示删除后，将会从以下{count}个行程中消失,请务必谨慎.<br/>删除后不可恢复,是否确认?</h3><ul>".template({"count" : count});
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
		//console.log(content);
	}
	
	$.ajax({
		url : "/tour/bytip/{id}.json".template({"id": id}),
		dataType : "json",
		success : function(res){
			if (res.list.length > 0) {
				hasProduct(res.list, res.count);
			} else {
				$.confirm('确定删除此旅游提示（不可恢复）？', "确认提示", func_remove, function() {});
			}
		}
	});
}

function updateTip(id) {
	openDialog('/tip/' + id + '/input', {
		title : '修改旅游提示',
		isClose : false,
		fixed : true,
		lock : true
	});
}

function addTip(areaId) {
	if (areaId == undefined || areaId == '') {
		$.gmMessage("请选择一个区域", false);
		return;
	} else {
		openDialog('/tip/input?areaId=' + areaId, {
			title : '新建旅游提示',
			isClose : false,
			fixed : true,
			lock : true,
			zIndex : 90
		});
	}
}