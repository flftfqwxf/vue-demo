
 var $ul = $("#ulList"), $ulList = $("#ulList"),
        $loading = $("#loading").on("click", loadData),
        $noMore = $("#noMore"),
        $noResult = $("#noResult"),
        $beforeSearch = $(".beforeSearch");
    	params = {size: 10, sort: 0},
        page = 1,
        leftHeight = 0,
        rightHeight = 0;
    	var $erro=$(".wrong_div");

//获取随机数
function getRandom(num1, num2) {
    if (num2){
        return Math.floor((num2 - num1) * Math.random()) + num1;
    }
    return Math.floor(num1 * Math.random());
}

//加载数据
var timer;
function loadData(query, filter) {
    if ($loading.find("div").hasClass("loading")) {
        return false;
    }
    isFilter = filter;
    if (query === true) {
        page = 1;
        $("#ulList").html("");
    }
    $noResult.add($noMore).hide();
    $loading.show().find("div").addClass("loading");
    $loading.show().find("div").html('<span class="onLoad"><img src="http://static.gmmtour.com/m/theme/manage/images/loading.gif" />加载中，请稍后...</span>');
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

$(window).load(function(){
	var winHeight =$(window).height();
    var headHeight =$(".h_top").height();
    var footHeight = 0;
    var dh = winHeight - footHeight-headHeight;
    $("#noResult").css({"min-height":(dh)+"px"});
    $(".gmui-page").css({"min-height":winHeight+"px"});
    $(".beforeSearch").css({"min-height":(dh)+"px"});
    $(".outer-box").height(dh);
});

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


(function ($) {
    //状态标识，用于判断当前操作是否为筛选
    var isFilter = false;
    //滚动加载数据
    $(window).on("scroll", onScroll);
    
	var winHeight =$(window).height(),
   headHeight =$(".h_top").height(),footHeight = 0;
    var dh = winHeight - footHeight-headHeight;
    var $searchInput=$(".search_input"),$searchBtn=$(".searchBtn");
    $(".main").css({"min-height":(dh)+"px"});
    params.keyWord=$("#keyword2").val();
	$(".search_input").val(params.keyWord);
	
	//搜索页面的js处理
    if (params.keyWord != "") {
    	$(".search_input").val(params.keyWord);
        $beforeSearch.hide();
        $(".main").show();
        loadData(true);
    }
    //清空输入框
    $(".gm-close-o").click(function(){
    	$searchInput.val("");
    	params.keyWord = "";
		location.href = "/search-input";
    });
    
    //监听输入框事件
    $searchInput.keyup(function(){
    	var value=$(this).val();
    	if(value == ""){
    		$(".destination").show();
        	$("#ulList").html("");
    		$(".main").hide();
    	}
    });
    
    //点击目的地
    $(".destination_item").click(function(){
    	var dataId=$(this).attr("data-id");
    	location.href="/product?line="+dataId;
    });
    
    //点击搜索事件
    $searchBtn.click(function () {
    	$(".main").show();
        $beforeSearch.hide();
        var keyword = $.trim($searchInput.val());
        if (keyword == "") {
            $(".destination").show();
        	$("#ulList").html("");
    		$(".main").hide();
            return;
        } else {
        	$(".destination").hide();
        	$(".main").show();
        	if(keyword != params.keyWord){
                location.href = "/search-input?keyWord=" + keyword;
                params.keyWord = keyword;
        	}
        }
    });
    
})(jQuery);
		