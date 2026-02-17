$(document).ready(function () {
    payment.Initialization()
})
var payment = {
    Initialization: function () {
        payment.DynamicBind()
        payment.Detail()
        $('.img-qr').addClass('placeholder')
        payment.ClearStorage()
    },
    ClearStorage: function () {
        sessionStorage.removeItem(STORAGE_NAME.ProductDetail)
        sessionStorage.removeItem(STORAGE_NAME.CartCount)
        sessionStorage.removeItem(STORAGE_NAME.BuyNowItem)
        sessionStorage.removeItem(STORAGE_NAME.SubProduct)
        sessionStorage.removeItem(STORAGE_NAME.Order)
        sessionStorage.removeItem(STORAGE_NAME.AddressClient)
        sessionStorage.removeItem(STORAGE_NAME.CartAddress)
        sessionStorage.removeItem(STORAGE_NAME.ProductDetailSelected)
        sessionStorage.removeItem(STORAGE_NAME.ProductCommentCount)
        sessionStorage.removeItem(STORAGE_NAME.OrderDetail)
        sessionStorage.removeItem(STORAGE_NAME.AddressClientLocal)
    },
    DynamicBind: function () {
        $("body").on('click', ".box-payment-info .btn", function () {
            payment.LoadingSuccess(0)
            
        });
        $("body").on("click", ".btn-repay", function () {
            
            const orderId = $(".section-payment").attr("data-id");

            if (!orderId) {
                Swal.fire("Lỗi", "Không tìm thấy mã đơn hàng để thanh toán lại.", "error");
                return;
            }

            $.post("/Order/VNPay", { id: orderId })
                .done(function (res) {
                    if (res.is_success && res.data) {
                        window.location.href = res.data; // Redirect đến VNPAY
                    } else {
                        Swal.fire("Lỗi", res.message || "Không thể tạo lại link thanh toán.", "error");
                    }
                })
                .fail(function () {
                    Swal.fire("Lỗi", "Không thể kết nối tới hệ thống.", "error");
                });
        });

    },
    Detail: function () {
        
        var usr = global_service.CheckLogin()
        if (usr) {
            var request = {
                "id": $('.section-payment').attr('data-id')
            }
            $.when(
                global_service.POST(API_URL.OrderDetail, request)
            ).done(function (result) {
                
                if (result.is_success && result.data) {
                    
                    payment.RenderBankTransfer(result.data.data)
                }
                else {
                    $('.box-payment-info').hide()
                    $('.box-payment-failed').show()
                }
            })

        } else {
            window.location.href='/home/error'
        }


    },
    RenderBankTransfer: function (order_detail) {
        
        switch (order_detail.payment_type) {
            case 2:
            {
                $('.box-payment-info').show()
                $('.box-payment-failed').hide()
                $('.box-payment-sucess').hide()
                    $('.order-no').text(order_detail.order_no)
                //$('.order-no').attr('href', '/order/detail/' + order_detail._id);
                //$('.order-no').attr('target', '_blank');
                var payment_type = GLOBAL_CONSTANTS.PaymentType.filter(obj => {
                    return obj.id === order_detail.payment_type
                })
                $('.payment-type').html(payment_type[0].name)
                $('.box-payment-info .flex-tr-transfer-description b').html(order_detail.order_no + ' thanh toan')
                $('.box-payment-info .flex-tr-amount b').html(global_service.Comma(order_detail.total_amount) + ' thanh toan')
                $('.box-payment-info').removeClass('placeholder')
                var request = {
                    "id": order_detail._id
                }
                $.when(
                    global_service.POST(API_URL.QRCode, request)
                ).done(function (result) {
                    
                    if (result.is_success && result.data) {
                        $('.img-qr').removeClass('placeholder')

                        $('.box-payment-info .img-qr img').attr('src', result.data)
                        payment.LoadingSuccess(30)
                    }
                })
            } break
            case 3: {
                // Ẩn tất cả phần còn lại
                $('.box-payment-info').hide();
                $('.box-payment-sucess').hide();
                $('.box-payment-failed').hide();
                $('.box-payment-waiting').hide();

                // Hiện block xử lý VNPAY
                $('.box-payment-vnpay-processing').show();

                // Gọi xác thực VNPAY
                $.post('/Order/VNPayValidate', {
                    response_from_vnpay: window.location.href
                }).done(function (res) {
                    $('.box-payment-vnpay-processing').hide();

                    if (res.is_success && res.data) {
                        $('.box-payment-sucess').show();
                        $('.box-payment-sucess .order-no').text("#" + res.data.order_no);
                        $('.box-payment-sucess .order-no').attr('href', '/order/detail/' + res.data.order_id);
                        $('.box-payment-sucess .payment-type').text("VNPAY");
                        $('.box-payment-sucess .date').append(`<p><strong>Thời gian thanh toán:</strong> ${res.data.created_date}</p>`);
                    } else {
                        $('.box-payment-failed2').show();
                        $('.box-payment-failed2 .order-no').text("Không xác định");
                    }
                }).fail(function () {
                    $('.box-payment-vnpay-processing').hide();
                    $('.box-payment-failed2').show();
                    $('.box-payment-failed2 .order-no').text("Không xác định");
                });
            } break
            case 1: {
                $('.box-payment-sucess').show()
                $('.box-payment-info').hide()
                $('.box-payment-failed').hide()
                $('.order-no').text(order_detail.order_no)
                //$('.order-no').attr('href', '/order/detail/' + order_detail._id);
                //$('.order-no').attr('target', '_blank');
                var payment_type = GLOBAL_CONSTANTS.PaymentType.filter(obj => {
                    return obj.id === order_detail.payment_type
                })
                $('.payment-type').html(payment_type[0].name)
            } break;
        }

        $('.box-payment-info').removeClass('placeholder')
    },
    LoadingSuccess: function (count) {
        
        if (count <= 0) {
            $('.box-payment-info').hide()
            $('.box-payment-sucess').show()
            return
        }
        $('.box-payment-info .btn').html('Xác nhận thông tin ( <nw class="second-count">' + count + '</nw>s )')
        setTimeout(function () {
            payment.LoadingSuccess(--count);
        }, 1000);
    }
}