;!function(controller) {
    // use strict
    'use strict';

    controller.using("eDate");
    controller.using("tools");
    controller.using("zclip");
    controller.using("slider");
    controller.using("compare");
    controller.using("eCalendar");

    controller.modules = {
        staticVar: function() {
            this.staticVar = {
                "nav": $("#J-p-nav"),
                "navH": $("#J-p-nav").outerHeight(true),
                "days": $("#J-days"),
                "daysLi": $("#J-days .days-list>li"),
                "daysNav": $("#J-p-days-nav"),
                "pics": $("#J-pics"),
                "picsLength": $("#J-pics .pic-small img").size(),
                "picsLi": $("#J-pics li"),
                "picsTimer": new Object(),
                "picsDelay": 5000,
                "picsAnimate": false,
                "navClick": false,
                "ajaxClick": false
            };
        },
        init: function() {
            // 初始化静态变量
            this.staticVar();

            // 我要参团
            this.joinHandler();

            // 产品图片集交互
            this.productPicsEvent();

            // 日程安排图片处理
            this.daysImgs();

            // 价格须知、注意事项里面图片处理
            this.otherInfoImgsHandler();

            // 亮点图片处理
            this.highlightsHandler();

            // 编辑器录入空、或换行的数据处理
            this.emptyRemove();

            // 日程概览交互
            this.surveyHandler();

            // 日程安排导航
            this.daysNav();

            // 事件
            this.event();

            // 对比功能
            this.compare();

        },
        eCalendar: function() {
            var id = $("#J-p-info").attr("data-id");
            $.getJSON("/product/" + id + "/prices",
            function(serverData) {
                var prices = serverData && serverData.productPrices|| [];
                $("[name=tempDate]").eDate({
                    months: 2,
                    direction: 'future',
                    disablePreviousYear: true,
                    disableNextYear: true,
                    format: "YYYY年MM月DD日",
                    onSelected: function(date) {
                	$(".p-calendar .selected").removeClass("selected");
                        $("#J-goDate .price-detail").size() == 0 && $("#J-goDate").append("<span class=\"price-detail\"></span>");
                        var dateId = date.replace("年", "-").replace("月", "-").replace("日", ""),
                        pricesDetail = $(".e-in-month[data-date=" + dateId + "].e-active").attr("data-original-title");
                        $("#J-goDate .price-detail").text(pricesDetail != "提交订单后客服将会联系您确认该日报价" ? pricesDetail: "");
                        $("[name=tempDate]").val(date);
                    },
                    drawCompate: function() {
                        var date, pricesDetail;
                        $("span[data-date]").removeAttr("data-original-title");
                        $(".e-in-month.e-active").attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", "提交订单后客服将会联系您确认该日报价");
                        $(prices).each(function(i, v) {
                            date = v.date.replace(" 00:00:00", "");
                            pricesDetail = $(v.dateGroupPrices[0].prices).map(function(iii, vvv) {
                                return vvv.type + "：￥" + vvv.price;
                            }).get().join("　");

                            $(".e-in-month[data-date=" + date + "].e-active").attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", pricesDetail);
                        });
                    }
                });
                
                $("#J-nCalendar").eCalendar({
                	dataHandler:function(){
                	       $(".fc-today:last").text("今天");
                	       
                	       //显示价格
                	       var date,pricesDetail,dom,today=$(".fc-today:last").attr("data-date");
                	       $(prices).each(function(i, v) {
                                   date = v.date.replace(" 00:00:00", "");
                                   pricesDetail = $(v.dateGroupPrices[0].prices).map(function(iii, vvv) {
                                       return vvv.type + "：￥" + vvv.price;
                                   }).get().join("　");
                                   dom=$(".fc-day-number[data-date="+date+"]");
                                   if((!dom.hasClass("fc-other-month"))&&(dom.hasClass("fc-future")||dom.hasClass("fc-today"))){
                                       dom.attr("data-detail",pricesDetail).append("<em class=\"date-price\">￥"+v.minPrice+"起</em>");
                                   }
                               });
                	       
                	       //当月不能再切换小于当月
                	       if($(".fc-today:last").size()>0){
                		   $(".fc-left").css("visibility","hidden");
                	       }
                	       else{
                		   $(".fc-left").removeAttr("style");
                	       }
                	       
                	       //今天之前禁用
                	       $(".fc-day-number").each(function(){
                		   if(!$(this).hasClass("fc-other-month")&&$(this).attr("data-date")<today){
                		       $(this).addClass("fc-disabled");
                		   }
                	       });
                	},
    			selectable: false,
    			dayClick: function(date) {
    			    $("[name=tempDate]").blur();
    			    var dom=$(".fc-day-number[data-date="+date.format()+"]");
    			    if((!dom.hasClass("fc-other-month"))&&(!dom.hasClass("fc-disabled"))&&(dom.hasClass("fc-future")||dom.hasClass("fc-today"))){
    				$(".p-calendar .selected").removeClass("selected");
    				$("td[data-date="+date.format()+"]").addClass("selected");
				
    				$("#J-goDate .price-detail").size() == 0 && $("#J-goDate").append("<span class=\"price-detail\"></span>");
    				$("#J-goDate .price-detail").text(dom.attr("data-detail")||"");
    				$("[name=tempDate]").val(date.format("YYYY年MM月DD日"));
    			    }
    			    
    			}
                });
            });

        },
        joinHandler: function() {
            this.eCalendar();
            var adult = $("input[name=adultNum]"),
            adultMinus = adult.prev(),
            adultAdd = adult.next(),
            children = $("input[name=childNum]"),
            childrenMinus = children.prev(),
            childrenAdd = children.next();

            adultMinus.click(function() {
                var temp = parseInt($(this).next().val());
                if (adultMinus.hasClass("disabled")) {
                    return false;
                }
                temp--;
                temp == 1 ? adultMinus.addClass("disabled") : adultMinus.removeClass("disabled");
                adultAdd.removeClass("disabled");
                adult.val(temp < 1 ? 1 : temp);
            });
            adultAdd.click(function() {
                var temp = parseInt($(this).prev().val());
                if (adultAdd.hasClass("disabled")) {
                    return false;
                }
                temp++;
                temp == 10 ? adultAdd.addClass("disabled") : adultAdd.removeClass("disabled");
                adultMinus.removeClass("disabled");
                adult.val(temp);
            });
            childrenMinus.click(function() {
                var temp = parseInt($(this).next().val());
                if (childrenMinus.hasClass("disabled")) {
                    return false;
                }
                temp--;
                temp == 1 ? childrenMinus.addClass("disabled") : childrenMinus.removeClass("disabled");
                childrenAdd.removeClass("disabled");
                children.val(temp < 1 ? 1 : temp);
            });
            childrenAdd.click(function() {
                var temp = parseInt($(this).prev().val());
                if (childrenAdd.hasClass("disabled")) {
                    return false;
                }
                temp++;
                temp == 10 ? childrenAdd.addClass("disabled") : childrenAdd.removeClass("disabled");
                childrenMinus.removeClass("disabled");
                children.val(temp);
            });
        },
        compare: function() {
            if ($(".compare-btn").size() == 0) return;

            var box = $("#J-detail-wrap");
            box.compare({
                addBtn: "compare-btn",
                addText: "加入对比",
                cancelText: "取消对比",
                getData: function() {
                    var data = {},
                    li = $("#J-p-info");
                    data.pic = li.attr("data-pic") || "";
                    data.id = li.attr("data-id") || "";
                    data.title = li.attr("data-title") || "";
                    data.startPlace = li.attr("data-startPlace") || "";
                    data.price = li.attr("data-price") || "";
                    return data;
                },
                actionUrl: "/product-compare",
                postDataName: "productsId",
                productUrl: "/item/",
                direction: (box.attr("type") == "manage" ? "right": "center")
            });
        },
        productPicsEvent: function() {
            var i = this,
            vars = this.staticVar,
            imgs = "";

            $(".pic-small img", vars.pics).each(function() {
                var url = $(this).attr("pic-url");
                $(this).attr("src", url + "@104w_78h_1e_1c");
                imgs += "<div><img src=\"" + (url + "@560w_410h_1e_1c") + "\"/></div>";
            });
            $(".pic-cover div", vars.pics).html(imgs);

            vars.pics.on("click", ".prev",
            function() {
                i.productPicsAnimate(vars.picsIndex - 1);

            }).on("click", ".next",
            function() {
                i.productPicsAnimate(vars.picsIndex + 1);

            }).on("click", "li img",
            function() {
                i.productPicsAnimate($(this).parent().index());
            });

            i.productPicsTimer();
        },
        productPicsTimer: function() {
            var i = this,
            vars = this.staticVar;

            vars.picsIndex = (vars.picsIndex ? vars.picsIndex: 0);
            vars.timer = setTimeout(function() {
                i.productPicsAnimate(vars.picsIndex + 1);
            },
            vars.picsDelay);

        },
        productPicsAnimate: function(index) {
            var i = this,
            vars = this.staticVar,
            margin = {};
            if (vars.picsAnimate == true) {
                return false;
            }

            clearTimeout(vars.timer);
            vars.picsAnimate = true;
            if (index < 0) index = vars.picsLength - 1;
            else if (index >= vars.picsLength) index = 0;
            vars.picsIndex = index;

            margin["marginLeft"] = -(index * 560) + "px";
            $(".pic-cover>div", vars.pics).animate(margin, 400,
            function() {
                vars.picsAnimate = false;
                i.productPicsTimer();
            });
            vars.picsLi.removeClass("active").eq(index).addClass("active");
        },
        otherInfoImgsHandler: function() {
            $(".p-content-list .newImg").each(function() {
                var src = "";
                var dataOriginal = $(this).attr("data-original");
                if (dataOriginal.indexOf("gmmtour.com") > 0) {
                    src = dataOriginal + "@742w";
                } else {
                    src = dataOriginal;
                }
                $(this).removeAttr("width");
                $(this).attr("src", src);
            });
        },
        surveyHandler: function() {

            var survey = $("#J-survey");
            // 日程概览线条补充
            if ($(".day-line", survey).size() > 1) {
                $(".day-line", survey).each(function(i) {
                    var h = (($(this).parents("td").outerHeight(true) - $(this).parent().height()) / 2);
                    $(this).height(h + "px").css(((i == 0) ? "bottom": "top"), "-" + (h) + "px");
                });
            }

            // 只有一个景点时bug处理
            $(".scenic-list", survey).each(function() {
                if ($("li", $(this)).size() == 1) {
                    $("li", $(this)).addClass("line-onlyone");
                }
            });

            // 行程概览查看详细hover
            $(".scenic-list", survey).mouseenter(function() {

                $(".view-detail", survey).hide();
                var $this = $(this).parents(".col4"),
                child = $this.children("div"),
                detail = $this.find(".view-detail");
                if (detail.size() > 0) {
                    detail.show();
                } else {
                    if ($this.hasClass("col4") && $this.find("li").size() > 3) {
                        var temp = $("<div class=\"view-detail\"><div>" + child.html() + "<div></div>");
                        temp.mouseleave(function() {
                            var $that = $(this);
                            setTimeout(function() {
                                $that.hide();
                            },
                            50);

                        });
                        $this.append(temp);
                    }
                }
            });

            // 行程概览查看详细hover
            $(".col2>div, .col5>div", survey).mouseenter(function() {

                $(".view-detail", survey).hide();
                var $this = $(this).parents(".col4"),
                child = $this.children("div"),
                detail = $this.find(".view-detail");
                if (detail.size() > 0) {
                    detail.show();
                } else {
                    if ($this.hasClass("col4") && $this.find("li").size() > 3) {
                        var temp = $("<div class=\"view-detail\"><div>" + child.html() + "<div></div>");
                        temp.mouseleave(function() {
                            var $that = $(this);
                            setTimeout(function() {
                                $that.hide();
                            },
                            50);

                        });
                        $this.append(temp);
                    }
                }
            });
        },
        daysImgs: function() {
            var i = this;
            $(".J-day-content", this.days).each(function() {
                var imgs = $("img", $(this)),
                scenics = $(".J_scenic", $(this)),
                insertDom = $(this);
                i.daysImgsHandler(imgs, scenics, insertDom);
            });
        },
        emptyRemove: function() {
            $(".p-detail-content p").each(function() {
                if ((!$.trim($(this).text())) && $(this).find("img").size() == 0) $(this).remove();
            });
        },
        daysNav: function() {
            var nav = $("#J-p-days-nav"),
            maxDay = parseInt(nav.attr("max-days")),
            html = "",
            library = {
                "1": "一",
                "2": "二",
                "3": "三",
                "4": "四",
                "5": "五",
                "6": "六",
                "7": "七",
                "8": "八",
                "9": "九",
                "10": "十",
                "11": "十一",
                "12": "十二",
                "13": "十三",
                "14": "十四",
                "15": "十五",
                "16": "十六",
                "17": "十七",
                "18": "十八",
                "19": "十九",
                "20": "二十",
                "21": "二十一",
                "22": "二十二",
                "23": "二十三",
                "24": "二十四",
                "25": "二十五",
                "26": "二十六",
                "27": "二十七",
                "28": "二十八",
                "29": "二十九",
                "30": "三十"
            };
            for (var i = 0; i < maxDay; i++) {
                html += "<li" + (i == 0 ? " class=\"active\"": "") + "><a class=\"J-day-click\" day=\"day" + (i + 1) + "\">第" + (library[i + 1]) + "天</a><i class=\"p-arrow-right\"></i></li>";
            }
            $("ul", nav).html(html);
        },
        jumpUrl: function(link) {
            var vars = this.staticVar;

            vars.navClick = true;

            var url = link.attr("href");

            url = url.substring(url.indexOf("#") + 1, url.length);
            var top = $("#" + url).offset().top - vars.navH;

            vars.daysNav.removeAttr("style");

            if (url == "J-days") {
                $("li", vars.daysNav).removeClass("active").eq(0).addClass("active");
            }

            $("html,body").animate({
                scrollTop: (isNaN(top) ? 0 : top)
            },
            400,
            function() {
                $("a.active", vars.nav).removeClass("active");
                link.addClass("active");
                setTimeout(function() {
                    vars.navClick = false;
                },
                100)
            });
        },
        jumpDay: function(link) {
            var vars = this.staticVar,
            day = link.attr("day"),
            top = $("#" + day).offset().top - vars.navH - 1,
            link = $("[day=" + day + "]", vars.daysNav).parent();

            vars.navClick = true;
            if (link.parents("#J-p-days-nav").size() > 0) {
                top = top - link.index() * 28;
            }

            $("html,body").animate({
                scrollTop: top
            },
            400,
            function() {
                setTimeout(function() {
                    vars.navClick = false;
                    $(window).trigger("scroll");
                    $("li", vars.daysNav).removeClass("active");
                    link.addClass("active");
                },
                100);

            });
        },
        slider: function() {
            // 2.4改版
            $("#right_slider").each(function() {
                $(this).Slide({
                    effect: "scroolLoop",
                    autoPlay: true,
                    speed: "normal",
                    timer: 3000,
                    steps: 1,
                    prevCallBack: function(_self, index) {
                        var navShow = _self.find(".JQ-slide-nav-show");
                        navShow.find("i.on").each(function() {
                            $(this).removeClass("on");
                        });
                        navShow.find("i").eq(index).addClass("on");
                    },
                    nextCallBack: function(_self, index) {
                        var navShow = _self.find(".JQ-slide-nav-show");
                        navShow.find("i.on").each(function() {
                            $(this).removeClass("on");
                        });
                        navShow.find("i").eq(index).addClass("on");
                    }
                });
            });
        },
        event: function() {
            var i = this,
            that = this,
            vars = i.staticVar,
            nav = vars.nav,
            navH = vars.navH,
            days = vars.days,
            daysNav = $("#J-p-days-nav"),
            items = $(".p-detail-item"),
            itemsSize = items.size(),
            detailW = 1180,
            winW = $(window).width(),
            daysLeft = days.offset().left,
            fixedForm = $(".p-fixed-form"),
            fixedFormTop = fixedForm.size()>0?fixedForm.offset().top:0,
            tabs = $("#J-days .p-detail-content");

            $("#J-days .p-tabs label").click(function() {
                $("#J-days .p-tabs label").removeClass("active");
                $(this).addClass("active");
                tabs.hide().eq($(this).index()).show();

                if ($(this).text() == "日程概览") {
                    vars.daysNav.hide();
                } else {
                    vars.daysNav.show();
                }
            });

            $(".btn-scan").hover(function() {
                $(".scan-weixin").show();
            },
            function() {
                $(".scan-weixin").hide();
            });

            // form
            $("section form").submit(function() {
                if (!$("#J-goDate input").val()) {
                    $.showMsg("请选择出发日期。");
                    return false;
                }
            });

            // 使用事件代理
            $(document).on("click", ".visa-type li",
            function() {

                // 签证弹窗中的页签事件
                $(".visa-type li.selected").removeClass("selected");
                $(this).addClass("selected");
                $(".visa-list .visa-content").addClass("hidden").eq($(this).index()).removeClass("hidden");

            }).on("click", ".J-shopPlace",
            function() {
                var top = $("#J-shopPlace").offset().top - vars.navH;
                $("html,body").animate({
                    scrollTop: (isNaN(top) ? 0 : top)
                },
                400);
            }).on("click", ".J-hotel, .J-scenic, .J_scenic",
            function() {

                // 景点、酒店弹窗
                if (vars.ajaxClick == true) return false;

                var type = ($(this).hasClass("J-hotel") ? "hotel": "sight"),
                id = ($(this).hasClass("J_scenic") ? $(this).attr("sight_id") : $(this).attr("data-id")),
                api = id + ".json";
                api = "/" + type + "/" + api

                vars.ajaxClick = true;
                $.ajax({
                    url: api,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        vars.ajaxClick = false;
                        var title = ((type == "hotel") ? data.hotel.name: data.sight.cnName),
                        content = ((type == "hotel") ? (data.hotel.description) : (data.sight.description)),
                        images = ((type == "hotel") ? (data.hotel.hotelImages) : (data.sight.sightImages));
                        
                        if(data.sight){
                            images.unshift(data.sight.coverImage);
                        }
                        
                        var coordinate = "";
                        $("#J-hotel-scenic-dialog").window({
                            title: (type == "hotel" ? "酒店详情": "景点详情"),
                            width: "800px",
                            footer: false,
                            event: function(dialog) {
                                $(".title", dialog).text(title);
                                $(".font-content", dialog).html(content);
                                var items = (type == "hotel") ? "酒店图片": "景点图片";
                                // 2.4弹窗改版
                                if (images.length > 0) {
                                    var html = "";
                                    $(images).each(function(i, v) {
                                        html += "<li><img src=\"" + v.url + "@430w_242h_1e_1c\"><span class=\"icon\"></span>" + "<div class='text_info'><a href='' target='_blank' title=''>" + items + "</a><span class='text_info_mum'><span>" + (i + 1) + "</span>/<span></span>" + images.length + "</span></div>" + "</li>";
                                    });
                                    // $(".scenic-pic",dialog).html("<img
                                    // src=\""+images[0].url+"@210w_120h_1e\"/>");
                                    // $('.scenic-ul
                                    // li:eq(0)',dialog).addClass('selected');
                                    $(".scenic-ul", dialog).html(html);
                                    that.slider();
                                } else {
                                    // 当没有图片的时候显示的界面
                                    $(".JQ-slide-nav").css({
                                        "display": "none"
                                    });
                                    if (type == "sight") {
                                        $(".scenic-pic", dialog).css({
                                            "background": "url('http://static.gmmtour.com/www/theme/web/default/images/common/no_hotel.png')"
                                        });
                                    } else if (type == "hotel") {
                                        $(".scenic-pic", dialog).css({
                                            'background': 'url("http://static.gmmtour.com/www/theme/web/default/images/common/no_hotel.png")'
                                        });
                                    }
                                }
                                if (type == "sight") {
                                    var content_box = $(".content_box").html('<div class="play_time"><span class="content_box_itmes">游玩时间:</span><span class="content_box_details">' + data.sight.playTime + '</span></div>' + '<div class="contact_number"><span class="content_box_itmes">联系电话:</span><span class="content_box_details">' + data.sight.phone + '</span></div>' + '<div class="detailed_address"><span class="content_box_itmes">详细地址:</span><span class="content_box_details">' + data.sight.address + '</span><span class="content_box_map" id="map"></span></div>' + '<div class="open_time"><span class="content_box_itmes">开放时间:</span><span class="content_box_details">' + data.sight.openTime + '</span></div>' + '<div class="ticket_information"><span class="content_box_itmes">门票信息:</span><span class="content_box_details">' + data.sight.ticket + '</span></div>');
                                    var scenic_font = $(".scenic-font").html('<div class="title">景点亮点</div><div class="font-content">' + data.sight.brightSpot + '</div>' + '<div class="title">景点介绍</div><div class="font-content">' + data.sight.description + '</div>' + '<div class="title">景点导览</div><div class="font-content"></div>' + '<div class="title">特别提示</div><div class="font-content">' + data.sight.tips + '</div>');

                                    coordinate = data.sight.coordinate;
                                    // 是否影藏地图
                                    if (data.sight.area.regionHome) {
                                        $("#map").css({
                                            "display": "block"
                                        });
                                    } else {
                                        $("#map").css({
                                            "display": "none"
                                        });
                                    }
                                } else if (type == "hotel") {
                                    var content_box = $(".content_box").html('<div class="play_time"><span class="content_box_itmes">英文名称:</span><span class="content_box_details">' + data.hotel.enName + '</span></div>' + '<div class="contact_number"><span class="content_box_itmes">酒店类型:</span><span class="content_box_details">' + data.hotel.grade + '</span></div>' + '<div class="detailed_address"><span class="content_box_itmes">详细地址:</span><span class="content_box_details">' + data.hotel.address + '</span><span class="content_box_map" id="map"></span></div>');
                                    var scenic_font = $(".scenic-font").html('<div class="title">酒店介绍</div><div class="font-content">' + data.hotel.description + '</div>');
                                    coordinate = data.hotel.coordinate;
                                    // 是否影藏地图
                                    if (data.hotel.area.regionHome) {
                                        $("#map").css({
                                            "display": "block"
                                        });
                                    } else {
                                        $("#map").css({
                                            "display": "none"
                                        });
                                    }
                                }
                                // 如果返回数据为NULL,则显示为暂无
                                $(".content_box_details").each(function() {
                                    if ($(this).text() == "null" || $(this).text() == "") {
                                        $(this).text("暂无");
                                    }
                                });
                                $(".font-content").each(function() {
                                    if ($(this).text() == "null" || $(this).text() == "") {
                                        $(this).text("暂无").css("border-bottom", "none");

                                    }
                                })
                                // 获取左边div高度
                                var rightHeight = $(".scenic-pic-box").height();
                                $(".hotel-scenic-dialog .scenic-font").css({
                                    "height": rightHeight + "px"
                                });

                                // 获取经纬度
                                var code = coordinate.split("|");

                                // 创建和初始化地图函数：
                                function initMap() {
                                    createMap(); // 创建地图
                                    setMapEvent(); // 设置地图事件
                                    addMapControl(); // 向地图添加控件
                                    addMapOverlay(); // 向地图添加覆盖物
                                }
                                function createMap() {
                                    map = new BMap.Map("map");
                                    map.centerAndZoom(new BMap.Point(code[0], code[1]), 15);
                                }
                                function setMapEvent() {
                                    map.enableScrollWheelZoom();
                                }
                                function addClickHandler(target, window) {
                                    target.addEventListener("click",
                                    function() {
                                        target.openInfoWindow(window);
                                    });
                                }
                                function addMapOverlay() {
                                    var markers = [{
                                        content: "我的备注",
                                        title: "我的标记",
                                        imageOffset: {
                                            width: -46,
                                            height: -21
                                        },
                                        position: {
                                            lat: 30.664636,
                                            lng: 104.07194
                                        }
                                    }];
                                    for (var index = 0; index < markers.length; index++) {
                                        var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
                                        var marker = new BMap.Marker(point, {
                                            icon: new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png", new BMap.Size(20, 25), {
                                                imageOffset: new BMap.Size(markers[index].imageOffset.width, markers[index].imageOffset.height)
                                            })
                                        });
                                        var label = new BMap.Label(markers[index].title, {
                                            offset: new BMap.Size(25, 5)
                                        });
                                        var opts = {
                                            width: 200,
                                            title: markers[index].title,
                                            enableMessage: false
                                        };
                                        var infoWindow = new BMap.InfoWindow(markers[index].content, opts);
                                        marker.setLabel(label);
                                        addClickHandler(marker, infoWindow);
                                        map.addOverlay(marker);
                                    };
                                }
                                // 向地图添加控件
                                function addMapControl() {
                                    var navControl = new BMap.NavigationControl({
                                        anchor: BMAP_ANCHOR_TOP_LEFT,
                                        type: BMAP_NAVIGATION_CONTROL_LARGE
                                    });
                                    map.addControl(navControl);
                                }
                                var map;
                                // 初始化地图
                                initMap();
                            }
                        });
                    },
                    error: function() {
                        vars.ajaxClick = false;
                    }
                });

            }).on("click", ".J-visa",
            function() {
                var id = $(this).attr("data-id");

                // 签证弹窗
                if (vars.ajaxClick == true) return false;

                vars.ajaxClick = true;

                $.ajax({
                    url: "/visa/" + id + ".json",
                    success: function(data) {
                        vars.ajaxClick = false;
                        $("#J-visa-dialog").window({
                            title: "签证详情",
                            footer: false,
                            event: function(dialog) {
                                if (null != data && null != data.visa) {
                                    var visaTermTypeList = data.visa.termTypes;
                                    var visaTermList = data.visa.terms;

                                    $(".tilte", dialog).text(data.visa.title);
                                    $(".visa-number", dialog).text(data.visa.inbound);
                                    $(".visa-stay", dialog).text(data.visa.stay);
                                    $(".visa-validate", dialog).text(data.visa.validate);
                                    $(".visa-scope", dialog).html(data.visa.scope);
                                    $(".visa-type", dialog).html("");
                                    $(".visa-list", dialog).html("");

                                    for (var i = 0; i < visaTermTypeList.length; i++) {
                                        var typeIndex = 0;
                                        var visaContent = '<div class="visa-content hidden">';
                                        for (var j = 0; j < visaTermList.length; j++) {
                                            if (visaTermTypeList[i] == visaTermList[j].type) {
                                                typeIndex == 0 && $(".visa-type", dialog).append('<li><a href="javascript:void(0);">' + visaTermList[j].typeName + '</a></li>');
                                                visaContent += '<dl><dt>' + visaTermList[j].term + '</dt><dt>' + visaTermList[j].termExplain + '</dt></dl>';
                                                typeIndex++;
                                            }
                                        }
                                        visaContent += '</div>';
                                        $(".visa-list", dialog).append(visaContent);
                                    }

                                    $(".visa-type li:eq(0)").click();
                                }
                            }
                        });
                    },
                    error: function() {
                        vars.ajaxClick = false;
                    }
                });

            }).on("click", ".hotel-scenic-dialog .scenic-ul li",
            function() {

                // 酒店、景点详情图片选择事件
                var lis = $(this).parent().find("li"),
                img = $(this).parent().prev(".scenic-pic").find("img");
                img.removeAttr("src").attr("src", $("img", $(this)).attr("data-src"));
                lis.removeClass("selected");
                $(this).addClass("selected");

            }).on("click", ".J-day-click",
            function() {

                // 具体某天跳转事件
                $(".p-tabs label:first").click();
                i.jumpDay($(this));
                return false;

            }).on("click", ".btn[action=share]",
            function() {
                if ($(this).attr("btn-disabled") != undefined) {
                    return false;
                }

                // 发给直客
                $("#J-share-dialog").window({
                    title: "发送给直客",
                    footer: "<div class=\"dialog-tip\"><p>• 直客看到的将是您微网站内对应产品的介绍页，并显示您设置的直客价</p><p>• 供应商、同行价等敏感信息直客不会看到，请放心</p></div>",
                    event: function(dialog) {
                        $(".J-clone", dialog).copy();
                    }
                });

            }).on("click", "ul.dashed a, #J-p-nav a",
            function() {

                // 导航链接，产品头部信息中价格与团期链接
                if ($(this).text() == "日程安排") {
                    $(".p-tabs label:first").click();
                }
                i.jumpUrl($(this));
                return false;

            });

            // resize事件
            $(window).resize(function() {
                winW = $(window).width();
                daysLeft = days.offset().left;
                $(window).trigger("scroll");
            }).resize();

            // 滚动事件
            setTimeout(function() {
                $(window).scroll(function() {
                    var scrollTop = $(window).scrollTop();

                    // 导航浮动
                    if (nav.offset().top < scrollTop) {
                        $(".p-fixed-form").show();
                        nav.addClass("p-nav-fixed");
                    } else {
                        $(".p-fixed-form").hide();
                        nav.removeClass("p-nav-fixed");
                        $("a", vars.nav).removeClass("active").eq(0).addClass("active");
                    }

                    if (vars.navClick == false) {

                        // 滚动时，自动关联导航
                        for (var i = 0; i < itemsSize; i++) {
                            var item = items.eq(i),
                            min = item.offset().top - navH - 20,
                            max = min + item.outerHeight(true) + 20;

                            if (min < scrollTop && scrollTop < max) {
                                $(".active", nav).removeClass("active");
                                $("a[href=#" + item.attr("id") + "]", nav).addClass("active");
                                break;
                            }
                        }

                        // 滚动时日程导航自动关联
                        if ($(".p-tabs .active").text() == "日程安排") {
                            var min = days.offset().top - navH,
                            max = min + days.outerHeight(true) - vars.daysNav.outerHeight(true);

                            if (min < scrollTop && scrollTop < max) {
                                var left = daysLeft - 90;
                                daysNav.css({
                                    position: "fixed",
                                    top: navH + 1 + "px",
                                    "left": left + "px"
                                });

                                if (vars.navClick == false) {
                                    for (var i = 0; i < vars.daysLi.size(); i++) {
                                        var $this = vars.daysLi.eq(i),
                                        dayMin = $this.offset().top - navH,
                                        dayMax = dayMin + $this.outerHeight(true),
                                        dayNavItem = $("[day=" + ($this.attr("id")) + "]", vars.daysNav).parent();

                                        dayMin = dayMin - dayNavItem.index() * 28;
                                        dayMax = dayMax - dayNavItem.index() * 28;

                                        if (dayMin <= scrollTop && scrollTop <= dayMax) {
                                            $("li", vars.daysNav).removeClass("active");
                                            dayNavItem.addClass("active");

                                            if (dayNavItem.index() + 1 >= 15) {
                                                $("ul", vars.daysNav).css("margin-top", "-420px");
                                            } else {
                                                $("ul", vars.daysNav).css("margin-top", "0");
                                            }
                                            break;
                                        }
                                    }
                                }
                            } else {
                                daysNav.removeAttr("style");
                            }
                        }
                    }

                    // fixed form
                    if (nav.offset().top < scrollTop && winW >= detailW) {
                        var right = (winW - detailW) / 2;
                        right = right > 0 ? right: 0;
                        fixedForm.css({
                            position: "fixed",
                            top: (navH + "px"),
                            left: "auto",
                            "right": right + "px"
                        });
                    } else {
                        var temp = fixedForm.css("display");
                        fixedForm.removeAttr("style");
                        if (temp) {
                            fixedForm.css("display", temp);
                        }
                    }
                });
            },
            50);
        },
        daysImgsHandler: function(imgDom, scenicDom, insertDom) {
            var vars = this.staticVar,
            imgsStr = "",
            imgs = $(imgDom).map(function() {
                return $(this).attr("data-original");
            }).get();

            $(imgDom).remove();

            for (var i = 0; i < ((imgs.length <= 3) ? imgs.length: 3); i++) {
                imgsStr += "<li><img src=\"" + imgs[i] + "@300w_222h_1e_1c\" /><h6><span></span><span>沿途风光</span></h6></li>";
            }

            // 用户上传不足三张
            if (imgs.length < 3) {
                var sysImgs = [],
                sysImgsName = [],
                length = 3 - imgs.length,
                index1,
                index2;

                $(scenicDom).each(function() {
                    var temp = $(this).attr("images").split(",") || [];
                    if ($(this).attr("images") && temp.length >= 1) {
                        sysImgs[sysImgs.length] = temp;
                        sysImgsName[sysImgsName.length] = $(this).text();
                    }
                });

                /* 代码待优化以满足扩展需求 start */
                if (length == 1) {
                    if (sysImgs.length > 0) {
                        index1 = 0;
                        index2 = 0;
                    }
                } else if (length == 2) {
                    if (sysImgs.length == 1) {
                        index1 = 0;
                        index2 = 1;
                    } else if (sysImgs.length >= 2) {
                        index1 = 1;
                        index2 = 0;
                    }
                } else if (length == 3) {
                    if (sysImgs.length == 1) {
                        index1 = 0;
                        index2 = 2;
                    } else if (sysImgs.length == 2) {
                        index1 = 1;
                        index2 = 1;
                    } else if (sysImgs.length >= 3) {
                        index1 = 2;
                        index2 = 0;
                    }
                }

                /* 代码待优化 end */

                var currentLength = imgs.length;
                for (var i = 0; i <= index1; i++) {
                    for (var j = 0; j <= index2; j++) {
                        if (sysImgs[i][j]) {
                            if (currentLength >= 3) {
                                break;
                            }
                            currentLength++;

                            imgsStr += "<li><img src=\"" + sysImgs[i][j] + "@300w_222h_1e_1c\" /><h6><span></span><span>" + sysImgsName[i] + "</span></h6></li>";
                        }
                    }
                }

            }
            if (imgsStr) {
                insertDom.after("<div class=\"p-upload-list\"><ul class=\"clearfix\">" + imgsStr + "</ul></div>");
            }
        },
        highlightsHandler: function() {
            var highlights = $("#J-highlights .p-highlights-content"),
            	src;
            $("img", highlights).each(function() {
        	src=$(this).attr("data-original");
        	if(src.indexOf("gmmtour.com")>=0){
        	    src+="@870w";
        	}
                highlights.before("<div class=\"p-highlights-pic\"><img src=\"" + src + "\"/></div>");
                $(this).remove();
            });
        }
    };

    controller.call();

} (new this.jSharp.controller());