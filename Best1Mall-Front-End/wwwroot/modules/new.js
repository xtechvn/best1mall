$(document).ready(function () {
    // ✅ Mặc định load danh sách "Tất cả" (category_id = 0)
    let category_id2 = parseInt($(".category_id").data("categoryid")) || 22;

    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const page = url_params.get('page') == null ? 1 : url_params.get('page');

    // ✅ Gọi load bài viết mặc định
    _new.loadNewsSection({
        targetSelector: '.list-news-home',
        view_name: '~/Views/Shared/Components/News/Home.cshtml',
        category_id: category_id2,
        page: page
    });

    _new.loadNewsSection({
        targetSelector: '.list-home',
        view_name: '~/Views/Shared/Components/News/HealthCorner.cshtml',
        category_id: category_id2,
        page: page
    });

    // ✅ Gắn sự kiện click cho từng danh mục
    $('body').on('click', '.cat-tag', function (e) {
        e.preventDefault();

        const $this = $(this);
        const categoryId = parseInt($this.data('id'));
        if (isNaN(categoryId)) return;

        // Xóa active tab "Tất cả" khi chọn danh mục khác
        if (categoryId !== 0) {
            $('.cat-tag[data-id="0"]').removeClass('bg-blue-500 text-white border-blue-500');
        }

        // Thêm active cho tab được chọn
        $('.cat-tag').removeClass('bg-blue-500 text-white border-blue-500');  // Xóa active tất cả
        $this.addClass('bg-blue-500 text-white border-blue-500');  // Thêm active cho thẻ <a> đang click

        // Load bài viết tương ứng
        _new.loadNewsSection({
            targetSelector: '.list-news-home',
            view_name: '~/Views/Shared/Components/News/Home.cshtml',
            category_id: categoryId,
            page: 1
        });

        _new.loadNewsSection({
            targetSelector: '.list-home',
            view_name: '~/Views/Shared/Components/News/HealthCorner.cshtml',
            category_id: categoryId,
            page: 1
        });
    });

    // ✅ Các phần khởi tạo khác
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



    loadNewsSection: function ({ targetSelector, category_id, page = 1, view_name }) {
        
        const $container = $(targetSelector);
        const loading = `<div class="py-6 text-center text-blue-500">Đang tải dữ liệu...</div>`;
        $container.html(loading);

        $.ajax({
            type: 'POST',
            dataType: 'html',
            url: '/news/home/get-article-list.json',
            data: {
                category_id: category_id,
                page: page,
                view_name: view_name
            },
            success: function (html) {
                
                $container.html(html);
            },
            error: function (xhr, status, error) {
                $container.html(`<div class="text-red-500 text-center">Tải thất bại: ${error}</div>`);
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
