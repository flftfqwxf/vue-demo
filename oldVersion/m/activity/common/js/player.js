// 添加音乐
$(function(){
    var audio = new Audio,
        el = $('#musicBtn'),
        attr = {loop: true, preload: "auto", src: el.data('src')};

    for (var i in attr){
        attr.hasOwnProperty(i) && i in audio && (audio[i] = attr[i]);
    }

    _play();

    $(document).one('touchstart', function(e){          
        if(audio.paused){
            _play();
        }
    });

    el.on('click', function(){
        if(audio.paused){
            _play(true);
        }else{
            audio.pause();
            el.removeClass('on')
        }
    });

    function _play(isClick){
        audio.play();
        el.addClass('on');
    }
});

