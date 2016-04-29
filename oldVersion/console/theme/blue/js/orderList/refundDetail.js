$(function() {
	(function(){
		$("#view_contract").on("click",function(){
        	var orderId=9        //页面数据还没套
        	var a="http://www.gmmtour.com/contract-order/"
        	$.ajax({
        		type:"GET",
        		url:""+a+""+orderId+"",
        		dataType:"html",
        		async:"false"
        	}).done(function(response){
                $.dialog({
					title: '合同详情',
					width: 800,
					height:560,
					padding : '5px 20px',
					content:response,
					lock: true,
					fixed: true,
					resize: false,		
					init:function(){
						$(".aui_footer").hide();
					}
				});
        	}).fail(function(){
                throw new Error("请求失败");
        	})
		 })
	})()
})