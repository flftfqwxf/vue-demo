var isNameEditing = false;

$(document).ready(function() {
	var editbox = $("#staff-name-editbox");
	var staffIdBox = editbox.find("input[name=id]");
	var staffNameBox = editbox.find("input[name=name]");
	var editarea = $("#staff-name-editbox .editbox-inner");

	var editStaffName = function(refNode, staffId, staffName) {
		if (!refNode) {
			staffIdBox.val("");
			staffNameBox.val("").attr("data-orig-value", "");
			editbox.fadeOut(350);
			return isNameEditing = false;
		}
		isNameEditing = true;
		refNode.append(editbox);
		editbox.fadeIn(350);
		staffIdBox.val(staffId);
		staffNameBox.val(staffName).attr("data-orig-value", staffName).focus();
	};

	// 编辑名称
	$(".staff-list").on("click", "[data-action=edit]", function(e) {
		var dataNode = $(this).parents("li");
		var staffId = dataNode.attr("data-id");
		var staffName = dataNode.attr("data-name");
		editStaffName(dataNode, staffId, staffName);
		e.stopPropagation();
	});

	// 设置权限
	$(".staff-list").on("click", "[data-action=permission]", function(e) {
		var dataNode = $(this).parents("li");
		var staffId = dataNode.attr("data-id");
		var userId = dataNode.attr("data-user");
		eidtStaff(staffId, userId);
		e.stopPropagation();
	});

	$(document).on("click", function(e) {
		if (
			isNameEditing &&
			!$.contains(editarea[0], e.target) &&
			e.target !== editarea[0]
		) {
			editStaffName(false);
		}
	});

	editbox.find("form").on("submit", function(e) {
		e.preventDefault();
		var staffName = $.trim(staffNameBox.val());
		var staffId = staffIdBox.val();
		var origName = staffNameBox.attr("data-orig-value");
		if (staffName && origName !== staffName) {
			$.ajax({
				url: '/supplier/staff/' + staffId + '/name',
				type: "POST",
				async: false,
				dataType: "json",
				data: {
					format: 'json',
					_method: 'PUT',
					name: staffName
				},
				success: function(json) {
					showmsg(null, json);
					editStaffName(false);
					$("li[data-id=" + staffId + "]")
						.attr("data-name", staffName)
						.find("h4").text(staffName);
				}
			});
		} else {
			editStaffName(false);
		}
		return false;
	});
});

function searchStaff() {
	var phoneNumber = $('#userPhone').val(),J_staffWrap=$('.J_staffWrap'),
        userPhone=$('#userPhone');
	$('input[name="userId"]').val("");
	if (!phoneNumber) {
		$.dialog.gmMessage("请输入员工账号", false);
		return false;
	}

	if (/^1[345678]\d{9}$/.test(phoneNumber)) {
		$.ajax({
			url: '/supplier/staff/checkUser',
			type: "GET",
			async: false,
			dataType: "json",
			data: {
				mobile: phoneNumber,
				format: 'json'
			},
			success: function(json) {
				var msgObj = $('.userId_Validform_checktip');
				if (json.result.success === false) {
					msgObj.text(json.result.message);
					msgObj.removeClass('Validform_right');
					msgObj.addClass('Validform_wrong');
                    secondSetep();
					//showmsg(null, json);
				} else {
					$('input[name="userId"]').val(json.result.message);
					msgObj.text('号码存在').removeClass('Validform_wrong').addClass('Validform_right');
                   setTimeout(function () {
                       msgObj.fadeOut('show');
                   },2500);
                    firstSetep();
				}
				msgObj.show();
			}
		});
	}
	//$('input[name="userId"]').blur();
}
function initStep() {
    $('body').on('click','.J_searchNum',function () {
        var $this=$(this);
        if ($.trim($this.text())==='下一步') {
            searchStaff();
        }else{
            secondSetep();
        }
    });
}
initStep();
/**
 * 添加员工第一步时，各INPUT 状态设置
 */
function firstSetep() {
    var J_searchNum=$('.J_searchNum'),userPhone=$('#userPhone'),J_staffWrap=$('.J_staffWrap');
    userPhone.attr('disabled',true);
    J_searchNum.text('修改手机号');
    J_staffWrap.show();
    curDialog._winResize();
    curDialog.DOM.buttons.find('.btn-process').attr('disabled',false);
}
/**
 * 添加员工第二步时，各INPUT 状态
 */
