/*
 * gmgallery.js - 图片库选择 - 0.2
 * author : wfq 2015-10-13
 * usage : $(".showgallery").gmgallery({});
 */
(function($) {
	var areajson = null;
	var reloadsystem = false;
	var imageTypeTemp = null;
	$.fn.gmgallery = function(options) {
		var settings = $.extend({}, {
			url : "/gallery/search.json?format=json",
			touristLineId : "", //专线ID
			touristLineObj : null,  // 专线对象
			imageType: "", // 获取图片类型
			imageTypeObj: null, // 获取图片类型
			pageSize : 12,
			width : 755,
			imgTooltipMaxWidth : 500,//图片预览最大宽度px
			maxFileSize : 2,//上传文件的最大尺寸M
			maxAreaDisplay : 3,
			onlyOneArea : true,//只选择一个区域
			showArea : true,//是否显示上传图片时的区域选择
			multiSelect : true,//支持图片多选
			onOk : $.noop,//回调函数（选中的图片）
			debug : false,
			zIndex : 1000,
			options_id:0,
			operateType: 'other_image', // 上传图片的类型
			isResetInit: false,  // 状态监控， 是否改变了专线
			alwaysReInit:false, //是否总是重新初始化
			clearKeyWord:false,//清空搜索词
			showUploadBut : true, // 是否显示
			showUserUploadList : true, // 是否显示自己上传列表
			selfListUrl : "/gallery/uploaded.json?format=json", // 默认显示自己上传列表的链接
			uploadUrl : "/gallery/save-image.json"
		}, options);
		var spe = 0,inited = false, getError = false, $tab, $dialog, $activeTab;
		init();
		return this.off("click.gmgallery").on("click.gmgallery",function(){
			if (getError) {
				initPagination(true);
			}
			_getTouristLineId();  // 点击时重置专线编号和初始化状态。
			if(inited && (settings.isResetInit||settings.alwaysReInit)){
		    	settings.isResetInit = false;
		    	initPagination(true);
	    	}
			if(inited && null != $dialog.html() && "" != $dialog.html()){
				$("li.imglist.selected",$dialog).removeClass("selected");
				$dialog.dialog("open");
				setDialogPosition($dialog);
				//add by zlm
				if(uploadtabcheck){
					inituploader();
				}
				return false;
			}
			inited = true;
			var h = '<ul><li><a index=0 href="#galleryTabSystem">系统图库</a></li>';
			h += (settings.showUserUploadList ? '<li><a index="1" href="#galleryTabuploaded">我上传的图片</a></li>' : '');
			h += '</ul>';
			var c = '<div class="searchdiv" style="top:5px;right:20px;position:absolute"><input class="serach-images-input" placeholder="搜索城市、景点"/><button class="button search_btn_">搜索</button></div>';			
			
			c += "<div id='galleryTabSystem'><ul class='gallery_thumbnails'></ul><div class='pagination'></div></div>";
			if (settings.showUserUploadList) {
				c += "<div id='galleryTabuploaded'><ul class='gallery_thumbnails'></ul><div class='pagination'></div></div>";
			}
			
			h += c;
			
			$tab.html(h).tabs({
				active : 0,
				create : function( event, ui ) {
					log("created..");
					$activeTab = ui.panel;
					initPagination();
				},
				beforeActivate : function(event,ui){
					$activeTab = ui.newPanel;
					var $tar = $(".searchdiv",$dialog);
					if (settings.showUserUploadList) {
						if ($activeTab.is("#galleryTabuploaded")) {
							$tar.hide();
						} else {
							$tar.show();
						}
					}
					/***add by zlm***/
					if(imageTypeTemp && _getQueryImageType()!=imageTypeTemp){
						initPagination(true);
					}else{
						initPagination();
					}
					_getQueryImageType(true);
					/***end***/
				}
			});
			$dialog.empty().append($tab).dialog('open').parent().css({zIndex:((settings.zIndex && settings.zIndex > 1000)?settings.zIndex:1010)});
		});
		
		function _getTouristLineId() {
			if( settings.touristLineObj && null != settings.touristLineObj ) {
				settings.isResetInit = (settings.touristLineId == settings.touristLineObj.val()) ? false : true;
				settings.touristLineId = null == settings.touristLineObj.val() || "" == settings.touristLineObj.val() ? "" : settings.touristLineObj.val();
			}
			return null == settings.touristLineId ? "" : settings.touristLineId;
		}
		function _getQueryImageType(settemp) {
			if (settings.imageTypeObj && null != settings.imageTypeObj) {
				settings.imageType = null == settings.imageTypeObj.val() || "" == settings.imageTypeObj.val() ? "" : settings.imageTypeObj.val();
			}
			if(settemp){
				imageTypeTemp = null == settings.imageType ? "" : settings.imageType;
			}
			return null == settings.imageType ? "" : settings.imageType;
		}
		
		function getUrl(showArea) {
			var rtnurl = settings.url;
			rtnurl += ((rtnurl.indexOf("?") > -1) ? "&queryType=" + _getQueryImageType() : "?queryType=" + _getQueryImageType());
			rtnurl += ((rtnurl.indexOf("?") > -1) ? "&line=" + _getTouristLineId() : "?line=" + _getTouristLineId());
			/***add by zlm**/
			if(settings.showArea && showArea){
				rtnurl = rtnurl+"&showArea="+settings.showArea;
			}
			return rtnurl;
		}
		
		function init() {
			$tab = $("<div class='gallery_tab'></div>");
			$dialog = $("<div class='gallery_dialog'></div>").appendTo("body").tooltip({
					items: "li.imglist",
					tooltipClass:"gallery-dialog-imgtips",
					position: { my: "left top",at: "right+5 top-5"},
					content: function() {
						var element = $( this ).find("img");
						return "<img style='max-width: "+settings.imgTooltipMaxWidth+"px' src='"+element.attr("data-original")+"'>";
					},
					open : function (){
						$(".ui-tooltip").css({"z-index" : (settings.zIndex && settings.zIndex > 1000)?settings.zIndex*1 + 2:1010+2});
					}
			}).dialog({
					autoOpen: false,
					dialogClass: "no-title",
					modal: true,
					width:settings.width,
					title:false,
					buttons: {
			        "完成": function() {
			        		var res = [];
			        		$("li.imglist.selected",settings.onlyOneArea ? $activeTab : $dialog).each(function(){
			        			res.push(eval('(' + $(this).attr("imgdata") + ')'));
			        		})
			        		log(res);
			        		if(res.length > 0) {
			        			var res = settings.onOk.call($dialog,settings.multiSelect?res:res[0]);
			        			$dialog.dialog("close");
			        			_getQueryImageType(true);
			        			if(settings.clearKeyWord){
			        				$(".serach-images-input").val("");
			        			}
			        		} else {
			        			$.alert("请至少选择一张图片", null, null, null, (settings.zIndex && settings.zIndex > 1000)?settings.zIndex*1 + 2:1010+2);
			        		}
			        	}
					}
			}).on("click",".imglist",function(){
				$(this).toggleClass("selected");
				if(!settings.multiSelect){
					$(".selected",$dialog).not(this).removeClass("selected");
				}
			}).on("click",".search_btn_",function(){
				if(window.Placeholders && !Placeholders.nativeSupport) {
					Placeholders.disable($(this).prev("input")[0]);
				}
				var keyword = $(this).prev("input").val();
				if(window.Placeholders && !Placeholders.nativeSupport) {
					Placeholders.enable($(this).prev("input")[0]);
				}
				var s = getUrl(false) + "&keyword=" + escape(keyword);
				initPagination(true,s);
			}).on("dblclick",".imglist",function(){
				var res = [];
				$(this).toggleClass("selected").addClass("selected");
				$("li.imglist.selected",settings.onlyOneArea ? $activeTab : $dialog).each(function(){
      			res.push(eval('(' + $(this).attr("imgdata") + ')'));
      		})
      		var res = settings.onOk.call($dialog,settings.multiSelect?res:res[0]);
      		$dialog.dialog("close");
      		_getQueryImageType(true);
      		if(settings.clearKeyWord){
				$(".serach-images-input").val("");
			}
			}).on("keydown", ".serach-images-input", function(){
				var e = window.event || arguments.callee.caller.arguments[0];
				if (e && e.keyCode == 13){
					e.returnValue=false;
					e.cancel = true;
					$(".search_btn_").click();
				}
			});
			getPaginationPlugin();
			getUploadPlugin();
			initUploader.call($dialog.next(".ui-dialog-buttonpane"));
		}
		function initUploader() {
			var $thiz = $(this);
			var selectAreaDiv = "";
			
			/***add by zlm**/
			if(settings.showUploadBut && settings.showArea && _getTouristLineId()){
				selectAreaDiv = "<div class='show-area'>&nbsp;&nbsp;上传区域:&nbsp;&nbsp;<select data-type=1></select>&nbsp;&nbsp;<select data-type=2></select>&nbsp;&nbsp;<select data-type=3 class=webup-hidden>&nbsp;&nbsp;</select><select class=webup-hidden></select></div>";
			}else{
				settings.showArea = false;
			}
			var bottomBut = "<form id='form_"+settings.options_id+"'>"+selectAreaDiv+"<div class='upload_div'><div class='result'></div>" +
					"<div class='btns'><a class='cancel'>取消</a>" +
					(settings.showUploadBut ? "&nbsp;&nbsp;|&nbsp;&nbsp;<div id='options_id_"+settings.options_id+"' class='uploadbtn'>从电脑上传</div>" : "") +
					"</div></div></form>";
			$thiz.append(bottomBut);
			$thiz.find(".cancel").click(function(){
				log("cancel click");
				if(settings.clearKeyWord){
    				$(".serach-images-input").val("");
    			}
				_getQueryImageType(true);
				$dialog.dialog( "close" );
			});
			if (settings.showUploadBut) {
				inituploader();
			}
		}
		/***add by zlm****/
		function inituploader(){
			var options_id = settings.options_id;
			//编辑器上传图片
			var submitdata = {"operateType":settings.operateType,"width":settings.allowWidth||"",height:settings.allowHeight||"",compareType:_getQueryImageType(),compareFn:_getQueryImageType};
			if(settings.uploadOpts && settings.uploadOpts!=null && settings.uploadOpts!="undefined"){
				submitdata = {"operateType":settings.operateType,"width":settings.uploadOpts.allowWidth||"-1",height:settings.uploadOpts.allowHeight||"-1",compareType:settings.uploadOpts.imageType,minRadio:settings.uploadOpts.minRadio,maxRadio:settings.uploadOpts.maxRadio};
			}	
			//行程封面
			var dom_process = $("#options_id_"+options_id)
			var $res = dom_process.parent().parent().find(".result");
			var activeFirst = true;
			$activeTab = $("#galleryTabuploaded");
			
			var showArea=function(show){
				if(settings.showArea){
					if(show){
						$(".show-area").show();
					}else{
						$(".show-area").hide();
					}
				}
			}
			
			inituploaderGmgallery("#options_id_"+options_id,$res,submitdata,function(response){
				$res.html("<span class='success'>上传成功</span>");
				var area = "";
				var upload = true;
				if(settings.showArea){
					area = getAreaValue();
					if(area==""){
						$res.html("<span>请选择上传区域</span>");
						upload=false;
						setTimeout(function() {
							$res.html("");
							showArea(true);
						}, 2000);
					}
				}
				if(upload==true){
					response.area=area;
					$.ajax({
						type:"POST",
						dataType:"json",
						async : true,
						url: settings.uploadUrl ,
						data:{imageType:settings.imageType ||"" ,format:"json",fileInfo:JSON.stringify(response),m:Math.random()},
						success:function(){
							$tab.tabs("option", "active", 1);
							activeFirst = true;
							reloadsystem=settings.showArea;
							initPagination(true,false,function(data){
								resetInnerHtml(data);
							});
							$res.html("");
							showArea(true);
						},
						error:function(){
							$res.html("保存图片失败");
							showArea(true);
						}
					});
				}
			},function(id,message){
					showArea(false);
					$res.html(message);
					setTimeout(function() {
						$res.html("");
						showArea(true);
					}, 2000);
			},showArea);
			
			function resetInnerHtml(data){
				$activeTab.find("ul.gallery_thumbnails").empty().html("").html(genImgList(data));
				if(activeFirst){
					$tab.tabs("option", "active", 1);
					$(".imglist:first",$activeTab).click();
					activeFirst = false;
				}
			}
		}
		function initPagination(force,sUrl,callback){
			var $pagination = $('.pagination',$activeTab),
			    $tar = $activeTab.find("ul.gallery_thumbnails");
			if($pagination.attr("paginationInited") === "true"){
				if(force === true){
					try{
						$tar.empty();
						$pagination.attr("paginationInited", "false");
						$pagination.pagination("destroy");
					}catch(e){}
				}else{
					return;
				}
			}
			var pagedata = $tar.html("<li>正在加载，请稍候。。。</li>").attr("pagedata");
			var pagination = null;
			if($activeTab.is("#galleryTabuploaded") && (force === true || !pagedata)){
				sUrl = ((settings.selfListUrl.indexOf("?") > -1) ? settings.selfListUrl + "&" : settings.selfListUrl + "?" ) + "size="+settings.pageSize+"&queryType=" + _getQueryImageType();
				/**
				$.ajax({
					url: sUrl + getRandomStr(),
					async:false,
					success:function(d){
						if(typeof d == "string"){
							d = eval('(' + d + ')');
						}
						$tar.html("").html(genImgList(d.images));
						pagination = d.pagination;
					},
					error: function(){
						getError = true;
					}
				})这段代码会引起两次请求**/
			}else{
				pagination = data = eval('(' + pagedata + ')');
			}
			if("true" !== $pagination.attr("paginationInited") && true !== $pagination.attr("paginationInited")){
				$pagination.attr("paginationInited","true").pagination({
					dataSource:(sUrl || getUrl(true)) + getRandomStr(),
					locator: 'images',
					triggerPagingOnInit:true,
					alias:{
						 pageNumber: 'page',
						 pageSize: 'size'
					},
					getTotalPageByResponse: function (data) {
						if(settings.showArea && data.areainfo && data.areainfo!=""){
							  areajson=JSON.parse(data.areainfo);//转换为json对象 
							  getAreaInfo(0);
						}
		                return data.pagination.pageCount;
		            },
					pageSize:settings.pageSize,
					hideWhenLessThanOnePage:false,
					beforePaging:function(){
						log("paging")
						$tar.html("<li>正在加载...</li>");
					},
					callback:function(data,p){
						$tar.html("").html(genImgList(data));
						callback && callback(data);
						setDialogPosition($dialog);
					}
				});
			}
		}
		function genImgList(data){
			var c = "";
			$.each(data,function(){
				c += "<li class='imglist' imgdata='"+JSON.stringify(this)+"'><img src='"+this.url+"@170w_130h_4e' data-original='"+this.url+"@"+settings.imgTooltipMaxWidth+"w_100q'/><span class='icon'></span>"+(this.recommend?"<div class='sight_pic_recommend'>推荐</div>":"")+"</li>";
			})
			return c?c:"<li>暂无数据</li>";
		}
		function getRandomStr(){
			return "&_=" + (new Date()).getTime();
		}
		function getScript(url,callback){
			// 由于静态资源迁移导致ajax不能同步加载跨域的js
			throw Error('请加载 ' + url);
			$.ajax({
				  url: url,
				  dataType: "script",
				  async:false,
				  success: callback || $.noop,
				  error: function(){
					  alert("上传控件加载异常！" + url + "未找到！请检测网络链接！正常后刷新重试！");
				  }
			});
		}
		
		function getPaginationPlugin(){
			$.fn.pagination === undefined && getScript(WEB_STATIC_CONSOLE+"/common/plugins/pagination/pagination-with-styles.min.js");
		}
		function getUploadPlugin(){
			$.fn.fileupload === undefined && getScript(WEB_STATIC_CONSOLE+"/common/plugins/jqueryui/fileUpload/js/jquery.fileupload.js");
		}
		function log(msg){
			if(settings.debug){
				(msg);
			}
		}
		function setDialogPosition($dialog){
			var clientHeight = document.documentElement ? document.documentElement.clientHeight : $(window).height(); // getBodyHeight();
			thisTop = (clientHeight - $dialog.parent().height()) / 2 + (document.body.scrollTop > 0 ? document.body.scrollTop : $(document).scrollTop());
			thisTop = thisTop > 0 ? thisTop : 0;
			$dialog.parent().css({top : thisTop});
		}
		
		/***add by zlm**/
		function getAreaValue(){
			var value = "";
			var select = $(".show-area").find("select");
			select.each(function(i,ele){
				var val = $(ele).val();
				if(val && val!="-1" && val!="" && val!="null"){
					value = val;
				}
			})
			return value;
		}
		
		/***add by zlm**/
		function getAreaInfo(type,val){
			var html = "";
			$.each(areajson,function(index,ele0){
				if(type==0){
					html = html+"<option value='"+ele0.id+"'>"+ele0.name+"</option>"
				}else if(type==1 && val!="-1"){
					var id0 = val;
					if(ele0.id==id0){
						if(ele0.leaf==false){
							html = "<option value='-1'>-请选择-</option>"
							$.each(ele0.items,function(j,ele1){
								html = html+"<option value='"+ele1.id+"'>"+ele1.name+"</option>"
							})
						}
					}
				}else if(type==2 && val!="-1"){
					var id0 = $(".show-area").find("select:eq(0)").val();
					var id1 = val;
					if(ele0.id==id0 && ele0.leaf==false){
						$.each(ele0.items,function(j,ele1){
							if(ele1.id==id1 && ele1.leaf==false){
								html = "<option value='-1'>-请选择-</option>"
								$.each(ele1.items,function(k,ele2){
									html = html+"<option value='"+ele2.id+"'>"+ele2.name+"</option>"
								})
							}
						})
					}
				}else if(type==3 && val!="-1"){
					var id0 = $(".show-area").find("select:eq(0)").val();
					var id1 = $(".show-area").find("select:eq(1)").val();
					var id2 = val;
					if(ele0.id==id0 && ele0.leaf==false){
						$.each(ele0.items,function(j,ele1){
							if(ele1.id==id1 && ele1.leaf==false){
								$.each(ele1.items,function(k,ele2){
									if(ele2.id==id2 && ele2.leaf==false){
											html = "<option value='-1'>-请选择-</option>"
											$.each(ele2.items,function(k,ele3){
												html = html+"<option value='"+ele3.id+"'>"+ele3.name+"</option>"
											})
									}
								})
							}
						})
					}
				}
			})
			var size = $(".show-area").find("select").length;
			if(type<size){
				if(html!=""){
					$(".show-area").find("select:eq("+type+")").removeClass("webup-hidden").html(html);
					$(".show-area").find("select:gt("+type+")").addClass("webup-hidden").html("");
					$(".show-area").find("select:eq("+type+")").on("change",null,function(type){
						var datatype = $(this).attr("data-type");
						if(datatype){
							$(".show-area").find("select:gt("+datatype+")").html("");
							getAreaInfo(parseInt(datatype),$(this).val());
						}
					})
					if(type==0){
						$(".show-area").find("select:eq("+type+")").change();
					}
				}else{
					$(".show-area").find("select:eq("+type+")").addClass("webup-hidden").html("");
					$(".show-area").find("select:gt("+type+")").addClass("webup-hidden").html("");
				}
				
			}
		}
		return this;
	}
})(jQuery);