(function($){
	var data = {size:5}, h = "", $c = $("#calendar"), $s = $("#stat"), w = "日，一，二，三，四，五，六".split("，"), pid;
	$(document).on("click",".qr,.pagenumber a",function(){
		var r = $(this).attr("rel");
		if(r){
			var d = {};
			if(r.indexOf("#") == 0){
				d[r.substring(1)] = $(r).val();
			}else{
				d = JSON.parse(r);
			}
			if(!d.viewAuthority)
				delete data.viewAuthority;
			load(d)
		}else{
			var l = $(this).attr("href");
			l && load({page:l.substring(l.indexOf("&page=")+6)})
		}
		return false;
	}).on("click",".stop",function(){
		var id = $(this).closest("tr").attr("rel");
		$.post("/tour/"+id+"/stop.json",function(){
			load();
		})
		return false;
	}).on("click",".del",function(){
		var p = $(this).closest(".but_more").position();
		pid = $(this).closest("tr").attr("rel");
		$("#confirm").css({top:p.top-90,left:p.left-50}).show();
		return false;
	}).on("click",".cancel",function(){
		$("#confirm").hide();
	}).on("click",".ok",function(){
		pid && $.ajax({
			url:"/tour/"+pid+".json",
			dataType:"json",
			method:"delete",
			success:function(d){
				load();
			}
		});
	})
	function load(d){
		$("#confirm").hide();
		if(d && !d.page)
			delete data.page;
		data = $.extend(data,d);
		$.each(data,function(k,v){
			if(v == "" || v == null){
				delete data[k];
			}
		})
		if(data.date){
			d = $s.find(".qr").length == 0;
			h = $s.html();
			$s.html("指定发团日期："+data.date+"<a class='but_more but_cel qr' rel='{\"date\":\"\"}'>取消</a>");
			d && $s.data("h",h);
		}else{
			h = $s.data("h");
			h && $s.html(h);
		}
		console.log(data);
		$("#dataList").load("/tour/list"+location.search,data)
	}
	load();
	for(var i=1;i<13;i++){
		h +="<option value='"+i+"'>"+(i<10?"0":"")+i+"</option>";
	}
	$("#month").append(h).change(function(){
		var y = $("#year").val(), m = this.value, count = 0;
		var temp = new Date(parseInt(y),parseInt(this.value),0);
		h = "",l = temp.getDate();
		temp.setDate(1);
		var z = temp.getDay();
		for(var i=1;i<=l;i++){
			h+='<div class="col"><p>'+i+'(周'+w[z++%7]+')</p></div>';
		}
		$c.find(".col").remove();
		$c.append(h);
		$.getJSON("/tour/trips.json?month="+y+"-"+m,function(d){
			$.each(d.trips,function(){
				count += this.count;
				var index = this.date.substring(8,10);
				$c.find(".col").eq(index-1).addClass("on").append("<a class='qr' rel='{\"date\":\""+this.date.substring(0,10)+"\"}'>"+this.count+"个行程</a>")
			})
			$s.html("<b>"+m+"</b>月共有<b>"+count+"</b>个行程发团，点击日期查看详情：")
		})
	}).val(new Date().getMonth()+1).change();
})(jQuery)