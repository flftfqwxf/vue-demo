$(function() {
	 $(window).scroll(function(e){
	    var top = window.pageYOffset || document.documentElement.scrollTop || 0;               
        if (1000<=top && top<=1450) {
		     $(".art").show();
		     $(".art li").eq(0).siblings("li").find("a").removeClass("active");
		     $(".art li").eq(0).find("a").addClass("active");
		}
		if(1500<=top && top<=2000){
			$(".art").show();
			$(".art li").eq(1).siblings("li").find("a").removeClass("active");
		    $(".art li").eq(1).find("a").addClass("active");
		}
		if(top>2300){
			$(".art").show();
			$(".art li").eq(2).siblings("li").find("a").removeClass("active");
		    $(".art li").eq(2).find("a").addClass("active");
		}
		if(top<900){
           $(".art").hide();
		}
    });
	 $(".art li a").on("click",function(){
	 	$(this).addClass("active").parent("li").siblings("li").find("a").removeClass("active");
	 })
})
