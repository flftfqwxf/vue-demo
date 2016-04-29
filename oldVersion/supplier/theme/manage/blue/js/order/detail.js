var s;

var leaveTimer=$(".rema-time");
if(leaveTimer.size()>0&&parseInt(leaveTimer.attr("timemillis"))>0){
    $(".rema-time span").countDown({
        leaveTime:parseInt(leaveTimer.attr("timemillis"))/1000,
        format:"hh时mm分ss秒",
        onEnd:function(){
    	    leaveTimer.remove();
        }
    });
}
else{
    leaveTimer.remove();
}

$(function() {
    var orderManage = {
        getUploadState: false, // 获取上传的状态
        init: function() {

            this.event("body");
        },
        _artDialog: function(option) {
            $.dialog(option);

            // 上传出团通知书
            // this._uploadNotice();
        },
        _uploadNotice: function(uploadBtn, label, activeBtn) {
            var _this = this;
            webUpload({
                "target": uploadBtn || '.upload-group-notice',
                "operateType": "order_attach",
                label: label || "上传出团通知书",
                accept: {
                    title: 'Images',
                    extensions: 'doc,pdf,ppt,txt',
                },
                fileSingleSizeLimit: 10 * 1024 * 1024,
                success: function(response) {
                    if (response.success) {
                        
                        
                        //重新上传只执行一次初始化
                        if ($(".new-upload").is(":hidden")) {
                            $(".upload-have-notice").addClass("pdt50");
                            _this._uploadNotice(".upload-again", "重新上传", activeBtn);
                            
                            $(".btn-cancel").hide();
                            $(".new-upload").removeClass('hidden');
                        }
                        
                        // 上传成功后调用  
                        response.message = JSON.parse(response.message);
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
            $(wrapperTarget).on('click', '.J-upload', function() {
                this.getUploadState = true;
                 var _this = $(this);
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
                    }, {
                        name: "取消",
                        className: 'btn-cancel',
                        callback: function() {

                        }
                    }, {
                        name: "确定",
                        className: 'btn-process',
                        callback:function(){
                            location.reload();
                        }
                    }, ]

                })
                // self._uploadNotice(".new-upload", "重新上传");
                self._uploadNotice(null, null, _this);
            }).on('click', '.btn-new-standard', function() {

                if ($(this).attr('data-state') === "reach-terms") {
                    $('label[data-state="other"]').removeClass('active');
                    $('.refund-textarea').addClass('hidden');
                } else {

                    $('label[data-state="reach-terms"]').removeClass('active');
                    $('.refund-textarea').removeClass('hidden');
                    $(this).hasClass('active') && $('.refund-textarea').addClass('hidden');

                }

            }).on('click', '[action="view"]', function() {
                var _this = $(this);
                var btn = [{
                    name: "重新上传",
                    className: 'new-upload',
                    callback:function(){
                  	 $(".upload-again label").click();
                  	 return false;
                    }
                }, {
                    name: "确定",
                    className: 'btn-process',
                    callback:function(){
                        location.reload();
                    }
                }];

                if ($(this).attr("distributor") != undefined) {
                    btn = [{
                        name: "取消"
                    }, {
                        name: "下载",
                        className: 'btn-process',
                        callback: function() {
                            window.location.href = $(".upload-have-notice a").attr("href");
                            return false;
                        }
                    }];
                }

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
                    button: btn

                });

                //上传组件调用
                self._uploadNotice(".upload-again", "重新上传", _this);

            }).on('click', '[action="view2"]', function() {
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
            })

        }
    }

    orderManage.init();

    //确认留位
    $("#J-confirm").click(function() {
        $("#J-confirm-dialog").window({
            title: "确认留位",
            button: [{
                name: "取消",
                callback: function() {
                    // alert('取消回调')
                }
            }, {
                name: "确定",
                className: 'btn-process',
                callback: function() {
                    $.ajax({
                            url: '/order/'+orderId+'/confirm/',
                            // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
                            data: {
                                hours: $('.J-select-time option:selected').val()
                            },
                        })
                        .done(function() {
                            location.reload();
                        });
                }
            }]
        });
    });


    //取消订单
    $("[action=J-cancel]").click(function() {
    	var url = $(this).attr("href");
        $.confirm("你确定要取消订单吗？", false, function() {
            $.ajax({
                    url: url,
                    // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
                    data: {
                        hours: $('.J-select-time option:selected').val()
                    },
                })
                .done(function() {
                    location.reload();
                });
        }, function() {})
    });

});
