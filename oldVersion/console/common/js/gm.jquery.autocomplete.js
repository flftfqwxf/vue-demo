(function($) {
	$.fn.gmAutoComplete = function(options) {
		var settings = $.extend({}, {
			uri : "/area-select?keyword=",  // 获取数据的请求地址
			nothingClear : false,   // 当输入为找到结果是否重置为上一次或为空。
			lineSet : false , // 是否获取专线限定
			lineObjId : "touristLineId",  // 获取专线限定对象的ID属性名
			def_data : {},  // 默认附件数据 
			callback : null,  // 点击列表中对象时的回调函数
			noDataButCall : null,
		}, options);
		var $self = this;
		if(!$self || $self == null || !$self.get(0) || $self.get(0) == null){
			return;
		}
		var dataReq = true,$queryDiv,firstInit=true,isInput = true,toID = $self.attr("toid");
		_init();
		function _init() {
			isInput = ($self.get(0).tagName.toLowerCase() == "input" || $self[0].type.toLowerCase() == "text" || $self[0].type.toLowerCase() == "hidden");
			$self.attr("autocomplete", "off");
			_setShowDiv();
			// 添加层内事件
			_setQueryDivEme();
			// 添加属性或值改变事件
			$self.on('valuechange', function (e, previous) {
				_setFindObj(settings.def_data, true);
			});
		}
		function _setFindObj(data, addkw){
			if(dataReq){
				dataReq = false;
				var inputV,url;
				if(settings.lineSet && null != settings.lineObjId && "" != settings.lineObjId){
					var lineId = $("#"+settings.lineObjId).val();
					data.lineId = lineId;
				}
				if($queryDiv.is(":hidden")){
					$queryDiv.css({
						"left": $self.left?$self.left:0+"px",
						"top" : ($self.top*1+$self.height()*1)+"px"
					}).show();
				}
				if(addkw){
					inputV = isInput?$self.val():$self.text();
					url = settings.uri + encodeURIComponent(inputV);
				}else{
					url = settings.uri;
				}
				$.ajax({
					url: url,
					type:"GET",
					async:false,
					data : data,
					dataType: "html",
					success:function(objData, textStatus, jqXHR){
						var loginStatus = jqXHR.getResponseHeader('sessionstatus');
						if (loginStatus === 'timeout'){
							showmsg(null, eval("(" + objData + ")"));
							return;
						}
						$queryDiv.html(objData);
						if(!settings.nothingClear){
							$self.parent().find(".nodata_add").each(function(){
								$(this).show();
							});
						}
						dataReq = true;
					}
				});
			}
		}
		function _setQueryDivEme(){
			$self.on("focus", function(e){
				var lineId = "";
				if(settings.lineSet){
					lineId = $("#"+settings.lineObjId).val();
				}
				var old_line = $queryDiv.attr("line_id");
				// 设置记录默认显示的有效值
				if((!$("#"+toID).attr("show_text") || null == $("#"+toID).attr("show_text") || "" == $("#"+toID).attr("show_text") || "undefined" == $("#"+toID).attr("show_text"))){
					$("#"+toID).attr("show_text", isInput?$self.val():$self.text());
				}
				if(firstInit ){
					if("" == $queryDiv.html() || null == $queryDiv.html()){
						_setFindObj(settings.def_data, false);
						if(settings.lineSet){
							$queryDiv.attr("line_id", lineId);
						}
						firstInit = false;
					}
				}else if(settings.lineSet && lineId != old_line && "" != lineId && null != lineId){
					_setFindObj(settings.def_data, false);
					$queryDiv.attr("line_id", lineId);
				}else{
					$queryDiv.show();
				}
			});
			// 选择时事件逻辑
			$self.on("blur", function(){
				_resetValue();
			});
			$self.parent().on("focus", ".input_query_li", function(e){
				$queryDiv.show();
			});
			$self.parent().on("mouseover", ".input_query_li", function(){
				$self.unbind("blur");
			});
			$self.parent().on("mouseout", ".input_query_li", function(){
				$self.on("blur", function(){
					_resetValue();
				});
			});
			$self.parent().on("click", ".input_query_li", function(e){
				if(isInput){
					$self.val($(this).text());
				}else{
					$self.text($(this).text());
				}
				$("#"+toID).val($(this).attr("key"));
				$("#"+toID).attr("show_text", $(this).text());
				$self.focus();
				$queryDiv.hide();
				if(settings.callback){
					settings.callback($(this).attr("key"),$(this).text());
				}
			});
			$self.parent().on("focus", ".top_type_li", function(e){
				$queryDiv.show();
			});
			$self.parent().on("mouseover", ".top_type_li", function(){
				$self.unbind("blur");
			});
			$self.parent().on("mouseout", ".top_type_li", function(){
				$self.on("blur", function(){
					_resetValue();
				});
			});
			$self.parent().on("click", ".top_type_li", function(e){
				var data_kt = {keytype: $(this).attr("attr_t")};
				data_kt = $.extend({}, settings.def_data,data_kt);
				_setFindObj(data_kt, false);
				$self.focus();
			});
			$self.parent().on("focus", ".no_datas_but", function(e){
				$queryDiv.show();
			});
			$self.parent().on("mouseover", ".no_datas_but", function(){
				$self.unbind("blur");
			});
			$self.parent().on("mouseout", ".no_datas_but", function(){
				$self.on("blur", function(){
					_resetValue();
				});
			});
			$self.parent().on("click", ".no_datas_but", function(e){
				if(settings.noDataButCall){
					settings.noDataButCall(isInput?$self.val():$self.text());
				}
				$self.focus();
				$queryDiv.hide();
			});
		}
		function _resetValue(){
			var setV = $("#"+toID).val();
			var showInputV = isInput?$self.val():$self.text();
			var hideShowText = $("#"+toID).attr("show_text");
			if(null == showInputV || "" == showInputV){
				$("#"+toID).attr("show_text", "");
				$("#"+toID).val("");
				hideShowText = "";
			}
			if(hideShowText != showInputV){
				if(settings.nothingClear){
					if((!hideShowText || null == hideShowText || "" == hideShowText || "undefined" == hideShowText)){
						$("#"+toID).val("");
						isInput?$self.val(""):$self.text("");
					}else{
						if(null == setV || "" == setV){
							isInput?$self.val(""):$self.text("");
							hideShowText = "";
							$("#"+toID).attr("show_text", hideShowText);
						}
						isInput?$self.val(hideShowText):$self.text(hideShowText);
					}
				}else{
					$("#"+toID).val("");
					$("#"+toID).attr("show_text", showInputV);
				}
			}
			$queryDiv.hide();
		}
		function _setShowDiv(){
			$queryDiv = $("<div></div>");
			var z = getMaxZIndex($self, 0);
			$self.parent().css("position", "relative");
			$queryDiv.css({"position" : "absolute","display" : "none","z-index" : z*1+10});
			$self.parent().append($queryDiv);
		}
	}
})(jQuery);