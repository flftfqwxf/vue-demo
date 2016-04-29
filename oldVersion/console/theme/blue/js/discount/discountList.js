$(function(){


});
var common={
	init:function(){
        this.cir();
	},
	art:function(json){
        $.dialog({
			title: '统计',
			width: 600,
			height:"auto",
			padding : '5px 10px',
			content:'',
			lock: true,
			fixed: true,
			resize: false,
			cancelVal:"关闭",
			cancel:function(){
				$(".aui_content").removeClass("scroll");
			},
		    init:function(){
	        	 $(".aui_content").html(template("stat",json)).addClass("scroll");
        	}
		})
	},
	cir:function(){
		var date=new Date();
		$(".status").each(function(){
			var _self=$(this);
			// if(_self.html().trim()==="已停止" && )
		})
	}
}
common.init();
// 统计测试数据
var json={
	result:{
		a:50,
		b:30,
		c:150,
		d:200,
		content:[
		   {"e":"2016.3.1",f:"未使用",g:"1000000",h:"----",j:"18683572847",k:"零上20度"},
		   {e:"2016.3.1",f:"未使用",g:"1000000",h:"----",j:"18683572847",k:"零上20度"},
		   {e:"2016.3.1",f:"未使用",g:"1000000",h:"----",j:"18683572847",k:"零上20度"},
		   {e:"2016.3.1",f:"未使用",g:"1000000",h:"----",j:"18683572847",k:"零上20度"},
		   {e:"2016.3.1",f:"未使用",g:"1000000",h:"----",j:"18683572847",k:"零上20度"}
		]
	}
}


function stat(id){	//统计     
	$.ajax({
		url:"111",
		type:"GET",
		async:false,
		dataType:"json",
		success:function(json){
		   if(json){


		   }				
		},
		error:function(){
			common.art(json);
			alert("错误");
		}
	}); 
}


function start(id){ //开始发放
	var star=$.confirm("领券中心及优惠券相关产品会显示领券入口，确认开始发放？","确认提示", function(){
		$.ajax({
			url:"111",
			type:"GET",
			async:false,
			dataType:"json",
			success:function(json){
			   if(json){


			   }				
			},
			error:function(){
				alert("错误");
			}
	    });
		star.close();
	},function(){
		//取消
	});

}


function pause(id){ //暂停发放
	var pau=$.confirm("领券中心及优惠券相关产品将隐藏领券入口，用户不能继续领取，已领取的劵任可使用。是否确认？","确认提示", function(){
		$.ajax({
			url:"111",
			type:"GET",
			async:false,
			dataType:"json",
			success:function(json){
			   if(json){


			   }				
			},
			error:function(){
				alert("错误");
			}
	    });
		pau.close();
	},function(){
		//取消
	});

}