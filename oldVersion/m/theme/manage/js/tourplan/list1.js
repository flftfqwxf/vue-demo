;(function($){	
	var url = window.location.href+".json";
	var $ul = $("#ulList"), 
	$loading = $("#loading").on("click",loadData),
	$noMore = $("#noMore"),
	$noResult = $("#noResult"),
	params = {size:10,sort:0},
	page = 1;

	function getRandom(num1,num2){
		if(num2)
			return Math.floor((num2-num1) * Math.random()) + num1;
		return Math.floor(num1 * Math.random());
	}
	function loadData(query){
		if($loading.hasClass("loading"))
			return false;
		if(query === true){			
			page = 1;
		}
		params["page"] = page++;
		$.getJSON(url, params ,function(d){
			$loading.removeClass("loading");
			var prevHeight = 0, len = d.images && d.images.length;//rd1 = getRandom(5), rd2 = 5 + getRandom(5),
			if(!len){
				if(query === true){
					$noResult.show();
					$ul.hide();
				}else{
					$noMore.show();
				}
				$loading.hide();
				return;
			}
			$ul.show();
			var columnWidth = Math.floor($ul.width()/3);
			$.each(d.images,function(i){
				var img = this.url, height = Math.floor(columnWidth*0.7);
				var dataOriginal =  this.url;
				if(dataOriginal.indexOf("gmmtour.com")>0){
					img+="@"+columnWidth+"w_"+ height +"h_1e_50q";	
				}else{
					img = dataOriginal;
				}	
				prevHeight = height;
				this["img"] = img;
				this["height"]=height;
				var num=Math.floor(getRandom(1,6));
				var bgColor="";
				if(num==1){	bgColor="#ec9696";}
				if(num==2){	bgColor="#ecd796";}
				if(num==3){	bgColor="#96ecdd";}
				if(num==4){	bgColor="#96c0ec";}
				if(num==5){	bgColor="#b7a6f4";}
				this["bg"]=bgColor;
				$ul.append(template("tpl_list_li",this));				
			});			
		}).fail(function(){
			$ul.add($loading).add($noMore).hide();
			$noResult.show();
		});
	}	
	loadData(true);
})(jQuery);
		