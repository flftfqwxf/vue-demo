function searchText(obj) {
	var text = obj.val();
	if (text == "" || text == undefined) {
		obj.val("搜索目的地");
	}
}
function isPlaceholer() {
	var input = document.createElement("input");
	return "placeholder" in input;
}
/*禁止输入特殊字符*/
function ValidateValue(textbox)  
{  
     var IllegalString = "\`~@#;,.!#$%^&*()+{}|\\:\"<>?=/,\'";  
     var textboxvalue = textbox.value;  
     var index = textboxvalue.length - 1;  
       
     var s = textbox.value.charAt(index);  
       
     if(IllegalString.indexOf(s)>=0)  
     {  
        s = textboxvalue.substring(0,index);  
        textbox.value = s;  
     }  
}  
$(function() {
    $(".main").css("height",$(window).height());
	if (!isPlaceholer()) {
		var $searchtext = $(".search-box").find("input");
		$searchtext.val("搜索目的地");
		$searchtext.blur(function() {
			searchText($searchtext);
		});
		$searchtext.focus(function() {
			$searchtext.val("");
		});
		$searchtext.keydown(function() {
			$searchtext.unbind("focus");
		});
	}
	$(".search-bt").click(function(){
		var iptVal = $(".search-input").val(); 
		if(iptVal=="搜索目的地"){
			iptVal="";
		}
    	window.location.href="/search-input?keyword="+iptVal;
	});
	$(".search-ico").click(function(){
		var iptVal = $("#search-ipt").val(); 
		if(iptVal=="搜索目的地"){
			iptVal="";
		}
    	window.location.href="/search-input?keyword="+iptVal;
	}) ;  
});