function secondSetep() {
    var J_searchNum=$('.J_searchNum'),userPhone=$('#userPhone'),J_staffWrap=$('.J_staffWrap');
    userPhone.attr('disabled',false);
    J_searchNum.text('下一步');
    J_staffWrap.hide();
    curDialog._winResize();
    curDialog.DOM.buttons.find('.btn-process').attr('disabled',true);
}
function openDialog(url, options, flush, callback) {
	var title = options.title;
    var isDisabled=options.isDisabled;
	//options.title = false;
	var throughBox = $.artDialog.through;
	var api, wrap, init = options.init,
		buttons = options.button,
		close = options.close,
		defaults = {
			isClickShade: false,
			cancel: undefined,
			init: function() {
				init && typeof init === 'function' && init.apply(this, arguments);
                //setTimeout(initStep,200);
			},
			close: function() {
				close && typeof close === 'function' && close.apply(this, arguments);
			}
		}
		//options.title = false;
	options.button = undefined;
	options.init = undefined;
	options.close = undefined;
	var myDialog = throughBox($.extend(defaults, options));
	$.ajax({
		type: "GET",
		url: url,
		dataType: 'html',
		success: function(data, textStatus, jqXHR) {
			var win = $.artDialog.top;
			var loginStatus = jqXHR.getResponseHeader('sessionstatus');
			if (loginStatus === 'timeout') {
				myDialog.close();
				showmsg(win, eval("(" + data + ")"), flush ? flush : 'flush_now');
				return;
			}
			buttons && myDialog.button(buttons);
			myDialog.content(data);
			if (!options.isClearBtn) {
				setSubBtn(win, myDialog, flush ? flush : 'flush_now', callback,isDisabled);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			debugging(myDialog, url, XMLHttpRequest, textStatus, errorThrown, 'add');
		}
	});
	return myDialog;
}

function setSubBtn(win, tobj, flush, callback,isDisabled) {
	tobj.button({
		name: "取消",
		callback: function() {
			$.confirm("您确认要离开此页面？", "确认提示", function() {
				tobj.close();
			}, function() {});
			return false;
		}
	}, {
		name: "保存",
        disabled: isDisabled,
		callback: function() {
			if (typeof(window["setDataToArray"]) === "function") {
				setDataToArray();
			}
			if (window.Placeholders && !Placeholders.nativeSupport)
				Placeholders.disable(win.$("[id$=Form]")[0]);
			if (win.$("[id$=Form]").Validform === undefined) {
				getScript("/common/plugins/validform/style.css", 'text');
				getScript("/common/plugins/validform/Validform_v5.3.2.js", 'script');
			}
			var formObj = win.$("[id$=Form]").Validform({
				tiptype: 4
			});
			//formObj.submitForm(false,'/');
			var url = win.$("[id$=Form]").find("#action").val();
			var subflag = formObj.getUtil().submitForm.call($(formObj.forms[0]), $(formObj.forms)[0].settings, false, url);
			subflag === undefined && (subflag = true);
			if (callback && typeof callback === 'function') {
				var callreturn = callback();
				if (!callreturn) {
					return false;
				}
			}
			if (subflag === true) {
				subOK(win, tobj, flush);
			}
			return false;
		},
		className: 'btn-process',
		focus: true
	});
}

function staffOperate(url, title, options,isDisabled) {
	var opts = {
		title: title,
		isClose: true,
		fixed: true,
		lock: true,
        resize:true,
        isDisabled:isDisabled
	};
	window.curDialog=openDialog(url ? url : '/supplier/staff/input', $.extend({}, opts, options));
}

//添加
function addStaff() {
	staffOperate('/supplier/staff/input', '添加员工',{},true);
}

//修改
function eidtStaff(id, userId) {
	staffOperate('/supplier/staff/' + id + '/input?_=' + Math.random(), '请设置该员工的权限', {
		button: [{
			name: '解雇该员工',
			callback: function() {
				$.confirm(
					"确定解雇？",
					"确认提示",
					function() {
						$.ajax({
							url: "/supplier/staff/dismiss",
							type: "POST",
							async: false,
							dataType: "json",
							data: {
								userId: userId,
								format: 'json',
							},
							success: function(json) {
								json['result']['jumpUrl'] = '/supplier/staff';
								showmsg(null, json, 'flush_now');
							}
						});
					},
					function() {}
				)
				return false;
			},
			cssClass: 'btn-sm-common'
		}]
	},false);
}

//申请列表
function staffPending() {
	staffOperate('/supplier/staff/pending', "审核新员工", {
		init: function() {
			this.DOM.footer.hide();
		},
		close: function() {
			this.DOM.footer.show();
		}
	});
}

//接受/解雇小二
function audit(userId, type) {
	$.ajax({
		url: '/supplier/staff/' + (type ? type : 'employ'),
		type: "POST",
		async: false,
		dataType: "json",
		data: {
			userId: userId,
			format: 'json',
			audit: true
		},
		success: function(json) {
			showmsg(null, json, 'flush_now');
		}
	});
}