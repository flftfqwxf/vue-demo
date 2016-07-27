$(function(){

    var common={
      init:function(){

      },
      art:function(title,temId){
          $.dialog({
          title: title,
          width: 600,
          height:"auto",
          padding : '5px 20px',
          content:'',
          lock: true,
          fixed: true,
          resize: false,
          cancelVal:"取消",
          cancel:function(){
            if(window.confirm("取消将清空已经录入的内容，是否取消？")){
              return true;
            }else{
              return false;
            }
          },
          okVal:"确定",
          ok: function(){
            if(title==="系统消息"){ //群发系统消息
              if($(".alldis").prop("checked") || $(".allsup").prop("checked")){
                if($("#rules").val()!=="" && $("#rules").val()!==undefined){
                  if($("#rules").val().length<=500){
                    if(window.confirm("确认发送给供应商/分销商")){//二次确认
                        $("#systemForm").submit(); 
                        return true;
                    }else{
                      return false;
                    }                                  
                  }else{
                     common.item($(".systembox .items"),"字符不能超过500。");
                     return false;
                  }                               
                }else{
                   common.item($(".systembox .items"),"文本编辑器不能为空。");
                   return false;
                }
              }else{
                 common.item($(".systembox .items"),"全部分销商和全部供应商请选填一个。");
                 return false;
              }                                             
            }else{//群发手机短信
              //     var reg=/^[\u4e00-\u9fa5]+$/;//中文验证
              //     var regtel=/0?(13|14|15|18)[0-9]{9}/;//手机号码验证。
              //     if($(".alldis_note").prop("checked") || $(".allsup_note").prop("checked") || $(".assign_tel").prop("checked")){
              //         if(reg.test($("#note").val())){
              //             if($(".assign_tel").prop("checked")){//勾选了指定，执行下面。
              //                if($("#telList").val()!==""){
              //                    var result=common.arr($("#telList").val())
              //                    var flag=true;
              //                    for(var i=0;i<result.length;i++){
              //                       if(regtel.test(result[i])){
              //                          flag=true;
              //                       }else{
              //                          flag=false;
              //                          break;
              //                       }
              //                    };
              //                    if(flag){
              //                        $("#phoneForm").submit();
              //                    }else{
              //                       common.item($(".phonebox .items"),"手机号码列表中有不合规范的手机号");                                      
              //                    };
              //                    return flag;
              //                }else{
              //                   common.item($(".phonebox .items"),"手机号码输入框不能为空");
              //               return false;
              //                }
              //             }else{
              //                $("#phoneForm").submit(); //没有勾选指定，直接提交。
              //                return true;
              //             }
              //       }else{
              //         common.item($(".phonebox .items"),"短信内容必须填写并且必须是中文");
              //         return false;
              //       }
              //     }else{
              //         common.item($(".phonebox .items"),"全部分销商、全部供应商、指定号码请选填一个。");
              //       return false;
              //     }
              }                      
          },          
          init:function(){
            $(".aui_content").html(template(temId));             
          }
        });     
      },
      eitor:function(){//富文本编辑器
        $("textarea[tag=edit]").each(function(){
          editor = initKindEditor($(this),null, null,"",null,null,function(){
            var statusBar = this.statusbar.get();
              var limitNum = 500;
              var textLength = common.getInputLen(this.html());
              var pattern = '还可以输入' + limitNum + '字';
              if(textLength > limitNum) {
                pattern = '你输入的字符个数已经超出最大允许值,最多输入'+limitNum+'个字符';
              }else{
                var result = limitNum - textLength;
                  pattern = '还可以输入' +  result + '字符';
              }
              $(statusBar).find(".status-text").text(pattern);
              this.sync();

          });         
        });     
      },
      getInputLen:function(val){
        var count = val.length;
        var arr = val.match(/\n/g);
        if(arr){
          count += arr.length;
        }
        return count;     
      },
      item:function(obj,artic){//提示方法
        obj.html(artic).show();
              setTimeout(function(){
                 obj.hide();
              },1500);
      }
      // arr:function(obj){ //将textarea内容转化为数组
      //   var proIdArr=obj.replace(/\r/ig,",").replace(/\n/ig,",").trim().split(","); 
      //   var newarr=[];           
      //   for(var i=0,a=proIdArr.length;i<a;i++){
      //     if(proIdArr[i] !== "" &&  proIdArr[i] !== undefined){
      //          newarr.push(proIdArr[i]); 
      //     }
      //   }
      //   return newarr;
      // }
    }
    common.init();

   //群系统消息
   $("#system").on("click",function(){
       common.art("系统消息","systemArt");
       common.eitor();
       setTimeout(function(){
          $(".status-text").html("最多输入500个字符")
       },10);      
   });
   //群手机消息
   // $("#phone").on("click",function(){
   //     common.art("群发短信","phoneArt");    
   // });
   // //选择
   // $(document).on("click",".assign_tel",function(){
   //    if($(".assign_tel").prop("checked")){
   //       $("#telList").removeAttr("disabled");          
   //    }else{
   //       $("#telList").attr("disabled","disabled");
   //    }
   // }).on("valuechange","#note",function(){ //算短信条数
   //      if($("#note").val()!==""){
   //          $(".phonebox .note_number").show();
   //      }else{
   //          $(".phonebox .note_number").hide();
   //      }
   //      $(".phonebox .note_number span").text(Math.ceil($(this).val().length/60))
   // });


})