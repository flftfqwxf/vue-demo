/*
 * gmgallery.js - 图片库选择 - 0.1
 * author : yusz
 * usage : $(".showgallery").gmchosentheme({});
 */
(function($) {
	$.fn.gmchosentheme = function(options) {
		var settings = $.extend({}, {
			debug : true,
			seperator:";"
		}, options);
		var $this = this,$container,$chosenChoices,$choseResults,$choseRecently;
		init();
		bindEvents();
		return this;
		function init(){
			$container = $('<div class="chosen-container chosen-container-multi" style="width:480px;"><ul class="chosen-choices"></ul>'
					+'<div class="chosen-drop"><ul class="chosen-results"><li>正在加载。。。</li></ul><div class="pagination"></div>'
					//+'<ul class="chosen-recentently"><li>正在加载。。。</li></ul>'
					+"</div></div>").insertAfter($this.hide());
			$chosenChoices = $(".chosen-choices",$container);
			$choseResults = $(".chosen-results",$container);
			$choseRecently = $(".chosen-recentently",$container);
			$.each($this.val().split(settings.seperator),function(){
				this !="" && addChosenChoice(this);
			})
			getPaginationPlugin();
			getData();
		}
		function getData(){
			var url = "/tour/theme.json";
			$.getJSON(url,function(d){
				callback(d.themes,$choseResults);
				$container.find(".pagination").pagination({
					dataSource:url,
					locator: 'themes',
					hideWhenLessThanOnePage:true,
					triggerPagingOnInit:false,
					alias:{
						 pageNumber: 'page',
						 pageSize: 'size'
					},
					totalNumber: d.pagination.count,
					pageSize:20,
					beforePaging:function(){
						$tar.html("<li>正在加载...</li>");
					},
					callback:function(data,p){
						callback(data,$choseResults);
					}
				});
			})
			function callback(d,$c){
				var h = "";
				$.each(d,function(){
					h += buildChoiceItem(this);
				})
				$c.html(h);
			}
			/*
			$.getJSON("/user/typing/5.json",function(d){
				callback(d.list,$choseRecently);
			})
			*/
		}
		function setValue(){
			$this.val(function(){
				var v = [];
				$chosenChoices.find("li").each(function(){
					v.push($(this).text())
				});
				return v.join(settings.seperator);
			})
		}
		function bindEvents(){
			$container.on("click",function(){
				$(this).addClass("chosen-with-drop chosen-container-active");
				$(document).off("click.showgmchosen").on("click.showgmchosen",function(e){
					if($(e.target).closest($container).length == 0){
						$container.removeClass("chosen-with-drop chosen-container-active");
						$(document).off("click.showgmchosen");
						setValue();
					}
				})
			}).on("click",".item",function(){
				var $this = $(this);
				if(!$this.hasClass("result-selected") && !isItemSelected($this)){
					addChosenChoice($this.text());
				}
				findResultsByDataid($(this).attr("dataid")).addClass("result-selected")
			}).on("click",".search-choice-close",function(){
				var $item = $(this).closest("li");
				findResultsByDataid($item.attr("dataid")).removeClass("result-selected");
				$item.remove();
				setValue();
				return false;
			})
			
		}
		function findResultsByDataid(dataid){
			return $("li[dataid='"+dataid+"']",$choseResults.add($choseRecently))
		}
		function isItemSelected($item){
			return $("li[dataid='"+$item.attr("dataid")+"']",$chosenChoices).length > 0;
		}
		function addChosenChoice(dataid,text){
			return $chosenChoices.append('<li class="search-choice" dataid="'+dataid+'"><span>'+(text||dataid)+'</span><a class="search-choice-close"></a></li>');
		}
		function buildChoiceItem(data){
			var value = data.content||data.name;
			return '<li class="item" dataid="'+value+'">'+value+'</li>'
		}
		function getScript(url,callback){
			$.ajax({
				  url: url,
				  dataType: "script",
				  async:false,
				  success: callback || $.noop,
				  error: function(){
					  alert(url + "未找到！")
				  }
			});
		}
		function getPaginationPlugin(){
			$.fn.pagination === undefined && getScript(WEB_STATIC_CONSOLE+"/common/plugins/pagination/pagination-with-styles.min.js");
		}
		function log(msg){
			if(settings.debug){
				console.log(msg);
			}
		}
	}
})(jQuery);