//判断是否是IE8

function checkIE(){
	var browser=navigator.appName
	var b_version=navigator.appVersion
	var version=b_version.split(";");
	var trim_Version=version[1].replace(/[ ]/g,"");
	if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")
	{
		$(".mask").hide();
		$(".phone").mouseover(function(){
			$(".mask").show();
			$(".mask").css({"background":"transparent url('/theme/manage/blue/images/black.png')","color":"white"});
			$(".qrcodeInfo").css({
				"margin-top":"410px",
				"margin-left":"20px"
			});
			$("#qrcode table").css({
				"border":"1px solid white",
				"height":"160px",
				"width":"160px",
				"margin-top":"0px",
				"margin-left":"0px"				
				});
		});
		$(".phone").mouseout(function(){
			$(".mask").hide();
		});
		return false;
	}
}

$(".redpacket-alert a").click(function(){
    $(".redpacket-alert").remove();
});

$(function(){
			$(".nav_li").removeClass("on");
			$(".nav_li:eq(0)").addClass("on");
			$(".menu_li").removeClass("on");
			$(".menu_li:eq(1)").addClass("on");
			$(".phone").mouseover(function(){
					$(".mask").css({
						"opacity":1,
						"background": "rgba(0,0,0,0.8)",
						"color":"white",
						"border":'none',
					});
					$(".qrcodeInfo").css({
						"margin-top":"438px",
						"margin-left":"20px"
					});
					$("#qrcode").css({						
						"height":"270px",
						"width":"270px",
						"margin-top":"-200px",
						"margin-left":"-20px"				
						});
				});
				$(".phone").mouseout(function(){
					$(".mask").css({
						"opacity":0
					});
				});
				var flag=checkIE();
				if(!flag){
					return;
				}
})