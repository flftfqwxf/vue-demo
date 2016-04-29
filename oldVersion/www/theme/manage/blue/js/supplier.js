function submitForm(url,dataType,data,callback){
	$.ajax({
		url: url,
		dataType: dataType || "json",
		data: data,
		success: function(d) {
			if (d.supplier && !d.supplier.background) {
				var msg = $.gmMessage("操作失败", false);
			} else {
				var msg = $.gmMessage("操作成功",true);
				callback && callback(d);
			}
		},
		error: function(xhr) {
			var msg = $.gmMessage("保存失败，请稍后重试");
		}
	});
	
}

//新版提示动画
function moveRight(){
	$("#J-version-new").animate({"right":"20px"},2000,function(){
		moveLeft();
	});
}
function moveLeft(){
	$("#J-version-new").animate({"right":"60px"},2000,function(){
		moveRight();
	})
}
$("#J-version-new").hover(function(){
	$("#J-version-new").pause();
	$("#J-version-new .words").stop(true,true).slideDown("slow");
},function(){
	$("#J-version-new").resume();
	$("#J-version-new .words").stop(true,true).slideUp("slow");
});
moveLeft();


//专线溢出处理
var tabOverFlow={
	init:function(){
		
		//初始化
		var width=0,
			fixedWidth=796;
		$(".supplier-plans .nav-tabs li").each(function(i){
			width+=$(this).outerWidth(true);
			$(this).attr("page",parseInt(width/fixedWidth));
		});
		
		if(width>fixedWidth){
			$(".supplier-plans .nav-tabs").width(fixedWidth*(width%fixedWidth>0?(parseInt(width/fixedWidth)+1):parseInt(width/fixedWidth))+"px");
		}
		if(width>fixedWidth) $(".supplier-plans .new-nav").addClass("overflow");
		
		//设置最大页数
		$(".supplier-plans .nav-tabs").attr("page",$(".supplier-plans .nav-tabs li:last").attr("page"));
		
		var currentPage=$(".supplier-plans .nav-tabs li.active").attr("page"),
			maxPage=parseInt($(".supplier-plans .nav-tabs").attr("page"));
		
		currentPage=parseInt(currentPage?currentPage:0);
		tabOverFlow.tabShowPage(currentPage,false);
		
		//翻页事件
		$(".supplier-plans .action a").click(function(){
			
			if($(this).attr("action")=="next"){
				//下一页
				if(currentPage>=maxPage) return false;
				currentPage++;
			}
			else{
				//上一页
				if(currentPage<=0) return false;
				currentPage--;
			}
			
			tabOverFlow.tabShowPage(currentPage);
		});
	},
	tabShowPage:function(page,animate){
		animate=(animate==undefined?true:animate);
		
		var margin=-parseInt($(".supplier-plans .nav-tabs").css("margin-left")),
			ml=0,
			first=$(".nav-tabs li[page=0]:first").offset().left,
			maxPage=parseInt($(".supplier-plans .nav-tabs").attr("page"));
		
		ml=($(".nav-tabs li[page="+page+"]:first").offset().left-first);
		if(animate) {
			$(".nav-tabs").animate({"margin-left":"-"+ml+"px"});
		}
		else{
			$(".nav-tabs").css({"margin-left":"-"+ml+"px"});
		}
		
		//按钮样式处理
		if(page==maxPage) $(".action a[action=next]").addClass("disabled");
		else $(".action a[action=next]").removeClass("disabled");

		if(page==0) $(".action a[action=prev]").addClass("disabled");
		else $(".action a[action=prev]").removeClass("disabled");
	}
}


tabOverFlow.init();

