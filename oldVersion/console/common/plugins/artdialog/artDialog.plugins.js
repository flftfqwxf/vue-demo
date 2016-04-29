var isdebugging = false;//是否调试JS
var dataType = isdebugging?'text':'json';
function debugging(tobj,url,XMLHttpRequest,textStatus,errorThrown,jsfunc){
	var msg = '<table class="content_view"><tr><td width="110">Js Function:</td><td>function '+jsfunc+'(){}</td></tr>';
	msg += '<tr><td width="110">URL:</td><td>'+url+'</td></tr>';
	msg += '<tr><td>HTTP Status:</td><td>'+XMLHttpRequest.status+'</td></tr>';
	msg += '<tr><td>readyStatus:</td><td>'+XMLHttpRequest.readyState+'</td></tr>';
	msg += '<tr><td>textStatus:</td><td>'+textStatus+'</td></tr>';
	msg += '<tr><td>errorThrown:</td><td>'+errorThrown+'</td></tr>';
	tobj.title('error');
	tobj.content(msg);
}

function openDialog(url, options, flush, callback){
	var throughBox = $.artDialog.through;
	var clientHeight = document.documentElement ? document.documentElement.clientHeight : $(window).height();
	var api, wrap, init = options.init, close = options.close, cancel = options.cancel, defaults = {
		//height : getBodyHeight() - 250,
		isClickShade: false,
		init: function() {
			api = this;
			wrap = api.DOM.wrap;
			wrap.find('.aui_main').css({
				//'padding-top' : '0px',
				'display' : 'inline-block',
				'overflow-x' : 'hidden',
				'overflow-y' : 'auto',
				'max-height' : clientHeight - 280
			});
			init && typeof init === 'function' && init();
		},
		close: function() {
			wrap.find('.aui_main').removeAttr('style');
			close && typeof close === 'function' && close();
		}
	}
	options.init = undefined;
	options.close = undefined;
	options.cancel = undefined;
	var myDialog = throughBox($.extend(defaults, options, {top: '48.2%'}));
	$.ajax({type: "GET",url:url,dataType:'html',
		success: function (data, textStatus, jqXHR) {
			var win = $.artDialog.top;
			var loginStatus = jqXHR.getResponseHeader('sessionstatus');
			if (loginStatus === 'timeout'){
				myDialog.close();
				showmsg(win, eval("(" + data + ")"));
				return;
			}
			try {
				var json = eval("(" + data + ")");
				myDialog.close();
				showmsg(win, json);
				return;
			} catch(e) {
			}
			myDialog.content(data);
			if (!options.isClearBtn) {
				setSubBtn(win, myDialog, flush ? flush : 'flush_now', callback, cancel);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			//debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'add');
			myDialog.title("操作失败！");
			myDialog.content("有可能是您的网络出现问题，<br/>请刷新后再操作！");
		}
	});
	return myDialog;
}

function setSubBtn(win, tobj, flush, callback, cancel){
	tobj.button({
		name:"取消",
		callback:function(){
			$.confirm("您确认要离开此页面？","确认提示", function(){
				cancel && typeof cancel === 'function' && cancel();
				tobj.close();
			},function(){
			});
			return false;
		},
		cssClass: 'btn-cancel'
	},{
		name:"保存",
		callback:function(){
			if (typeof(window["setDataToArray"]) === "function") {
				setDataToArray();
			}
			if (win.$("[id$=Form]").Validform === undefined){
				getScript(WEB_STATIC_CONSOLE+"/common/plugins/validform/style.css", 'text');
				getScript(WEB_STATIC_CONSOLE+"/common/plugins/validform/Validform_v5.3.2.js",'script');
			}
			var formObj = win.$("[id$=Form]").Validform({tiptype:4});
			//formObj.submitForm(false,'/');
			var url = win.$("[id$=Form]").find("#action").val();
			var subflag = formObj.getUtil().submitForm.call($(formObj.forms[0]),$(formObj.forms)[0].settings,false,url);
			subflag === undefined && (subflag=true);
			if(callback && typeof callback === 'function'){
				var callreturn = callback();
				if(!callreturn){
					return false;
				}
			}
			if(subflag===true){
				subOK(win, tobj, flush);
			}
			return false;
		},
		cssClass: 'btn-save',
		focus: true
	});
}

function getScript(url, type, callback){
	$.ajax({
		  url: url,
		  dataType: type,
		  async:false,
		  success: callback || $.noop,
		  error: function(){
			  alert(url + "未找到！")
		  }
	});
}

function subOK(win, tobj, extra){
	var formData = win.$("[id$=Form]").serialize();
	var url = win.$("[id$=Form]").attr("action");
	var myDialog = win.$.artDialog({fixed:true,lock:true,drag:false});
	if(url){
		$.ajax({type: "POST",dataType:dataType,url: url,data: formData,
			success: function(data){
				myDialog.close();
				//return false;
				showmsg(tobj, data, extra);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				//debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'subOK');
				myDialog.title("操作失败！");
				myDialog.content("有可能是您的网络出现问题，<br/>请刷新后再操作！");
			}
		});
	}else{
		myDialog.close();
		//tobj.close();
	}
}

/*
 */
function showmsg(tobj, data, extra){
	if(isdebugging){
		alert(data);return;
	}
	if (data.result.hasOwnProperty("fieldErrors")) {
		$.each(data.result.fieldErrors, function(k,v){
			$.dialog.gmMessage(v.defaultMessage, false);
		});
		return;
	}
	if (data.result.success) {
		tobj && tobj.close();
		if (extra === 'flush_now') {
			$.cookie('message', '"'+data.result.success + '_' + data.result.message + '"', {path:'/'});
			reload(0);
		} else {
			$.dialog.gmMessage(data.result.message, data.result.success);
		}
	} else {
		$.dialog.gmMessage(data.result.message, data.result.success);
	}
}



function reload(time) {
	setTimeout(function(){
		location.reload();
	}, time);
}