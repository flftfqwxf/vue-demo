$(function(){
    // 测试问答
    var winWidth = $(window).width();
    var wrapper = $('#pageWrap section');
    var answers = ['A', 'B', 'C', 'D'];
    var polling = 1000;
    var index = 0;
    var timer;
    var moveFn = function(){
        index ++;
        if(index < 4){
            wrapper.css('-webkit-transform', 'translateX(-'+ (index * winWidth) +'px)');    
        }else{
            $('#subForm').submit();
        }
    }

    $('.page').width(winWidth);
    wrapper.width(4 * winWidth);

    $('.interlocutions p').click(function(){
        var $parents = $(this).parents('.page');
        var pi = $parents.index();
        var ai = $(this).index();

        if(timer) clearTimeout(timer);

        $('#subForm input').eq(pi - 1).val(answers[ai]);
        $(this).addClass('active').siblings().removeClass('active');

        timer = setTimeout(function(){
            moveFn();
        }, polling);
    });

    $('#playBtn').on('click', function(){
        $('.fixed-bar').hide();
        moveFn();
    });

    
    $('.interlocutions p').on('click', function(){
        var pi = $(this).parents('.page').index();
        var ai = $(this).index();

        $('#subForm input').eq(pi - 1).val(answers[ai]);
    });
});