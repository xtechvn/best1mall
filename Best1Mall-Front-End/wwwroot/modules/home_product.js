function formatCurrencyVND(number) {
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
    const parentGroupId = window.AppConfig?.parentGroupId ?? 0;
    const childrenId = window.AppConfig?.childrenId ?? null;
    // Kiểm tra nếu đang có children_id trong URL và loại bỏ nó khi reload
    if (childrenId) {
        history.replaceState(null, null, "/san-pham?group_id=" + parentGroupId); // Thay đổi URL và bỏ children_id khi reload
    }

    $('.menu_group_product').removeClass('text-purple-500 font-medium active').addClass('text-gray-700');

    // Nếu có children_id trong URL, thêm lại trạng thái active cho nhóm con tương ứng
   

    $('body').on('click', '.menu_group_product', function (e) {
        debugger
        e.preventDefault();

        const $this = $(this);
        const categoryId = parseInt($this.data('id'));
        if (isNaN(categoryId)) return;

        // Nếu click vào thẻ đang active thì toggle bỏ active
        if ($this.hasClass('active')) {
            // Bỏ active
            $this.removeClass('text-purple-500 font-medium active')
                .addClass('text-gray-700');
                
            // Đổi url về group_id và children_id
            history.pushState(null, null, "/san-pham?group_id=" + parentGroupId );

            // Load lại sản phẩm cho idToSet
            home_product.loadListProduct(parentGroupId, 1, 12, "/Views/Shared/Components/Product/ProductListViewComponent.cshtml");

            //// Cập nhật previousCategoryId nếu cần
            //if (idToSet !== categoryId) {
            //    previousCategoryId = idToSet;
            //} else {
            //    previousCategoryId = null;
            //}

            return; // thoát hàm
        }

        // Nếu click vào thẻ mới, xóa active thẻ khác
        $('.menu_group_product.active')
            .removeClass('text-purple-500 font-medium active')
            .addClass('text-gray-700');

        // Thêm active class vào thẻ mới
        $this.removeClass('text-gray-700')
            .addClass('text-purple-500 font-medium active');
        // Lưu lại childrenId nếu đang chọn một nhóm con
        const newChildrenId = categoryId !== parentGroupId ? categoryId : null;
        // Lưu lại previousCategoryId là categoryId trước khi đổi
        previousCategoryId = $('.menu_group_product.active').data('id') || null;

        // Reset filter giá, rating nếu có
        $('#priceFrom, #priceTo').val('');
        $('.rating-filter').removeClass('text-yellow-500 font-bold');

        history.pushState(null, null, "/san-pham?group_id=" + parentGroupId + (newChildrenId ? "&children_id=" + newChildrenId : ""));

        // Load sản phẩm
        home_product.loadListProduct(categoryId, 1, 12, "/Views/Shared/Components/Product/ProductListViewComponent.cshtml");
    });

   
    
    // Lắng nghe sự kiện khi thay đổi giá
    let debounceTimer;
    $('#priceFrom, #priceTo').on('input', function () {
        debugger
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            
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
            // 👉 Nếu đang ở trang /san-pham thì load dữ liệu sản phẩm ngay lập tức
            if (window.location.pathname.toLowerCase().includes("/san-pham")) {
                debugger
                const group_id = parseInt($('#group_id_from_url').val()) || 0;

                const skip = 1;
                const take = 12;
                const view_name = "/Views/Shared/Components/Product/ProductListViewComponent.cshtml";

                home_product.skip = skip;
                home_product.take = take;

                // Gọi loadListProduct để:
                // - Render sản phẩm
                // - Xử lý việc show/hide nút "Xem thêm"
                home_product.loadListProduct(group_id, skip, take, view_name);
            }
           
           
            // Lấy group_id đầu tiên từ danh sách danh mục
            const firstCategoryId = parseInt($('.cat-tag2').first().data('id')) || 0;

            // Thêm active cho tab đầu tiên
            $('.cat-tag2').removeClass('bg-blue-500 text-white border-blue-500'); // Xóa active cho tất cả tab
            $('.cat-tag2[data-id="' + firstCategoryId + '"]').addClass('bg-blue-500 text-white border-blue-500'); // Thêm active cho tab đầu tiên


            if ($('.list-product-sale .swiper-wrapper').length > 0) {
                global_service.LoadGroupProduct($('.list-category'), GLOBAL_CONSTANTS.GroupProduct.GROUP_PRODUCT, GLOBAL_CONSTANTS.GridSize)
                //--Product Sale Slide:
                global_service.LoadHomeFlashSaleGrid($('.list-product-sale .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
                // Bear Collection
                global_service.LoadHomeLabelGrid(
                    $('#bear-collection .swiper-wrapper'),
                    GLOBAL_CONSTANTS.GroupProduct.BEAR_COLLECTION,
                    GLOBAL_CONSTANTS.GridSize,
                    '#banner-bear-collection'
                );

                // Discount
                global_service.LoadHomeLabelGrid(
                    $('#product-discount .swiper-wrapper'),
                    GLOBAL_CONSTANTS.GroupProduct.Discount,
                    GLOBAL_CONSTANTS.GridSize,
                    '#banner-product-discount'
                );

                // Intelligence
                global_service.LoadHomeLabelGrid(
                    $('#intelligence-collection .swiper-wrapper'),
                    GLOBAL_CONSTANTS.GroupProduct.INTELLECTUAL_DEVELOPMENT,
                    GLOBAL_CONSTANTS.GridSize,
                    '#banner-intelligence-collection'
                );

                // Load sản phẩm theo group_id đầu tiên
                home_product.loadProductByGroup(firstCategoryId);

                //global_service.LoadLabelList();






            }
            $('.xemthem').hide()
        },
        loadProductByGroup: function (group_id) {
           
          
            // Chỉ gán động cho #List-product, các phần khác vẫn gán cứng
            global_service.LoadHomeProductGrid($('.list-product .swiper-wrapper'), group_id, GLOBAL_CONSTANTS.GridSize, false);

        },
        skip: 1, // Biến để theo dõi trang hiện tại
        take: 12, // Số lượng sản phẩm mỗi trang
        loadListProduct: function (group_id, skip, take, view_name, priceFrom = 0, priceTo = 0, ratingFrom = 0) {
           
            debugger
            $.ajax({
                url: '/product/loadProductTopComponent', // URL tới action loadProductTopComponent
                type: 'POST',
                dataType: 'json',
                data: {
                    group_id: group_id,  // Truyền group_id
                    page_index: skip,            // Trang bắt đầu
                    page_size: take,
                    view_name: view_name,
                    price_from: priceFrom,  // Truyền giá trị priceFrom
                    price_to: priceTo,       // Truyền giá trị priceTo
                    rating: ratingFrom // Truyền ratingFrom
                },
                success: function (res) {
                    debugger
                    const html = res.html || '';
                    const total = res.count || 0;
                    const isEmptyResponse = !html || html.trim() === "";
                    // Nếu bạn muốn thêm sản phẩm mới vào danh sách hiện tại mà không thay thế toàn bộ
                    if (skip === 1) {
                        $('.component-product-list').html(html);

                        if (isEmptyResponse) {
                            $('#load-more-btn').hide();
                            $('#no-products-message').show();
                        } else {
                            $('#load-more-btn').show();
                            $('#no-products-message').hide();
                        }
                    } else {
                        $('.component-product-list').append(html);

                        if (isEmptyResponse) {
                            $('#load-more-btn').hide();
                        }
                    }
                    // ✅ Miễn là chưa load hết thì vẫn hiện nút "Xem thêm"
                    const totalLoaded = skip * take;
                    const hasMore = totalLoaded < total;

                    if (hasMore) {
                        $('#load-more-btn').show();
                    } else {
                        $('#load-more-btn').hide();
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
           debugger
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