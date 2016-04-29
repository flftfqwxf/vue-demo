(function($,w){
	var textWidth=0, $iframe = $("#previewFrame"), category = $("#background ul").attr("background-category"), // 背景图分类 
		$p;// 背景图分页
	//$("#preview_ctn").load("/common/4/4.html");
	$(document).on("click",".setText",function(){
		$dialog.dialog("open");
		$("#dialog_txt input").select($("#dialog_txt input").val().length, 0);
	}).on("click",".next_btn,.mod_btn",function(){
		$.unbindbeforeout();
		var oPosition = $text.position(), iWidth = $text.parent().width(), iHeight = $text.parent().height();
		var sLeft = oPosition.left/iWidth, sTop = oPosition.top/iHeight;
		param.title = $text.text();
		param.titleMargin = "left:"+(sLeft*100)+"%;top:"+(sTop*100)+"%";
		//reloadFrame();
		if($(this).is(".mod_btn")){
			var data = {
					title:param.title,
					titleMargin:param.titleMargin,
					"template.id":param.templateId,
					"background.id":param.backgroundId
			}
			var dialog = $.dialog({
				isClose: false,
			    title: false,
			    lock:true,
			    zIndex:12000,
			    content: '正在提交，请稍候。。。'
			});
			$.post("/shop/",data,function(d){
				if (d.result && !d.result.success) {
					$.gmMessage(d.result.message, true);
				} else {
					$.gmMessage("设置已保存",true);
				}
			}).fail(function(){
				$.gmMessage("保存失败，请稍后重试");
			}).always(function(){
				dialog.close()
			})
		}else{
			next();
		}
	}).on("click",".bar a",function(){
		var $this = $(this);
		if($this.is(".current"))
			return false;
		$this.addClass("current");
		var $old = $this.siblings(".current").removeClass("current");
		$("#"+$old.attr("rel")).slideUp();
		$("#"+$this.attr("rel")).slideDown(function(){
			$(this).trigger("show");
		});
		if($this.attr("rel") == "background") {
			if (!category) {
				category = $(".category :input[name='category']:first").val();
			}
			$(".category :input[name='category'][value='"+category+"']").click();
			if(!$("input[name='backgroundId']").val()) {
				$("[key]:first","#background").click();
			} else {
				$("[key]:eq("+(param.backgroundId-1)+")","#background").click();
			}
		}
	}).on("click","[key]",function(){
		var $this = $(this), key = $this.attr("key"), tid = $this.attr("tid");
		if($this.hasClass("selected"))
			return false;
		$this.closest("ul").find(".selected").removeClass("selected");
		$this.addClass("selected");
		$this.prev('.unselected').addClass("selected");
		param[key] = tid;
		if(key == "templateId" && !$("input[name='backgroundId']").val()){
			param.backgroundId = $this.attr("bid");
		} else if (key == "templateId") {
			$('#background').find('a[tid='+param.backgroundId+']').addClass('selected');
			$('#background').find('a[tid='+param.backgroundId+']').prev('.unselected').addClass('selected');
		}
		reloadFrame();
	}).on('click', '.unselected', function(){
		var $this = $(this), key = $this.next('a').attr("key"), tid = $this.next('a').attr("tid");
		if($this.hasClass("selected"))
			return false;
		$this.closest("ul").find(".selected").removeClass("selected");
		$this.addClass("selected");
		$this.next('a').addClass("selected");
		param[key] = tid;
		if(key == "templateId" && !$("input[name='backgroundId']").val()){
			param.backgroundId = $this.next('a').attr("bid");
		} else if (key == "templateId") {
			$('#background').find('a[tid='+param.backgroundId+']').addClass('selected');
			$('#background').find('a[tid='+param.backgroundId+']').prev('.unselected').addClass('selected');
		}
		reloadFrame();
	}).on("click", ".category :input[name='category']", function(){
		category = $(this).val();
		initBackground.call($("#background"));
	});
	
	var $dialog = $("#dialog_txt").dialog({
		//appendTo:$form,
		position: { my: "center top", at:"center top",of:"#main"},
		autoOpen : false,
		dialogClass: "dialog_custom",
		modal : true,
		width : 400
	}).on("click",".save_btn",function(){
		var txt = $dialog.find("input").val();
		txt=txt.replace(/\s/g,'&nbsp;');
		$text.html(txt).trigger("show");
		$("#setTextDescr").text("修改文本");
		$dialog.dialog("close");
	});
	var sUrl = "http://m.gmmtour.com/preview?",param={},
	$text = $("#text").draggable({ containment: "parent" }).on("show",textOnShow).on("mousedown",function(){
		$("#msg").hide();
		$.bindbeforeout();
	});//拖动文本框
	function initBackground(){
		var $ul = $("ul",this), $t =this;
		if($p && $p.length) {
			$p.pagination("destroy");
		}
		$p = $(".pagination",this).pagination({
			dataSource:"/shop/background-list.json?category=" + (encodeURI(category) || "") + "&_=" + new Date(),
			locator: 'backgrounds',
			triggerPagingOnInit: true,
			className: 'paginationjs-theme-blue',
			//hideWhenLessThanOnePage: true,
			alias:{
				pageNumber: 'page',
				pageSize: 'size'
			},
			getTotalPageByResponse: function (data) {
				return data.pagination.pageCount;
			},
			pageSize:param.pageCount || 10,
			beforePaging:function(){
				$ul.html("<li>正在加载...</li>");
			},
			afterPaging:function(){
				$t.trigger("show");
			},
			callback:function(data,p){
				var sHtml = "";
				var bid = $ul.attr('background-selected');
				$.each(data,function(){
					sHtml += '<li><img src="'+this.image+'@130w" /><img src="/theme/manage/blue/images/mset-selected.png" class="unselected'+(bid==this.id ? " selected":"")+'" /><a key="backgroundId" view="'+this.color+'" tid="'+this.id+'" '+(bid==this.id ? "class='selected'":"")+'>选择</a></li>'
				});
				$ul.html(sHtml);
			}
		});
		this.on("show",function(){
			$p.width("100%").width($p.find(".paginationjs-pages").width())
		});
	}
	
	function textOnShow(){
		if($.trim($text.text()) == ""){
			$text.hide();
			$("#msg").hide();
		}else{
			$text.show();
			var oPosition = $text.offset();
			var $tar = $("#msg").show().css({left:oPosition.left,top:oPosition.top+$text.height()+20});
		}
	}
	
	function reloadFrame(){
		var url = sUrl;
		$.each(param,function(k,v){
			if(k!='title')
				url += "&"+ k + "=" + escape(v).replace(/%A0/g, "%20");
		})
		$iframe.attr("src", url + "&_=" + Math.random());
	}
	
	function next(){
		var url = "/shop/setup?";
		$.each(param,function(k,v){
			url += "&"+ k + "=" + escape(v).replace(/%A0/g, "%20");
		})
		window.location.href=url;
	}
	
	$("input[name]:hidden").each(function(){
		param[this.name] = this.value;
	});
	if(param.templateId){
		param.pageCount = 10;
		reloadFrame();
		textOnShow();
	}else{
		$("[key]:first","#template").click();
	}
	//$.bindbeforeout();
})(jQuery,window);

function log(){
	if(!window.console) {
	    window.console = {};
	    console.log = function() {};
	}
    console.log.apply(console, arguments);
}