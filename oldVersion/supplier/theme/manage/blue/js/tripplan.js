$(window).load(function(){
	autoWidth('planTitle');
	
	$('body').on('mouseover','div.plan_title',function(e){
		$('#editPlanTitle').show();
	}).on('mouseout', 'div.plan_title', function(){
		$('#editPlanTitle').hide();
	});
	
	$('#planTitle').on('keyup', function(e){
		autoWidth('planTitle');
		if(e.keyCode == 13) { //回车
			editTitle(false);
		}
	}).on('blur', function(){
		editTitle(false);
	});
	
	$('#editPlanTitle').on('click', function(){
		editTitle(true);
	});
	
	
	$('body').on('mouseover','div.brightspot',function(e){
		$('#editBrightSpot').show();
	}).on('mouseout', 'div.brightspot', function(){
		$('#editBrightSpot').hide();
	});
	
	$('#editBrightSpot').on('click', function(){
		editBrightSpot(true);
	});
	
	$('#brightspot').on('blur', function(){
		editBrightSpot(false);
	});
});

//修改框宽度自适应
function autoWidth(id){
	iCount = $('#'+id).val().replace(/[^\u0000-\u00ff]/g,"aa").length;
	$('#'+id).attr('size',iCount+2);
}

function editTitle(isEdit){
	if (isEdit) {
		$('#planTitleValue #planTitle').val($('#planTitleShow').text());
		autoWidth('planTitle');
		$('#planTitleValue').show();
		$('#planTitleValue #planTitle').focus();
		$('#editPlanTitle').hide();
		$('#planTitleShow').hide();
	} else {
		$('#planTitleShow').text($('#planTitleValue #planTitle').val());
		$('#planTitleValue').hide();
		$('#planTitleShow').show();
	}
}

function editBrightSpot(isEdit){
	if (isEdit) {
		$('#brightSpotVal #brightSpot').val($('#brightSpotShow').text());
		//autoWidth('planTitle');
		$('#brightSpotVal').show();
		$('#brightSpotVal #brightSpot').focus();
		$('#editBrightSpot').hide();
		$('#brightSpotShow').hide();
	} else {
		$('#brightSpotShow').text($('#brightSpotVal #brightSpot').val());
		$('#brightSpotVal').hide();
		$('#brightSpotShow').show();
	}
}