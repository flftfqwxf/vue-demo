//日期格式处理
var startDate=$("[name=startDate]").val(),
    endDate=$("[name=endDate]").val();
if(startDate){
    startDate=startDate.substring(0,4)+"-"+startDate.substring(4,6)+"-"+startDate.substring(6,8);
}
if(endDate){
    endDate=endDate.substring(0,4)+"-"+endDate.substring(4,6)+"-"+endDate.substring(6,8);
}
$("#J-startDate").val(startDate);
$("#J-endDate").val(endDate);
$("#search-form").submit(function(){
    $("[name=startDate]").val($("#J-startDate").val().replace(/-/ig,""));
    $("[name=endDate]").val($("#J-endDate").val().replace(/-/ig,""));
});

//导出功能
$("#J-export").click(function(){
    window.location.href="/account/income?format=xls&page=1&size=2000&startDate="+$("#J-startDate").val().replace(/-/ig,"")+"&endDate="+$("#J-endDate").val().replace(/-/ig,"");
});