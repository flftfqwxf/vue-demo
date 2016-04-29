$(function(){
	$(".status").each(function(e){
		var _self=$(this);
		if(_self.html().trim()==="已过期"){
              _self.next(".tc").find(".btn_info").eq(1).attr("href","javascript:void(0)").addClass("disabled_status")
		}
	})
})
function del(id){	
    var delInfo=$.confirm("确定删除？","确认提示", function(){
		$.ajax({
			url:"/activity/"+id,
			type:"DELETE",
			async:false,
			dataType:"json",
			success:function(json){
				
				if(json.result.success===true){
                    window.location.reload();
				}else{
                    alert(json.result.message);
				}
				
			},
			error:function(){
				alert("错误");
			}
		});
		delInfo.close();
	},function(){
		//取消
	});
}