
//using plugins or packages
jSharp&&jSharp.define(["jquery","dialog"],function(){

	//use use strict
	'use strict';

	//window
	$.fn.window=function(options){
		var content=$(this).html(),
			id=$(this).attr("id")+"_dialog";
			content=$(content).attr("id",id).prop('outerHTML');
			
		$.dialog({
			title:options.title||false,
            width: options.width||"auto",
            height: options.height||"auto",
            padding: 0,
            isOuterBoxShadow:false,
            init:function(){
            	var dialog=$("#"+id).parents(".aui_outer");
            	
            	$(".aui_title div",dialog).remove();
            	
            	if(options.footer==false){
            		$(".aui_footer",dialog).parent().hide();
            	}
            	else if(options.footer&&typeof options.footer=="string"){
            		if(options.title=="景点详情" ||options.title=="酒店详情"){           			                       
            			$(".aui_footer",dialog).parent().hide();
            			$(".aui_title",dialog).append(options.footer);
            		}else{
            			$(".aui_footer",dialog).parent().hide().show();
            			$(".aui_buttons",dialog).html(options.footer);
            		} 
            	}            	
            	if(typeof options.event=="function"){
            		options.event(dialog);
            	}
            	
            	if(options.lock==false){
            		dialog.css("box-shadow","1px 1px 10px #999");
            	}
            },
            content:content,
            lock: (options.lock==false?false:true),
            fixed: true,
            ok: false,
            cancel: function () {
            },
            cancelVal: '关闭',
		})
	};
	
	//showMsg
	$.showMsg=function(msg,type){
		 type=type?type:"danger";
		 var tpl=$('<span class="common-tips btn btn-'+type+'" type="msg" style="visibility: hidden;z-index:999999;">'+
	         		'<i class="gm-icon gm-close"></i>'+msg+
	         	'</span>');
		 if($(".common-tips[type=msg]").size()==0){
			$("body").append(tpl);
			tpl.css({"position":"fixed","top":"3px","left":"50%","margin-left":"-"+(tpl.outerWidth(true)/2)+"px"});
			tpl.css("visibility","visible");
			setTimeout(function(){tpl.fadeOut("slow",function(){tpl.remove();})},3000);
		 }
	};
	
	$.queryString=function(key,url){
		url=(url)?url:location.search;
		if(key!=null&&key!=""&&key!=undefined){
			var value = url.match(new RegExp("[\?\&]" +key + "=([^\&]*)(\&?)","i"));
			return value ? value[1] : value;
		}
		var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g")); 
		if(result==null) return null;
	     for(var i = 0; i < result.length; i++){
	         result[i] = result[i].substring(1);
	     }
	     return result;
	};

	//copy
	$.fn.copy=function(){
		var $this=$(this);
		$this.zclip({
			path:WEB_STATIC+"/common/plugins/zclip/ZeroClipboard.swf",
			copy:function(){
				return $(this).parent().find('input').val();
			},
			afterCopy:function(){
				var $this=$(this);
				$this.html("复制成功");
				setTimeout(function(){
					$this.html("一键复制");
					$this.copy();
				},2000);
			}
		});
	};

	//cookie
	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			// AMD
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			// CommonJS
			factory(require('jquery'));
		} else {
			// Browser globals
			factory(jQuery);
		}
	}(function ($) {

		var pluses = /\+/g;

		function encode(s) {
			return config.raw ? s : encodeURIComponent(s);
		}

		function decode(s) {
			return config.raw ? s : decodeURIComponent(s);
		}

		function stringifyCookieValue(value) {
			return encode(config.json ? JSON.stringify(value) : String(value));
		}

		function parseCookieValue(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape...
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}

			try {
				// Replace server-side written pluses with spaces.
				// If we can't decode the cookie, ignore it, it's unusable.
				// If we can't parse the cookie, ignore it, it's unusable.
				s = decodeURIComponent(s.replace(pluses, ' '));
				return config.json ? JSON.parse(s) : s;
			} catch(e) {}
		}

		function read(s, converter) {
			var value = config.raw ? s : parseCookieValue(s);
			return $.isFunction(converter) ? converter(value) : value;
		}

		var config = $.cookie = function (key, value, options) {

			// Write

			if (value !== undefined && !$.isFunction(value)) {
				options = $.extend({}, config.defaults, options);

				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setTime(+t + days * 864e+5);
				}

				return (document.cookie = [
					encode(key), '=', stringifyCookieValue(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path    ? '; path=' + options.path : '',
					options.domain  ? '; domain=' + options.domain : '',
					options.secure  ? '; secure' : ''
				].join(''));
			}

			// Read

			var result = key ? undefined : {};

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			var cookies = document.cookie ? document.cookie.split('; ') : [];

			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = parts.join('=');

				if (key && key === name) {
					// If second argument (value) is a function it's a converter...
					result = read(cookie, value);
					break;
				}

				// Prevent storing a cookie that we couldn't decode.
				if (!key && (cookie = read(cookie)) !== undefined) {
					result[name] = cookie;
				}
			}

			return result;
		};

		config.defaults = {};

		$.removeCookie = function (key, options) {
			if ($.cookie(key) === undefined) {
				return false;
			}

			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return !$.cookie(key);
		};

	}));
});

