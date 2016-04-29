$(function(){



    $("#fullpage").fullpage({
        sectionsColor: ['#ff8b48', '#f3f3f3', '#ffffff', '#f3f3f3','#ffffff','#f3f3f3','#00000','#f3f3f3','#ffffff'],
        fixedElements:"#header",     //将导航条的位置进行定位在顶部，配合CSS
        continuousVertical:true,    //是否循环滚动，注意与 loopTop 及 loopBottom 不兼容
        navigation:true,   //设置圆点
        scrollOverflow:true, //需使用slimscroll.js才会生效
        //配置回调函数
        afterLoad:function(anchorLink, index){ //页面加载完成和scroll（滚动）停止后触发
             if(index===1){
                $(".btn_one").addClass("animated rollIn"); 
                $(".title_one").addClass("animated zoomInDown"); 
                $(".item_one").addClass("animated lightSpeedIn");
                $(".box_one>.box_one_imge").addClass("animated fadeInDown"); 
                $(".box_one>.box_one_imga,.box_one>.box_one_imgb,.box_one>.box_one_imgc,.box_one>.box_one_imgd").addClass("animated bounceOut"); 
                setTimeout(function(){
                	$(".btn_one").removeClass("animated rollIn");
                	$(".title_one").removeClass("animated zoomInDown"); 
                    $(".item_one").removeClass("animated lightSpeedIn");
                    $(".box_one>.box_one_imge").removeClass("animated fadeInDown"); 
                    $(".box_one>.box_one_imga,.box_one>.box_one_imgb,.box_one>.box_one_imgc,.box_one>.box_one_imgd").removeClass("animated bounceOut"); 
                },1000);        
             };
             if(index===2){
             	$(".title_two").addClass("animated bounceInLeft");
             	$(".item_two").addClass("animated bounceInRight");
                $(".trademark_one").addClass("animated bounceIn");
                setTimeout(function(){
                    $(".trademark_two").addClass("animated bounceIn");
                },300);
                setTimeout(function(){
                    $(".trademark_three").addClass("animated bounceIn");
                },600);
                setTimeout(function(){
                    $(".trademark_four").addClass("animated bounceIn");
                },900);
                setTimeout(function(){
                    $(".trademark_five").addClass("animated bounceIn");
                },1200);
                setTimeout(function(){
                	$(".title_two").removeClass("animated bounceInLeft");
             	    $(".item_two").removeClass("animated bounceInRight");
                    $(".trademark_one,.trademark_two,.trademark_three,.trademark_four,.trademark_five").removeClass("animated bounceIn");
                },1500);
             };
             var mathsl;
             if(index===3){
                $(".title_three").addClass("animated bounceInDown"); 
                $(".item_three").addClass("animated shake");
                $(".box_three").addClass("animated bounceIn");

                setTimeout(function(){
                    $(".title_three").removeClass("animated bounceInDown"); 
                    $(".item_three").removeClass("animated shake");
                    $(".box_three").removeClass("animated bounceIn");
                    $(".box_three_x1").animate({"width":"266px"},"slow");
                    $(".box_three_x2").animate({"width":"191px"},"slow");
                    $(".box_three_x3").animate({"width":"83px"},500);
                    $(".box_three_plne").animate({"top":"50px","opacity":"1","left":"660px"},500);
                },1000);
                mathsl=setInterval(function(){
                    var l=common.math();
                    $(".three_dd_"+l+"").addClass("select").siblings(".three_dd").removeClass("select");
                },1500);

             };
             if(index!==3){
                $(".box_three_plne").css({"top":"130px","opacity":"0","left":"570px"});
                  $(".box_three_x1,.box_three_x2,.box_three_x3").css("width","0px");
                  clearInterval(mathsl);
             }
             if(index===4){
                $(".btn_four").addClass("animated rotateInDownRight"); 
                $(".title_four").addClass("animated bounceInDown"); 
                $(".item_four").addClass("animated shake");
                $(".box_four_mac").addClass("animated zoomInDown");
                setTimeout(function(){
                    $(".box_four_ipad").show();
                    $(".box_four_ipad").addClass("animated flipInX");
                },300);
                setTimeout(function(){
                    $(".box_four_phone").show();
                    $(".box_four_phone").addClass("animated flipInY");
                },600);              
                setTimeout(function(){
                    $(".btn_four").removeClass("animated rotateInDownRight"); 
                    $(".title_four").removeClass("animated bounceInDown"); 
                    $(".item_four").removeClass("animated shake");
                    $(".box_four_mac").removeClass("animated zoomInDown");
                     $(".box_four_ipad").removeClass("animated flipInX");
                     $(".box_four_phone").removeClass("animated flipInY");
                },1500);  

             };
             if(index!==4){
                  $(".box_four_ipad,.box_four_phone").hide();
             }
             if(index===5){
                 $(".title_five").addClass("animated bounceInDown");
                 $(".item_five").addClass("animated bounceInUp");
                 $(".box_five").addClass("animated zoomInDown");
                 setTimeout(function(){
                   $(".five_pa,.five_pb,.five_pc,.five_pd").addClass("animated rotateIn");                  
                 },800);
                 setTimeout(function(){
                   $(".title_five").removeClass("animated bounceInDown");
                   $(".item_five").removeClass("animated bounceInUp");
                   $(".box_five").removeClass("animated zoomInDown");
                   $(".five_pa,.five_pb,.five_pc,.five_pd").removeClass("animated rotateIn"); 
                   
                },1500); 

             };
             if(index===6){              
                 $(".title_six").addClass("animated flipInY");
                 $(".six_li").eq(0).show().addClass("animated zoomInDown");
                setTimeout(function(){
                    $(".six_li").eq(1).show().addClass("animated zoomInRight");
                },300);
                setTimeout(function(){
                     $(".six_li").eq(2).show().addClass("animated zoomInLeft");
                },600);
                setTimeout(function(){
                     $(".title_six").removeClass("animated flipInY");
                     $(".six_li").removeClass("animated zoomInDown");
                },1000);
                $(".six_co_b .co_aimg_1").hover(function(){
                     $(this).addClass("animated shake").siblings("img").addClass("animated wobble");
                },function(){
                     $(this).removeClass("animated shake").siblings("img").removeClass("animated wobble");
                });
                $(".six_co_c .co_aimg_1").hover(function(){
                     $(this).addClass("animated shake").siblings("img").addClass("animated wobble");
                },function(){
                     $(this).removeClass("animated shake").siblings("img").removeClass("animated wobble");
                });
                $(".six_co_a .co_aimg_2").hover(function(){
                     $(this).addClass("animated shake");
                },function(){
                     $(this).removeClass("animated shake");
                });
               
             };
             if(index!==6){
                $(".six_li").hide();
             };
             if(index===7){
                $(".title_seven").addClass("animated lightSpeedIn");
                $(".item_seven").addClass("animated fadeInLeft");
                $(".g_seven").addClass("animated fadeInRight");
                setTimeout(function(){
                   $(".title_seven").removeClass("animated lightSpeedIn");
                   $(".item_seven").removeClass("animated fadeInLeft");
                   $(".g_seven").removeClass("animated fadeInRight");
                },1500);    

             };
             if(index===8){
                $(".title_eight,.item_eight,.main .box_egiht img").show();
                $(".title_eight").addClass("animated rotateInDownRight");
                $(".eight_big_one").addClass("animated tada");
                $(".eight_big_two").addClass("animated bounceInDown");
                $(".eight_samll_two,.eight_samll_one,.eight_samll_th,.item_eight").addClass("animated wobble");
                setTimeout(function(){
                    $(".title_eight").removeClass("animated rotateInDownRight");
                    $(".eight_big_one").removeClass("animated tada");
                     $(".eight_big_two").removeClass("animated bounceInDown");
                    $(".eight_samll_two,.eight_samll_one,.eight_samll_th,.item_eight").removeClass("animated wobble");
                },1500); 

             };
             if(index!==8){
                $(".title_eight,.item_eight,.main .box_egiht img").hide();
             };
             if(index===9){
                 $(".title_nine").addClass("animated flipInY");
                 $(".main .box_nine ul li").addClass("animated hinge");
                 setTimeout(function(){
                    $(".title_nine").removeClass("animated flipInY");
                   $(".main .box_nine ul li").removeClass("animated hinge");
                },2000);
             };
        },
        onLeave: function(index, direction) {   //当用户离开页面正在过度到新的section的时候触发，
              // console.log(direction);
        },
        afterRender:function(){  //页面初始化完成后的回调函数
                $(".btn_one").addClass("animated rollIn"); 
                $(".title_one").addClass("animated zoomInDown"); 
                $(".item_one").addClass("animated lightSpeedIn");
                $(".box_one>.box_one_imge").addClass("animated fadeInDown"); 
                $(".box_one>.box_one_imga,.box_one>.box_one_imgb,.box_one>.box_one_imgc,.box_one>.box_one_imgd").addClass("animated bounceOut");
                $(".box_one>.box_one_imgd"); 
                setTimeout(function(){
                	$(".btn_one").removeClass("animated rollIn");
                	$(".title_one").removeClass("animated zoomInDown"); 
                    $(".item_one").removeClass("animated lightSpeedIn");
                    $(".box_one>.box_one_imge").removeClass("animated fadeInDown"); 
                    $(".box_one>.box_one_imga,.box_one>.box_one_imgb,.box_one>.box_one_imgc,.box_one>.box_one_imgd").removeClass("animated bounceOut"); 
                },1000)
                 // 加入左右轮播字体图标(第四屏)
                 $("div.slider-nav span.left").html('').html('<i class="fa fa-angle-left"></i>');
                 $("div.slider-nav span.right").html('').html('<i class="fa fa-angle-right"></i>');              
        }
    });
    //第九屏的轮播
   $("#temp_seven").Slide({
        effect: "scroolLoop",
        autoPlay: false,
        speed: "normal",
        chooseNav: 'headlNav',
        individuallyNav: 'individuallyNav',
        timer: 3000,
        steps: 2
    });
   var common={
         init:function(){
            this.hv();
         },
         hv:function(){
            $(".btn_three,.btn_one,.btn_four").hover(function(){
                $(this).find("span").addClass("animated bounce");
            },function(){
                $(this).find("span").removeClass("animated bounce");
            });
           
         },
         math:function(){
             var a=parseInt(Math.random()*(8-1+1)+1);
             return a;
         }

   };
   common.init();

    // canvas
    (function(t){
       $("#contanier").height($("#section_one").height())
       var _DENSITY = 20, _FPS = 30, _OPACITY = .5;
	    t.fn.effect = function () {
	        var i = this;
	        return t(i).children().each(function () {
	            var i = this, o = Math.round(1 / t(i).offset().top * (t(window).height() / 2 + t(window).scrollTop()) * 100) / 100;
	            t(i).find(".effect").css({opacity: o >= 1 ? 1 : 0})
	        }), this
	    }
	    t.fn.engine = function () {
	        for (var i = this, o = _DENSITY, n = _FPS, e = Math.round(window.devicePixelRatio ? window.devicePixelRatio : 1), h = [], a = t(i).find(".animation").get(0), d = a.getContext("2d"), r = function () {
	            a.width = t(i).width() * e, a.height = t(i).height() * e, d.clearRect(0, 0, a.width, a.height), t(h).each(function () {
	                var t = this, i = _OPACITY - _OPACITY / (a.width / 2) * Math.abs(a.width / 2 - t.position.x), o = _OPACITY - _OPACITY / (a.height / 2) * Math.abs(a.height / 2 - t.position.y);
	                d.beginPath(), d.arc(t.position.x, t.position.y, t.speed.x * t.speed.y % (50 * e) + 10 * e, 0 * Math.PI, 2 * Math.PI), d.globalAlpha = o >= i ? i : o, d.fillStyle = "rgba(" + t.color.r + ", " + t.color.g + ", " + t.color.b + ", 1)", d.fill(), d.closePath(), t.position.x = ((t.speed.x % 2 ? t.position.x + t.speed.x / n : t.position.x - t.speed.x / n) + a.width) % a.width, t.position.y = ((t.speed.y % 2 ? t.position.y + t.speed.y / n : t.position.y - t.speed.y / n) + a.height) % a.height
	            })
	        }; o--;)h.push({
	            position: {
	                x: Math.round(1e6 * Math.random()) % (t(i).width() * e),
	                y: Math.round(1e6 * Math.random()) % (t(i).height() * e)
	            },
	            speed: {x: Math.round(1e6 * Math.random()) % (50 * e), y: Math.round(1e6 * Math.random()) % (50 * e)},
	            color: {
	                r: Math.round(1e6 * Math.random()) % 64 + 192,
	                g: Math.round(1e6 * Math.random()) % 64 + 192,
	                b: Math.round(1e6 * Math.random()) % 64 + 192
	            }
	        });
	        return r(), setInterval(function () {
	            r()
	        }, 1e3 / n), t(window).bind("load resize scroll", function () {
	            {
	                var o = Math.round(100 * (1 - 2 / t(i).height() * t(window).scrollTop())) / 100;
	                Math.round(t(i).height() / 2 - t(i).find(".content").height() / 2 - t(window).scrollTop() / 4)
	            }
	            t(i).find(".animation").css({opacity: o >= 0 ? o : 0})
	        }), this
	    }
	    $("#contanier").engine();
    })(jQuery)
	     
    
})