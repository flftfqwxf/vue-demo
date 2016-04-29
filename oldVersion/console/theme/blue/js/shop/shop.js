Date.prototype.format = function(fmt) {
	if (!fmt)
		fmt = "yyyy-MM-dd";
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
function shopOperate(url, title, options){
	var opts = {
	        title   :   title,
	        isClose :   false,
	        fixed   :   true,
	        lock    :   true
    };
    return openDialog(url, $.extend({}, opts, options));
}

function shopView(id){
	var auditedView = shopOperate('/shop/item?distributorId='+id, '详情',{
		isOuterBoxShadow: false,
		isClearBtn: true,
		button: [
					{
						name:'关闭',
						cssClass:'btn-cancel',
						callback: function(){
							auditedView.close();
							return false;
						}
					}
				]
	});
}

function sort(sortParam) {
   $('#sortInput').val(sortParam);
   $('#searchForm').submit();
}

/**
 * 根据传入日期获取这周一的日期
 * @param current
 * @returns
 */
function getMondayByCurrent(current) {
	var currDate = new Date();
	if (current && typeof current === "string") {
		currDate = new Date(current);
	} else if (typeof current === "Date") {
		currDate = current;
	}
	var currentDay = currDate.getDay();
	if (currentDay == 0) {
		currentDay = 7;
	}
	
	currDate.setDate(currDate.getDate() - currentDay + 1);
	return currDate;
}

/**
 * 根据当前日期获取当月的第一天的日期
 * @param current
 * @returns
 */
function getFirstDayOfMonthByCurrent(current) {
	var currDate = new Date();
	if (current && typeof current === "string") {
		currDate = new Date(current);
	} else if (typeof current === "Date") {
		currDate = current;
	}
	var year = currDate.getFullYear();
    var month = currDate.getMonth();
    if (month < 10){
        month = "0"+month;
    }
    return new Date(year, month, "01");
}