$(function() {
	(function(){
		$("#J_print").on("click",function(){
			var title=document.title;
			document.title="订单详情打印";
			$(".information_content").jqprint({
				operaSupport:false
			});
			setTimeout(function(){document.title=title;},1000);
        });	

        $("#view_contract").on("click",function(){
        	var orderId=$(this).attr("data-id")        //页面数据还没套
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

        
	})(window)
	    
});