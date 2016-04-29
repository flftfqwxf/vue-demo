function setProductSaleStatus(id, st){
	var url = '/product/'+id+'/onshelves';
	var msg = '您确定要上架该产品？'
	if('ON' == st){
		url = '/product/'+id+'/offshelves';
		msg = '产品下架后，若分销商已经将该产品上架到自己的网站，则也<br/>会自动下架'
	}
	$.confirm(msg,'确认提示',function(){
		$.ajax({
			url : url,
			type: "POST",
			dataType: "json",
			data:{format:'json', _method:'PUT'},
			success:function(data){
				showmsg(null, data, 'flush_now');
			}
		});
	},function(){});
}