/*首页宣传的tab切换*/
function changeStatus(obj1,obj2,obj3,obj4){
	$("."+obj1+" .icon-btn").removeClass(obj1+"-icon").addClass(obj1+"-icon-on");
	$("."+obj1+" dd").addClass("d-on");	
	$("."+obj2+" .icon-btn").addClass(obj2+"-icon").removeClass(obj2+"-icon-on");
	$("."+obj2+" dd").removeClass("d-on");	
	$("."+obj3+" .icon-btn").addClass(obj3+"-icon").removeClass(obj3+"-icon-on");
	$("."+obj3+" dd").removeClass("d-on");	
	$("."+obj4+" .icon-btn").addClass(obj4+"-icon").removeClass(obj4+"-icon-on");
	$("."+obj4+" dd").removeClass("d-on");
	changeTypeImg(obj1);
}
/*获取当前选中项 */
function getImgType(){
	//获取当前选中项
	var typeImg="";
	$(".propaganda-ul").find("li").each(function(){
		var str=$(this).find("div").attr("class");
		var int=str.indexOf("-icon-on");
		var strBtn="icon-btn";
		var strBtnLength="icon-btn".length;
		var jit=str.indexOf("icon-btn");
		type=str.substring(jit+strBtnLength+1,int);
		if(int>0){typeImg=type;}
	});
	return typeImg;
}
/* 获取图片信息 */
function getImgInfo(){
	//获取最后一张图片详细路径
	var imgUrl=$(".p-img-items .p-img-item:eq(2)").find("img").attr("src");
	//获取图片目录
	var jt=imgUrl.lastIndexOf("/");
	var imgFile=imgUrl.substring(0,jt+1);
	//获取最后出现点的索引
	var int=imgUrl.lastIndexOf(".");
	//获取最后一张图片
	var imgLastIndex=parseInt(imgUrl.substring(int-1,int));
	var images={imagesUrl:imgUrl,imagesFile:imgFile,imagesLastIndex:imgLastIndex};
	return images;
}
/* 获取相应图片下的文字说明 */
function imgInfo(obj){
	//获取图片属性
	var images=getImgInfo();
	var text="";
	if(obj=="template"){
		$(".img-info").show();	var text="";
		if(images.imagesLastIndex==3){text="海量数据，自动实现新产品上架与发布";}
		if(images.imagesLastIndex>=6){text="精美Word模板，让您的行程改头换面";}
		$(".img-info span").text(text);
	}
	else{	$(".img-info").hide();	return;	}
}
/*上一组图片 */
function preImg(obj){
	//获取图片属性
	var images=getImgInfo();
	//新图片索引
	var imgIndex=0;
	var j=[];
	var temp=[];
	//修改图片路径
	if(images.imagesLastIndex<=9 && images.imagesLastIndex>=6){
		for(var i=0;i<3;i++){
			imgIndex=parseInt(images.imagesLastIndex-3-i);
			imgUrl=images.imagesFile+obj+imgIndex+".jpg";
			temp[i]=imgUrl;
		}
		j=temp.reverse();
		for(var i=0;i<3;i++){	$(".p-img-items .p-img-item:eq("+i+")").find("img").attr("src",j[i]);	}
	}
	imgInfo(obj);
}
/* 下一组图片 @param obj当前图片所属的选项卡的对象 */
function nextImg(obj){
	//获取图片属性
	var images=getImgInfo();
	//新图片索引
	var imgIndex=0;
	if(obj=="template"){
		if(images.imagesLastIndex<6){
			for(var i=0;i<3;i++){
				imgIndex=parseInt(images.imagesLastIndex+(i+1));
				imgUrl=images.imagesFile+obj+imgIndex+".jpg";
				$(".p-img-items .p-img-item:eq("+i+")").find("img").attr("src",imgUrl);
			}
		}
		imgInfo(obj);
	}
	if(obj=="micro-site"){	return;	}
}
/** 获取选中的选项卡，相应修改图片 */
function changeTypeImg(obj){
	imgInfo(obj);
	if(obj=="plan"){
		$(".p-img-items,.aboutUs-info").hide();
		$(".plan-info").show();
		return;
	}
	if(obj=="aboutUs"){
		$(".p-img-items,.plan-info").hide();
		$(".aboutUs-info").show();
		return;
	}
	else{
		fade();
		$(".p-img-items").show();
		$(".plan-info,.aboutUs-info").hide();
		var url="../../theme/web/default/images/common/index/demo/";
		var imgUrl="";
		for(var i=0;i<3;i++){
			imgUrl=url+obj+(i+1)+".jpg";
			$(".p-img-items .p-img-item:eq("+i+")").find("img").attr("src",imgUrl);
		}
	}
}
/* 淡入淡出*/
function fade(){	$(".p-img-items .p-img-item img").fadeOut(100).fadeIn(600); }
/*隐藏左右切换*/
function arrow(int){
	if(int==1){
		$(".left-icon,.right-icon").show();
		$(".p-imgs").css({"margin-left":"30px","width":"1080px"});
	}else{
		$(".left-icon,.right-icon").hide();
		$(".p-imgs").css({"margin-left":"90px","width":"1020px"});
	}
}
$(function(){
	$(".head").css({"background":"#acd3e4"});
	getImgType();
	changeTypeImg("micro-site");
	arrow(0);
	$(".micro-site").click(function(){
		changeStatus("micro-site","plan","template","aboutUs");
		arrow(0);
	})
	$(".plan").click(function(){
		changeStatus("plan","micro-site","template","aboutUs");
		arrow(0);
	})
	$(".template").click(function(){
		changeStatus("template","plan","micro-site","aboutUs");
		arrow(1);
	})
	$(".aboutUs").click(function(){
		changeStatus("aboutUs","plan","micro-site","template");
		arrow(0);
	})
	//宣传切换图片上一页
	$(".preBtn").click(function(){ preImg(getImgType());  });
	//宣传切换图片下一页
	$(".nextBtn").click(function(){ nextImg(getImgType());	});
	//战略合作伙伴图片切换
	 var pageIndex=1,pageCount=5;
	$(".logo"+pageIndex).siblings().hide();
	$(".pre").click(function(){
		if(pageIndex==1){return;}
		else{
			pageIndex--;
			$(".logo"+pageIndex).siblings().hide();
			$(".logo"+pageIndex).effect("slide",{direction:"left"},"slow");
		}
	});
	$(".next").click(function(){
		if(pageIndex==5){return;}
		else{
			pageIndex++;
			$(".logo"+pageIndex).siblings().hide();
			$(".logo"+pageIndex).effect("slide",{direction:"right"},"slow");
		}
	});
	$("title").text("港马觅途-旅游同业线上营销平台，为旅游企业的网络化运营提供开发、运营、推广、培训等一站式解决方案");
});

