
 var $ul = $("#ulList"), $ulList = $("#ulList"),
        $loading = $("#loading").on("click", loadData),
        $noMore = $("#noMore"),
        $noResult = $("#noResult"),
        $beforeSearch = $(".beforeSearch"),
        params = {size: 10, sort: 1,line: $("#lineId").val()},
        page = 1,
        leftHeight = 0,
        rightHeight = 0;
    	var $erro=$(".wrong_div");

//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//获取随机数
function getRandom(num1, num2) {
    if (num2){
        return Math.floor((num2 - num1) * Math.random()) + num1;
    }
    return Math.floor(num1 * Math.random());
}

function setHeight(){
	var winHeight =$(window).height();
    var headHeight =$("header").height() + $("[data-id=topFilterDeparture]").height();
    var footHeight = 0;
    var dh = winHeight - footHeight-headHeight;
    $("#noResult").css({"min-height":(dh)+"px"});
    $(".beforeSearch").css({"min-height":(dh)+"px"});
    $(".outer-box").height(dh);
    $(".departure").height(dh-36);
};

//加载数据
var timer;
function loadData(query, filter) {
    isFilter = filter;
    if (query === true) {
        page = 1;
        $("#ulList").html("");
    }
    $beforeSearch.hide();
    $noResult.add($noMore).hide();
    $loading.show().find("div").addClass("loading");
    $loading.show().find("div").html('<span class="onLoad"><img src="'+WEB_STATIC+'/m/theme/manage/images/loading.gif" />加载中，请稍后...</span>');
    params["page"] = page++;
    clearTimeout(timer);
    $.getJSON("/search.json", params, function (d) {
        $loading.find("div").removeClass("loading");
        if(page>3){
        	timer=setTimeout(function(){
        		$loading.find("div").html('点击加载更多');
        	},400);
        }
        //在异步获取到产品总数后将重新初始化微信分享
        try {
            if (d.pagination) {
                wx.ready(function () {
                    weixinShareSDK.reSetShareNumAndShare(d.pagination.count);
                })
            }
        } catch (e) {
        }
        var prevHeight = 0, len = d.productList && d.productList.length;
        if (!len) {
            var result = $ulList.html();
            var menu = $("#topFilterLines .oneList li:eq(1)").html();
            if (query === true) {
                $ul.hide();
                $noResult.show();
                $beforeSearch.hide();
            } else {
                $noResult.hide();
                $noMore.show();
            }
            $loading.hide();
            return;
        }
        $ul.show();
        if (len < params.size) {
            $beforeSearch.hide();
            $noMore.show();
            $loading.hide();
        }
        var width = Math.floor($("#ulList").width() / 2) - 10;
        var height = Math.floor(width * 0.7);
        $.each(d.productList, function (i) {
            var img = this.coverImage.url + "@";
            img += width + "w_" + height + "h_1e_60q";
            prevHeight = height;
            this["img"] = img;
            this["height"] = height;
            var num = Math.floor(getRandom(1, 6));
            var bgColor = "";
            if (num == 1) {
                bgColor = "#ec9696";
            }
            if (num == 2) {
                bgColor = "#ecd796";
            }
            if (num == 3) {
                bgColor = "#96ecdd";
            }
            if (num == 4) {
                bgColor = "#96c0ec";
            }
            if (num == 5) {
                bgColor = "#b7a6f4";
            }
            this["bg"] = bgColor;
            $("#ulList").append(template("tpl_list_li", this));
        })
    }).fail(function () {
        $ul.add($loading).add($noMore).hide();
        $noResult.show();
    });
}
//获取当前城市ip
function getCityIP(){
	$.getJSON("http://www.gmmtour.com/area/ip.json",function(d){
		if(d.remoteArea != null){
			$(".departure li").each(function(){
				var city=$(this).text();
				var ip=$(this).attr("data-id");
				if(ip == d.remoteArea.id && !d.isCdRange){
					$(this).addClass("current");
					$('[data-id="topFilterDeparture"] span').text(city+"出发");
				}
				if(d.isCdRange){
					 if(city == "成都"){
						 $(this).addClass("current");
						 $('[data-id="topFilterDeparture"] span').text(city+"出发");
					 }
				}
				params['departurePlaceId']=d.remoteArea.id;
			});
		}else{
			$('[data-id="topFilterDeparture"] span').text("全部出发地");
		}
	});
}

