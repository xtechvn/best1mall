﻿function formatCurrencyVND(number) {
    return number.toLocaleString('vi-VN');
}

function getRawNumber(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
}


$(document).ready(function () {
    // ✅ Mặc định load danh sách "Tất cả" (group_id = 0)

    // Gắn sự kiện click cho từng danh mục
    $('body').on('click', '.cat-tag2', function (e) {
        debugger
       
        e.preventDefault();

        const $this = $(this);
        const categoryId = parseInt($this.data('id'));
        if (isNaN(categoryId)) return;


        if (categoryId !== 0) {
            $('.cat-tag2[data-id="0"]').removeClass('bg-blue-500 text-white border-blue-500');
        }

        // Thêm active cho tab được chọn
        $('.cat-tag2').removeClass('bg-blue-500 text-white border-blue-500');  // Xóa active tất cả
        $this.addClass('bg-blue-500 text-white border-blue-500');  // Thêm active cho thẻ <a> đang click

        // Load dữ liệu sản phẩm tương ứng theo group_id
        home_product.loadProductByGroup(categoryId);
    });

    $('body').on('click', '.menu_group_product', function (e) {
       
        e.preventDefault();

        const $this = $(this);
        const categoryId = parseInt($this.data('id'));
        var skip = 1; // Trang bắt đầu
        var take = 12; // Số lượng sản phẩm mỗi trang (tùy chỉnh theo yêu cầu)
        var view_name = "/Views/Shared/Components/Product/ProductListViewComponent.cshtml";
        if (isNaN(categoryId)) return;
        // ✅ Reset giá và rating filter
        $('#priceFrom, #priceTo').val('');
        $('.rating-filter').removeClass('text-yellow-500 font-bold');
        history.pushState(null, null, "/san-pham?group_id=" + categoryId); // Thay đổi đường dẫn mà không tải lại trang
        // Reset skip
        home_product.skip = skip;
        // Load dữ liệu sản phẩm tương ứng theo group_id
        home_product.loadListProduct(categoryId, skip, take, view_name);
        // Thêm active class cho tab đang được chọn
        $('.menu_group_product').removeClass('active'); // Xóa active từ tất cả các tab
        $this.addClass('active'); // Thêm active vào tab đang được nhấn


    });
   
    
    // Lắng nghe sự kiện khi thay đổi giá
    let debounceTimer;
    $('#priceFrom, #priceTo').on('input', function () {
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            debugger
            // Lấy raw number từ chuỗi
            const rawFrom = getRawNumber($('#priceFrom').val());
            const rawTo = getRawNumber($('#priceTo').val());
            // Format lại hiển thị
            $('#priceFrom').val(rawFrom > 0 ? formatCurrencyVND(rawFrom) : '');
            $('#priceTo').val(rawTo > 0 ? formatCurrencyVND(rawTo) : '');
            var group_id;

            // Kiểm tra xem đã chọn tab hay chưa
            if ($('.menu_group_product.active').length > 0) {
                // Nếu đã chọn tab, lấy group_id từ tab hiện tại
                group_id = parseInt($('.menu_group_product.active').data('id'));
            } else {
                // Nếu chưa chọn tab, lấy group_id từ ViewBag hoặc URL
                group_id = parseInt($('#group_id_from_url').val()) || parseInt('@ViewBag.group_id') || 0; // Lấy group_id từ URL hoặc ViewBag

                if (isNaN(group_id)) {
                    console.log("Invalid group_id");
                    return;
                }
            }

            // Gọi lại hàm load sản phẩm với giá lọc
            home_product.loadListProduct(group_id, 1, 12, "/Views/Shared/Components/Product/ProductListViewComponent.cshtml", rawFrom, rawTo);
            }, 500); // 300ms delay

    });
    $('body').on('click', '.rating-filter', function (e) {
        debugger
        e.preventDefault();

        const rating = parseFloat($(this).data('rating')) || 0;

        // Đặt active class cho filter được chọn
        $('.rating-filter').removeClass('text-yellow-500 font-bold');
        $(this).addClass('text-yellow-500 font-bold');

        const priceFrom = getRawNumber($('#priceFrom').val());
        const priceTo = getRawNumber($('#priceTo').val());

        var group_id;

        // Kiểm tra xem đã chọn tab hay chưa
        if ($('.menu_group_product.active').length > 0) {
            // Nếu đã chọn tab, lấy group_id từ tab hiện tại
            group_id = parseInt($('.menu_group_product.active').data('id'));
        } else {
            // Nếu chưa chọn tab, lấy group_id từ ViewBag hoặc URL
            group_id = parseInt($('#group_id_from_url').val()) || parseInt('@ViewBag.group_id') || 0; // Lấy group_id từ URL hoặc ViewBag

            if (isNaN(group_id)) {
                console.log("Invalid group_id");
                return;
            }
        }

        home_product.loadListProduct(group_id, 1, 12, "/Views/Shared/Components/Product/ProductListViewComponent.cshtml", priceFrom, priceTo, rating);
    });


        home_product.Initialization()
    })

    var home_product = {
        Initialization: function () {
           
            // Lấy group_id đầu tiên từ danh sách danh mục
            const firstCategoryId = parseInt($('.cat-tag2').first().data('id')) || 0;

            // Thêm active cho tab đầu tiên
            $('.cat-tag2').removeClass('bg-blue-500 text-white border-blue-500'); // Xóa active cho tất cả tab
            $('.cat-tag2[data-id="' + firstCategoryId + '"]').addClass('bg-blue-500 text-white border-blue-500'); // Thêm active cho tab đầu tiên


            if ($('.list-product-sale .swiper-wrapper').length > 0) {
                global_service.LoadGroupProduct($('.list-category'), GLOBAL_CONSTANTS.GroupProduct.GROUP_PRODUCT, GLOBAL_CONSTANTS.GridSize)
                //--Product Sale Slide:
                global_service.LoadHomeProductGrid($('.list-product-sale .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
                //-- Discount Grid:
                global_service.LoadHomeProductGrid($('#product-discount .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.Discount, GLOBAL_CONSTANTS.GridSize)
                //-- Bear Grid:
                global_service.LoadHomeProductGrid($('#bear-collection .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.BEAR_COLLECTION, GLOBAL_CONSTANTS.GridSize)
                //-- Intelligence Grid:
                global_service.LoadHomeProductGrid($('#intelligence-collection .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.INTELLECTUAL_DEVELOPMENT, GLOBAL_CONSTANTS.GridSize)
                // Load sản phẩm theo group_id đầu tiên
                home_product.loadProductByGroup(firstCategoryId);

                //global_service.LoadLabelList();






            }
            $('.xemthem').hide()
        },
        loadProductByGroup: function (group_id) {
           ;

            // Chỉ gán động cho #List-product, các phần khác vẫn gán cứng
            global_service.LoadHomeProductGrid($('.list-product .swiper-wrapper'), group_id, GLOBAL_CONSTANTS.GridSize);

        },
        skip: 1, // Biến để theo dõi trang hiện tại
        take: 12, // Số lượng sản phẩm mỗi trang
        loadListProduct: function (group_id, skip, take, view_name, priceFrom = 0, priceTo = 0, ratingFrom = 0) {
           
            debugger
            $.ajax({
                url: '/product/loadProductTopComponent', // URL tới action loadProductTopComponent
                type: 'POST',
                dataType: 'html',
                data: {
                    group_id: group_id,  // Truyền group_id
                    page_index: skip,            // Trang bắt đầu
                    page_size: take,
                    view_name: view_name,
                    price_from: priceFrom,  // Truyền giá trị priceFrom
                    price_to: priceTo,       // Truyền giá trị priceTo
                    rating: ratingFrom // Truyền ratingFrom
                },
                success: function (response) {
                    debugger
                    const isEmptyResponse = !response || response.trim() === "";
                    // Nếu bạn muốn thêm sản phẩm mới vào danh sách hiện tại mà không thay thế toàn bộ
                    if (skip === 1) {
                        // Nếu là lần đầu tiên tải, thay thế toàn bộ sản phẩm
                        $('.component-product-list').html(response);
                        // Ẩn hoặc hiện nút Xem thêm
                        if (isEmptyResponse) {
                            $('#load-more-btn').hide();
                            $('#no-products-message').show(); // Hiện thông báo
                        } else {
                            $('#load-more-btn').show();
                            $('#no-products-message').hide(); // Ẩn thông báo nếu có sản phẩm
                        }
                    } else {
                        // Nếu là lần sau (khi nhấn "Xem thêm"), thêm sản phẩm mới vào cuối danh sách
                        $('.component-product-list').append(response);
                        // Nếu không có gì mới => ẩn nút
                        if (isEmptyResponse) {
                            $('#load-more-btn').hide();
                        }
                    }
                    // Cập nhật lại giá trị skip (tăng lên mỗi lần load thêm)
                    home_product.skip = skip; // reset lại skip về 1 sau khi load sản phẩm mới
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error);  // Log lỗi nếu có
                }
            })
        },
        // Hàm gọi Ajax để load thêm sản phẩm
        loadMore: function () {
           
            var group_id;

            // Kiểm tra xem đã chọn tab hay chưa
            if ($('.menu_group_product.active').length > 0) {
                // Nếu đã chọn tab, lấy group_id từ tab hiện tại
                group_id = parseInt($('.menu_group_product.active').data('id'));
            } else {
                // Nếu chưa chọn tab, lấy group_id từ ViewBag hoặc URL
                group_id = parseInt($('#group_id_from_url').val()) || parseInt('@ViewBag.group_id') || 0; // Lấy group_id từ URL hoặc ViewBag

                if (isNaN(group_id)) {
                    console.log("Invalid group_id");
                    return;
                }
            }

            var skip = home_product.skip + 1; // Tăng skip để tải sản phẩm tiếp theo
            var take = home_product.take;
            var view_name = "/Views/Shared/Components/Product/ProductListViewComponent.cshtml";

            var priceFrom = parseFloat($('#priceFrom').val()) || 0; // Lấy giá trị từ ô nhập liệu
            var priceTo = parseFloat($('#priceTo').val()) || 0;   // Lấy giá trị từ ô nhập liệu
            var ratingFrom = 0; // Mặc định là không có rating filter

            // Gọi lại function loadListProduct để tải thêm sản phẩm với lọc theo giá
            home_product.loadListProduct(group_id, skip, take, view_name, priceFrom, priceTo, ratingFrom);
        }



    }