$(document).ready(function () {
    order_index.Initialization()
})
var order_index = {
    Data: {
        Index: 1,
        Size: 10
    },
    Initialization: function () {
        order_index.Search()
        order_index.DynamicBind()
    },
    DynamicBind: function () {
        $("body").on('click', "#order-keyword-clear", function () {
            var element=$(this)
            element.hide()
            $('#order-keyword').val(null).trigger('change')
        });
        $("body").on('keyup', "#order-keyword", function () {
            var element = $(this)
            if (element.val() != null && element.val() != undefined && element.val().trim() != '') {
                $('#order-keyword-clear').show()
            }
        });
        $("body").on('click', ".order-tab", function () {
            var element = $(this)
            $('.order-tab li').removeClass('active')
            element.closest('li').addClass('active')
            order_index.Search()

        });
        $("body").on("click", ".buy-now", function () {
            debugger
            const productId = $(this).data("product-id");
            const quantity = $(this).data("quanity") || 1;

            const usr = global_service.CheckLogin();
            if (!usr) {
                $(".mainheader .client-login").click();
                return;
            }

            const request = {
                product_id: productId,
                quanity: quantity,
                token: usr.token
            };

            $.when(global_service.POST(API_URL.AddToCart, request)).done(function (result) {
                if (result.is_success && result.data) {
                    sessionStorage.setItem(STORAGE_NAME.BuyNowItem, JSON.stringify(request));
                    window.location.href = "/cart";
                } else {
                    alert("Không thể thêm sản phẩm vào giỏ hàng.");
                }
            });
        });
        $("body").on("click", ".order-index-repay", function () {
            debugger
            const orderId = $(this).data("order-id");

            const usr = global_service.CheckLogin();
            if (!usr) {
                $(".mainheader .client-login").click();
                return;
            }

            // ✅ Chuyển hướng luôn sang trang thanh toán lại
            window.location.href = '/order/payment/' + orderId;
        });


    },
    Search: function () {
        var usr = global_service.CheckLogin(); // kiểm tra đăng nhập
        if (usr == null || usr == undefined || usr.token == null || usr.token == undefined) {
            $('#order-history').html('')
            $('#order-history').removeClass('placeholder')
            return
        }
        var order_no = $('#order-keyword').val()
        var request = {
            token: usr.token,
            order_no: (order_no == null || order_no == undefined) ? '' : order_no,
            status: $('.order-tab .active a').attr('data-id'),
            page_index: order_index.Data.Index,
            page_size: order_index.Data.Size
        };
        $.when(
            global_service.POST(API_URL.OrderSearch, request)
        ).done(function (result) {
            if (result != null && result != undefined) {
                $('#order-history').html(result)
            }
            else {
                $('#order-history').html('')
            }
            $('#order-history').removeClass('placeholder')
        })
    }

}