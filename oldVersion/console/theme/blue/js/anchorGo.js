var userAgent = navigator.userAgent.toLowerCase();
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};
jQuery.fn.anchorGoWhere = function(options){
	var obj = jQuery(this);
	var defaults = {target:0, timer:1000};
	var o = jQuery.extend(defaults,options);
	obj.each(function(i){
		jQuery(obj[i]).click(function(){
			obj.each(function(i){
				jQuery(this).removeClass("on");
			});
			jQuery(this).addClass("on");
			var _rel = jQuery(this).attr("href").substr(1);
			switch(o.target){
				case 1: 
					var _targetTop = jQuery("#"+_rel).offset().top-70;
					jQuery("html,body").animate({scrollTop:_targetTop},o.timer);
					break;
				case 2:
					var _targetLeft = jQuery("#"+_rel).offset().left;
					jQuery("html,body").animate({scrollLeft:_targetLeft},o.timer);
					break;
			}
			return false;
		});                  
	});
};

function getCookie(name){  
    var start = document.cookie.indexOf(name + "=");  
    var len = start + name.length + 1;  
    if ((!start) && (name != document.cookie.substring(0, name.length))) {  
        return null;  
    }  
    if (start == -1) return null;  
    var end = document.cookie.indexOf(';', len);  
    if (end == -1) end = document.cookie.length;  
    return unescape(document.cookie.substring(len, end));  
}  
   
function setCookie(name, value, expires, path, domain, secure) {  
    var today = new Date();  
    today.setTime(today.getTime());  
    if (expires) {  
        expires = expires * 1000 * 60 * 60 * 24;  
    }  
    var expires_date = new Date(today.getTime() + (expires));  
    document.cookie = name+'='+escape(value) +  
        ((expires ) ? ';expires='+expires_date.toGMTString() : '') + //expires.toGMTString()  
        ((path) ? ';path=' + path : '') +  
        ((domain) ? ';domain=' + domain : '') +  
        ((secure) ? ';secure' : '');  
}
$(window).load(function(){
	$("#detail_nav ul li a,#detail_nav_fixed ul li a").anchorGoWhere({target:1});
	window.onscroll = function(){
		var obj_top = document.getElementById("detail_nav").offsetTop;
		var scrollt = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollt >= 500){
			$("#return_top").show();
			var first_show = getCookie("first_show");
			if(!first_show){
				$("#bottom_tip").show();
			} else {
				$("#bottom_tip").hide();
			}
		}else{
			$("#return_top").hide();
			$("#bottom_tip").hide();
		}
		if(scrollt >= obj_top){
			$("#detail_nav_fixed").show();
		}else{
			$("#detail_nav_fixed").hide();
		}
		for(var i = 1; i < 7; i++){
			if(document.getElementById('ct0'+i) && document.getElementById('ct0'+i).offsetTop - scrollt - 90 <= 0){
				$("#detail_nav_fixed ul li a").each(function(i){
					$(this).removeClass("on");
				});
				$("#detail_nav_fixed ul li").find('a[href="#ct0'+i+'"]').addClass("on");
			}
		}
	};
	$('#bottom_close').click(function(){
		$("#bottom_tip").hide();
		setCookie("first_show", "woshinidaye");
	});
});