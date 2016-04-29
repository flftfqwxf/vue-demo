(function($,w){
	var HTML_DECODE = {
		    "&lt;"  : "<",   
		    "&gt;"  : ">",   
		    "&amp;" : "&",   
		    "&nbsp;": " ",   
		    "&quot;": "\"",   
		    "&copy;": "©"  
		};
	var utils = {
			tmpl : function(tpl,data){
				$.each(data,function(k,v){
					tpl = tpl.replace(/{{(\w+)}}/g, function(w){var s=w.substring(1,w.length-1);return data[s]||""})
				})
				return tpl;
			},
			importModule : function(js){
				$.ajax({
					  url: WEB_STATIC_CONSOLE+"/theme/blue/js/"+js+".js",
					  dataType: "script",
					  async: false,
					  success: $.noop,
					  error: function(d){
						  $.gmMessage(js + "未找到！", false);
					  }
				});
			},
			getUrlParam :function(name) {
	            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	            var r = window.location.search.substr(1).match(reg);
	            if (r != null) 
	            	return unescape(r[2]); 
	            return null;
	        },
			decodeHtml : function(s){
				return (typeof s != "string") ? s : 
			          s.replace(/&\w+;|&#(\d+);/g,  
			                    function($0,$1){
			                        var c = HTML_DECODE[$0];
			                        if(c === undefined){
			                            if(!isNaN($1)){
			                                c = String.fromCharCode(($1 == 160) ? 32:$1);
			                            }else{
			                                c = $0;
			                            }
			                        }
			                        return c;
			                    });
			},
			getValue : function(jsonObj,key){
				try{
					return jsonObj[key];
				}catch(e){
				}
			},
			showError: function($tar,msg,pos){
				$tar.validationEngine('showPrompt',msg,'error',pos,true);
			},
			setIndex : function(){
				var pname,idx;
				this.each(function(){
					idx = 0;
					$("[pname]",this).each(function(i){
						var n = $(this).attr("pname");
						if(n != pname){
							idx = 0;
						}
						pname = n;
						$(this).attr("index",++idx);
					})
				})
			},
			getFormData: function(){
				var valid = Product.$form.validationEngine('validate');
				$("textarea",this).each(function(){
					if($(this).is(":hidden")){
						var max = $(this).attr("maxlength") || 2000;
						var $tar = $(this).prev("div.edui-default");
						if($tar.is(":visible")){
							var editor = UE.getEditor($tar.attr("id"));
							if(editor.getContentLength(true)>max){
								utils.showError($tar,"* 最多 "+max+" 个字符");
								valid = false;
								return false;
							}
						}
					}else if($(this).attr("maxlength")){
						if($(this).val().length>$(this).attr("maxlength")){
							utils.showError($(this),"* 最多 "+max+" 个字符");
							valid = false;
							return false;
						}
					}
				})
				if(!valid)
					return false;

				if(window.Placeholders && !Placeholders.nativeSupport)
					Placeholders.disable(Product.$form[0]);
				var data = [], add = !utils.getUrlParam("id");
				$(this).find(":input[name]").each(function(){
					var $t = $(this);
					if($t.is(":hidden")){
						if($t.is(":radio,:checkbox,select,:text"))
							return;
						if($t.is("textarea")){
							var $tar = $(this).prev("div.edui-default");
							if(!$tar.is(":visible")){
								return;
							}
						}
					}
					if($t.is(":radio,:checkbox") && !this.checked)
						return;
					var $p = $t.parents("[pname]");
					var n = $t.attr("name");
					if(n.indexOf("-")>0){
						n = n.replace(/-(\d){13}/,"");
					}
					$p.each(function(){
						n = $(this).attr("pname")+"["+($(this).attr("index")-1)+"]."+n;
					})
//					if(add && n == "id")
//						return;
					data.push({name:n,value:this.value});
				})
				if(window.Placeholders && !Placeholders.nativeSupport)
					Placeholders.enable(Product.$form[0]);
				return data;
			},
			initAutocomplete: function(input,option,callback){
				if(typeof input === "string")
					input = $(input);
				input.autocomplete("/"+input.attr("ac_url")+".json?_="+Math.random(), $.extend({
					minChars: 0,
					clickFire:true,
					requestParamName: "keyword",
					showOthers: false,
					pagination: true,
					hotType: null,
					width:(input.width() > 0)?input.width():"100%",
					extraParams:{lineId:Product.lineId || "",size:100,count:100},
					parse:function(data){
						var parsed = [];
						var rows = $.isArray(data) ? data : data.list;
						if(rows && rows.length){
							for (var i=0; i < rows.length; i++) {
								var row = rows[i];
								parsed.push({
									data: row,
									value: row.name,
									result: row.name
								})
							}
						}
						
						return parsed;
					},
					formatItem: function(row, i, max) {
						if(!row.name)
							return "";
						return row.name;
					}
				},option)).result(callback || $.noop);
			}
	}
	w.Product = w.Product || {};
	w.Product.utils = $.extend({}, w.Product.utils, utils);
})(jQuery,window)

function Class() {
}

Class.extend = function extend(props) {
	var prototype = new this();
	var _super = this.prototype;

	for ( var name in props) {

		if (typeof props[name] == "function"
				&& typeof _super[name] == "function") {

			prototype[name] = (function(super_fn, fn) {
				return function() {
					var tmp = this.callSuper;

					this.callSuper = super_fn;

					var ret = fn.apply(this, arguments);

					this.callSuper = tmp;

					if (!this.callSuper) {
						delete this.callSuper;
					}
					return ret;
				}
			})(_super[name], props[name])
		} else {
			prototype[name] = props[name];
		}
	}

	function Class() {
	}

	Class.prototype = prototype;
	Class.prototype.constructor = Class;

	Class.extend = extend;
	Class.create = Class.prototype.create = function() {

		var instance = new this();

		if (instance.init) {
			instance.init.apply(instance, arguments);
		}

		return instance;
	}

	return Class;
}