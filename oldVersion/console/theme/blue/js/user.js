function userOperate(url, title, options, flushNow, callback){
    var opts = {
            title   :   title,
            isClose :   false,
            fixed   :   true,
            lock    :   true,
            resize  :   true
    };
    return openDialog(url, $.extend({}, opts, options), flushNow, callback);
}

function view(id, available){
    var userView = userOperate('/employee/'+id, "用户详情", {
        width: (null != id && "" != id && id > 0)?630:380,
        height: 'auto',
        padding: '0px 0px 4px 0px',
        isOuterBoxShadow: false,
        button: [
                 {
                     name:'删除',
                     callback: function () {
                         $.confirm(
                             "确定删除此帐户（不可恢复）？", 
                             "确认提示", 
                             function(){
                                 $.ajax({
                                     url:"/employee/"+id + "?format=json&_method=DELETE",
                                     type: "POST",
                                     async:false,
                                     dataType: "json",
                                     success:function(json){
                                         showmsg(null, json, 'flush_now');
                                     }
                                 });
                             }, 
                             function(){}
                         )
                         return false;
                     },
                     cssClass: id!=1?'btn-sm-common':'btn-hide'
                 },
                 {
                     name:'停用',
                     callback: function () {
                         $.confirm(
                             "确定禁用此帐户？", 
                             "确认提示", 
                             function(){
                                 $.ajax({
                                     url:"/employee/"+id + "/disable?format=json",
                                     type: "POST",
                                     async:false,
                                     dataType: "json",
                                     success:function(json){
                                         showmsg(null, json, 'flush_now');
                                     }
                                 });
                             }, 
                             function(){}
                         )
                         return false;
                     },
                     cssClass:  /*available&&id!=1 ? 'btn-sm-common' :*/ 'btn-hide' 
                 },
                 {
                     name:'恢复',
                     callback: function () {
                         $.confirm(
                             "确定恢复此帐户？", 
                             "确认提示", 
                             function(){
                                 $.ajax({
                                     url:"/employee/"+id + "/resume?format=json",
                                     type: "POST",
                                     async:false,
                                     dataType: "json",
                                     success:function(json){
                                         showmsg(null, json, 'flush_now');
                                     }
                                 });
                             }, 
                             function(){}
                         )
                         return false;
                     },
                     cssClass : /*available||id==1 ?*/ 'btn-hide' /*: 'btn-sm-common'*/
                 }
             ]
    }, "flush_now");
}


function add(){
    var userAddView = userOperate("/employee/input", "新增用户", {
        width: 440,
        height: 'auto',
        padding: '0px 0px 4px 0px',
        isOuterBoxShadow: false
    });
}
