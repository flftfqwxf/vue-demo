(function($, w) {
	var ctx = $("#step3").on("hide", function() {
		Product.utils.setIndex.call($(this));
		var data = Product.utils.getFormData.call(this);
		return data;
	}).on("show", function() {
		$("#btnSave").text("确认保存");
	}).on("change",".radio2",function(){
		var $this = $(this);
		var $tar = $this.parent().nextAll(".hide"); 
		if($this.attr("role") == "show"){
			$tar.show().focus();
		}else{
			$tar.hide();
		}
	}).on("change",".radio1",radio1ChangeHandler).on("click",".del_tr",function(){
		$(this).closest("tr").remove();
	}).on("click",".add_tr",addTr);
	
	function radio1ChangeHandler(d){
		var tid = "tpl_"+this.name+"_"+this.value;
		d.tid = tid;
		var $new = $(this).closest(".col2").find(".op").html(template(tid,d));
		if(this.value == "1")
			initEditor($new);
		else{
			$new.find("tr").length == 1 && $new.find(".add_tr").click();
		}
	}
	function addTr(data){
		var $tar = $(this).prev("table").find("tbody");
		if($tar.find("tr").length>49){
			$.alert("最多添加50条")
			return false;
		}
		var tr = template($(this).attr("rel")+"_tr",data || {});
		$tar.append(tr);
	}
	function addTips(data){
		var ids = [],type = this;
		$.each(data||[],function(){
			ids.push(this.id);
		})
		$.getJSON("/"+type+"/list.json?line="+Product.lineId,function(d){
			var h = "";
			$.each(d[(type=="visa"?"visaArea":type)+"s"]||[],function(){
				if($.inArray(this.id,ids)>-1)
					this.checked = true;
				h += template("tpl_"+type+"s",this);
			})
			h && $("#tips",ctx).append(h).show().tooltip({items:"[tooltip]",content:function(){return $(this).find(">div").html()}}).next(".hide").show();
		});
	}
	function initEditor(c){
		$("textarea",c).each(function(){
			var id = "descr"+new Date().getTime();
			$(this).attr("id",id).height(100);
			initUEditor(id,false,false,Product.lineId,650,0);
		});
	}
	Product.step3 = {
		init : function(data) {
			var d = data || {};
			ctx.find("#step3_content").html(template("tpl_step3",d))
			$.each(["tip","visa"],function(i){
				addTips.call(this,d[this+(i==1?"Area":"")+"s"]);
			})
			initEditor(ctx);
			/*
			$('.Wdate').datepicker({
				changeMonth: true,
				changeYear: true,
				dateFormat: 'yy-mm-dd'
			}).attr('readonly',true);
			Product.utils.initAutocomplete($("#distributorName",ctx).attr("ac_url","vendor/distributor/select"),{hotType:null},function(e,d){
				$(this).prev("input").val(d && d.id || "");
			})
			*/
			ctx.find(":radio:checked").each(function(){
				radio1ChangeHandler.call(this,d);
			});
			$.each("selfPaids,shops".split(","),function(){
				if(d[this] && d[this].length){
					var $tar = $("."+this,ctx).find("tbody>tr").remove().end().find(".add_tr");
					$.each(d[this],function(){
						addTr.call($tar,this)
					})
				}
			})
		}
	}
})(jQuery, window)

function getSelfpaidTyping(){
	var dialog_Selfpaid = $.artDialog({
		title: '最近使用',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	
        },
        okVal: '确认',
        okCssClass: 'btn-save',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'btn-cancel'
	});
	setDialogSearch("/typing/selfpaid", dialog_Selfpaid);
}

function getShopsTyping(){
	var dialog_Shops = $.artDialog({
		title: '最近使用',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	console.log(data);
        },
        okVal: '确认',
        okCssClass: 'btn-save',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'btn-cancel'
	});
	setDialogSearch("/typing/shop", dialog_Shops);
}
function setDialogSearch(uri, dialog){
	$.ajax({
		url: uri,
		type:"GET",
		dataType: "html",
		success:function(objData){
			dialog.content(objData);
			$("#typing_query").on("click", function(){
				query_click();
			});
		},
		error: function(){
			dialog.close();
			$.alert("加载最近使用失败！请刷新重试", "提示", "warning", function(){ });
		}
	});
	function query_click(){
		if(uri.indexOf("?") >0){
			uri = uri + "&keyword=" + $("#typing_keyword").val();
		}else{
			uri = uri+"?keyword="+$("#typing_keyword").val();
		}
		$.ajax({
			url: uri+"&_="+Date.parse(new Date()),
			type:"GET",
			dataType: "html",
			success:function(objData){
				dialog.content(objData);
				$("#typing_query").on("click", query_click);
			}
		});
	}
}
function getTypingData(){
	var data = {};
	data.custom = true;
	data.text = "";
	data.list = [];
	$("input[name='typing_set']:checked").each(function(){
		if($(this).val() == true || $(this).val() == "true"){
			data.custom = true;
			data.text = ($(this).parent().parent().find(".typing_info_body").html()).LTrim().RTrim();
		}else{
			data.custom = false;
			$(this).parent().parent().find(".data_li").each(function(){
				var shopLi = {};
				$(this).find("td").each(function(){
					shopLi[$(this).attr("title")] = $(this).text();
				});
				data.list.push(shopLi);
			});
		}
	});
	return data;
}
