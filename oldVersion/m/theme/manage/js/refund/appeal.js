$(function(){
	$(document).on("click",".J-appeal-select>label.btn",function(){
		event.preventDefault();
		if ($(this).hasClass('active')) {
			$(this).removeClass("active");
		}else{

			$(this).addClass("active").siblings().removeClass("active");
		}
	})
})