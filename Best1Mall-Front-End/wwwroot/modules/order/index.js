$(document).ready(function () {
    order_index.Initialization()
})
var order_index = {
    Data: {
        Index: 1,
        Size: 10
    },
    Initialization: function () {
        order_index.ResetPager();         // reset trước khi search
        order_index.Search()
        order_index.OrderCount()
        order_index.DynamicBind()
    },
    // --------- Helpers ----------
    GetActiveStatus: function () {
        // data-id trên tab: "-1" | "0" | "1,2" | ...
        return $('.tab-status .list-tab .active a').data('id') || '';
    },

    ResetPager: function () {
        order_index.Data.Index = 1;
        // nếu có nút xem thêm thì reset luôn
        var $btn = $('#btn-load-order');
        if ($btn.length) {
            $btn.attr('data-page', 1).hide().prop('disabled', false).text('Xem thêm'); // Ẩn ngay
        }
    },
    DynamicBind: function () {
        $("body").on('click', "#order-keyword-clear", function () {
            var element = $(this)
            element.hide()
            $('#order-keyword').val(null).trigger('change')
        });
        $(document).on('keydown', '#order-keyword', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Ngăn submit form / reload
                order_index.Search();
                return false;
            }
        });
        $("body").on('keyup', "#order-keyword", function (event) {
            event.preventDefault()
            var element = $(this);
            if (element.val() != null && element.val() != undefined && element.val().trim() != '') {
                $('#order-keyword-clear').show();
            } else {
                $('#order-keyword-clear').hide();
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
        // Đổi tab
        $('body').on('click', '.order-tab', function () {
            // set active tab
            $('.tab-status .list-tab li').removeClass('active');
            $(this).closest('li').addClass('active');

            // reset filter text & icon X
            $('#order-keyword').val('');
            $('#order-keyword-clear').hide();
            $('#order-history').addClass('placeholder').empty(); // cảm giác mượt hơn

            // reset page + load lại trang đầu
           
            order_index.ResetPager();
            order_index.Search();
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
                    const productIds = rebuyList.map(item => item.product_id);
                    sessionStorage.setItem(STORAGE_NAME.BuyNowItem, JSON.stringify({ product_ids: productIds }));
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

        $('body').on('click', '.order-index-refund', function () {
            var element = $(this)
            $('#refund-popup').attr('data-order-id', element.attr('data-order-id'))
            $('#refund-popup-orderno').html(element.attr('data-order-no').toUpperCase())
            $('#refund-popup').show()
        });
        $('body').on('click', '.order-index-received', function () {
            var element = $(this)
            $('#receiver-popup').attr('data-order-id', element.attr('data-order-id'))
            $('#receiver-popup-orderno').html(element.attr('data-order-no').toUpperCase())
            $('#receiver-popup').show()
        });
        $('body').on('click', '#refund-popup-cancel', function () {
            $('#refund-popup').hide()
        });
        $('body').on('click', '#refund-popup-confirm', function () {
            order_index.Refund()
        });
        $('body').on('click', '#receiver-popup-confirm', function () {
            order_index.ReceivedOrder()
        });
        $('body').on('click', '#receiver-popup-cancel', function () {
            $('#receiver-popup').hide()
        });

        $('#btn-load-order').on('click', function () {
            
            var btn = $(this);
            var page = parseInt(btn.attr('data-page'), 10) + 1; // tăng trang
            var usr = global_service.CheckLogin();

            if (!usr || !usr.token) {
                Swal.fire('Thông báo', 'Vui lòng đăng nhập để xem đơn hàng.', 'info');
                return;
            }

            var request = {
                token: usr.token,
                order_no: $('#order-keyword').val() || '',
                status: $('.tab-status .list-tab .active a').attr('data-id') || '',
                page_index: page,
                page_size: 10 // hoặc kích thước trang bạn muốn
            };

            btn.prop('disabled', true).text('Đang tải...');
           

            $.post("/Order/LoadOrders", request, function (res) {
                
                if (res) {
                    $('#order-history').append(res.html)
                    btn.attr('data-page', page);
                }

                if (res.isLastPage) {
                    btn.hide();  // Nếu không còn sản phẩm nào, ẩn nút "Xem thêm"
                } else {
                    btn.prop("disabled", false).text("Xem thêm");  // Hiển thị lại nút "Xem thêm"
                }
            }).fail(function (err) {
                console.error("LoadMore error:", err);
                btn.prop("disabled", false).text("Xem thêm");
            });
           
        });
        let velocity = 0;
        let lastX = 0;
        let frame;

        $(document).on('mousedown', '.list-tab', function (e) {
            $(this).data('isDown', true)
                .data('startX', e.pageX - $(this).offset().left)
                .data('scrollLeft', $(this).scrollLeft());
            velocity = 0;
            lastX = e.pageX;
            cancelAnimationFrame(frame);
        });

        $(document).on(' mouseup', '.list-tab', function () {
            let $this = $(this);
            $this.data('isDown', false);

            // Quán tính trượt
            function momentum() {
                $this.scrollLeft($this.scrollLeft() - velocity);
                velocity *= 0.95; // giảm dần tốc độ
                if (Math.abs(velocity) > 0.5) {
                    frame = requestAnimationFrame(momentum);
                }
            }
            requestAnimationFrame(momentum);
        });

        $(document).on('mousemove', '.list-tab', function (e) {
            if (!$(this).data('isDown')) return;
            e.preventDefault();

            let startX = $(this).data('startX');
            let scrollLeft = $(this).data('scrollLeft');
            let x = e.pageX - $(this).offset().left;
            let walk = (x - startX);

            $(this).scrollLeft(scrollLeft - walk);

            // Tính vận tốc
            velocity = e.pageX - lastX;
            lastX = e.pageX;
        });
    },
    // --------- Actions ----------
    Search: function () {
        var usr = global_service.CheckLogin();
        if (!usr || !usr.token) {
            $('#order-history').html('').removeClass('placeholder');
            $('#btn-load-order').hide(); // ẩn luôn
            return;
        }
        $('#btn-load-order').hide();
        var status = $('.tab-status .list-tab .active a').data('id')
        var order_no=$('#order-keyword').val()
        var request = {
            token: usr.token,
            order_no: order_no == null || order_no == undefined ? '' : order_no,
            status: status == null || status == undefined ? '' : status,
            page_index: order_index.Data.Index, // luôn 1 nếu bạn reset trước khi Search
            page_size: order_index.Data.Size
        };

        $.when(global_service.POST(API_URL.OrderSearch, request))
            .done(function (result) {
                $('#order-history').html(result || '');
                $('#order-history').removeClass('placeholder');

                // ✅ Quyết định hiển thị nút “Xem thêm”
                var pageSize = order_index.Data.Size;
                var temp = $('<div>').html(result || '');
                var loaded = temp.find('.order-history-item').length;

                if (loaded >= pageSize) {
                    $('#btn-load-order')
                        .attr('data-page', 1)
                        .show()
                        .prop('disabled', false)
                        .text('Xem thêm');
                } else {
                    $('#btn-load-order').hide();
                }
            })
            .fail(function () {
                $('#order-history').removeClass('placeholder').html('');
                $('#btn-load-order').hide();
            });
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
                $('.order-tab-refund .tab-count').html('(' + (result.refund != undefined && result.refund > 0 ? result.refund : '0') + ')');
                $('.order-tab-processing .tab-count').html('(' + (result.processing != undefined && result.processing > 0 ? result.processing : '0') + ')');
            }
           
        })
    },
    Refund: function () {
        var reason = $('#order-refund-reason').val()
        if (reason == null || reason == undefined || reason.trim() == '') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Vui lòng nhập lý do trả hàng / hoàn tiền',
                showConfirmButton: false,
                timer: 2000
            });
            return
        }
        var usr = global_service.CheckLogin()
        var token = ''
        if (usr) {
            token = usr.token

        }
        var request = {
            "reason": reason,
            "id": $('#refund-popup').attr('data-order-id'),
            "token": token
        }
        $.when(
            global_service.POST('/Order/Refund', request)
        ).done(function (result) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Gửi yêu cầu hoàn tiền thành công!',
                showConfirmButton: false,
                timer: 2000
            });
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        })
    },
    ReceivedOrder: function () {
      
        var usr = global_service.CheckLogin()
        var token = ''
        if (usr) {
            token = usr.token

        }
        var request = {
            "id": $('#receiver-popup').attr('data-order-id'),
            "token": token
        }
        $.when(
            global_service.POST('/Order/ReceivedOrder', request)
        ).done(function (result) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Gửi yêu cầu thành công!',
                showConfirmButton: false,
                timer: 2000
            });
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        })
    }

}