$(function(){
	var supplierDialog = function(options) {
		var api, wrap, defaults = {
				id: 'supplierDialog',
		        //title: false,
		        isClose: true,
		        fixed: true,
		        lock: true,
		        minWidth: 120,
		        padding: "0",
		        content:"加载中...",
		        init: function(here){
		            api = this;
		            wrap = api.DOM.wrap;
		            wrap.find('.aui_content').css({
		                    'min-width':'120px',
		                    'text-align': 'center'
		            });
		            wrap.find('.aui_main').css({
		            	'padding-top': '0px'
		            });
		        },
		        close: function(){
		        	wrap.find('.aui_content').removeAttr("style");
		        	wrap.find('.aui_main').removeAttr("style");
		        	if (myDialog._clip) {
		        		myDialog._clip.destroy();
		        		myDialog._clip = null;
		        	}
		        }
		}, _supplierDialog = artDialog.get('supplierDialog');
		if (_supplierDialog) {
			_supplierDialog.close();
		}
		_supplierDialog = $.dialog($.extend(defaults, options));
		return _supplierDialog;
	}, myDialog, $backImgShow = $("#supplierBackgroundImg"), 
	oldBackImgShow = $backImgShow.html(),
	oldType = $(":input[type='radio']:checked").val();
	$(".supplier-cert-img img").each(function() {
		var height = 54;
		var image = $(this);
		if(image.height() > height) {
			image.height(height);
			image.width(height/image.height()*image.width());
		}
	});
	// 保存系统图片
	function saveSystemImage() {
		var url = $("#background").attr("supplier-url");
		var $selected = $("#background").find('li.selected img');
		if($selected.length == 0) {
			var msg = $.gmMessage("请选择一张背景图");
			return false;
		}
		submitForm(url +"/background.jsonp?image="+ $selected.attr("data-src"), "jsonp", null, function(d){
			$(".supplier-background").css({'background-image':'url("'+d.supplier.background+'")'});
			$("#background .imagebar li.old-selected").removeClass("old-selected");
			$("#background .imagebar li img[data-src='"+d.supplier.background+"']").parent("li").addClass("old-selected");
			oldType = $(":input[type='radio']:checked").val();
			$backImgShow.html("上传的背景图片将显示在这里");
			oldBackImgShow = $backImgShow.html();
		});
		myDialog.close();
	}
	// 取消系统图片
	function cancelSystemImage() {
		$("#background .imagebar li.selected").removeClass("selected");
		$("#background .imagebar li.old-selected").addClass("selected");
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		myDialog.close();
	}
	// 保存上传图片
	function saveUploadImage() {
		var url = $("#background").attr("supplier-url");
		var $imgObj = $backImgShow.find("#showSupplierBackground");
		if(!$imgObj || ($imgObj && $imgObj.length == 0)) {
			var msg = $.gmMessage("请上传背景图");
			return false;
		}
		submitForm(url +"/background.jsonp?image="+ $imgObj.attr("data-src"), "jsonp", null, function(d){
			$(".supplier-background").css({'background-image':'url("'+d.supplier.background+'")'});
			oldType = $(":input[type='radio']:checked").val();
			$("#background .imagebar li.selected").removeClass("selected");
			$("#background .imagebar li.old-selected").removeClass("old-selected");
		});
		
		/**add by zlm**/
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		debugger;
		myDialog.close();
	}
	// 上传图片模式－取消按钮
	function cancelUploadImage() {
		$backImgShow.html(oldBackImgShow);
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		myDialog.close();
	}
	$(document).on("click", ".nav-tabs > li", function() {
		var self = $(this);
		if (self.hasClass(".active")) {
			return;
		}
		self.addClass('active').siblings().removeClass('active');
		var lineId = self.attr('data-line-id');
		$("input[name=line]").val(lineId);
		subform();

	}).on("click", "#setBackground", function(){
		myDialog = supplierDialog({
			title: "主题背景",
			content: $("#background") && $("#background").length && $("#background")[0],
			//width:930,
			//height:490,
			zIndex: 200,
			button: [
				{
					name: "取消",
					callback: function() {
						if (this._bar == "uploadbar") {
							cancelUploadImage.call(this);
						} else {
							cancelSystemImage.call(this);
						}
					}
				},
				{
					name: "保存",
					className: "btn btn-process",
					callback: function(){
						// 系统图片的保存按钮.
						if ($(".supplier_dialog .radio-group .active input").val() == "uploadbar") {
							saveUploadImage.call(this);
						} else {
							saveSystemImage.call(this);
						}
					}
				}
			]
		});
		inituploadpic();
	})/*.on("click", "#background .imagebar:visible ~.buttonbar .cancel", function(){
		// 系统图片的取消按钮.
		$("#background .imagebar li.selected").removeClass("selected");
		$("#background .imagebar li.old-selected").addClass("selected");
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		myDialog.close();
	}).on("click", "#background .imagebar:visible ~.buttonbar .save", function(){
		// 系统图片的保存按钮.
		var url = $("#background").attr("supplier-url");
		var $selected = $("#background").find('li.selected img');
		if($selected.length == 0) {
			var msg = $.gmMessage("请选择一张背景图");
			return false;
		}
		submitForm(url +"/background.jsonp?image="+ $selected.attr("data-src"), "jsonp", null, function(d){
			$(".supplier-background").css({'background-image':'url("'+d.supplier.background+'")'});
			$("#background .imagebar li.old-selected").removeClass("old-selected");
			$("#background .imagebar li img[data-src='"+d.supplier.background+"']").parent("li").addClass("old-selected");
			oldType = $(":input[type='radio']:checked").val();
			$backImgShow.html("上传的背景图片将显示在这里");
			oldBackImgShow = $backImgShow.html();
		});
		myDialog.close();
	}).on("click", "#background .uploadbar:visible ~.buttonbar .cancel", function(){
		// 从电脑上传图片的取消按钮.
		$backImgShow.html(oldBackImgShow);
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		myDialog.close();
	}).on("click", "#background .uploadbar:visible ~.buttonbar .save", function(){
		// 从电脑上传图片的保存按钮.
		var url = $("#background").attr("supplier-url");
		var $imgObj = $backImgShow.find("#showSupplierBackground");
		if(!$imgObj || ($imgObj && $imgObj.length == 0)) {
			var msg = $.gmMessage("请上传背景图");
			return false;
		}
		submitForm(url +"/background.jsonp?image="+ $imgObj.attr("data-src"), "jsonp", null, function(d){
			$(".supplier-background").css({'background-image':'url("'+d.supplier.background+'")'});
			oldType = $(":input[type='radio']:checked").val();
			$("#background .imagebar li.selected").removeClass("selected");
			$("#background .imagebar li.old-selected").removeClass("old-selected");
		});
		
		//add by zlm*
		$("input[value='"+oldType+"']").attr("checked", "checked").trigger("change");
		
		myDialog.close();
	})*/.on("click", "#background .imagebar li", function(){
		$(this).siblings(".selected").removeClass("selected");
		$(this).addClass("selected");
	}).on("click", "#shareLink", function(){
		myDialog = supplierDialog({
			title: "分享",
			content: $("#share") && $("#share").length && $("#share")[0],
			//width:800,
			//height:416,
			zIndex: 999,
			button: [
				{
					name: "复制主页地址",
					className: "btn btn-process copy-button",
					callback: function() {}
				}
			]
		});
		var clip = new ZeroClipboard( $(".copy-button") );
		myDialog._clip = clip;
		clip.on( "ready", function( readyEvent ) {
		  clip.on( "copy", function( event ) {
		    clip.setText(location.href);
		  });
		});
		// 设置url
		$("#share").find("input").val(window.location.href);
	})/*.on("click", "#share .buttonbar .save", function(){
		myDialog.close();
	})*/.on("change", "#background .radio-group input[name='type']", function(){
		$(".picture").hide();
		$("."+$(this).val()).show();
		/***add by zlm***/
		if(uploadtabcheck){
			inituploadpic();
		}
		 /*****end*****/
	}).on("click", ":input[type='file']", function(){
		
	}).on("mouseenter", "td [show-title]", function(d){
		_title = $(this).attr('show-title');
    $("body").append('<div id="tooltip"><pre style="white-space: pre-wrap!important;break-word:break-all;word-wrap:break-word;">' + _title + "</pre></div>"); //创建提示框,添加到页面中
    $("#tooltip").css({
      left: (d.pageX + 30) + "px",
      top: d.pageY + "px"
    }).show() //设置提示框的坐标，并显示
	}).on("mouseleave", "td [show-title]", function(d){
		//this.title = _title; //重新设置title
    $("#tooltip").remove() //移除弹出框
	}).on("mousemove", "td [show-title]", function(d){
		$("#tooltip").css({
		  left: (d.pageX + 30) + "px",
		  top: d.pageY + "px"
		});
	}).on("click", "#share input", function() {
		this.select();
	});
	
	
	$("#background .option :input[type='radio']:checked").trigger("change");
	$("#background .option :input[type='radio']").on("change", function() {
		myDialog && (myDialog._bar = this.value);
	});
	
	$(".j_gm-wrong").click(function(){
		$(".fixbottom").hide();
	});
});