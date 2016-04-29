/**
 * Created by cai on 2015/6/1.
 */
/*
 * jQuery placeholder, fix for IE6,7,8,9
 * @author JENA
 * @since 20131115.1504
 * @website ishere.cn
 */

var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        $('input[placeholder]').each(function(index, element) {
        	if($(this).attr("setplaceh") != "true"){
	            var self = $(this), txt = self.attr('placeholder');
	            self.attr("setplaceh", "true");
	            var $selfParent = $('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'});
	            self.wrap($selfParent);
	            var holder = $('<span class="placeholder"></span>').text(txt);
	            holder.show();
	            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
	            holder.css({fontSize:'12px',width:self.width(),overflow:'hidden',position:'absolute', left:'50px', top:pos.top, height:h, lienHeight:h, paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
	            if(!self.val()){
	                holder.show();
	            } else {
	            	holder.hide();
	            }
	            $(this).parent().focusin(function(e) {
	                holder.hide();
	            }).focusout(function(e) {
	                if(!self.val()){
	                    holder.show();
	                }
	            });
	            holder.click(function(e) {
	                holder.hide();
	                self.focus();
	            });
        	}
        });
    }
};

$(function(){
	JPlaceHolder.init();
    //切换国内境外周边游
    $(".title-ul li").each(function(i){
    	var $showObj;
        $(this).click(function(){
            $(this).addClass('select').siblings().removeClass('select');
        	$('.f5').attr('type', $(this).attr('type'));
        	$("#recommendForm").find(":input[name='column']").val($(this).attr('type'));
            $(".under_line").css({left:(i*$(this).width())})
            var tbBox = $(".tb-box").addClass("tb-box-hide").eq(i);
            tbBox.removeClass("tb-box-hide");
            JPlaceHolder.init();
            $('.f5').click();
        });
    });
    var defaults = $(".title-ul").find("li[type='"+currentType+"']").index();
    var tbBox = $(".tb-box").addClass("tb-box-hide").eq(defaults);
    tbBox.removeClass("tb-box-hide");
    $(".under_line").css({left:(defaults*$(".title-ul li").width())});
    //拖动排序
    $(".menu-list-box ul").sortable({cursor:"move",stop:function(){

    }});
    //增加一条
    var newLi= '<li class="clearfix item_li">';
    newLi+= '<span class="drag-icon"></span>';
    newLi+= '<input class="menu-pro-name" type="text" placeholder="请输入产品名称">';
    //newLi+= '<a href="javascript:" class="delete-this-bt"></a>';
    newLi+= '<button data-role="delete" type="button" class="btn btn-default">';
    newLi+='<i class="fa fa-trash"></i>';
    newLi+='</button>';
    newLi+= '</li>';

    $(".add-one").click(function(){
        var addType=$(this).attr("type");
        var parentObj=addType=="abroad"?$(".out-box"):addType=="domestic"?$(".in-box"):$(".local-box");
        if($(this).parent().find("ul li.item_li").length < 30){
            $(newLi).appendTo($(this).parent().find("ul"));
            JPlaceHolder.init();
            autoCompleteLoad($(this).parents(".menu-list-box").find("ul"),addType);
        }
    })

    //删除一条
    $(".menu-list-box").on("click",".delete-this-bt",function(){
        $(this).parent("li").remove();
    })

    //提示信息三次以后不显示

    var times = $.cookie('RECOMMEND_MESSAG_TIMES');
	if (!times) {
		$.cookie('RECOMMEND_MESSAG_TIMES', 1, {path:'/'});
		$(".notice").show();
	} else {
		times = parseInt(times);
		if (times < 5) {
			$.cookie('RECOMMEND_MESSAG_TIMES', parseInt(times) + 1, {path:'/'});
			$(".notice").show();
		} else {
			$(".notice").hide();
		}
	}

    //搜索自动完成
    //abroad,domestic,around
    function autoCompleteLoad(parentObj,arg){
	    $(parentObj).find(".menu-pro-name,.cover-pro-name").each(function(){
	        $(this).unautocomplete();
	        $(this).autocomplete("/item/recommend.json?size=10",{
	            minChars: 0,
	            //max: 1000,
	            //scroll: true,
	            clickFire:true,
	            requestParamName: "keyword",
	            showOthers: false,
	            pagination: false,
	            //scrollHeight: '350px',
	            extraParams:{"column": arg},
	            parse:function(data){
	                var item = data.items ? data.items : new Array();
	                if(!item){
	                    //showmsg(null,"xxxx");
	                    //$.gmMessage("无可以使用产品",false)
	                }
	                var parseArr=[];
	                for(var i=0; i<item.length; i++){
	                    parseArr.push({
	                        data: item[i],
	                        value: item[i].product.name,
	                        result:item[i].product.name
	                    })
	                }
	                return parseArr;
	
	            },
	            formatItem: function(row, i, max) {
	                if(!row.product.name)
	                    return "";
	                return row.product.name;
	            }
	        }).result(function(e, d){
	        	if (!d) {
	        		$(this).attr("id", "");
	        		$(this).css('color','#aaa');
	        	} else {
	        		$(this).attr("id", d.id);
	        	}
	        });
	    });
    }

    autoCompleteLoad($(".out-box"),"abroad");
    autoCompleteLoad($(".in-box"),"domestic");
    autoCompleteLoad($(".local-box"),"around");

	$(".table-zone").find(".menu-pro-name,.cover-pro-name").blur(function(){
		if (!$(this).val()) {
			$(this).val("");
			$(this).attr("id", "");
		}
	});
	
	//保存修改
    function getDataList(type,container){

        var dataList={};
        var countCover=0;
        var countList=0;
        
        dataList["recommendList[0].column"] = "abroad";
        $(container).find(".out-box").find(".cover-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[0].coverItems["+(countCover)+"].id"]=$(this).attr("id");
                countCover++;
            }
        });

        $(container).find(".out-box").find(".menu-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[0].listItems["+(countList)+"].id"]=$(this).attr("id");
                countList++;
            }
        });

        var countCover = 0;
        var countList = 0;
        dataList["recommendList[1].column"] = "domestic";
        $(container).find(".in-box").find(".cover-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[1].coverItems["+(countCover)+"].id"]=$(this).attr("id");
                countCover++;
            }
        });

        $(container).find(".in-box").find(".menu-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[1].listItems["+(countList)+"].id"]=$(this).attr("id");
                countList++;
            }
        });
        
        var countCover = 0;
        var countList = 0;
        dataList["recommendList[2].column"] = "around";
        $(container).find(".local-box").find(".cover-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[2].coverItems["+(countCover)+"].id"]=$(this).attr("id");
                countCover++;
            }
        });

        $(container).find(".local-box").find(".menu-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
                dataList["recommendList[2].listItems["+(countList)+"].id"]=$(this).attr("id");
                countList++;
            }
        });
        
        //console.log(dataList);
        return dataList;
    }

    function setDataList(){
    	setObjChild($(".out-box"), 0);
    	setObjChild($(".in-box"), 1);
    	setObjChild($(".local-box"), 2);
    }
    
    function setObjChild(obj, index){
        var recommendInfo = $("#recommendInfo");
        var countCover=0;
        $(".hiddenInfo"+index).each(function(){
        	$(this).remove();
        });
        obj.find(".cover-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
            	recommendInfo.append('<input type="hidden" class="hiddenInfo'+index+'" name="recommendList['+(index)+'].coverItems['+(countCover)+'].id" value="'+$(this).attr("id")+'" />');
                countCover++;
            }
        });
        var countList=0;
        obj.find(".menu-pro-name").each(function(i){
        	$(this).blur();
            if($(this).val()!=="" && $(this).attr("id") !== ""){
            	recommendInfo.append('<input type="hidden" class="hiddenInfo'+index+'" name="recommendList['+(index)+'].listItems['+(countList)+'].id" value="'+$(this).attr("id")+'" />');
                countList++;
            }
        });
    }

    $(".save").click(function(){
        var type=$(this).attr("type");
        setDataList();
        $("#recommendForm").submit();
        
//        var sendData=getDataList(type,".table-zone");
//
//        $.ajax({
//            url:"/recommend.json?_method=POST&v="+Date.parse(new Date()),
//            type:"POST",
//            dataType:"json",
//            data: sendData,
//            success:function(callbackData){
//                showmsg(null,callbackData);
//            },
//            error:function(){
//            	
//            }
//        });
    })

    var url;
    $('.f5').click(function(){
    	var type = $(this).attr("type");
    	var countCover = 0;
        var countList = 0;
        var dataList = {};
        dataList["column"] = type;
        var parentObj = $(".local-box");
        if(type=="domestic"){
        	parentObj = $(".in-box");
        }
        if(type=="abroad"){
        	parentObj = $(".out-box");
        }
        parentObj.find(".cover-pro-name").each(function(i){
            if($(this).val()!==""){
                dataList["coverItems["+(countCover)+"].id"]=$(this).attr("id");
                countCover++;
            }
        });

        parentObj.find(".menu-pro-name").each(function(i){
            if($(this).val()!==""){
                dataList["listItems["+(countList)+"].id"]=$(this).attr("id");
                countList++;
            }
        });
        url = "http://" + $('input[name="shopDomain"]').val() + "/"+dataList['column']+"?_=" + Math.random();
		$.each(dataList,function(k,v){
			if(k!='column'){
				url += "&"+ k + "=" + encodeURI(v);
			}
		});
		$('#previewFrame').attr('src', url);
    });
    //$('#previewFrame').attr('src', url);
    $('.f5').click();
    $(".close-notice-bt").click(function(){
    	$(this).parent().hide();
    	$.cookie('RECOMMEND_MESSAG_TIMES', 5, {path:'/'});
    });
    
    $(".menu-list-box").each(function(){
    	var defLength = $(this).find("ul li").length;
    	if(defLength < 4){
    		for(var i = defLength; i < 3; i++){
    			$(this).find(".add-one").click();
    		}
    	}
    });
    
})