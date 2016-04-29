     var cardNo=$("#J-cardNo");
    cardNo.val(cardNo.val().toBankStr());
    
    var getInputValue={
        accountName:$(".accountName"),
        bankNumber:$(".bankNumber"),
        selProvince:$(".selProvince"),
        selCity:$(".selCity"),
        bankName:$(".bankName"),
        bankNameChild:$(".bankNameChild"),
        contant:$(".contant"),
        phone:$(".phone")
    };
    $("#J-cardNo").keyup(function(){
	$(this).val($(this).val().toBankStr());
    });
    
    $("[name=provinceId]").select({
        api:"/area/11.json",
        defaultText:"请选择省份",
        onSelect:function(id){
           $("[name=cityId]").select({
                api:"/area/"+id+".json",
                defaultText:"请选择城市"
            });
        },
        onInit:function(){
            if($("[name=provinceId]").val()){
        	$("[name=cityId]").select({
                    api:"/area/"+$("[name=provinceId]").val()+".json",
                    defaultText:"请选择城市"
                });
            }
        }
    });
    
    
    
    $("#setting").validationEngine({
          // Auto-hide prompt  
        autoHidePrompt: true,  
        showOneMessage:true,
        // Delay before auto-hide  
        autoHideDelay: 10500,  
    });

   $("#J-submit").click(function(){
        var getFormVlaue ={};
        if($("#setting").validationEngine('validate')){
               $.each(getInputValue, function(index, val) {
                    getFormVlaue[index] = val.val();
               });
               
               getFormVlaue["bankNumber"]=getFormVlaue["bankNumber"].toBankStr();
               getFormVlaue["selProvince"]=$(".selProvince option[value="+getFormVlaue["selProvince"]+"]").text();
               getFormVlaue["selCity"]=$(".selCity option[value="+getFormVlaue["selCity"]+"]").text();
               
               $.dialog({
                title:"核对收款账户信息",
                content:template("test-account-info",getFormVlaue),
                width:462,
                height:102,
                lock:true,
                fixed:true,
                padding:"10px 0",
                button:[
                    
                    {
                        name:"取消"
                    },
                    {
                        name:"确认提交",
                        className: 'btn-process',
                        callback:function(){
                            var cardNo=$("#J-cardNo");
                            $("[name=cardNo]").val(cardNo.val().replace(/\s/g,""));
                            $("#setting").submit();
                        }
                    }
                ]

            })
        }
       
   });
   
$(window).resize(function(){
	   $(".withdraw-setting").height($(window).height()-$(".page-footer").outerHeight(true)-$(".sub-title").outerHeight(true)-$(".page-title").outerHeight(true)-40);
}).resize();