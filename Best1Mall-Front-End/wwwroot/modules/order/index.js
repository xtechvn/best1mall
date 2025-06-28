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
        order_index.OrderCount()
        order_index.DynamicBind()
    },
    DynamicBind: function () {
        $("body").on('click', "#order-keyword-clear", function () {
            var element = $(this)
            element.hide()
            $('#order-keyword').val(null).trigger('change')
        });
        $("body").on('keyup', "#order-keyword", function (event) {
            event.preventDefault()
            var element = $(this);
            if (element.val() != null && element.val() != undefined && element.val().trim() != '') {
                $('#order-keyword-clear').show();
            } else {
                $('#order-keyword-clear').hide();
            }

            if (event.keyCode === 13) {
                order_index.Search();
            }
        });
        $("body").on('click', "#order-keyword-search", function () {
            order_index.Search()

        });
        $("body").on('click', "#order-keyword-clear", function () {
            $('#order-keyword').val('').trigger('change')
            $('#order-keyword-clear').hide()
            order_index.Search()
        });
        $("body").on('keyup', "#order-keyword", function () {
            var element = $(this)
            if (element.val() != undefined || element.val() != null && element.val().trim() != '') {
                $('#order-keyword-clear').show()
            } else {
                $('#order-keyword-clear').hide()
            }
        });
        $("body").on('click', ".order-tab", function () {
            var element = $(this)
            $('.order-tab').closest('li').removeClass('active')
            element.closest('li').addClass('active')
            $('#order-keyword').val('').trigger('change')
            $('#order-keyword-clear').hide()
            order_index.Search()

        });
        $("body").on("click", ".rebuy-order-btn", function () {
            const rebuyRaw = $(this).attr("data-rebuy");
            let rebuyList = [];

            try {
                rebuyList = JSON.parse(rebuyRaw);
            } catch (e) {
                alert("Dữ liệu đơn hàng không hợp lệ.");
                return;
            }

            const usr = global_service.CheckLogin();
            if (!usr) {
                $(".mainheader .client-login").click();
                return;
            }

            const addPromises = rebuyList.map(item => {
                return global_service.POST(API_URL.AddToCart, {
                    product_id: item.product_id,
                    quanity: 1, // giới hạn max
                    token: usr.token
                });
            });

            Promise.all(addPromises).then(results => {
                const allOk = results.every(res => res.is_success);
                if (allOk) {
                    window.location.href = "/cart";
                } else {
                    alert("Có sản phẩm không thể thêm vào giỏ hàng.");
                }
            });
        });

        $("body").on("click", ".order-index-repay", function () {

            const orderId = $(this).data("order-id");

            const usr = global_service.CheckLogin();
            if (!usr) {
                $(".mainheader .client-login").click();
                return;
            }

            // ✅ Chuyển hướng luôn sang trang thanh toán lại
            window.location.href = '/order/payment/' + orderId;
        });

        $(document).on('click', '.order-index-refund', function () {

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
            status: $('.tab-status .list-tab .active a').attr('data-id'),
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
    },
    OrderCount: function () {
        var usr = global_service.CheckLogin(); // kiểm tra đăng nhập
        if (usr == null || usr == undefined || usr.token == null || usr.token == undefined) {
         
            return
        }
        var request = {
            token: usr.token
        };
        $.when(
            global_service.POST(API_URL.OrderCount, request)
        ).done(function (result) {
            if (result != null && result != undefined) {
                $('.order-tab-all .tab-count').html('(' + (result.all != undefined && result.all > 0 ? result.all : '0') +')');
                $('.order-tab-waiting .tab-count').html('(' + (result.waiting_payment != undefined && result.waiting_payment > 0 ? result.waiting_payment : '0') + ')');
                $('.order-tab-delvering .tab-count').html('(' + (result.on_delivery != undefined && result.on_delivery > 0 ? result.on_delivery : '0') + ')');
                $('.order-tab-finish .tab-count').html('(' + (result.success != undefined && result.success > 0 ? result.success : '0') + ')');
                $('.order-tab-cancel .tab-count').html('(' + (result.cancel != undefined && result.cancel > 0 ? result.cancel : '0') + ')');
            }
           
        })
    }

}