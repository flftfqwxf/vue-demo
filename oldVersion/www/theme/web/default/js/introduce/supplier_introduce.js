$(function(){
    var moneym;
    var remoney;
    var cremoney;
    var mathcl;
    var imgurlsrc;
    var monenysrcmanth=2;
    var moneySrc;


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
             if(index===3){
                $(".btn_three").addClass("animated rotateInDownRight"); 
                $(".title_three").addClass("animated bounceInDown"); 
                $(".item_three").addClass("animated shake");
                $(".box_three_mac").addClass("animated zoomInDown");
                setTimeout(function(){
                    $(".box_three_ipad").show();
                    $(".box_three_ipad").addClass("animated flipInX");
                },300);
                setTimeout(function(){
                    $(".box_three_phone").show();
                    $(".box_three_phone").addClass("animated flipInY");
                },600);              
                setTimeout(function(){
                    $(".btn_three").removeClass("animated rotateInDownRight"); 
                    $(".title_three").removeClass("animated bounceInDown"); 
                    $(".item_three").removeClass("animated shake");
                    $(".box_three_mac").removeClass("animated zoomInDown");
                     $(".box_three_ipad").removeClass("animated flipInX");
                     $(".box_three_phone").removeClass("animated flipInY");
                },1500);
             };
             if(index!==3){
                  $(".box_three_ipad,.box_three_phone").hide();
             }
             if(index===4){
                  $(".btn_four").eq(0).addClass("animated fadeInLeftBig");
                  $(".btn_four").eq(1).addClass("animated fadeInRightBig");
                  $(".title_four").addClass("animated zoomInUp");
                  $(".four_cir").addClass("animated swing");
                  setTimeout(function(){
                     $(".btn_four").eq(0).removeClass("animated fadeInLeftBig");
                  $(".btn_four").eq(1).removeClass("animated fadeInRightBig");
                  $(".title_four").removeClass("animated zoomInUp");
                  $(".four_cir").removeClass("animated swing");
                },1000);  

             };
             if(index===5){
                 $(".title_five").addClass("animated bounceInDown");
                 $(".item_five").addClass("animated bounceInUp");
                 $(".main .box_five ul li").addClass("animated zoomInUp");
                 setTimeout(function(){
                   $(".title_five").removeClass("animated bounceInDown");
                   $(".item_five").removeClass("animated bounceInUp");
                   $(".main .box_five ul li").removeClass("animated zoomInUp");
                },1000); 

             };
             if(index===6){
                 moneySrc="http://static.gmmtour.com/www/theme/web/default/images/introduce/supplier_introduce/six/2.png";  
                 $(".six_mac").show();              
                 $(".title_six").addClass("animated flipInY");
                 $(".item_six").addClass("animated flipInY");
                 $(".six_mac").addClass("animated zoomInUp");
                 setTimeout(function(){
                    $(".six_mac").removeClass("animated zoomInUp");
                     $(".title_six").removeClass("animated flipInY");
                     $(".item_six").removeClass("animated flipInY");
                     $(".box_hj .six_hj").animate({"top":"0px"},"slow")
                },1000);
                 // 钱相关
                mathcl=setInterval(function(){
                    monenysrcmanth=common.math();                    
                },1000);
                imgurlsrc=setInterval(function(){
                    if(monenysrcmanth==="undfind" || monenysrcmanth===""){
                        moneySrc="http://static.gmmtour.com/www/theme/web/default/images/introduce/supplier_introduce/six/5.png";
                    }else{
                        moneySrc="http://static.gmmtour.com/www/theme/web/default/images/introduce/supplier_introduce/six/"+monenysrcmanth+".png";                        
                    }                    
                },2000);
                // console.log(a);                
                cremoney=setInterval(common.creatmoeneynode,2500);
                //移动函数
                moneym=setInterval(common.moneymove,70);
                //删除函数
                remoney=setInterval(common.removemoneynode,30); 
             };
             if(index!==6){
                $(".six_mac").hide();
                $(".box_hj .six_hj").css({"top":"500px"});
                clearInterval(cremoney);
                clearInterval(moneym);
                clearInterval(remoney);
                clearInterval(imgurlsrc);
                clearInterval(mathcl);
                $(".moenyclass").each(function(){  //删除页面的节点
                    $(this).remove();
                });
                moneylist.splice(0,moneylist.length); //并清空保存money的数组。
             }
             if(index===7){
                 $(".title_seven").show();
                $(".title_seven").addClass("animated fadeInDownBig");
                $(".box_seven ul div").eq(0).show();
                $(".box_seven ul div").eq(0).addClass("animated lightSpeedIn");
                setTimeout(function(){
                    $(".box_seven ul div").eq(1).show();
                    $(".box_seven ul div").eq(1).addClass("animated lightSpeedIn");
                },200); 
                setTimeout(function(){
                    $(".box_seven ul div").eq(2).show();
                    $(".box_seven ul div").eq(2).addClass("animated lightSpeedIn");
                },400);
                setTimeout(function(){
                    $(".box_seven ul div").eq(3).show();
                    $(".box_seven ul div").eq(3).addClass("animated lightSpeedIn");
                },600); 
                setTimeout(function(){
                    $(".box_seven ul div").eq(4).show();
                    $(".box_seven ul div").eq(4).addClass("animated lightSpeedIn");
                },800); 
                setTimeout(function(){
                    $(".box_seven ul div").eq(5).show();
                    $(".box_seven ul div").eq(5).addClass("animated lightSpeedIn");
                },1000);
                setTimeout(function(){
                    $(".title_seven").removeClass("animated fadeInRightBig");
                    $(".box_seven ul div").removeClass("animated lightSpeedIn");
                },1500);   

             };
             if(index!==7){
                $(".title_seven").hide();
                $(".box_seven ul div").hide();
             };
             if(index===8){
                $(".title_eight,.item_eight,.main .box_egiht img").show();
                $(".title_eight").addClass("animated rotateInDownRight");
                $(".eight_big_one").addClass("animated tada");
                $(".eight_samll_two,.eight_samll_one,.eight_samll_th,.item_eight").addClass("animated wobble");
                setTimeout(function(){
                    $(".title_eight").removeClass("animated rotateInDownRight");
                    $(".eight_big_one").removeClass("animated tada");
                    $(".eight_samll_two,.eight_samll_one,.eight_samll_th,.item_eight").removeClass("animated wobble");
                },1500); 

             };
             if(index!==8){
                $(".title_eight,.item_eight,.main .box_egiht img").hide();
             };
             if(index===9){
                $(".title_nine").addClass("animated lightSpeedIn");
                $(".item_nine").addClass("animated fadeInLeft");
                $(".g_nine").addClass("animated fadeInRight");
                setTimeout(function(){
                   $(".title_nine").removeClass("animated lightSpeedIn");
                   $(".item_nine").removeClass("animated fadeInLeft");
                   $(".g_nine").removeClass("animated fadeInRight");
                },1500); 
             };
             if(index===10){
                 $(".title_ten").addClass("animated flipInY");
                 $(".main .box_ten ul li").addClass("animated hinge");
                 setTimeout(function(){
                    $(".title_ten").removeClass("animated flipInY");
                   $(".main .box_ten ul li").removeClass("animated hinge");
                },2000);
             };
        },
        onLeave: function(index, direction) {   //当用户离开页面正在过度到新的section的时候触发，
              console.log(direction);
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
   $("#temp_nine").Slide({
        effect: "scroolLoop",
        autoPlay: false,
        speed: "normal",
        chooseNav: 'headlNav',
        individuallyNav: 'individuallyNav',
        timer: 3000,
        steps: 2
    });
   //钱
   
   var moneylist=new Array();
   var six_container=document.getElementById("six_container");
   var common={
         init:function(){
            this.hv();
         },
         creatmoeneynode:function(){
            var moneys=new common.money(parseInt(Math.random()*1000),parseInt(-Math.random()*100),moneySrc,parseInt(Math.random()*10+5));
            moneylist.push(moneys);
         },
         moneymove:function(){
            for(var i=0;i<moneylist.length;i++){
               moneylist[i].move();
            }
         },
         removemoneynode:function(){
            for(var i=0;i<moneylist.length;i++){
               if(parseInt(moneylist[i].imgnode.style.top)>400){
                  six_container.removeChild(moneylist[i].imgnode);
                  moneylist.splice(i,1);
                }
            }
         },
         money:function(x,y,imgsrc,speed,width){   
            this.x=x;
            this.y=y;
            this.imgnode=document.createElement("img");
            this.imgsrc=imgsrc;
            this.speed=speed;
            this.width=width;
            //属性的值
            this.int=function(){
                this.imgnode.src=this.imgsrc;
                this.imgnode.style.position ="absolute";
                this.imgnode.style.left=this.x+'px';
                this.imgnode.style.top=this.y+'px';
                this.imgnode.className="moenyclass";
                six_container.appendChild(this.imgnode);
            }
            //初始化
            this.int();
            //行为
            this.move=function(){
                this.imgnode.style.top=parseInt(this.imgnode.style.top)+this.speed+'px';
            }
         },
         math:function(){
             var a=parseInt(Math.random()*(5-2+1)+2);
             return a;
         },
         hv:function(){
            $(".btn_three,.btn_one,.btn_four").hover(function(){
                $(this).find("span").addClass("animated bounce");
            },function(){
                $(this).find("span").removeClass("animated bounce");
            });
           
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