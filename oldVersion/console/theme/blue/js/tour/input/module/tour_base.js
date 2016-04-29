((function($, w){
	
	var $content;
	var $body = $(".input_body #base");
	var inited = false;
	var $uploading = false;
	// attchment 
	var $files ;
	var $filediv;
	var $fbefore ;
	var $fdoing ; 
	var $fsuccess;
	var $fcancel;
	var $fcover;
	// attchment end
	var module = {
			hide : function(){
				$body.hide();
			},
			show : function(){
				$("#nextBtn").show();
				$("#btnSave").hide();
				$body.show();
				
				//init flash upload .隐藏层后.flash失效.需要重新init
				webUpload({
					id : "#upBtnID",
					label : "上传附件",
					process : function(percent) {
						
						if (!$fbefore.hasClass("opacity")) {
							$fbefore.addClass("opacity");
							$fdoing.show();
							$uploading = true;
						}
						$("span", $fdoing).text("上传中（{percent}）".template({"percent" : percent }));
					},
					success : function(response){
						if(!response.notUsewebUploader){
							$fdoing.hide();
						}
						$uploading = false;
						var filename = response.name;
						if (!filename) {
							Tour.utils.showError($("#upBtnID"), "文件格式错误");
							$fbefore.removeClass("opacity");
							$fcover.hide();
							return ;
						} else {
							$fsuccess.show();
							$("span", $fdoing).text("上传中（0%）");
							
							setTimeout(function(){
								$fsuccess.hide();
								$fbefore.removeClass("opacity");
								if ($("[data-name=attachments]", $files).length < 5) {
									$fcover.hide();
								}  else {
									$fcover.show();
								}
								
							},2000);
							var maxname = 25;
							if (filename.length >= maxname) {
								var lastIdx = filename.lastIndexOf(".");
								var staff = filename.substring(lastIdx);

								if (staff.length >= maxname) {
									Tour.utils.showError($("#upBtnID"), "文件格式错误");
									return ;
								}
								filename =  filename.substring(0, 25 - staff.length) + staff;
								
							}
							//附件名字
							var attchment = {
									url : response.url,
									name : filename,
									size : response.size
							}
							$files.append(template("tmp_step_base_file", attchment));
							
						}
						

						
					},
					error : function(id,msg){
						$uploading = false;
						$fbefore.removeClass("opacity");
						Tour.utils.showError($("#upBtnID"), msg);
						$fdoing.hide();
						$fcover.hide();
					},
					cancelsuccess : function(){
						$uploading = false;
						$fbefore.removeClass("opacity");
						$fdoing.hide();
						$fcover.hide();
					},
					positionable:true,
					target:".upfile",
					tipmessage:"<small class='upload-tips'>最多5个jpg、office文件供用户下载（若没有不可传）</small>",
					corver:'<div class="cover hidden"><span class="upBtn">上传附件</span></div>',
					messagejson:true,
					operateType : "tour_attach",
					useDefault:1,
					accept:{ 
						title: 'Images',
			            extensions: '*'
			           },
					cancel : $fcancel
				});
				//init flash upload end
			},
			clear : function(){
				inited = false;
				$body.html("");
			},
			isInit : function(){
				return inited;
			},
			init : function(){
				//供应商系统专用
				if (!Tour.current.lineId) {
					alert("没找找到专线ID");
					return false;
				}
				inited  = true;
				
				$tour = Tour.current.data;
				$content = $(template("tmp_step_base", Tour.current.data));
				$body.html($content);
				$($content).on("click",".stepBtn", Tour.nextStep);
				
				//从出团计划团过来。
				var tourName = $("#urlTourName").val();
				if (tourName) {
					$("#tourName").val(tourName);
				}
				
				
				
				
				
				
				if (Tour.current.lineId) {
					$.getJSON('/line/play/{line}.json?_={random}'.template({'line' : Tour.current.lineId,  'random' : Math.random()}), function(res){
		            	var options = "<option value=''>点击选择行程线路（必填）</option>";
		            	var list = res.list;
		            	for(var i = 0; i < list.length; i++){
		            		options += '<option value="{id}">{name}</option>'.template({'id' : list[i].id, 'name' : list[i].name});
		            	}
		            	$("select[name='id']").html(options).val($tour.playOption && $tour.playOption.id);
		            });
				}
				
				
				
				
				// attchment 
				$files = $(".upFileInfo");
				$filediv = $(".upfile");
				$fbefore = $(".beforeUp", $filediv);
				$fdoing = $(".doingUp", $filediv); 
				$fsuccess = $(".successUp", $filediv);
				$fcancel = $(".cancle", $filediv);
				$fcover = $(".cover", $filediv);
				var idx = 0;
				$(Tour.current.data.attachments).each(function(){
					$files.append(template("tmp_step_base_file", $.extend({},this, {"idx":idx++})));
				});
				
				
				if ($("[data-name=attachments]", $files).length >= 5) {
					$fcover.show();
				}
				Tour.current.jsondom.event.afterRemove.push(function(action, target){
					if (target.attr("data-del-target") == "attachment") {
						$fcover.hide();
					}
				});
				// attchment end;
				
				$content.find("textarea[tag=edit]").each(function(){
						initKindEditor($(this), null, null, Tour.current.lineId);
				});
				
				/***update by zlm***/
				$("#upload_img_but").gmgallery({touristLineId: Tour.current.lineId ,multiSelect:false,operateType:"tour_corver_image",options_id:new Date().getTime(),onOk:function(image){
					$("#coverImg").attr("src", image.url);
					$("#coverImgId").val(image.id);
				}});
			},
			submit : function(){
			
				var valid = Tour.utils.vaildDatas();
				if($("#coverImgId").val()==""){
					Tour.utils.showError($("#upload_img_but"),"请选择一张封面图片！");
					valid = false;
				}
				if(!valid) return false;
				
				if ($uploading) {
					alert("文件上传中.请稍后..");
					return false;
				}
				$("textarea[tag=edit]").each(function(){
					KindEditor.removePlaceholder($(this));
				});
				
				Tour.current.jsondom.refresh($body);
				
				return true;
			}
	}
	
	w.Tour = w.Tour || {};
	w.Tour.module = w.Tour.module || {};
	w.Tour.module.base = w.Tour.module.base || {};
	$.extend(w.Tour.module.base, module);
}))(jQuery, window);