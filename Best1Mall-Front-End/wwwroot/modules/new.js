$(document).ready(function () {
    // 👇 Gọi load tin liền tay ngay khi trang vừa load
    let category_id2 = parseInt($(".category_id").data("categoryid"));
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const page = url_params.get('page') == null ? 1 : url_params.get('page');

    // Gọi ngay để load bài viết liền, khỏi đợi Initialization
    _new.bin_news_home(category_id2, page);

    // Sau đó mới tới khởi tạo các thành phần còn lại
    _new.Initialization();
    _home_product.Initialization();
    $("#text_input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            _new.GetFindArticleByTitle();
        }
    });
});

let category_id = 22;
let category_id_menu = 22;

var _new = {
    Initialization: function () {
        
        _new.getNewsMostViewedArticle(1, 3, category_id_menu);
    },

    bin_news_home: function (category_id, page) {
        $.ajax({
            dataType: 'html',
            type: 'POST',
            url: '/news/home/get-article-list.json',
            data: { category_id: category_id, page: page, view_name: "~/Views/Shared/Components/News/Home.cshtml" },
            success: function (data) {
                $('.list-news-home').html(data);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
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
  
    GetFindArticleByTitle: function () {
        debugger
        $('.list-news-top').hide();
        $('#section-article-paginate').hide();
        $('.pagination').hide();

        var requestObj = {
            title: $('#text_input').val(),
            parent_cate_faq_id: category_id
        };
        $.ajax({
            url: "/News/GetFindArticleByTitle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
                $('#section-article-paginate').show();
                $('.pagination').show();
                $("#section-article-paginate").html(data);

            },

        });
    },
};

var _home_product = {
    Initialization: function () {
        _home_product.LoadHomeProductSlide($('.list-product-sale .swiper_wrapper'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
    },

    LoadHomeProductSlide: function (element, group_id, size) {
        var request = {
            "group_id": group_id,
            "page_index": 1,
            "page_size": size
        }
        $.when(
            global_service.POST(API_URL.ProductList, request)
        ).done(function (result) {
            element.addClass('placeholder')
            element.addClass('box-placeholder')
            var html = ''
            if (result.is_success) {
                $(result.data).each(function (index, item) {
                    html += HTML_CONSTANTS.Home.SlideProductItem
                        .replaceAll('{url}', '/product/detail/' + item.product_code)
                        .replaceAll('{avt}', item.image_thumb)
                        .replaceAll('{name}', item.product_name)
                        .replaceAll('{amount}', item.amount_vnd > 0 ? global_service.Comma(item.amount_vnd) + ' đ' : 'Giá liên hệ')
                        .replaceAll('{review_point}', (item.rating == null || item.rating <= 0) ? '5' : item.rating)
                        .replaceAll('{review_count}', (item.reviews_count == null || item.reviews_count <= 0) ? '(1)' : '(' + item.reviews_count + ')')
                        .replaceAll('{old_price_style}', (item.price_vnd == null || item.price_vnd <= 0) ? '' : '')
                        .replaceAll('{price}', (item.price_vnd == null || item.price_vnd <= 0) ? global_service.Comma(item.amount_vnd) + ' đ' : '')
                });
            }
            element.html(html)
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
        })
    }
};
