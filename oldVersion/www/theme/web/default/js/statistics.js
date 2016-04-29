(function(){
	var url = window.location.href;
	//url = url.replace(/([^?]+[^/]).*/,"$1");
	//不能使用AJAX..跨域AJAX不会带上cookie
//	alert(encodeURIComponent(url));
	var request = "http://www.gmmtour.com/statistics?url=" + encodeURIComponent(url);
	var img = new Image();
	img.src = request;
})();