//筛选确定
function confirm(){
	var flag = checkDate($(".date_input"));
	var tripday=$.trim($('[data-name="days"]').val());
	var min=$.trim($('[data-name="minPrice"]').val());
	var max=$.trim($('[data-name="maxPrice"]').val());
	if(flag){
		//验证输入框
		if(! /^\d+$/.test(tripday) && tripday != ""){
			showErro("行程天数必须输入整数",$('[data-name="days"]'));
			return ;
		}
		if( ! /^\d*(?:\.\d{0,20})?$/.test(min) && min != "" ){
			showErro("价格必须输入数字",$('[data-name="minPrice"]'));
			return;
		}
		if(! /^\d*(?:\.\d{0,20})?$/.test(max) && max != ""){
			showErro("价格必须输入数字",$('[data-name="maxPrice"]'));
			return;
		}
		if(min > max && min != "" && max != ""){
			showErro("最低价必须小于最高价",$('[data-name="maxPrice"]'));
			return;
		}
		else{
		     filterClose();
	         $(".lmTopFilter li").find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
	         $(".lmTopFilter li").siblings("li").removeClass("no_current");
	         $(".outer-box-content input").each(function(){
	        	 var name=$(this).attr("data-name");
	        	 var value="";
	        	 if(name == "tourType"){
	        		 if($(this).hasClass("current")){
	        			 value=$(this).attr("data-id");
	        			 params[name] = value;
	        		 }
	        	 }else{
	        		 value=$(this).val();
	        		 params[name] = value;
	        	 }
	         });
	         //加载数据
	         loadData(true, true);
		}
	}
}

/*清空所有情况*/
function clearInput(){
	$(".outer-box-content input[type='text']").each(function(){
		$(this).val("");
	});
	$(".outer-box-content input[type='date']").each(function(){
		$(this).val("");
	});
	$('[data-name="pro_type"]').removeClass("current");
	$('[data-name="pro_type"]:eq(0)').addClass("current");
}

//显示提示信息，200毫秒后消失
function showErro(text,$obj){
	$erro.fadeIn(50).find('span').text(text);
	var showTime=setTimeout(function(){
		$erro.fadeOut(50);
		clearTimeout(showTime);
	},400);
	$(".outer-box-content input").removeClass("erro_border");
	$obj.addClass("erro_border").focus();
}


//时间验证
function  checkDate($obj){
	var from = "", to = "", text = "",flag = true, format = function (v) {
      return v.replace(/-/g, ".").substring(5);
  };
  $obj.find("input[type='date']").each(function () {
      var name = $(this).attr("data-name"), value = this.value;//$(this).attr("data-value");
      params[name] = value || "";
      if ($(this).attr("rel") == "from"){
          from = value;
      }
      else{
          to = value;
      }
  });
  var today = new Date();
  today = today.format("yyyy-MM-dd").toString();
  today = new Date(today.replace(/-/g, "/"));
  var dateFrom = new Date(from.replace(/-/g, "/"));
  var dateTo = new Date(to.replace(/-/g, "/"));
  if (from && to) {
      if (from > to) {
      	showErro("最晚出发时间不能早于最早出发时间！",$('[data-name="endDate"]'));
      	 flag = false;
      }
      if (dateFrom < today) {
      	showErro("出发时间不能早于当前日期！",$('[data-name="startDate"]'));
         flag = false;
      }
      text = format(from) + "-" + format(to);
  }
  else {
      if (from) {
          if (dateFrom < today) {
          	showErro("出发时间不能早于当前日期！",$('[data-name="startDate"]'));
          	 flag = false;
          }
          text = "最早" + format(from);
      }
      if (to) {
          if (dateTo < today) {
          	showErro("出发时间不能早于当前日期！",$('[data-name="endDate"]'));
          	 flag = false;
          }
          text = "最晚" + format(to);
      }
  }
  if (text){
      text += "出发";
  }
  else{
      text = "出发时间";
  }
  return flag;
}
//滚动加载事件
var scrollTimer;
function onScroll() {
  scrollTimer && clearTimeout(scrollTimer);
  if ($loading.is(":visible")) {
      scrollTimer = setTimeout(function () {
          var bottom = $loading.offset().top;
          var scrollTop = $(window).scrollTop();
          var windowHeight = $(window).height();
          if (scrollTop >= bottom - windowHeight) {
              if (page < 4) {
                  loadData();
              } else {
                  $loading.find("div").html("点击加载更多");
              }
          }
      }, 400);
  }
}

