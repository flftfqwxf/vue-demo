function lineOperate(url, title){
	var thisUrl = url ? url : '/line/input';
	if(thisUrl.indexOf("?") != -1){
		thisUrl = thisUrl + "&t="+Math.floor(Math.random()*10+1);
	}else{
		thisUrl = thisUrl + "?t="+Math.floor(Math.random()*10+1);
	}
    var lineView = openDialog(thisUrl, {
        title   :   title ? title : '添加专线',
        isClose :   false,
        fixed   :   true,
        lock    :   true,
        zIndex  :   99
    },'flush_now' ,function(){
    	$("#touristLinePlay .play_li_content").each(function(i){
    		$(this).find(".playid").attr("name", "playOption["+i+"].id");
    		$(this).find(".playname").attr("name", "playOption["+i+"].name");
    	});
    	return true;
    });
}

function lineDel(id){
	$.confirm('确定删除此专线（不可恢复）？',"确认提示",function(){
		$.ajax({
			url:"/line/"+id + "?format=json&_method=DELETE&t=" + Math.floor(Math.random()*10+1),
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
	// TODO
});