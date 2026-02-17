$(document).ready(function() {
    _newdetail.Initialization()
    $('body').on('click', '.cat-tag-detail', function (e) {
        
        e.preventDefault();
        const categoryId = parseInt($(this).data('id'));
        if (isNaN(categoryId)) return;

        // ✅ Redirect sang trang /tin-tuc?cateId=xxx
        window.location.href = `/tin-tuc?category_id=${categoryId}`;
    });


})
let category_id = 10;
var _newdetail = {
    Initialization: function () {
        _newdetail.getNewsMostViewedArticle(1, 10, 1);
        //_newdetail.NewsCategory();
        var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
        var id = parseFloat(categoryIdSession);
        $('.cat-tag').removeClass('active');
        $('.tag_' + id).addClass('active');
        // Gắn event tìm kiếm enter
        $("#text_input").on('keyup', function (e) {
            
            if (e.key === 'Enter' || e.keyCode === 13) {
                _newdetail.GetFindArticleByTitle();
            }
        });

        // Gắn nút search click
        $('.btn-search').on('click', function () {
            
            _newdetail.GetFindArticleByTitle();
        });
    

    },
    getNewsMostViewedArticle: function (page, size, category_id) {
        var requestObj = {
            skip: page,
            take: size,
            category_id: category_id
        };
        $.ajax({
            url: "/News/NewsMostViewedArticle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {

                $("#Most_Viewed_Article").html(data);
            },

        });
    },
    //NewsCategory: function () {
    //    var requestObj = {

    //    };
    //    $.ajax({
    //        url: "/News/NewsCategory",
    //        type: 'post',
    //        data: { requestObj: requestObj },
    //        success: function (data) {
    //            $("#news-category").html(data);
    //        },

    //    });
    //},
    GetFindArticleByTitle: function () {
        
        const keyword = $('#text_input').val().trim();
        if (!keyword) {
            // Nếu trống thì về lại trang Home
            window.location.href = '/tin-tuc';
            return;
        }
        $('.details-news').hide();  // Ẩn content bài viết chính
        $('#search-results').show(); // Hiện vùng kết quả tìm kiếm

        var requestObj = {
            title: keyword,
            parent_cate_faq_id: 22 // bạn set category id đúng ở detail
        };
        $.ajax({
            url: "/News/GetFindArticleByTitle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
                
                $("#search-results").html(data);
            },
        });
    },
    //getNewsByTag: function (id, url) {
    //    sessionStorage.setItem('NewsCategoryId', Number(id));
    //    window.location.href = "/" + url;
    //},
}