var $filter = $("#topFilter"),
    $filterDrap = $(".lmTopFilterDrop"),
    $filterMask = $("#topFilterMask1,#topFilterMask2");

//收起筛选栏目
function filterClose() {
    $filterDrap.hide();
    $filterMask.hide();
    $("body").css({"overflow":"auto","position":"relative"});
    $('li', $filter).removeClass('current');
}

(function ($) {
    //状态标识，用于判断当前操作是否为筛选
    var isFilter = false;
    setHeight();
    (function () {
    	getCityIP();
    	setTimeout(function(){
    		loadData(true, isFilter);
    	},200);
        //滚动加载数据
        $(window).on("scroll", onScroll);

        //筛选
        $filter.on("click", "li", function (e) {
        	$filterMask.show();
            if ($(this).is(".disabled")){
                return false;
            }
	        $filterDrap.hide();
	        $(this).siblings().find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
	        $(this).siblings(".current").removeClass("current").addClass("no_current");
	        var target = $(this).removeClass("no_current").addClass("current").attr("data-id");
	        $(this).find(".gmIcon").removeClass("gm-arrow-full").addClass("gm-arrow-up");
	        var $tar = $("#" + target).show();
	        $("body").css({"overflow":"hidden","position":"absolute","height":"100%"});
            return false;
        });
        $(window).resize(function() {
        	setHeight();
        });
        //出发地选择
        $(".departure li").click(function(){
        	var $this = $(this), name = $this.attr("data-name"), value = $this.attr("data-id");
            $(".topFilterDeparture").siblings().removeClass("current");
            if (params[name] != value) {
            	params[name] = value;
            	$("[data-id='topFilterDeparture'] span").text($this.text());
            	$("[data-id='topFilterDeparture'] .gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
                $this.addClass("current").siblings(".current").removeClass("current");
                loadData(true, true);
        	}
            filterClose();
            return false;
        });
        
        //价格排序
        $(".oneList").on("click", "li[data-id]", function () {
            var $this = $(this), name = $this.attr("data-name"), value = $this.attr("data-id");
            $('.oneList li').siblings().removeClass("current");
            $this.addClass("current");
            if (params[name] != value) {
                params[name] = value;
                $('[data-id="topFilterSorts"] span').text($this.text());
                $('[data-id="topFilterSorts"] .gmIcon').removeClass("gm-arrow-up").addClass("gm-arrow-full");
                loadData(true, true);
        	}
            filterClose();
            return false;
        });
        
        //点击产品类型
        $(".labelBtn").click(function(){
    		$('.labelBtn').removeClass("current");
    		$(this).addClass("current");
    	});
    	
        //筛选组合确定事件
        $("#confirm").on("click", function () {
        	confirm();
        });
        //清空所有筛选条件
        $(".clearfilter").click(function(){
        	clearInput();
    	})
    	
        
        $filterMask.on("click", function () {
            $(".lmTopFilter li").find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
            $(".lmTopFilter li").siblings("li").removeClass("no_current");
            filterClose();
        });
       
    })();
})(jQuery);
		