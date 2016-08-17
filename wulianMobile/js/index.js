var INDEX_PAGE = {
    init: function () {
        this.topSort();
        this._initSwiper()
    },
    topSort: function () {
        $('#header_sort').on('click', function () {
            // console.log('444')
            var sort_wrap = $('.sort_wrap');
            if (sort_wrap) {
                sort_wrap.toggle()
            }
            // $('.sort_wrap').show()
        });
        $('.sort_wrap>li').on('click', function () {
            $('.sort_wrap >li').removeClass('active')
            $(this).addClass('active');
            location.href = $(this).attr('data-url')
        })
    },
    _initSwiper: function () {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        });
    }
}