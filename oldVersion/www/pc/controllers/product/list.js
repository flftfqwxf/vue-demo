;!function(controller) {
    // use strict
    'use strict';

    controller.using(["slider", "tools", "zclip", "compare", "e97Date"]);

    controller.modules = {
        staticVars: function() {
            this.staticVars = {
                listItemTpl: $("#J-list-item").html(),
                interval: new Object(),
                detailTpl: $("#J-price-detail").html(),
                itemDetailTpl: $("#J-price-item").html(),
                noDataTpl: $("#J-noData").html(),
                freeWalkerPriceTpl: $("#J-freeWalker-price").html(),
                loading: $("#J-loading"),
                list: $("#J-listBox tbody"),
                searchBox: $("#J-search-box"),
                page: $(".list-page"),
                dataTimeTpl: "<div class=\"form-group  has-feedback\">" + "<input readonly type=\"text\" class=\"form-control input-sm hasDatepicker\" id=\"J-startDate\" onfocus=\"WdatePicker({minDate:'%y-%M-{%d}',maxDate:'#F{$dp.$D(\\'J-endDate\\')}'})\" name=\"startDate\" placeholder=\"最早出发\">" + "<span class=\"gmIcon gm-calendar form-control-feedback\"></span>" + "</div>" + "<div class=\"date_line\">-</div>" + "<div class=\"form-group  has-feedback\">" + "<input readonly type=\"text\" class=\"form-control input-sm hasDatepicker\" id=\"J-endDate\" onfocus=\"WdatePicker({minDate:'#F{$dp.$D(\\'J-startDate\\')||\\'%y-%M-{%d}\\'}'})\" name=\"endDate\" placeholder=\"最晚出发\">" + "<span class=\"gmIcon gm-calendar form-control-feedback\"></span>" + "</div>" + "<div class=\"date_btn\">" + "<button class=\"btn btn-info btn-sm J-date-btn fl\" type=\"button\">确定</button>" + "</div>",
                pageTpl: "<div class=\"paginationWrap\">" + "<div>当前<span v=\"current\">1/1</span>每页<span v=\"per\">20</span>条 共<span v=\"total\">1</span>页</div>" + "<ul class=\"pagination\">" + "<li action=\"first\" page=\"1\"><a>&lt;&lt;</a></li>" + "<li action=\"prev\"><a>&lt;</a></li>" + "<li action=\"next\"><a>&gt;</a></li>" + "<li action=\"last\"><a>&gt;&gt;</a></li>" + "</ul>" + "</div>"
            }
        },
        init: function() {
            // static vars
            this.staticVars();

            // ipSearch
            this.ipSearch();

            // slider
            this.slider();

            //
            this.hotSupplier();

            // event
            this.event();

            // list search event
            this.listSearchEvent();
        },
        compare: function() {
            var box = $(".list-box");
            box.compare({
                addBtn: "compare",
                actionUrl: "/product-compare",
                postDataName: "productsId",
                productUrl: "/product/",
                direction: (box.attr("type") == "manage" ? "right": "center")
            });
        },
        pageBuilder: function(currentPage, pageCount) {
            var that = this,
            vars = that.staticVars,
            page = $(vars.pageTpl),
            pageList = "",
            prev = (currentPage - 1 > 0 ? currentPage - 1 : 1),
            next = (currentPage + 1 > pageCount ? pageCount: currentPage + 1),
            spaceNum = 5,
            spaceIndex = currentPage % 5 == 0 ? parseInt(currentPage / 5 - 1) * 5 + 1 : parseInt(currentPage / 5) * 5 + 1,
            maxIndex = (spaceIndex + 5) > pageCount ? pageCount: (spaceIndex + 5);

            for (var i = spaceIndex; i <= maxIndex; i++) {
                if (i != pageCount && i == maxIndex) {
                    pageList += "<li page=\"" + i + "\"><a>...</a></li>";
                } else if (i == spaceIndex && i != 1) {
                    pageList += "<li page=\"" + (i - 1) + "\"><a>...</a></li>";
                    pageList += "<li page=\"" + i + "\" " + ((currentPage == i) ? "class=\"active\"": "") + "><a>" + i + "</a></li>";
                } else {
                    pageList += "<li page=\"" + i + "\" " + ((currentPage == i) ? "class=\"active\"": "") + "><a>" + i + "</a></li>";
                }

            }

            $("[v=current]", page).text(currentPage + "/" + pageCount);
            $("[v=per]", page).text(20);
            $("[v=total]", page).text(pageCount);
            $("[action=prev]", page).after(pageList);

            $("[action=prev]", page).attr("page", prev);
            $("[action=next]", page).attr("page", next);
            $("[action=last]", page).attr("page", pageCount);

            if (currentPage == 1) {
                $("[action=first],[action=prev]", page).addClass("disabled");
            }

            if (currentPage == pageCount) {
                $("[action=next],[action=last]", page).addClass("disabled");
            }

            vars.page.html(page);
        },
        listSearchEvent: function() {
            var that = this,
            vars = that.staticVars,
            query, name, value;
            vars.searchBox.on("click", "a",
            function() {

                if ($(this).hasClass("disabled") || ($(this).hasClass("active") && $(this).parent(".all").size() > 0)) {
                    return false;
                }

                query = {};
                name = $(this).parents("tr").attr("name");

                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this).parents("tr").find(".all a").addClass("active");
                    value = "";
                } else {
                    $(this).parents("tr").find("a.active").removeClass("active");
                    $(this).addClass("active");
                    value = $(this).attr("data-id") || "";
                }

                if (name == "months") {
                    $("#J-startDate, #J-endDate").val("");
                }

                query[name] = value;
                that.resetResultSearch();
                that.listRequest(query);
            }).on("click", ".J-date-btn",
            function() {
                query = {};

                var startDate = $("#J-startDate").val(),
                endDate = $("#J-endDate").val();

                if (startDate || endDate) {
                    query["startDate"] = startDate;
                    query["endDate"] = endDate;
                    that.listRequest(query);
                } else {
                    $.showMsg("请选择最早出发时间或最晚出发时间。");
                }

            });
        },
        searchBoxIsActive: function(key, query, v) {
            var result = false;
            switch (key) {
            case "departureTimes":
                result = (String(v.value) == query.months && ((!query.startDate) || (!query.endDate)));
                break;
            case "suppliers":
                result = (String(v.id) == query.supplier);
                break;
            case "tripDays":
                result = (String(v.value) == query.days);
                break;
            case "types":
                result = (String(v.value) == query.tourType);
                break;
            }
            return result;
        },
        resetResultSearch: function() {
            // $(".search-select>span>span").text("综合排序").attr("data-id",1);
            $("#validateform input").val("");
        },
        compareBtnUpdate: function() {
            var id;
            $("a.compare").each(function() {
                id = $(this).parents(".p-list-item").attr("data-id");
                if ($(".compare-data[data-id=" + id + "]").size() > 0) {
                    $(this).addClass("compare-added");
                    $(this).find("i").text("-");
                    $(this).find("b").text("已加入");
                }
            });
        },
        listArrowHandler: function() {
            $(".search-box .show-box").each(function() {
                if ($(this).height() >= 170) {
                    $(this).find(".gm-arrow").show();
                }
            });
        },
        listBuilder: function(data, query) {
            var that = this,
            vars = that.staticVars,
            library = {
                "departureTimes": "出发时间",
                "suppliers": "供应商",
                "tripDays": "行程天数",
                "types": "类型"
            },
            typeText = {
                "groupTour": "跟团游",
                "shipTour": "游轮",
                "freeWalkerTour": "自由行"
            },
            listBox = "",
            tbody = $("<div></div>"),
            tr = "",
            tourType = "",
            priceDetail = "",
            detailItem = "",
            searchItem,
            searchItemHtml = "",
            listContent = "",
            searchName = {
                "departureTimes": "出发时间",
                "suppliers": "供应商",
                "tripDays": "行程天数",
                "types": "类型"
            };

            // 产品数量显示
            $("h2 em", vars.searchBox).text(data.pagination.count);

            if (data.specification) {
                $("tbody", vars.searchBox).empty();
                var postKey = "";
                for (var key in data.specification) {
                    if (data.specification[key]) {
                        searchItemHtml = "";

                        if (key == "suppliers") postKey = "supplier";
                        else if (key == "departureTimes") postKey = "months";
                        else if (key == "types") postKey = "tourType";
                        else if (key == "tripDays") postKey = "days";

                        searchItem = $("<tr name=\"" + postKey + "\"><td>" + searchName[key] + "</td><td class=\"all\"><a" + (((postKey == "months") ? ((!query[postKey]) && (!query["startDate"]) && (!query["endDate"])) : ((!query[postKey]))) ? " class=\"active\"": "") + ">不限</a></td><td></td></tr>")

                        $(data.specification[key]).each(function(i, v) {
                            searchItemHtml += "<a data-id=\"" + (key == "suppliers" ? v.id: v.value) + "\" " + ((key == "departureTimes" && v.value == null) ? "class=\"disabled\"": "") + " " + (that.searchBoxIsActive(key, query, v) ? "class=\"active\"": "") + ">" + v.name + "</a>";
                        });

                        searchItemHtml = (key == "departureTimes" ? searchItemHtml + vars.dataTimeTpl: searchItemHtml);

                        if (key == "suppliers") {
                            searchItemHtml = "<div class=\"show-box box-open\">" + searchItemHtml + "<i class=\"gm-icon gm-arrow\" data-value=\"1\"></i></div>";
                        }

                        $("td:last()", searchItem).html(searchItemHtml);

                        $("tbody", vars.searchBox).append(searchItem);

                        if (query.startDate) {
                            $("#J-startDate").val(query.startDate);
                        }
                        if (query.endDate) {
                            $("#J-endDate").val(query.endDate);
                        }
                    }
                }
                if ($(".city-dropdown").is(":visible")) {
                    vars.searchBox.show();
                }
                that.listArrowHandler();
            } else if (data.productList.length == 0 && parseInt(query.page) == 1 && ((!query.minPrice) && (!query.maxPrice) && (!query.airlineCode))) {
                vars.searchBox.hide();
            }

            // 有产品时
            if (data.productList.length > 0) {
                $(data.productList).each(function(i, v) {
                    tr = $(vars.listItemTpl);

                    if (v.groupTour) {
                        tourType = "groupTour";
                    }
                    if (v.shipTour) {
                        tourType = "shipTour";
                    }
                    if (v.freeWalkerTour) {
                        tourType = "freeWalkerTour";
                    }

                    // fill value
                    // cover
                    tr.attr("data-id", v.id);
                    $("[v=pic-link]", tr).attr("href", "/product/" + v.id);
                    if (v.coverImage) {
                        $("[v=pic-link] img", tr).attr("src", v.coverImage.url + "@240w_180h_1e_1c");
                    }

                    // title
                    $("[v=link]", tr).attr("href", "/product/" + v.id).text(v.name).attr("title", v.name);
                    $("[v=tourType]", tr).text(typeText[tourType]).addClass(tourType);
                    $("[v=departure]", tr).text(v.departurePlace.name + "出发");
                    if (v.subtitle) {
                        $("[v=brightPoints]", tr).html("<b class=\"brightPoints\">"+v.subtitle+"</b>").attr("title", v.subtitle);
                    }
                
                    $("[v=code]", tr).text("编号：" + v.id);
                    $("[v=line]", tr).text("专线：" + v.touristLine.name);
                    $("[v=supplier]", tr).text(v.supplier.name)/*.attr("href", "http://" + v.supplier.domain)*/;
                    $("[v=price] em", tr).text(String((v.minPrice || v.encryptMinPrice) || "0").replace(".00", ""));

                    if (window.noLogin == true) {
                        $("[v=departureDate], [v=priceDetail]", tr).html("<a href=\"/login\">登录</a>后可见");
                        
                    } else {
                        $("[v=departureDate]", tr).text(v.allRemainingDays.days2String).attr("title", v.allRemainingDays.days2String).after("<span>&nbsp;共<em>" + (v.allRemainingDays.days || "0") + "</em>个团期</span>");
                        if (v.supplier.auth) {
                            $("[v=authenticate]",tr).append("<b><i class=\"gmIcon gm-authenticate\"></i>已认证</b>")
                        }
                        if (v.minus !== 0) {
                            $("[v=discountInfo]",tr).append("<p class=\"stand-by\" data-placement=\"bottom\" data-toggle=\"tooltip\" data-original-title=\"本产品可使用红包"+v.minus+"/人\"><span class=\"title\">立减</span><span class=\"num\">"+v.minus+"</span></p>");
                        }
                        if (v.rebate !== 0) {
                            $("[v=discountInfo]",tr).append("<p class=\"rebate\" data-placement=\"bottom\" data-toggle=\"tooltip\" data-original-title=\"本产品可获得返利"+v.rebate+"/人\"><span class=\"title\">返利</span><span class=\"num\">"+v.rebate+"</span></p>");
                        }
                        if (v.profits !== 0) {
                            $("[v=discountInfo]",tr).append("<p class=\"profit\" data-placement=\"bottom\" data-toggle=\"tooltip\" data-original-title=\"本产品可获得利润"+v.profits+"/人\"><span class=\"title\">利润</span><span class=\"num\">"+v.profits+"</span></p>");
                        }
                        if (v.recentItems) {
                            $("[v=priceDetail]", tr).html("<em>" + (v.recentItems.length) + "组报价</em>");
                            $("[v=priceDetail]", tr).append(that.priceDetailHander(tourType, v.recentItems));
                        }
                    }

                    // compare
                    if (tourType != "groupTour") {
                        $(".compare", tr).addClass("compare-disabled").attr("data-placement", "bottom").attr("data-toggle", "tooltip").attr("data-original-title", "暂不支持该类型产品对比");
                    }

                    tbody.append(tr);

                    $(".list-search").show();

                    listContent = tbody.html();
                });
                that.pageBuilder(data.pagination.currentPage, data.pagination.pageCount);
                vars.page.show();

            } else {

                // 无产品时隐藏列表上方搜索、分页及显示无数据样式
                if ((!data.specification) && $(".city-dropdown").is(":visible") && ((!query.minPrice) && (!query.maxPrice) && (!query.airlineCode))) {
                    $(".list-search").hide();
                }

                listContent = vars.noDataTpl;
            }

            // list show and fill list
            vars.list.parent().show();
            vars.list.html(listContent);

            // list hack
            that.listLineHack();

        },
        priceDetailHander: function(type, data) {
            var that = this,
            vars = that.staticVars,
            priceDetail = $(vars.detailTpl),
            detailItem,
            airplane,
            departureDate,
            price,
            recommend;

            $(data).each(function(i, v) {

                detailItem = $(vars.itemDetailTpl);

                // dom
                airplane = $("tr[v=airplane] div", detailItem);
                departureDate = $("tr[v=departureDate] div", detailItem);
                price = $("tr[v=price] div", detailItem);
                recommend = $("tr[v=recommend] div", detailItem);

                $(".order-num", detailItem).text(i + 1);

                // 航空公司
                if (v.airline) {
                    airplane.text(v.airline.name + v.airline.code);
                    if (v.charter) {
                        airplane.append("<b class=\"green\">包机</b>");
                    }
                } else {
                    airplane.parent().parent().remove();
                }

                // 发团日期
                if (v.everyDay == true) {
                    departureDate.html(v.startAndEndDate + "<b class=\"green\">天天发团</b>");
                } else if (v.remainingDays2String) {
                    departureDate.text(v.remainingDays2String);
                } else {
                    departureDate.html("<b style=\"color:#aaa;\">已过期</b>");
                }

                if (type == "groupTour") {

                    // 同行结算价
                    var temp = "";
                    if (v.prices && v.prices.length > 0 && v.prices[0]["extraPrice"]) {
                        temp = "<span class=\"span-space\">单房差：" + v.prices[0]["extraPrice"] + "元</span>";
                    }

                    price.addClass("orange").html($(v.prices).map(function(ii, vv) {
                        return "<span class=\"span-space\">" + vv.type + "：" + vv.price + "元</span>";
                    }).get().join("") + temp);

                    // 直客建议价
                    recommend.addClass("orange").html($(v.prices).map(function(ii, vv) {
                        return "<span class=\"span-space\">" + vv.type + "：" + (v.extraPrice + vv.price) + "元</span>";
                    }).get().join("") + temp);
                } else if (type == "shipTour") {

                    var p = $("<p><b class=\"strong\" v=\"ship\"></b><b v=\"shippingLine\"></b><b class=\"green\" v=\"departure\"></b></p>");
                    $("[v=ship]", p).text(v.ship);
                    $("[v=shippingLine]", p).text(v.shippingLine);
                    $("[v=departure]", p).text(v.departure);
                    price.html(p).append($(v.prices).map(function(ii, vv) {
                        return "<div><em>" + vv.type + "：" + vv.price + "元</em>&nbsp;&nbsp;(单房差<em>" + vv.extraPrice + "</em>元)&nbsp;&nbsp;" + (vv.remark || "") + "</div>";
                    }).get().join(""));

                    recommend.text("在上述同行价格基础上加" + v.extraPrice + "元");
                } else if (type == "freeWalkerTour") {

                    var item;
                    $(v.prices).each(function(ii, vv) {
                        item = $(vars.freeWalkerPriceTpl);
                        $("[v=price]", item).text(vv.type + "：" + vv.price + "元");
                        $("[v=hotel]", item).html($(vv.hotels).map(function(iii, vvv) {
                            return "<div>" + vvv.hotelDetails + "</div>";
                        }).get().join(""));
                        if (vv.extraPrice) {
                            $("[v=extraPrice]", item).text(vv.extraPrice || 0);
                        } else {
                            $("[v=extraPrice]", item).parent().remove();
                        }
                        if (vv.remark) {
                            $("[v=remark]", item).append($("[v=extraPrice]", item).size() > 0 ? "，" + vv.remark: vv.remark);
                        }
                        price.append(item);
                    });

                    recommend.text("在上述同行价格基础上加" + v.extraPrice + "元");
                }

                $("ul", priceDetail).append(detailItem);
            });
            return priceDetail;
        },
        listRequest: function(data) {

            var that = this,
            tr, clickFlag = data.page ? true: false;

            // 请求条件
            data = data ? data: {};
            data.page = data.page ? data.page: 1;
            data.keyWord = data.keyWord ? data.keyWord: $(".J-search-txt").val();
            data.departurePlaceId = $("[name=departurePlaceId]").val();

            // search box a
            $("a.active", that.staticVars.searchBox).each(function() {
                tr = $(this).parents("tr");
                if (tr.attr("name") == "supplier") {
                    data["supplier"] = data["supplier"] ? data["supplier"] : ($(this).attr("data-id") || "");
                } else {
                    data[tr.attr("name")] = ($(this).attr("data-id") || "");
                }
            });

            // order
            data["sort"] = data.sort ? data.sort: $(".search-select>span>span").attr("data-id");
            data["minPrice"] = $("[name=minPrice]").attr("data-value");
            data["maxPrice"] = $("[name=maxPrice]").attr("data-value");
            data["airlineCode"] = $("[name=airlineCode]").attr("data-value");

            $("[name=minPrice]").val(data["minPrice"]);
            $("[name=maxPrice]").val(data["maxPrice"]);
            if ((!data["minPrice"]) && (!data["maxPrice"])) {
                $("#J-maxPrice").parent().next(".clear").remove();
            }

            $("[name=airlineCode]").val(data["airlineCode"]);

            // search box input
            data["startDate"] = $("#J-startDate").val();
            data["endDate"] = $("#J-endDate").val();

            // 请求之前隐藏列表，分页，显示loading
            that.staticVars.list.parent().hide();
            that.staticVars.page.hide();
            that.staticVars.loading.show();

            if (clickFlag) {
                var pageUrl = "/product?";
                for (var key in data) {
                    pageUrl += "&" + key + "=" + (data[key] || "");
                }
                pageUrl = pageUrl.replace("&", "");

                _hmt.push(['_trackPageview', pageUrl]);
            }

            $.ajax({
                url: "/product-niubility.json",
                type: "get",
                data: data,
                dataType: "json",
                success: function(serverData) {
                    that.staticVars.loading.hide();
                    that.listBuilder(serverData, data);

                    if (!clickFlag && $(".compare-toolbar").size() == 0) {

                        // compare
                        that.compare();
                    }

                    // compare btn update
                    that.compareBtnUpdate();
                },
                error: function() {
                    that.staticVars.loading.hide();
                }
            });
        },
        slider: function() {
            $("#right_slider, #J-top-slider").each(function() {
                $(this).Slide({
                    effect: "fade",
                    speed: "normal",
                    autoPlay: false,
                    createPage: false,
                    timer: 3000,
                    chooseNav: 'JQ-slide-nav-show',
                    individuallyNav: 'JQ-slide-nav'
                });
            });
        },
        listLineHack: function() {
            $(".p-list-item").hover(function() {
                var prev = $(this).prev("tr");
                if (prev.size() > 0) {
                    var color = $(this).find("td").css("border-bottom-color");
                    $("td", prev).attr("style", "border-bottom-color:" + color + "!important;");
                }
            },
            function() {
                var prev = $(this).prev("tr");
                if (prev.size() > 0) $("td", prev).removeAttr("style");
            });

            $(".price-word em").hover(function() {
                var box = $(this).next(".price-show-box"),
                offset = $(this).offset(),
                winH = $(window).height(),
                boxH = box.outerHeight(true),
                top = offset.top - $(window).scrollTop() + 20,
                x = 0,
                y = 23;
                if (boxH > winH - top) {
                    y = -boxH;
                }
                box.css({
                    "top": y + "px",
                    "left": x + "px"
                }).show();
            },
            function() {
                var box = $(this).next(".price-show-box");
                box.hide();
            });
        },
        searchClick: function(value, supplier) {
            var _dataValue = parseInt($("input[name=departurePlaceId]").val()),
            _name = $(".J-city-name").text();
            if (isNaN(_dataValue)) {
                $(".J-search-button").find(".name").html("全部");
            } else {
                $(".J-search-button").find('.name').text(_name);
            }
            if (value) {
                $(".J-search-txt").val(value);
                $(".J-gm-close").show();
            } else {
                $(".J-gm-close").hide();
            }
            $(".ip-city").hide();
            $(".hot-city").show();
            $(".J-search-city-ul").hide().addClass('J-new-ul');
            $(".p-top-slider").hide();
            $(".city-dropdown").show();
            $(".search-input").width(559);
            $(".J-fuzzy-find-list").width(483);
            $(".J-hot-city-list").hide().width(483);

            $(".search-box tbody").empty();

            // judge cd city
            this.ipvalue();

            // request data
            this.resetResultSearch();
            if (supplier) {
                this.listRequest({
                    supplier: supplier
                });
            } else {
                this.listRequest({
                    keyWord: value
                });
            }
        },
        inputSearchHandler: function() {
            // 搜索框输入联想
            var inputTimer, inputValue, i = this,
            vars = i.staticVars,
            _len, _keyIndex = -1;
            $(".J-search-txt").keydown(function(e) {
                var _currKey = e.keyCode || e.which || e.charCode;
                if (_currKey == 40 || _currKey == 38) {
                    return false;
                }
            });
            $(".J-search-txt").keyup(function(e) {
                var _currKey = e.keyCode || e.which || e.charCode;
                clearTimeout(inputValue);
                inputValue = setTimeout(function() {
                    var _value = $(".J-search-txt").val();
                    if (_value) {
                        $(".J-gm-close").show();
                    } else {
                        $(".J-gm-close").hide();
                    }
                },
                300);
                if (_len) {
                    if (_currKey == 40 || _currKey == 38) {
                        if (_currKey == 38) {
                            if (_keyIndex <= 0) {
                                _keyIndex = _len.length - 1;
                            } else {
                                _keyIndex = _keyIndex - 1;
                            }

                        } else if (_currKey == 40) {
                            if (_keyIndex < _len.length - 1) {
                                _keyIndex = _keyIndex + 1;
                            } else {
                                _keyIndex = 0;
                            }
                        }
                        $(".J-fuzzy-find-list li").removeClass('bgcolor').eq(_keyIndex).addClass("bgcolor");
                        var _keyValue = $(".J-fuzzy-find-list li.bgcolor .city-name").find(".name").text();
                        $(".J-search-txt").val(_keyValue);
                        return false;
                    }
                }
                $(".J-hot-city-list").hide();
                clearTimeout(inputTimer);
                var $this = $(this);
                inputTimer = setTimeout(function() {
                    $.ajax({
                        url: "/destination-prompt.json",
                        data: {
                            keyword: $this.val(),
                            size: 10
                        },
                        dataType: "json",
                        success: function(data) {
                            _len = data.destinations;
                            if (data.destinations && _len.length > 0) {
                                var ul = $(".J-fuzzy-find-list"),
                                li;
                                $("ul", ul).empty();
                                $(data.destinations).each(function(i, v) {
                                    var _value = $(".J-search-txt").val(),
                                    _newName = v.cnName.replace(_value, "<span class=\"name-color\">" + _value + "</span>"),
                                    _nameType = v.type;
                                    if (_nameType == "area") {
                                        _nameType = "目的地";
                                    } else {
                                        _nameType = "景点";
                                    }
                                    li = $("<li><span class=\"city-name\"><span class=\"name\">" + _newName + "</span>(" + _nameType + ")</span><span class=\"pro-number\">约" + (v.productCount) + "个产品</span></li>");
                                    $("ul", ul).append(li);
                                });
                                $(".J-hot-city-list").hide();
                                if (e.keyCode == 13) {
                                    $(".J-fuzzy-find-list").hide();
                                    return false;
                                }
                                $(".J-fuzzy-find-list").show();
                                /* $(".J-gm-close").show(); */
                                _keyIndex = -1;
                            } else {
                                /* $(".J-gm-close").show(); */
                                $(".J-fuzzy-find-list").hide();
                            }
                        }
                    });
                },
                400);
            });

            // seaerch event focus
            $(".J-search-txt").focus(function() {
                var keyword = $(this).val();
                if (!keyword) {
                    $(".J-fuzzy-find-list").hide();
                    $(".J-hot-city-list").show();
                }
            });
        },
        ipSearch: function() {
            var i = this;
            if ((!$.cookie("id")) && (!$.cookie("name"))) {
                $.ajax({
                    type: "get",
                    url: "/area/ip.json",
                    dataType: "json",
                    success: function(data) {
                        var remoteArea = data.remoteArea,
                        isCdRange = data.isCdRange;
                        if (data.remoteArea) {
                            /*
				     * $(".J-city-name").text(remoteArea.cnName);
				     * $("input[name=departurePlaceId]").val(remoteArea.id);
				     */
                            $(".J-city-list li").each(function() {
                                var _name = parseInt($(this).find("a").attr('data-value'));
                                if (remoteArea.id === _name) {
                                    $(".J-city-name").text(remoteArea.cnName);
                                    $("input[name=departurePlaceId]").val(remoteArea.id);
                                }
                            })
                        }
                        i.ipvalue();
                        if ($(".city-dropdown").is(":visible")) {
                            i.listRequest();
                        } else i.listRequest({
                            specification: 0
                        });

                    }
                });
            } else {
                $(".J-city-name").text($.cookie("name"));
                $("input[name=departurePlaceId]").val($.cookie("id"));
                i.ipvalue();
                if ($(".city-dropdown").is(":visible")) {
                    i.listRequest();
                } else i.listRequest({
                    specification: 0
                });
            }
        },
        ipvalue: function() {
            // judge cd ip
            var _dataValue = parseInt($("input[name=departurePlaceId]").val());
            if (_dataValue == 2294) {
                $(".J-not-cd-ip").hide();
                $(".J-cd-ip").show();
                $(".J-search-city-ul").css("visibility", "visible");
            } else {
                $(".J-not-cd-ip").show();
                $(".J-cd-ip").hide();
                $(".J-search-city-ul").css("visibility", "visible");
            }
        },
        hotSupplier: function() {
            $.ajax({
                url: "/product/hotSupplier.json?size=5&_=" + Date.parse(new Date()),
                type: 'GET',
                dataType: "json",
                success: function(data) {
                    if (data && data.hotSupplierList) {
                        var _hotSupplier = $("#hot_tourist_line");
                        for (var i = 0; i < data.hotSupplierList.length; i++) {
                            var _thisHot = data.hotSupplierList[i],
                            index = i + 1,
                            $list = $("<div class=\"hot_li\"><span class=\"hot_li_num red_bg\">" + index + "</span><a href=\"javascript:void(0);\" class=\"hot_li_title\" title=" + _thisHot.name + " attr_id=" + _thisHot.id + ">" + _thisHot.name + "</a><span class=\"hot_li_info\" title=\"更新" + _thisHot.statistics.updateProductCountWeek + "条计划\">更新<span class=\"important_tips\">" + _thisHot.statistics.updateProductCountWeek + "</span>条计划</span></div>");
                            if (i > 2) {
                                _hotSupplier.append($list);
                                _hotSupplier.find(".hot_li").eq(i).find(".hot_li_num").removeClass('red_bg').addClass('blue_bg');
                            } else {
                                _hotSupplier.append($list);
                            }

                        }
                    }
                }
            });
        },
        event: function() {
            var i = this,
            vars = i.staticVars;

            // 调用input输入框搜索
            i.inputSearchHandler();

            // 价格输入框限制
            $("#validateform input[name=minPrice], #validateform input[name=maxPrice]").keyup(function() {
                $(this).val($(this).val().replace(/\D/g, ''));
            });

            // 事件代理
            $(document).on("click", ".J-city-button, .J-search-button",
            function() {
                // two for city search button
                var _name = $(this).siblings('div');
                if (_name.hasClass("open")) {
                    _name.removeClass("open");
                } else {
                    _name.addClass("open");
                }
            }).on("click", ".J-city-list a,.J-search-list a",
            function() {
                // two for city search
                var _dataValue = $(this).attr("data-value"),
                _name = $(this).text();
                $(".J-city-name").text(_name);
                $("input[name=departurePlaceId]").val(_dataValue);
                $(".J-search-button").find('.name').text(_name);
                $(this).parents("div").removeClass('open');
                if (_name == "全部") {
                    _name = "全部出发地";
                }
                $.cookie("id", _dataValue);
                $.cookie("name", _name);
                i.ipSearch();

            }).on('click', '.J-gm-close',
            function() {
                // gm-close icon state
                $(".J-search-txt").val("");
                $(this).hide();
                $(".J-fuzzy-find-list").hide();
            }).on('click', '.J-city-con-right a',
            function() {
                // sub search-list a click
                var _value = $(this).text();
                i.searchClick(_value);
                $(".J-hot-city-list").hide();

            }).on('click', '.J-search-city-ul a',
            function(event) {
                // left city a click
                var _value = $(this).text();
                i.searchClick(_value);
                $(this).parents(".city-con-hover").mouseleave();

            }).on('mouseenter', '.J-search-city-ul li',
            function() {
                $(this).find('.city-con-hover').show();
                $(this).prev().find(".city-con-box>div").css("border-color", "transparent");
                $(this).find(".city-con-box>div").css("border-color", "transparent");
            }).on('mouseleave', '.J-search-city-ul li',
            function() {
                $(this).find('.city-con-hover').hide();
                $(this).prev().find(".city-con-box>div").css("border-color", "#e0e1e2");
                $(this).find(".city-con-box>div").css("border-color", "#e0e1e2");
            }).on('click', '.J-fuzzy-find-list li',
            function(event) {
                // fuzzy search click
                var _val = $(this).find(".name").text();
                $(".J-search-txt").val(_val);
                $(".J-fuzzy-find-list").hide();
                i.searchClick(_val);

            }).on("click", ".J-share",
            function() {
                if (noLogin == true) {
                    $.showMsg("限港马分销商登录后使用，客人将在产品页面看到您的名称及设置的对应报价", "danger");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "/product/send/" + $(this).parents("tr").attr("data-id") + "?format=json",
                    data: {
                        m: Math.random()
                    },
                    success: function(response) {
                        if (response.success) {
                            $("#J-share-dialog").window({
                                title: "发送给直客",
                                width: "auto",
                                footer: "<div class=\"dialog-tip\"><p>• 直客看到的将是您微网站内对应产品的介绍页，并显示您设置的直客价</p><p>• 供应商、同行价等敏感信息直客不会看到，请放心</p></div>",
                                event: function(dialog) {
                                    $("img", dialog).attr("src", "/qrcode?text=" + response.message + "&width=120&height=120&m=" + new Date().getTime());
                                    $("input", dialog).val(response.message).attr("placeholder", response.message);
                                    $(".J-clone", dialog).copy();
                                }
                            });
                        } else {
                            $.showMsg(response.message, "danger");
                        }
                    },
                    error: function() {
                        $.showMsg("服务器错误!", "danger");
                    }
                });

            }).on('click',
            function(target) {
                // sub search-list hide
                if ($(target.target).parents(".search-input").size() == 0) {
                    $(".J-hot-city-list").hide();
                    $(".J-fuzzy-find-list").hide();
                };
                if ($(target.target).parents(".city-dropdown").size() == 0) {
                    $(".J-search-list").removeClass('open');
                }
                if ($(target.target).parents(".ip-city").size() == 0) {
                    $(".J-city-list").removeClass("open");
                }

            }).keydown(function(event) {
                // shortcut key
                if (event.keyCode == 13) {
                    $(".J-search-btn").click();
                }
            }).on("click", ".J-search-btn",
            function() {
                // search button click
                var _value = $(".J-search-txt").val();
                if (_value) {
                    i.searchClick(_value);
                } else {
                    return false;
                }

            }).on("mouseenter", ".J-search-city-list",
            function() {
                // left city list meanu
                $(".J-new-ul").show().addClass('new');

            }).on("mouseleave", ".J-search-city-list",
            function() {
                // left city list meanu
                $(".J-new-ul").hide().removeClass("new");

            }).on("click", "#hot_tourist_line .hot_li_title",
            function() {
                // hot supplier click
                var _supplier = $(this).attr("attr_id");
                $(".search-box tbody").empty();
                i.searchClick($(".J-search-txt").val(), _supplier);

            }).on("click", ".pagination li",
            function() {

                var page = $(this).attr("page");

                // 分页事件
                if ($(this).hasClass("disabled") || $(this).hasClass("active")) {
                    return false;
                }

                if (!isNaN(page)) {
                    i.listRequest({
                        page: page
                    });
                }

            }).on("click", "#J-order-search li",
            function() {

                // order
                var temp = $(this).parent();
                temp.hide().prev("span").find("span").attr("data-id", $(this).attr("data-id")).text($(this).text());
                setTimeout(function() {
                    temp.removeAttr("style");
                },
                100);
                i.listRequest({
                    "sort": $(this).attr("data-id")
                });

            }).on("click", "#J-price-search",
            function() {
                var minPrice = $("[name=minPrice]").val(),
                maxPrice = $("[name=maxPrice]").val(),
                minPrice_value = $("[name=minPrice]").attr("data-value")||"",
                maxPrice_value = $("[name=maxPrice]").attr("data-value")||"";

                if (minPrice != minPrice_value || maxPrice != maxPrice_value) {
                    if ((!isNaN(minPrice)) && (!isNaN(maxPrice)) && (parseInt(minPrice) > parseInt(maxPrice))) {
                        $.showMsg("最低价不能高于最高价。");
                        return false;
                    }

                    if (minPrice != minPrice_value) {
                        minPrice_value = minPrice;
                    }
                    if (maxPrice_value != maxPrice) {
                        maxPrice_value = maxPrice;
                    }

                    $("#J-maxPrice").attr("data-value", maxPrice_value);
                    $("#J-minPrice").attr("data-value", minPrice_value);

                    if ($(this).parent().next(".clear").size() == 0) {
                        $(this).parent().after("<a class=\"clear\">清除</a>");
                    } else if ((!minPrice_value) && (!minPrice_value)) {
                        $(this).parent().next(".clear").remove();
                    }
                    i.listRequest({
                        "specification": 0,
                        "minPrice": minPrice_value,
                        "maxPrice": maxPrice_value
                    });
                }

            }).on("click", "#J-airplane-search",
            function() {

                var airline = $("[name=airlineCode]").val(),
                airline_value = $("[name=airlineCode]").attr("data-value")||"";
                if (airline != airline_value) {
                    $("[name=airlineCode]").attr("data-value", airline);
                    airline_value = airline;
                    i.listRequest({
                        "specification": 0,
                        "airlineCode": airline_value
                    });
                    if ($(this).parent().next(".clear").size() == 0) {
                        $(this).parent().after("<a class=\"clear\">清除</a>");
                    } else if (!airline_value) {
                        $(this).parent().next(".clear").remove();
                    }
                }

            }).on("click", "a.clear",
            function() {

                var temp = $(this).prev();
                $("input", temp).val("").attr("data-value", "");
                $(".btn", temp).show();
                $(this).remove();
                i.listRequest({});

            }).on("click", ".search-box .gm-arrow",
            function() {
                if ($(this).parent().hasClass("box-open")) {
                    $(".search-box .show-box").scrollTop(0);
                    $(this).parent().removeClass("box-open");
                } else {
                    $(this).parent().addClass("box-open");
                }

            });
        }
    };

    controller.call();

} (new this.jSharp.controller());