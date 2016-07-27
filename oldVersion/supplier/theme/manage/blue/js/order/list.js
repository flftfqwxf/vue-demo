//倒计时
var nowTime = $("#nowDate").val();
$(".table-hover tbody tr").each(function() {
    var temp = $(".alert-danger", $(this));
    if (nowTime <= temp.attr("attr_end_time")) {
        temp.countDown({
            leaveTime:parseInt(temp.attr("timemillis"))/1000,
            text: temp.attr("title"),
            onEnd:function(dom){
        	dom.remove();
            }
        });
    }
});


$("#productId").keyup(function(){
    $(this).val($(this).val().replace(/[^\d]/g,""));
}).blur(function(){
    $(this).val($(this).val().replace(/[^\d]/g,""));
});

$(function() {

    //清空条件
    $("#J-reset").click(function() {
        $(".form-wrapper .form-group input:not([type='checkbox']),.form-wrapper .form-group select").val("");
        $(".form-wrapper .form-group input[type='checkbox']:checked").parent('.active').removeClass('active');
        $(".form-wrapper .form-group input[type='checkbox']:checked").attr('checked', false);
    });
    
    //导出
    $("#J-export").click(function(){
	window.location.href="/order/export?format=xls&"+$("form.page-main").serialize();
    });
    
    /*禁止手机号和验证码输入非数字*/
    keyNum($("#newPhone"));
    keyNum($("#checkCode"));

    //设置接收短信的手机号
    if(location.href.indexOf("distributor.")>=0){
	setNewPhone("/distributor");
    }
    else {
	setNewPhone("/supplier");
    }

    var orderManage = {
        getUploadState: false,
        // 获取上传的状态
        init: function() {

            this.event("body");
        },
        _artDialog: function(option) {
            $.dialog(option);
        },
        _uploadNotice: function(uploadBtn, label, activeBtn) {
            var _this = this;
            webUpload({
                "target": uploadBtn || '.upload-group-notice',
                "operateType": "order_attach",
                label: label || "上传出团通知书",
                accept: {
                    title: '文档',
                    extensions: 'doc,pdf,ppt,txt',
                },
                fileSingleSizeLimit: 10 * 1024 * 1024,
                success: function(response) {
                    // 上传成功后调用
                    if (response.success) {

                        //重新上传只执行一次初始化
                        if ($(".new-upload").is(":hidden")) {
                            $(".upload-have-notice").addClass("pdt50");
                            _this._uploadNotice(".upload-again", "重新上传", activeBtn);
                            
                            $(".btn-cancel").hide();
                            $(".new-upload").removeClass('hidden');
                        }
                        
                        response.message=$.parseJSON(response.message);
                        $(".upload-have-notice").html('<a href="/download?file='+response.message.url+'&name=' + response.name + '">' + response.name + '</a>');
                        
                        //入库
                        var file=response.message;
                        var orderAttachment = {};
                        orderAttachment.url = file.url;
                        orderAttachment.filePath = file.url;
                        orderAttachment.name = file.name;
                        orderAttachment.size = file.size;
                        $.ajax({
                             url:"/order/"+activeBtn.attr("order-id")+"/file.json",
                             data:orderAttachment,
                             type:"post",
                             dataType:"json",
                             success:function(){
                        	 //$.showMsg("出团通知书上传成功。","success");
                             },
                             error:function(){
                        	 $.showMsg("出团通知书上传失败，请重新上传。","danger");
                             }
                        });
                    }
                },
                error: function(id, message) {
                    $.showMsg(message,"danger");
                }
            });

        },
        event: function(wrapperTarget) {
            var self = this;
            $(wrapperTarget).on('click', '[action=upload]',
            function() {
                var _this = $(this);
                this.getUploadState = true;
                self._artDialog({
                    title: "上传出团通知书",
                    content: template("upload-have-notice-f", {}),
                    width: 462,
                    height: 102,
                    lock: true,
                    fixed: true,
                    padding: "10px 0",
                    button: [{
                        name: "重新上传",
                        className: 'new-upload hidden',
                        callback:function(){
                   	 $(".upload-again label").click();
                   	 return false;
                        }
                    },
                    {
                        name: "取消",
                        className: 'btn-cancel'
                    },
                    {
                        name: "确定",
                        className: 'btn-process',
                        callback:function(){
                            location.reload();
                        }
                        
                    },
                    ]

                });
                // 上传出团通知书
                self._uploadNotice(null, null, _this);
                
            }).on('click', '[action="refund"]',
            function() {
                self._artDialog({
                    title: "退款",
                    content: template("refund-dialog", {}),
                    width: 462,
                    height: 102,
                    lock: true,
                    fixed: true,
                    padding: "10px 0",
                    button: [
                             
                    {
                        name: "取消",
                        callback: function() {

                        }
                    },
                    {
                        name: "确认提交",
                        className: 'btn-process',
                        callback: function() {

                        }
                    }]

                });

            }).on('click', '[action="listview"]',function() {
        	var _this=$(this);
        	var btn=[
                         {
                             name: "重新上传",
                             callback:function(){
                        	 $(".upload-again label").click();
                           	 return false;
                             }
                         },
                         {
                             name: "确定",
                             className: 'btn-process',
                             callback:function(){
                        	 location.reload();
                             }
                         }
                ];
        	
        	if($(this).attr("distributor")!=undefined){
        	    btn=[
        	         {
        	             name:"取消"
        	         },
        	         {
        	             name:"下载",
        	             className: 'btn-process',
                             callback: function() {
                        	 window.location.href=$(".upload-have-notice a").attr("href");
                             }
        	         }
        	    ];
        	}
        	
                self._artDialog({
                    title: "查看出团通知书",
                    content: template("view-have-notice-f", {name:_this.attr("attr_name"),href:_this.attr("attr_href")}),
                    width: 462,
                    height: 102,
                    lock: true,
                    fixed: true,
                    padding: "10px 0",
                    button:btn

                });
                
                //上传组件调用
                self._uploadNotice(".upload-again", "重新上传",_this);

            }).on('click', '[action="listview2"]', function() {
                var _this = $(this);

                self._artDialog({
                    title: "查看出团通知书",
                    content: template("view-have-notice-f", {
                        name: _this.attr("attr_name"),
                        href: _this.attr("attr_href")
                    }),
                    width: 462,
                    height: 102,
                    lock: true,
                    fixed: true,
                    padding: "10px 0",
                    button: [
                        {
                            name:"取消"
                        },
                        {
                            name:"下载",
                            className: 'btn-process',
                            callback: function() {
                        	 window.location.href=$(".upload-have-notice a").attr("href");
                            }
                        }
                    ]

                });
            }).on('click', '.btn-new-standard',
            function() {

                if ($(this).attr('data-state') === "reach-terms") {
                    $('label[data-state="other"]').removeClass('active');
                    $('.refund-textarea').addClass('hidden');
                } else {

                    $('label[data-state="reach-terms"]').removeClass('active');
                    $('.refund-textarea').removeClass('hidden');
                    $(this).hasClass('active') && $('.refund-textarea').addClass('hidden');

                }

            });
        }
    }
    
    //表单列表管理功能初始化
    orderManage.init();
    
    //列表导航筛选
    $("#order-status li").click(function() {
	$(".page-main input[type=text],.form-wrapper .form-group select").val("");
    $(".form-wrapper .form-group input[type='checkbox']:checked").parent('.active').removeClass('active');
    $(".form-wrapper .form-group input[type='checkbox']:checked").attr('checked', false);
        $("#orderStatus").val($(this).attr("attr_value"));
        $("#from-submit").click();
    });
});