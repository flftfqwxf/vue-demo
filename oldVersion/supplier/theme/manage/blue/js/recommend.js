var message = "";
$(function() {
    var update = false;
    if (message != "" && message != "null") {
        showMsg(message)
    }

    function initGmgallery(state) {
        $.each($('button[name="gmbutton"]'), function(index, value) {
            var self = $(this);
            $(value).gmgallery({
                touristLineObj: $("#lineSelect"),
                multiSelect: false,
                //imageTypeObj: $("#galleryImageType"),
                imageType: "s_recommend_index",
                operateType: "tour_corver_image",
                options_id: new Date().getTime(),
                onOk: function(image) {
                    self.closest('.pub-box-list').find("img").attr("src", image.url);
                    self.closest('li').find(".itemlarge").find("input[data-name=imageUrl]").val(image.url);
                    if (self.hasClass('btn-cover')) {
                        self.hide();
                    }


                }
            })
        })
    }


    $.each($(".webupload"), function(index, value) {
        var self = $(this),
            label;

        if (self.closest('li').find('input[data-name="pcImageUrl"]').val()) {
            label = "更换图片";

        } else {
            label = "添加图片";
            self.closest('li').find(".btn-cover").show();
            self.closest('.replace-img').hide();

        }

        webUpload({
            "target": ".webupload" + index,
            "operateType": "other_image",
            allowType: 'siterecbig',
            minRadio: "",
            maxRadio: "",
            label: label,
            //allowWidth: -1,
            //allowHeight: -1,
            fileSingleSizeLimit: 2 * 1024 * 1024,
            success: function(response, target) {
                console.log(this);
                $(target).closest('.pub-box-list').find("img").attr("src", response.url + "@100h_100w_1e_1c");
                $(target).closest('li').find(".itemlarge").find("input[data-name=pcImageUrl]").val(response.url);
            },
            error: function(id, message) {
                showMsg(message)
            }
        });

    })

    $.each($(".webupload-t"), function(index, value) {
        var self = $(this),
            label;

        if (self.closest('li').find('input[data-name="pcImageUrl"]').val()) {
            label = "更换图片";

        } else {
            label = "添加图片";
        }

        webUpload({
            "target": ".webupload-t" + index,
            "operateType": "other_image",
            allowType: 'siterecbig',
            minRadio: "",
            maxRadio: "",
            label: label,
            //allowWidth: -1,
            //allowHeight: -1,
            fileSingleSizeLimit: 2 * 1024 * 1024,
            success: function(response, target) {
                $(target).closest('.pub-box-list').find("img").attr("src", response.url + "@100h_100w_1e_1c");
                $(target).closest('li').find(".itemlarge").find("input[data-name=pcImageUrl]").val(response.url);
                $(target).hide();
            },
            error: function(id, message) {
                showMsg(message)
            }
        });

    })



    initGmgallery();
    // initCompuat();

    function showMsg(msg, type) {
        type = type ? type : "danger";
        var tpl = $('<span class="common-tips btn btn-' + type + '" type="msg" style="visibility: hidden;z-index:999999;">' +
            '<i class="gm-icon gm-close"></i>' + msg +
            '</span>');
        if ($(".common-tips[type=msg]").size() == 0) {
            $("body").append(tpl);
            tpl.css({
                "position": "fixed",
                "top": "3px",
                "left": "50%",
                "margin-left": "-" + (tpl.outerWidth(true) / 2) + "px"
            });
            tpl.css("visibility", "visible");
            setTimeout(function() {
                tpl.fadeOut("slow", function() {
                    tpl.remove();
                })
            }, 3000);
        }
    };



    $(".checkBtn").click(function() {
        var $this = $(this);
        var input = $(this).closest('.input-group').find('input');
        input.val(input.val().replace(/\D/g, ''));
        var value = input.val();
        var li = $this.closest('li')
        var parent = $this.closest('li').find('.itemlarge');
        var validInput = parent.find("input[data-name=valid]");
        var productIdInput = parent.find("input[data-name=productId]");
        var imgPC = parent.find("input[data-name=pcImageUrl]");
        var imageUrlInput = parent.find("input[data-name=imageUrl]");
        var lineInput = parent.find("input[data-name=lineId]");
        var productNameInput = parent.find("input[data-name=productName]");
        var oldValue = productIdInput.val();
        if (value != "") {

            var toset = true;
            if (toset) {
                var id = value;

                var oldLineId = lineInput.val();
                if (oldValue != value) {
                    input.next().addClass('fa fa-refresh fa-spin');
                    update = true;
                    $.ajax({
                        url: "/recommend/" + id + "?format=json&m=" + Math.random(),
                        type: "GET",
                        async: false,
                        dataType: "json",
                        success: function(json) {
                            if (json.result && json.result.success != "undefined" && json.result.success == false && json.result.isReload == true) {
                                $.gmMessage(json.result.message, false);
                                return;
                            } else {}

                            if (json.product) {
                                var product = json.product;
                                console.log(product.name);
                                if (product.available == true && product.onShelf == true && product.selfSupport == false && product.deadline == false) {
                                    validInput.val("true");
                                    productIdInput.val(product.id);
                                    lineInput.val(product.touristLine.id);
                                    li.find(".input-product-number").text(product.name);
                                    //和上一次专线不一样
                                    if (oldLineId != product.touristLine.id) {
                                        imageUrlInput.val("");
                                    }
                                    productNameInput.val(product.name);
                                    input.next().removeAttr('class');
                                    input.next().addClass('fa fa-fw fa-check-circle form-control-feedback ');
                                    input.next().css({
                                        color: "#4bc5d1"
                                    })
                                    li.find("img").attr('src',"");
                                    li.find(".webuploader-pick").text("添加图片");
                                    li.find(".input-product-number").removeAttr('style');
                                    li.find(".J-add-btn").removeClass('has-error');
                                    li.find("img").attr({
                                        "src": "",
                                        alt: ""
                                    });
                                    li.find("i").attr({
                                        "data-original-title": '',
                                        "data-errormessage": ''
                                    })
                                    isConform();
                                    initGmgallery();
                                    li.find(".form-control").css("color", "#000");
                                } else {
                                    input.next().removeAttr('class');
                                    input.next().addClass('fa fa-exclamation-circle text-danger form-control-feedback ');
                                    input.next().css({
                                        color: "#f98282"
                                    })
                                    li.find(".input-product-number").removeAttr("style");
                                    li.find(".input-product-number").attr("title",product.name);
                                    li.find(".form-control").css("color", "#000");
                                    input.next().remove();
                                     li.find(".input-product-number").html(product.name);
                                    input.after('<i data-role="button" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="产品已过期，请及时更新" data-errormessage="请输入产品编号" class="fa fa-exclamation-circle text-danger form-control-feedback" style="color: rgb(249, 130, 130);"></i>')
                                    li.find(".input-product-number").text();
                                    $this.closest('.input-group').addClass('has-error');
                                }
                            } else {
                                isProductBtn()

                            }
                        },
                        error: function() {
                            //$this.show();
                        }
                    })
                } else if (oldValue != "") {
                    parent.find(".imgBtn").removeAttr("disabled").css("background", "#fff");
                }
            }
        } else {
            update = true;
            //clearSet(parent)
            $this.parent().find(".gm-warning").remove();
            isProductBtn();
        }


        function isProductBtn() {
            var li = $this.closest('li');
            li.find(".input-product-number").text("产品不存在");
            li.find(".input-product-number").css("color", "#e86262");
            li.find(".form-control").css("color", "#e86262");
            input.next().removeAttr("class");
            $this.closest('.input-group').addClass('has-error');
            //删除页面已经的有的图片
            li.find("img").attr({
                "src": "",
                alt: ""
            });
            //禁用上传的按钮
            li.find(".pub-box-list").find("button").attr("disabled", true);
            li.find(".uploadbeforeUp").attr("disabled", true);
            li.find(".btn-cover").show();

            //  产品不存在设置input.hidden的值
            validInput.val("true");
            productIdInput.val("");
            imgPC.val("");
            lineInput.val("");
            imageUrlInput.val("");
            productNameInput.val("");
        }



        function isConform() {
            var li = $this.closest('li');
            li.find(".btn-cover").hide();
            li.find('button[name="gmbutton"]').show();
            li.find(".webupload-t").show();

            li.find(".pub-box-list").find("button").removeAttr("disabled");
        }



        $(this).blur();

    });


    $(".form-control").on("keyup", function() {
        var $this = $(this);
        var input = $(this).closest('.input-group'),
            li = $(this).closest('li');
        var parent = $this.closest('li').find('.itemlarge');
        var validInput = parent.find("input[data-name=valid]");
        var productIdInput = parent.find("input[data-name=productId]");
        var imgPC = parent.find("input[data-name=pcImageUrl]");
        var imageUrlInput = parent.find("input[data-name=imageUrl]");
        var lineInput = parent.find("input[data-name=lineId]");
        var productNameInput = parent.find("input[data-name=productName]");

        if (!($(this).val())) {
            input.find("button").attr('disabled', true);
            input.find("button").removeClass("btn-info");
            input.removeClass("has-error");
            li.find(".input-product-number").text("输入编号后产品名称将显示在这里");
            li.find(".input-product-number").removeAttr("style");
            //删除页面已经的有的图片
            li.find("img").attr({
                "src": "",
                alt: ""
            });

            //禁用上传的按钮
            li.find(".pub-box-list").find("button").attr("disabled", true);
            li.find(".uploadbeforeUp").attr("disabled", true);
            var len = li.find(".pub-box-list-2").find('.btn-temp').length;
            var len1 = li.find(".pub-box-list-1").find('.btn-temp').length;
            if (!len1) {
                li.find(".not-img-btn").show();
                // li.find(".pub-box-list-1").find("img").next().after('<button class="btn btn-default webupload webupload0 btn-sm btn-temp" disabled="disabled" style="display:block;" type="button">添加图片</button>');
            }

            li.find("i").removeAttr('class');
            li.find(".btn-cover").show();

            //  产品不存在设置input.hidden的值
            validInput.val(true);
            productIdInput.val("");
            imgPC.val("");
            lineInput.val("");
            imageUrlInput.val("");
            productNameInput.val("");
        } else {
            input.find("button").removeAttr('disabled');
            input.find("button").addClass("btn-info");
            input.find("button").removeClass("disabled");

        }

    });



    //  添加form验证
    $("#savebtn").on("click", function() {
        var flag = true;
        $.each($(".J-add-btn"), function(index, value) {
            if ($(".J-add-btn").find(".btn-info").length > 0) {
                if ($(value).find(".btn-info").length > 0) {
                    var itemlarge = $(value).find(".btn-info").closest('li').find(".itemlarge");
                    var input = [];
                    input.push(itemlarge.find('input[data-name="pcImageUrl"]'));
                    input.push(itemlarge.find('input[data-name="imageUrl"]'));
                    input.push(itemlarge.find('input[data-name="productId"]'));
                    $.each(input, function(index, value) {
                        if (!$(value).val()) {
                            flag = false;
                            if (!input[0].val() && !input[1].val()) {
                                  console.log(10);
                                showMsg("请设置产品推荐图");
                                console.log(10);
                            } else {
                                  console.log(11111);
                                showMsg($(value).attr("data-msg"));
                            }

                        }

                    })
                }

            } else {
                showMsg("请设置产品");
                flag = false;

            }
        })

        flag && $(".editIndex_form").submit();


    })



    $(".pub-box-list").hover(function() {
        var li = $(this).closest('li');
        if (li.find(".J-add-btn").find(".btn-info").length > 0) {
            if (li.find('.pub-box-list-1').find("img").attr("src")) {
                $(this).closest('.pub-box-list-1').find(".replace-img").fadeIn(200);
                li.find(".replace-img").find(".webuploader-pick").text("更换图片");
            }

            if (li.find('.pub-box-list-2').find("img").attr("src")) {
                $(this).closest('.pub-box-list-2').find(".replace-img").fadeIn(200);
            }
        }

    }, function() {
        $(this).find(".replace-img").fadeOut(200);
    })

})