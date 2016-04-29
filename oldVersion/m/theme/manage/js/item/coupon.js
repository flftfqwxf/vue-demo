//领取优惠券
function getProCoupon(couponId){
	$.ajax({
		url: '/coupon/receive.json',
		type: 'POST',
		dataType: 'json',
		data:{'couponId':couponId}
	})
	.done(function(data) {
		console.log(data);
	})
	.fail(function() {
		alert('领取失败！请重试');
	});
}

//我所有的优惠券
function getAllCoupon(fn){
	var allCoupon={};
	$.ajax({
		url: '',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		console.log(data);
		allCoupon=data;
	})
	.fail(function() {
		alert('加载失败！请重试');
	});
}
function appendCoupon(data,status){//data:优惠券数据，status：优惠券状态为三种,0:未使用，1：已使用，-1：过期了
	if(status ===0){
		
	}if(status ===1){
		
	}else{
		
	}
}
(function(){
	//产品详情页选择优惠券
	$(".J_coupon").click(function(event) {
		var couponId=parseInt($(this).parent().attr("data-id"));
		//getProCoupon(1);
	});

	$(".coupon_get.J_coupon").click(function(){//优惠券详情 领取或立即使用
		//getProCoupon(1);
	});
	
	//我的，优惠券
	var allCoupon={};
	if($('.tab_item3.active')){
		getAllCoupon(function(allCoupon){
			allCoupon=this.allCoupon;
		});
	}
	//优惠券切换
	$('.tab_item3').click(function(){
		$(".tab .tab_item3").removeClass("active");
		$(this).addClass('active');
		var status=parseInt($(this).attr('data-id'));
		//appendCoupon(allCoupon,status);
	});
	
	var show=false;
	$('.coup_rule').click(function(){//查看优惠券规则
		var $tag=$(this);
		if(!show){
			$tag.find(".rule").show();
			$(this).find(".gmIcon").removeClass('gm-down').addClass('gm-up');
			show=true;
		}else{
			$tag.find(".rule").hide();
			$(this).find(".gmIcon").removeClass('gm-up').addClass('gm-down');
			show=false;
		}
	});
})();