function autoComplete(callback, line, obj) {
    var obj = obj || $("#addSup").find(".supplier-pro-name");

    obj.each(function () {
        var $this = $(this);

        $this.unautocomplete().autocomplete("/" + $this.attr("data-url") + ".json?_=" + Math.random() + "&lineId=" + line, {
            minChars: 0,
            clickFire: true,
            requestParamName: "name",
            showOthers: false,
            pagination: false,
            extraParams: {count: 6},
            parse: function (data) {
                var parsed = [];
                var rows = $.isArray(data) ? data : data.list;
                if (rows && rows.length) {
                    for (var i = 0; i < rows.length; i++) {
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
            formatItem: function (row, i, max) {
                if (!row.name) {
                    return "";
                }
                return row.name;
            }
        }).result(function (e, data) {
            var index = $("#addSup").find(".supplier-pro-name").index(e.currentTarget);
            
            if (data) {
                data.dom = $this;
                data.domIndex = index;
                callback(e, data);
            } else {
                e.dom = $this;
                e.domIndex = index;
                callback(e, data);
            }
        });
    })
}
var JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        $(':input[placeholder]').each(function (index, element) {
            if ($(this).attr("setPlaceh") != "true") {
                var self = $(this), txt = self.attr('placeholder');
                self.attr("setPlaceh", "true");
                self.wrap($('<div></div>').css({position: 'relative', zoom: '1', border: 'none', background: 'none', padding: 'none', margin: 'none'}));
                var holder = $('<span></span>').text(txt);
                holder.show();
                var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                holder.css({
                    fontSize: '12px',
                    width: self.width(),
                    overflow: 'hidden',
                    position: 'absolute',
                    left: pos.left + 5,
                    top: pos.top,
                    height: h,
                    lienHeight: h,
                    paddingLeft: paddingleft,
                    color: '#aaa'
                }).appendTo(self.parent());
                if (!self.val()) {
                    holder.show();
                } else {
                    holder.hide();
                }
                self.focusin(function (e) {
                    holder.hide();
                }).focusout(function (e) {
                    if (!self.val()) {
                        holder.show();
                    }
                });
                holder.click(function (e) {
                    holder.hide();
                    self.focus();
                });
            }
        });
    }
};

// 更新联系方式index
function updateContactIndex() {
    $('.J_contact-item').each(function(i){
        $(this).find('[name^=contacts]').each(function(){
            var newName = $(this).attr('name').replace(/\[\d+\]/, '[' + i + ']');

            $(this).attr('name', newName);
        });
    });
}
$(function () {
    var shopForm = $('#shopForm').validationEngine({
        maxErrorsPerField: 1,
        validateNonVisibleFields: false,
        scroll: true,
        scrollOffset: 100,
        autoHidePrompt: true,
        autoHideDelay: 10000,
        focusFirstField: true,
        binded: false
    });

    JPlaceHolder.init();
    var newLi = '<li>'
            + '<input type="hidden" name="excludeSupplierIds" />'
            + '<input class="form-control supplier-pro-name validate[required]" autocomplete="off" type="text" placeholder="请输入供应商名称" data-url="supplier-select" />'
            + '<a href="javascript:" class="delete-this-bt"></a>'
            + '</li>', domainInput = $('input[name="domain"]'),
    //newContact = '<div class="form-inline J_contact-item">'
    //    + '<select name="contacts[0].phoneType" class="select form-control validate[required]">'
    //    + '<option value="2">座机号码</option>'
    //    + '<option value="1">手机号码</option>'
    //    + '<option value="3">400/800</option>'
    //    + '</select>'
    //    + '<input type="text" placeholder="名称，如客服小王" name="contacts[0].name" class="form-control validate[required],maxSize[10]" data-errormessage-value-missing="*请输入联系人名称" />'
    //    + '<span class="phone phone1"><input type="text" placeholder="11位手机号码" name="contacts[0].mobilePhone" class="form-control validate[required,custom[mobilephone]]" data-errormessage-value-missing="*请输入11位手机号码" /></span>'
    //    + '<span class="phone phone2"><input type="text" placeholder="区号" name="contacts[0].code" class="form-control validate[custom[d3-4]" /><span>-</span><input type="text" placeholder="8位座机号码" name="contacts[0].telePhone" class="form-control validate[required,custom[d6-8]]" data-errormessage-value-missing="*请输入8位座机号码" /></span>'
    //    + '<span class="phone phone3"><input type="text" placeholder="10位电话号码" name="contacts[0].phone400" class="form-control validate[required,custom[d10]]" data-errormessage-value-missing="*请输入10位电话号码" /></span>'
    //    + '<button data-role="delete" type="button" class="btn btn-default delete-contact"><i class="fa fa-trash"></i></button>'
    //    + '</div>',
        newContact = '  <div class="form-inline J_contact-item">'
            + '  <label class="btn btn-default btn-select">      '
            + '  <select name="contacts[0].phoneType" class="J_select validate[required]">   '
            + '  <option value="2">座机号码</option> '
            + '  <option value="1">手机号码</option> '
            + '  <option value="3">400/800</option>      '
            + '  </select>'
            + '  </label> '
            + ' <input type="text" placeholder="名称，如客服小王" name="contacts[0].name" class="col-sm-4 form-control validate[required,maxSize[10]]"       '
            + 'data-errormessage-value-missing="*请输入联系人名称"/>'
            + '  <div class="phone phone1" style="display: none;"> '
            + ' <input type="text" placeholder="11位手机号码" name="contacts[0].mobilePhone" class=" form-control validate[required,custom[mobilephone]]"    '
            + '  data-errormessage-value-missing="*请输入11位手机号码"/>     '
            + '      </div>   '
            + '      <div class="phone phone2"> '
            + '      <input type="text" placeholder="区号" name="contacts[0].code" class="form-control  validate[custom[d3-4]]" />'
            + '      <div class="spaceLine">-</div> '
            + '     <input type="text" placeholder="6到8位座机号码" name="contacts[0].telePhone" class=" form-control validate[required,custom[d6-8]]"    '
            + '  data-errormessage-value-missing="*请输入6到8位座机号码"/>       '
            + '  <span class="spaceLine">-</span><input type="text" placeholder="分机号(选填)" value="" name="contacts[0].extensionNumber" class=" form-control validate[custom[d6]]" data-errormessage-value-missing="*请输入6位数字以内的分机号"/>'
            + '      </div>   '
            + '      <div class="phone phone3"> '
            + '     <input type="text" placeholder="10位座机号码" name="contacts[0].phone400" class=" form-control validate[required,custom[d10]]"    '
            + '  data-errormessage-value-missing="*请输入10位电话号码"/>'
            + '  <span class="spaceLine">-</span><input type="text" placeholder="分机号(选填)" value="" name="contacts[0].extensionNumber" class=" form-control validate[custom[d6]]" data-errormessage-value-missing="*请输入6位数字以内的分机号"/>'
            + '      </div>   '
            + ' <button data-role="delete" type="button" class="btn btn-default delete-contact"><i class="fa fa-trash"></i></button> </div> '
    $addContact = $(".J_addContactBtn");
    $(document).on("click", ".add-btn", function () {
        var newLiObj = $(newLi);
        $(this).parents(".supplier-list-box").find("ul").append(newLiObj);
        JPlaceHolder.init();
        /**
         autoComplete(function(e, d){
    		if (d) {
    			$(this).closest('li').find('input[type="hidden"]').val(d.id || '');
    		} else {
    			$(this).closest('li').find('input[type="hidden"]').val('');
    		}
		});**/
    }).on("click", ".supplier-list-box .delete-this-bt", function () {
        $(this).parent("li").remove();
    }).on("click", ".J_addContactBtn", function () {
        var len = $('.J_contact-item').length;
        var $newContact = $(newContact);
        $.each($newContact.find('[name*=contacts]'), function () {
            var newName = $(this).attr('name').replace(/\d+/, len);
            $(this).attr('name', newName);
        });
        $(this).before($newContact);
        if (len >= 9) {
            $(".J_addContactBtn").hide();
        }
        $newContact.find('.J_select').trigger('change');
        JPlaceHolder.init();
    }).on("click", ".J_contact-item .delete-contact", function () {
        $(this).parents(".J_contact-item").remove();
        var len = $('.J_contact-item').length;
        if (len < 10) {
            $(".J_addContactBtn").show();
        }
        updateContactIndex();
    }).on("change", ".J_contact-item .J_select", function () {
        $contact = $(this).closest('.J_contact-item');
        $contact.find('.phone').hide();
        $contact.find('.phone').find('input').attr('disabled', 'disabled');
        $contact.find('.phone' + $(this).val()).show();
        $contact.find('.phone' + $(this).val()).find('input').removeAttr('disabled');
    }).on("click", ".save-btn", function () {
        updateContactIndex();
        if (!checksupplier()) {
            return false;
        }
        $('#shopForm').submit();
    });
    $('.J_select').trigger('change');
    if (initAllSupplierInfo) {
        initsupplier();
    }
});
function checksupplier() {
    if (!initAllSupplierInfo) {
        return true;
    }
    var pass = false;
    var allDomestic = $(".allDomestic").find("input[name='line_domestic']");
    var allBroad = $(".allBroad").find("input[name='line_abroad']");
    $("input[name=supplierInfo]").each(function () {
        if ($.trim($(this).val()) != "") {
            pass = true;
        }
    })

    if (!pass) {
        $("#productorgial").validationEngine('showPrompt', "至少选择一条专线或一个供应商", 'error', null, true);
    } else {
        var productOriginate = 0;
        var sc = 0;
        var gn = 0;
        var cj = 0;
        allDomestic.each(function () {
            if ($(this).attr("checked")) {
                if (productOriginate < 3) {
                    if ($(this).val() == 1) {
                        sc = 1;
                    } else {
                        gn = 2;
                    }
                }
            }
        })
        allBroad.each(function () {
            if ($(this).attr("checked")) {
                cj = 5;
                return false;
            }
        })
        productOriginate = sc + gn + cj;
        $("input[name=productOriginate]").val(productOriginate);
        $("input[name=supplierInfo]").each(function () {
            if ($.trim($(this).val()) == "") {
                //$(this).remove();
            }
        })
    }
    return pass;
}
var $form;
function isValid() {
    if (window.Placeholders && !Placeholders.nativeSupport) {
        Placeholders.disable($form[0]);
    }
    var flag = $form.validationEngine('validate');
    if (window.Placeholders && !Placeholders.nativeSupport) {
        Placeholders.enable($form[0]);
    }
    return flag;
}
function initsupplier() {
    $(document.body).keydown(function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
    var maxsupplier = 30;
    var allDomestic = $(".allDomestic").find("input[name='line_domestic']");
    var allBroad = $(".allBroad").find("input[name='line_abroad']");
    if(allSupplierInfo){
        var allSupplierData = JSON.parse(allSupplierInfo);//转换为json对象
    }
    
    var checkAllSelect = function (type) {
        if (type == 1) {
            var allselect = true;
            allDomestic.each(function () {
                if (!$(this).attr("checked")) {
                    allselect = false;
                    return false;
                }
            })
            $.setChecked($("input[name=all_domestic]"), allselect);
        } else if (type == 2) {
            var allselectb = true;
            allBroad.each(function () {
                if (!$(this).attr("checked")) {
                    allselectb = false;
                    return false;
                }
            })
            $.setChecked($("input[name=all_abroad]"), allselectb);
        }
    }
    checkAllSelect(1);
    checkAllSelect(2);
    // var findSupplierNames = function (suppliers) {
    //     var names = "";
    //     var count = 0;
    //     var existArr = new Array();
    //     if (suppliers.length > 0) {
    //         $.each(allSupplierData, function (i, dataObj) {
    //             if (dataObj.children) {
    //                 $.each(dataObj.children, function (j, child) {
    //                     for (var k = 0; k < suppliers.length; k++) {
    //                         var item = suppliers[k];
    //                         if (!existArr.contains(item)) {
    //                             if (item != "" && child.name == item) {
    //                                 names += item + "," + child.value;
    //                                 names += separator;
    //                                 existArr.push(item);
    //                             }
    //                         }
    //                     }
    //                     if (existArr.length == suppliers.length) {
    //                         return false;
    //                     }
    //                 })
    //             }
    //             if (existArr.length == suppliers.length) {
    //                 return false;
    //             }
    //         })
    //     }
    //     return names;
    // }
    
    var existsupplier = function(lineId,suppliername){
	 	var data = [];
	 	if(true){
	 		return data;
	 	}
	 	// $.each(allSupplierData,function(i,dataObj){
	 	// 	if(dataObj.name==lineId){
		 // 		if(dataObj.children){
			//  		$.each(dataObj.children,function(j,child){
	 	// 				if(child.value==suppliername){
	 	// 					data.exist = true;
	 	// 					data.id = child.name;
	 	// 					return false;
	 	// 				}
			//  		})
			//  		}
	 	// 	}
	 	// })
 	
	 	// return data;
    }
    
    //定义弹出层
    var showDialog = function (options) {
        var showDialog = $.dialog({
            title: options.title || false,
            isClose: options.title ? true : false,
            width: options.width || 460,
            minHeight: 200,
            isOuterBoxShadow: false,
            padding: "0px",
            content: options.obj,
            lock: true,
            fixed: true,
            button: [
                {
                    name: '取消',
                    callback: function () {
                        this.DOM.wrap.find('.cancel').click();
                        return false;
                    }
                },
                {
                    name: options.okName || '确认',
                    className: options.okClass || 'btn-process',
                    callback: function () {
                        this.DOM.wrap.find('.sure').click();
                        return false;
                    },
                    focus: true
                }
            ],
            init: options.init
        });
        return showDialog;
    }
    var cancelAll = function (i, okcall, cancelcall) {
        var opts = {};
        if (i == 1) {
            opts.linename = "国内游";
            opts.linearea = "全部国内";
        } else if (i == 2) {
            opts.linename = "出境游";
            opts.linearea = "全部出境";
        } else if (i == 3) {
            opts.linename = "周边游";
            opts.linearea = "四川";
        }
        var clearAllLine = showDialog({
            obj: template("tpl_clearAllLine", opts),
            init: function () {
                $("#clearAllLine .cancel").click(function () {
                    if (cancelcall) {
                        cancelcall();
                    }
                    clearAllLine.close();
                });
                $("#clearAllLine .sure").click(function () {
                    if (okcall) {
                        okcall();
                    }
                    clearAllLine.close();
                })
            }
        });
    }
    //取消所有
    var removeAllSelected = function (alldom) {
        alldom.each(function () {
            var supplierinfo = $(this).parents('li').find("input[name=supplierInfo]");
            $.setChecked($(this), false);
            supplierinfo.val("");
            supplierinfo.attr("infonames", "");
            supplierinfo.prev().html("(全部)")
        })
    }
    //选择所有
    var setAllSelected = function (alldom) {
        alldom.each(function () {
            var supplierinfo = $(this).parents('li').find("input[name=supplierInfo]");
            $.setChecked($(this), true);
            supplierinfo.val($(this).val() + "#*");
            supplierinfo.attr("infonames", "");
            supplierinfo.prev().html("(全部)")
        })
    }
    var opensuccess = function () {
        outbound = true;
        $("#msg").remove();
        $("#outboundtipmessage").show();
        $("#abord-disabled").removeClass("disabled");
        $.setChecked($("input[name=all_abroad]"), true);
        $.setDisabled($("input[name=all_abroad]"), false);
        allBroad.each(function () {
            var supplierinfo = $(this).parents('li').find("input[name=supplierInfo]");
            $.setChecked($(this), true);
            supplierinfo.val($(this).val() + "#*");
            supplierinfo.attr("infonames", "");
            supplierinfo.prev().html("(全部)")
            $.setDisabled($(this), false);
        })
    }
    //
    var allEach = function (alldom, type) {
        alldom.each(function (i, element) {
            $(this).on("change", null, function () {
                var supplierinfo = $(element).parents('li').find("input[name=supplierInfo]");
                supplierinfo.prev().html("(全部)")
                if ($(this).attr("checked")) {
                    checkAllSelect(type);
                    supplierinfo.val($(this).val() + "#*");
                    supplierinfo.attr("infonames", "");
                } else {
                	 var $this = $(this);
                    if ($(this).val() == 1) {
                        //四川
                        cancelAll(3, function () {
                            supplierinfo.val("");
                            supplierinfo.attr("infonames", "");
                            checkAllSelect(type);
                        }, function () {
                            $.setChecked($this, true);
                            supplierinfo.val($this.val() + "#*");
                            supplierinfo.attr("infonames", "");
                            checkAllSelect(type);
                        })
                    }
                    if (type == 1) {
                        $.setChecked($("input[name=all_domestic]"), false);
                    } else if (type == 2) {
                        $.setChecked($("input[name=all_abroad]"), false);
                    }
                    var selected = false;
                    alldom.each(function () {
                        if ($(this).attr("checked")) {
                            selected = true;
                            return false;
                        }
                    });
                    //还有选中的
                    if (selected) {
                    	supplierinfo.val("");
                        supplierinfo.attr("infonames", "");
                    } else {
                        //没有选中的了
                        //supplierinfo.val("");
                        //supplierinfo.attr("infonames", "");
                        checkAllSelect(type);
                        /****/
                        cancelAll(type, function () {
                            supplierinfo.val("");
                            supplierinfo.attr("infonames", "");
                            checkAllSelect(type);
                        }, function () {
                            $.setChecked($this, true);
                        })
                    }
                }
            });
        })
    }

    /*
     * 复制
     * params
     * value    - 指定的供应商ids eg: id,id
     * line_i   - 操作的当前专线id
     * internal - Boolean true: 国内/国际
    */
    var copySetting = function (value, line_id, internal) {
        var domall = allDomestic;
        if (!internal) {
            domall = allBroad;
        }
        if (value == "*") {
            //全部供应商
            setAllSelected(domall);
        } else {
            $.get('/shop/copy.json', {
                region: internal ? 1 : 2,
                supplierIds: value.slice(0, -1)
            }).done(function(res){
                cp(res);
            });

            // domall.each(function (i, element) {
            //     var input_line_id = $(this).val(); // 该专线id
            //     if (input_line_id != line_id) {
            //         //所有专线
            //         $.each(allSupplierData, function (i, dataObj) {
            //             var lineId = dataObj.name;
            //             //相同专线
            //             if (input_line_id == lineId) {
            //                 // TODO
            //                 var supplerIds = value.split(",");
            //                 var children = dataObj.children;
            //                 if (dataObj.children) {
            //                     var newvalue = "";
            //                     var newname = "";
            //                     for (var j = 0; j < supplerIds.length; j++) {
            //                         var singleId = supplerIds[j];
            //                         $.each(children, function (k, child) {
            //                             if (singleId == child.name) {
            //                                 newvalue += singleId;
            //                                 newname += singleId + "," + child.value;
            //                                 newvalue += ",";
            //                                 newname += separator;
            //                             }
            //                         })
            //                     }
            //                     if (newvalue != "") {
            //                         //有找到相同的供应商
            //                         var supplierinfo = $(element).parents('li').find("input[name=supplierInfo]");
            //                         var checked = $(element).attr("checked");
            //                         if (checked) {
            //                             //以前的数据
            //                             var oldvalue = supplierinfo.val();
            //                             var oldvalueArr = oldvalue.split("#");
            //                             var oldname = supplierinfo.attr("infonames");
            //                             if (oldvalueArr[1] && oldvalueArr[1] == "*") {
            //                                 //选择的所有，不复制
            //                             } else {
            //                                 if (oldvalueArr[1] && oldvalueArr[1] != "") {
            //                                     //指定选择
            //                                     var oldArr = oldvalueArr[1].split(",");
            //                                     var newArr = newvalue.split(",");
            //                                     var union = Array.union(oldArr, newArr);
            //                                     supplierinfo.val(input_line_id + "#" + union.toString().replace("\\s+", ""));

            //                                     console.log(findSupplierNames(union));
            //                                     // 1157,寻秦之旅#1454383630809#1158,心灵之旅#1454383630809#1186,东北快车#1454383630809#
            //                                     supplierinfo.attr("infonames", findSupplierNames(union));

            //                                     supplierinfo.prev().html("(指定供应商)")
            //                                 }
            //                             }
            //                         } else {
            //                             //以前没有选中,直接复制
            //                             supplierinfo.val(input_line_id + "#" + newvalue);
            //                             supplierinfo.attr("infonames", newname);
            //                             supplierinfo.prev().html("(指定供应商)")
            //                             $.setChecked($(element), true);
            //                         }
            //                     }
            //                 }
            //                 return false;
            //             }
            //         })
            //     }
            // });
        }

        function cp(res){
            if(res.result.length){
                $.each(res.result, function(i, n){
                    var n = typeof n === 'string' ? JSON.parse(n) : n;
                    var lineId = n.lineId;
                    var element = $('[value="'+ lineId +'"]');
                    var newvalue = '';
                    var newname = '';
                    var supplierData = JSON.parse(n.supplier);

                    if(lineId != line_id){
                        $.each(supplierData, function(ii, s){
                            var last = ii == supplierData.length - 1;

                            newvalue += s.id + (last ? '' : ',');
                            newname += s.id + ',' + s.name + (last ? '' : separator);
                        });

                        var supplierinfo = $(element).parents('li').find("input[name=supplierInfo]");
                        var checked = $(element).attr("checked");
                        if (checked) {
                            //以前的数据
                            var oldvalue = supplierinfo.val();
                            var oldvalueArr = oldvalue.split("#");
                            var oldname = supplierinfo.attr("infonames");

                            oldname += (oldname ? separator : '');

                            if (oldvalueArr[1] && oldvalueArr[1] == "*") {
                                //选择的所有，不复制
                            } else {
                                if (oldvalueArr[1] && oldvalueArr[1] != "") {
                                    //指定选择
                                    var oldArr = oldvalueArr[1].split(",");
                                    var newArr = newvalue.split(",");
                                    var union = Array.union(oldArr, newArr);

                                    supplierinfo.val(lineId + "#" + union.toString().replace("\\s+", ""));

                                    // console.log(findSupplierNames(union));
                                    // // 1157,寻秦之旅#1454383630809#1158,心灵之旅#1454383630809#1186,东北快车#1454383630809#
                                    supplierinfo.attr("infonames", (oldname + newname).split(separator).uniquelize().join(separator));
                                    supplierinfo.prev().html("(指定供应商)")
                                }
                            }
                        } else {
                            //以前没有选中,直接复制
                            supplierinfo.val(lineId + "#" + newvalue);
                            supplierinfo.attr("infonames", newname);
                            supplierinfo.prev().html("(指定供应商)")
                            $.setChecked($(element), true);
                        }
                    }
                });
            }
        }
    }
    //开通弹层提示
    $(".disabled").hover(function () {
        $("#msg").show();
        setTimeout(function () {
            $("#msg").hide();
        }, 10000);
    });
    
    //开通弹层提示
    var agreen;
    $("#application").click(function () {
        var notice = showDialog({
                title: '申请出境资质',
                okName: '确认并开通',
                okClass: 'btn-common',
                width: 500,
                obj: template("tpl_notice", {}),
                init: function () {
                    var wrap = this.DOM.wrap;

                    $("#msg").hide();
                    agreen = $('#agreen').attr('checked');

                    //是否同意开通
                    $("#notice input[name='agreen']").change(function () {
                        agreen = $(this).attr("checked");
                       
                        if(agreen){
                            wrap.find('.btn-common').addClass('btn-process').removeClass('btn-common');
                        }else{
                            wrap.find('.btn-process').addClass('btn-common').removeClass('btn-process');
                        }
                    });
                    $("#notice .cancel").click(function () {
                        notice.close();
                    });
                    $("#notice .sure").click(function () {
                        if(!agreen){
                            $("#agreen").validationEngine('showPrompt', "请阅读并同意以上条款", 'error', null, true);
                            return false;
                        }
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: "/selfApplyOutbound?format=json",
                            //data:{m:Math.random()},
                            success: function (response) {
                                if (response.flag) {
                                    $.gmMessage("已开通销售出境产品功能", true);
                                    opensuccess();
                                    notice.close();
                                } else {
                                    $.gmMessage("操作失败", false);
                                }
                            },
                            error: function () {
                                alert("error")
                            }
                        })
                    })
                }
            }
        );
    });
    allEach(allDomestic, 1);
    //国内全选，反选
    $("input[name='all_domestic']").change(function () {
        var ele = $(this);
        if ($(ele).attr("checked")) {
            setAllSelected(allDomestic);
        } else {
            //removeAllSelected(allDomestic);
            /****/
            cancelAll(1, function () {
                //确认取消
                removeAllSelected(allDomestic);
            }, function () {
                // $(ele).attr("checked",true);
                $.setChecked(ele, true);
            })
        }
    });
    //outbound=="true"
    allEach(allBroad, 2);
    //出境全选，反选
    $("input[name='all_abroad']").change(function () {
        var ele = $(this);
        if ($(ele).attr("checked")) {
            setAllSelected(allBroad);
        } else {
            //removeAllSelected(allBroad);
            /****/
            cancelAll(2, function () {
                //确认取消
                removeAllSelected(allBroad);
            }, function () {
                $.setChecked($(ele), true);
            })
        }
    });
    //指定某些供应商
    $("input[name=someSupplier]").change(function () {
        if ($(this).attr("checked")) {
            $("#addSup").show();
            $.setChecked($("input[name=allSupplier]"), false);
        } else {
            $("#addSup").hide();
        }
    });
    //全部供应商
    $("input[name=allSupplier]").change(function () {
        if ($(this).attr("checked")) {
            $.setChecked($("input[name=someSupplier]"), false);
        }
    });
    //弹出某个专线下的全部供应商
    $(".allSupplier").each(function (i, ele) {
        $(this).on("click", null, function () {
            var $this = $(this);
            var internal = $(this).parents('.allDomestic').length;//;国内

            /**
            if ($(this).parents('ul').hasClass('allBroad')) {
                internal = false;

                if (outbound == "false") {
                    $("#msg").show();
                    setTimeout(function () {
                        $("#msg").hide();
                    }, 5000)
                    return;
                }
            }
            **/
            var linearea = "国内";
            if (!internal) {
                linearea = "出境";
            }
            var line_id = $(this).prev().children().val();
            var name = $.trim($(this).prev().text());
            var tid = new Date().getTime();
            var html = template("tpl_dialog", {linename: name, linearea: linearea});
            var oldnames = $(ele).next().attr("infonames");
            var valuedom = $(ele).next();
            var options = {
                width: 500,
                title: name + '<span class="sufo">，包含哪些供应商？</span>',
                obj: html,
                init: function () {
                    $form = $("#dialogForm").validationEngine({
                        validateNonVisibleFields: true,
                        validationEventTrigger: "",
                        showOneMessage: false,
                        maxErrorsPerField: 1,
                        scroll: true,
                        scrollOffset: 100,
                        autoHidePrompt: true,
                        autoHideDelay: 3000,
                        focusFirstField: true
                    });
                    //加载旧数据
                    if (oldnames && $.trim(oldnames) != "") {
                        $.setChecked($("input[name=allSupplier]"), false);
                        $.setChecked($("input[name=someSupplier]"), true);
                        $("#addSup").show();
                        var oldnamesarr = oldnames.split(separator);
                        for (var i = 0; i < oldnamesarr.length; i++) {
                            var namevalue = oldnamesarr[i];
                            if (namevalue != "") {
                                var namevaluearr = namevalue.split(",");
                                addOne(namevaluearr[0], namevaluearr[1]);
                            }
                        }
                    }
                    //指定某些供应商
                    $("input[name=someSupplier]").change(function () {
                        if ($(this).attr("checked")) {
                            $("#addSup").show();
                            $.setChecked($("input[name=allSupplier]"), false);
                            valuedom.val("");
                            valuedom.attr("infonames", "");
                            addOne();
                        } else {
                            $.setChecked($('#allSupplier'), true);
                            $("#addSup").find(".addSup").html("");
                            $("#addSup").hide();
                        }
                    });
                    //全部供应商
                    $("#showAllSupplier #allSupplier").on("change", null, function () {
                        var checked = $(this).attr("checked");
                        if (checked) {
                            $.setChecked($("input[name=someSupplier]"), false);
                            $("#addSup").find(".addSup").html("");
                            $("#addSup").hide();
                            valuedom.val(line_id + "#*");
                            valuedom.attr("infonames", "");
                        }
                    });
                    //添加一条
                    var h = 0;
                    $(".addOne").click(addOne);
                    function addOne(value, name) {
                        var length = $("#showAllSupplier input[name=supplierval]").length;
                        if (length >= maxsupplier) {
                            $("input[name=someSupplier]").validationEngine('showPrompt', "每条专线下最多添加" + maxsupplier + "个供应商", 'error', null, true);
                            return;
                        }
                        var html = '<div class="addSupplier"><input name="supplierval" type="hidden"/><input name="setsupplier" class="form-control supplier-pro-name validate[required]" autocomplete="off" type="text" data-errormessage="请输入供应商名称" placeholder="请输入供应商名称" data-url="supplier-select" /><button class="btn btn-default del" type="button" data-role="delete"><i class="fa fa-trash"></i></button></div>';
                        if (value && name) {
                            html = '<div class="addSupplier"><input name="supplierval" type="hidden" value="' + value + '"/><input name="setsupplier" value="' + name + '" class="form-control supplier-pro-name validate[required]" autocomplete="off" type="text"  placeholder="请输入供应商名称" data-url="supplier-select" /><button class="btn btn-default del" type="button" data-role="delete"><i class="fa fa-trash"></i></button></div>';
                        }
                        var t = $("#addSup").scrollTop() + 40;
                        $("#addSup").scrollTop($("#addSup").scrollTop() + 40);
                        var $new = $(html).appendTo($(".addSup"));
                        //var target = $("#addSup .supplier-pro-name:last");
                        //var index = $("#addSup .supplier-pro-name").length-1;
                        autoComplete(function (e, d) {
                            if (d) {
                                var set = true;
                                var length = $("#showAllSupplier input[name=supplierval]").length;
                                if (length > d.domIndex) {
                                    $("#showAllSupplier input[name=supplierval]").each(function (index) {
                                        if ($.trim($(this).val()) != "") {
                                            if (index != d.domIndex) {
                                                if ($(this).val() == d.id) {
                                                    set = false;
                                                    return false;
                                                }
                                            }
                                        }
                                    })
                                    if (set) {
                                        if (d.id) {
                                            d.dom.prev().val(d.id);
                                        } else {
                                            d.dom.prev().val("");
                                            d.dom.validationEngine('showPrompt', "没有该供应商", 'error', null, true);
                                        }
                                    } else {
                                        d.dom.val("");
                                        d.dom.prev().val("");
                                        d.dom.validationEngine('showPrompt', "该供应商已经存在", 'error', null, true);
                                        return false;
                                    }
                                }
                            } else {
                                e.dom.prev().val("");
                                var nextdom = e.dom.next();
                                if (nextdom && e.dom.val() != "") {
                                    var dis = nextdom.css("display");
                                    if (dis && dis == "none") {
                                        e.dom.validationEngine('showPrompt', "没有该供应商", 'error', null, true);
                                    }
                                }
                            }
                        }, line_id, $new.find('.supplier-pro-name'));
                        $("#showAllSupplier .supplier-pro-name").on("blur", null, function (e) {
                            if ($.trim($(this).val()) == "") {
                                $(this).prev().val("");
                            } else {
                                /**
                                 if(!existsupplier($(this).val())){
									$(this).prev().val("");
									$(this).validationEngine('showPrompt',"没有该供应商",'error',null,true);
								}
                                 **/
                            }
                        });
                        if ($(".addSupplier").length == 1) {
                            $(".addSupplier .del:eq(0)").remove();
                            // $(".addSupplier:eq(0)").css("background","#fff")
                        } else {
                            if ($(".addSupplier:eq(0)").find(".del").length == 0) {
                                $(".addSupplier:eq(0)").append('<button class="btn btn-default del" type="button" data-role="delete"><i class="fa fa-trash"></i></button>')
                            }
                            // $(".addSupplier").css("background","#FF7F79")
                        }
                        $(".addSupplier .del").each(function () {
                            $(this).on("click", null, function () {
                                var len = $(".del").length;
                                if (len > 1) {
                                    $(this).parent().remove();
                                    $("#addSup").focus();
                                }
                                len = $(".del").length;
                                if (len == 1) {
                                    $(".addSupplier .del:eq(0)").remove();
                                    $(".addSupplier:eq(0)").css("background", "#fff")
                                }
                            })
                        });

                        allSupplier && allSupplier._reset();
                    }
                }
            }
            var allSupplier = showDialog(options);
            $("#showAllSupplier").find(".cancel").click(function () {
                allSupplier.close();
            });
            $("#showAllSupplier").find(".sure").click(function () {
                if (!isValid()) {
                    return;
                }
                var hasError = false;
                $("#showAllSupplier .supplier-pro-name").each(function () {
                    if ($.trim($(this).val()) == "") {
                        $(this).prev().val("");
                    } else {
                    	if($(this).prev().val()==""){
	                    	var data = existsupplier(line_id,$(this).val());
							if(data.exist){
								if($(this).prev().val()!=data.id){
									$(this).prev().val(data.id);
								}
							}else{
								$(this).prev().val("");
								$(this).validationEngine('showPrompt',"没有该供应商",'error',null,true);
								hasError = true;
								return;
							}
                    	}
                    }
                });
                if (hasError) {
                    return;
                }
                var checkedall = $("#showAllSupplier #allSupplier").attr("checked");
                var value = "";
                //infonames
                var names = "";
                if (checkedall) {
                    value = "*";
                } else {
                    $("#showAllSupplier input[name=supplierval]").each(function () {
                    	if(existsupplier(line_id,$(this).next().val())){
							if($.trim($(this).val())!=""){
								value = value +$(this).val()+",";	
								names = names+ $(this).val()+","+$(this).next().val();
								names = names+separator;
							}
						}
                    })
                }
                var copy = $("#showAllSupplier #copy").attr("checked");
                var destvalue = line_id + "#" + value;
                if (value != "") {
                    if (value == "*") {
                        $this.html("(全部)");
                        $.setChecked($(ele).parent().find(':checkbox'), true)
                        valuedom.val(destvalue);
                        valuedom.attr("infonames", "");
                    } else {
                        //指定供应商
                        valuedom.val(destvalue);
                        valuedom.attr("infonames", names);
                        $.setChecked($(ele).parent().find(':checkbox'), true)
                        $this.html("(指定供应商)");
                    }
                    if (copy) {
                        copySetting(value, line_id, internal);
                    }
                } else {
                    $.setChecked($(ele).parent().find(':checkbox'), false)
                    valuedom.val("");
                    valuedom.attr("infonames", "");
                }
                if (internal) {
                    checkAllSelect(1);
                } else {
                    checkAllSelect(2);
                }
                //关闭
                allSupplier.close();
            })
        });
    });

    // 修改网址
    var old_domain = $('#domain').val(),
        host_name = '.gmmtour.com',
        edit_domain = '';

    $('#domainEdit').on('click', function(){
        $.dialog({
            title: '微网站网址修改',
            isClose: true,
            width: 530,
            minHeight: 200,
            isOuterBoxShadow: false,
            padding: "0px",
            content: template("tpl_domain", {
                old_domain: old_domain + host_name,
                host_name: host_name
            }),
            lock: true,
            fixed: true,
            button: [
                {
                    name: '取消',
                    callback: function () {
                       
                    }
                },
                {
                    name: '确定',
                    className: 'btn-process',
                    callback: function () {
                        var _domain = this.DOM.wrap.find('.new-domain'),
                            domain = _domain.val(),
                            temp  = true;

                        if(!/^[A-Za-z0-9]{7,15}$/.test(domain)){
                          
                            _domain.validationEngine('showPrompt', '限7-15位数字/字母', 'error');
                            return false;
                        }else{
                            

                            $.ajax({
                                    url: '/shop/checkdomain',
                                    type: 'GET',
                                    data: "domain="+domain+"&format=json",
                                     async: false,
                                    success:function(data){
                                        if(!data.success){
                                            _domain.validationEngine('showPrompt', data.message, 'error');
                                            temp = false;
                                        }
                                    },
                                    error:function(){
                                         _domain.validationEngine('showPrompt',"验证失败,请稍候...", 'error');
                                          temp = false;
                                    }
                                })

                           
                        }
                        if(temp){
                            $('#domainShow').text(domain);
                            $('#domain').val(domain);
                            edit_domain = domain;
                        }   
                        
                        return temp;
                    }
                }
            ],
            init: function(){
                this.DOM.wrap.find('.new-domain').focus().val(edit_domain);
            }
        });
    });
}