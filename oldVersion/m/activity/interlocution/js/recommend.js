$(function(){
    // 抽奖
    var levelName = ['一等奖', '二等奖', '三等奖', '四等奖'];

    $('#drawBtn').on('click', function(){
        $('#mask').show();
        $.get(config.luckUrl, {activityId: config.activityId}, function(res){
            if(res.award){
                res.award.levelName = levelName[res.award.level - 1];
            }

            var htmls = template('resultPop', res);
            $('#mask').hide();
            $('body').append(htmls);
        });
    });

    // 领取奖品
    var loading;
    $(document).on('click', '.receive-btn', function(){
        var tel = $('#receiveTel').val();

        if(loading) return;
        if(tel){
            if(!/^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(tel)){
                alert('请输入正确的11位手机号码');
                return;
            }
        }else{
            alert('请填写手机号码');
            return;
        }

        loading = true;
        $.get(config.receiveUrl, {
            activityId: config.activityId,
            userPhone: tel
        }, function(res){
            var htmls = template('resultPop', res);
            $('.result-pop').remove();
            $('body').append(htmls);
            loading = false;
        });
    });

    $('.share_close_but, .shareTipsBg').click(function(){
        $('#drawBtn').hide();
    });
});