$(document).ready(function () {
    cart.Initialization()

})
var appliedVoucher = null; // Lưu voucher đang áp dụng (nếu có)
var cart = {

    Data: {
        cancel_token: false
    },
    Initialization: function () {
        var appliedVoucher = null; // ví dụ: { code: 'ABC123', id: 3 }
       
        cart.DynamicBind()
        cart.CartItem()
        $('.select-delivery .list-option').fadeOut()
        $('.select-bank .list-option').fadeOut()
       // $('.voucher ').hide()
        cart.OrderAddress()

    },

    DynamicBind: function () {
        $("body").on('click', ".all-pop", function (event) {
            
            var cartId
            var element = $(this)
            event.preventDefault()
            var box_id = element.attr('data-id')
            // Nếu là nút xoá, truyền data-cart-id
            if (box_id === "#lightbox-delete-cart") {
                cartId = element.attr('data-cart-id');
                
            } else {
                cartId = element.closest('.product').attr('data-cart-id');
            }
            $(box_id).attr("data-cart-id", cartId);
            $('.popup').addClass('hidden')
            $('' + box_id).removeClass('hidden')
            $('' + box_id).show()
            // 👉 Nếu là popup địa chỉ, gọi render địa chỉ
            if (box_id === "#address-book") {
                var list = sessionStorage.getItem(STORAGE_NAME.AddressClient);
                if (list) {
                    var data = JSON.parse(list);
                    address_client.RenderExistsAddress(data, $('#address-receivername').attr('data-id'));
                }
            }
        });
        $("body").on('click', "#hinhthucgiaohang .item li", function () {
            var element = $(this)
            if (element.hasClass('disabled')) {
                return
            }
            $('#hinhthucgiaohang .item li').removeClass('active')
            $('#hinhthucgiaohang .item li').removeClass('active-delivery')
            element.addClass('active')
            element.addClass('active-delivery')
        });
        $("body").on('click', "#hinhthucgiaohang .btn-save", function () {
           // $('#hinhthucgiaohang').removeClass('overlay-active')
            $('#hinhthucgiaohang').addClass('hidden')

            cart.RenderSelectionDelivery()
        });
        $("body").on('click', "#voucher-popup .btn-back", function () {
           // $('#hinhthucgiaohang').removeClass('overlay-active')
            $('#voucher-popup').addClass('hidden')

           
         });
        $("body").on('click', "#hinhthucgiaohang .btn-back", function () {
            // $('#hinhthucgiaohang').removeClass('overlay-active')
            $('#hinhthucgiaohang').addClass('hidden')


        });
        //$("body").on('click', ".section-cart .table-addtocart .remove-product", function () {
        //    
        //    var element = $(this)
        //    cart.RemoveCartItem(element.closest('.product').attr('data-cart-id'))

        //});
        $("body").on('click', "#lightbox-delete-cart .btn-save", function () {
            
            cart.ConfirmRemoveCartItem()

        });
        $('body').on('change', '.checkbox-all', function () {
            
            const isChecked = $(this).prop('checked');

            $('.table-addtocart .box-checkbox input[type="checkbox"]').prop('checked', isChecked);

            cart.ReRenderAmount();
        });

        $("body").on('click', ".box-checkbox-label,.delivery .list-option label,.pay .list-option label", function () {
            var element = $(this)
            element.closest('.box-checkbox').find('input').click()
            var check_all = true
            $('.table-addtocart .box-checkbox').each(function (index_var, variation_item) {
                var element_checkbox = $(this)
                if (!element_checkbox.find('input').is(":checked")) {
                    check_all = false
                    return false
                }
            })
            if (check_all) {
                $('.box-checkbox-all').closest('.box-checkbox').find('input').prop('checked', true)
            } else {
                $('.box-checkbox-all').closest('.box-checkbox').find('input').prop('checked', false)

            }
            var value = element.closest('.box-checkbox').find('.option-name').text()
            element.closest('.select-option').find('.tt').text(value)
            if (!element.closest('.list-option').is(':hidden')) {
                element.closest('.list-option').fadeOut()
            }
        });
        $("body").on('click', ".box-checkbox, .number-input button, .checkbox-cart", function () {
            cart.ReRenderAmount()
        });
        $("body").on('click', ".btn-confirm-cart", function () {
            
            cart.ConfirmCart()
        });
        $("body").on('keyup', ".product-quantity input", function () {
            
            $('.btn-confirm-cart').addClass('button-disabled')
            $('.btn-confirm-cart').addClass('placeholder')

            var element = $(this)
            setTimeout(() => {
                cart.ChangeCartQuanity(element.closest('.product'))
                cart.ReRenderAmount()

            }, 1000);

        });
        $("body").on('click', ".product-quantity button", function () {
            $('.btn-confirm-cart').addClass('button-disabled')
            $('.btn-confirm-cart').addClass('placeholder')

            var element = $(this)
            setTimeout(() => {
                cart.ChangeCartQuanity(element.closest('.product'))
                cart.LoadShippingFee()
                cart.ReRenderAmount()

            }, 1000);
        });
        $("body").on('click', "#lightbox-delete-cart .btn-back", function () {
            $('#lightbox-delete-cart').removeClass('overlay-active')


        });
        $("body").on('click', ".right-cart .select-bank", function () {
            $('#phuongthucthanhtoan').addClass('overlay-active')
        });
       $("body").on('click', "#phuongthucthanhtoan .btn-save", function () {
                $('#phuongthucthanhtoan').addClass('hidden');

                const selected = $('input[name="payment_type"]:checked');
                const labelText = $(`label[for="${selected.attr('id')}"]`).text().trim();

                $('.right-cart .pay .select-bank .tt').html(labelText);
            });
            $("body").on('click', "#phuongthucthanhtoan .btn-back", function () {
                $('#phuongthucthanhtoan').addClass('hidden');

               
            });

        //Vourcher
        $('.btn-vorcher').on('click', function () {
            
            const selectedVoucher = $('input[name="voucher"]:checked'); // Lấy voucher đã chọn
            if (selectedVoucher.length > 0) {
                const voucherCode = selectedVoucher.data('code');
                const voucherId = selectedVoucher.data('id');
                const usr = global_service.CheckLogin();
                const token = usr ? usr.token : '';

               // Lấy tổng giá trị đơn hàng từ giỏ hàng
                const totalOrderAmount = cart.ReRenderAmount(false);  // Gọi hàm để lấy tổng tiền đơn hàng
                appliedVoucher = { code: voucherCode, id: voucherId };
                // Kiểm tra nếu giỏ hàng không có sản phẩm hợp lệ
                if (totalOrderAmount <= 0) {
                    // Sử dụng SweetAlert2 để hiển thị thông báo
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Vui lòng chọn sản phẩm trước khi áp dụng voucher!',
                    });
                    return;  // Dừng thực hiện nếu giỏ hàng trống
                }

                const request = {
                    voucher_name: voucherCode,        // Mã voucher
                    token: token,              // Token người dùng
                    total_order_amount_before: totalOrderAmount // Tổng tiền đơn hàng
                };

                // Gọi API ApplyVoucher
                cart.ApplyVoucher(request);
            } else {
                // Sử dụng SweetAlert2 khi người dùng chưa chọn voucher
                Swal.fire({
                    icon: 'warning',
                    title: 'Chưa chọn voucher!',
                    text: 'Vui lòng chọn voucher trước khi áp dụng!',
                });
            }
        });
        // Gắn toggle bằng cách nhớ trạng thái đã click
        let lastCheckedVoucher = null;

        $('.btn-remove-voucher').on('click', function () {
            
          

            // 1. Reset biến voucher
            appliedVoucher = null;
            // 💥 Reset biến track radio đang chọn
            lastCheckedVoucher = null;

            // 2. Ẩn UI hiển thị voucher
            $('#discountSection').addClass('hidden');
            $('#discountCart').addClass('hidden');

            // 3. Bỏ chọn input radio
            $('input[name="voucher"]:checked').prop('checked', false);

            // 4. Reset text hiển thị giảm giá
            //$('.total-discount-amount').text('0 đ');
            //$('.total-after-discount').text(global_service.Comma(cart.ReRenderAmount()) + ' đ');

            cart.ReRenderAmount(); // render lại mà không dùng voucher
        });
      

        $('body').on('click', 'input[name="voucher"]', function (e) {
            
            const $this = $(this);

            // Nếu click vào chính voucher đang được chọn → uncheck thủ công
            if ($this[0] === lastCheckedVoucher) {
                $this.prop('checked', false);
                lastCheckedVoucher = null;
                appliedVoucher = null;

                // Ẩn UI giảm giá nếu có
                $('#discountCart').addClass('hidden');
                $('#discountSection').addClass('hidden');
                $('.total-discount-amount').text('0 đ');
                $('.total-after-discount').text(global_service.Comma(cart.ReRenderAmount()) + ' đ');
                // Bắt buộc: trigger change để browser hiểu radio đã reset
                $this.blur(); // trick nhỏ giúp unbind hover/focus
            } else {
                lastCheckedVoucher = $this[0];
            }
        });



       
    },

    OrderAddress: function () {
        cart.RenderDefaultAddress();
        var request = {

        }
        $.when(
            global_service.POST(API_URL.AddressPopup, request)
        ).done(function (result) {
            $('body').append(result)
            address_client.Initialization()
            address_client.DynamicConfirmAddress(function (data) {
                cart.ConfirmCartAddress(data)
            })

        })
    },
    RenderDefaultAddress: function () {
        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }
        var request = {
            "token": usr.token
        }
        $.when(
            global_service.POST(API_URL.DefaultAddress, request)
        ).done(function (result) {
            if (result.is_success) {
                cart.ConfirmCartAddress(result.data)

            }
        })
    },
    ConfirmCartAddress: function (data) {
        if (data != undefined && data.id != undefined) {
            $('#address-receivername').attr('data-id', (data.id == null || data.id == undefined || data.id == '' ? '-1' : data.id))
            $('#address-receivername').html(data.receiverName)
            $('#address-phone').html(data.phone)
            $('#address').html(address_client.RenderDetailAddress(data))
            sessionStorage.setItem(STORAGE_NAME.CartAddress, JSON.stringify(data))
            cart.LoadShippingFee()
        }
    },
    CartItem: function () {

        
        var usr = global_service.CheckLogin()
        if (usr) {
            var request = {
                "token": usr.token
            }
            $.when(
                global_service.POST(API_URL.CartList, request)

            ).done(function (result) {
               
                if (result.is_success && result.data && result.data.length > 0) {
                    cart.RenderCartItem(result.data)
                    cart.RenderBuyNowSelection()
                    cart.GetListVoucherUser();

                }
                else {
                    $('#main').html(HTML_CONSTANTS.Cart.Empty)

                }

            })

        } else {
            //$('#main').html(HTML_CONSTANTS.Cart.Empty)
            //$('.mainheader .client-login').click()
            // 🔴 Nếu chưa login → lấy giỏ từ sessionStorage
            let localCart = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];

            if (localCart.length > 0) {
                cart.RenderCartItem(localCart);
                cart.RenderBuyNowSelection();
            } else {
                $('#main').html(HTML_CONSTANTS.Cart.Empty);
            }
        }


    },
    RenderCartItem: function (list) {
       
        var html = ''
        var total_amount = 0

        $(list).each(function (index, item) {
            
            var product = item.product;

            // --- Điều kiện Flash Sale ---
            var isFlashSale = product.amount_after_flashsale != null &&
                product.amount_after_flashsale > 0 &&
                product.flash_sale_todate != null &&
                new Date(product.flash_sale_todate) > new Date();

            var display_price = isFlashSale ? product.amount_after_flashsale : product.amount;
            var quanity = item.quanity > 999 ? 999 : item.quanity; // ✅ Giới hạn tối đa 999
            var total_price = display_price * quanity;
            //var total_price = display_price * item.quanity;

            // --- Điều kiện hiển thị sản phẩm trong giỏ ---
            var amountOk = display_price > 0;
            var statusOk = product.status === 1;
            var supplierOk = product.supplier_status === 1;
            var isEnabled = amountOk && statusOk && supplierOk;

            var disabledClass = isEnabled ? '' : 'disabled-product';
            var checkboxDisabled = isEnabled ? '' : 'disabled';
            var btnDisabled = isEnabled ? '' : 'disabled';
            var inputReadonly = isEnabled ? '' : 'readonly';

            var html_item = HTML_CONSTANTS.Cart.Product
                .replaceAll('{url}', '/san-pham/' + global_service.RemoveUnicode(global_service.RemoveSpecialCharacters(product.name)).replaceAll(' ', '-') + '--' + product.parent_product_id)
                .replaceAll('{id}', item._id || product._id)
                .replaceAll('{product_id}', product._id)
                .replaceAll('{amount}', display_price)
                .replaceAll('{name}', product.name)
                .replaceAll('{amount_display}', global_service.Comma(display_price))
                .replaceAll('{quanity}', global_service.Comma(quanity))
                .replaceAll('{total_amount}', global_service.Comma(total_price))
                .replaceAll('{disabledClass}', disabledClass)
                .replaceAll('{checkboxDisabled}', checkboxDisabled)
                .replaceAll('{btnDisabled}', btnDisabled)
                .replaceAll('{inputReadonly}', inputReadonly);

            // --- Variation / attribute ---
            var variation_value = '';
            $(product.variation_detail).each(function (index_var, variation_item) {
                var attribute = product.attributes.find(obj => obj._id === variation_item._id);
                var attribute_detail = product.attributes_detail.find(obj => obj.name === variation_item.name);
                if (attribute && attribute_detail) {
                    variation_value += attribute.name + ':' + attribute_detail.name;
                    if (index_var < product.variation_detail.length - 1) {
                        variation_value += ', <br />';
                    }
                }
            });

            var img_src = product.avatar;
            if (!img_src.includes(API_URL.StaticDomain)
                && !img_src.includes("data:image")
                && !img_src.includes("http"))
                img_src = API_URL.StaticDomain + product.avatar;

            html_item = html_item
                .replaceAll('{attribute}', variation_value)
                .replaceAll('{src}', img_src);

            html += html_item;
            total_amount += total_price;
        });

        $('.section-cart .table-addtocart').html(html);
        $('.section-cart').removeClass('placeholder');
        cart.ReRenderAmount();
        cart.RenderCartNumberOfProduct();
    },


    RenderBuyNowSelection: function () {
        var buy_now_item = sessionStorage.getItem(STORAGE_NAME.BuyNowItem)
        if (buy_now_item) {
            var buy_now = JSON.parse(buy_now_item)
            $('.table-addtocart .product').each(function (index, item) {
                var element = $(this);
                var checkbox = element.find('.checkbox-cart');
                var isDisabled = checkbox.prop('disabled');
                if (element.attr('data-product-id') == buy_now.product_id && !isDisabled) {
                    element.find('.checkbox-cart').prop('checked', true)
                    cart.ReRenderAmount()
                    return false
                }
            })
            sessionStorage.removeItem(STORAGE_NAME.BuyNowItem)
        }

    },
    RenderCartNumberOfProduct: function () {
        $('.total-sp').html('(' + $('.table-addtocart .product').length + ' sản phẩm) ')

    },
    GetListVoucherUser: function () {
        
        const usr = global_service.CheckLogin();
        if (!usr) return;

        const request = {
            token: usr.token,
            //product_id:"682551b6711071e30c18bae6"
        };
        $.when(
            global_service.POST(API_URL.VourcherList, request)

        ).done(function (result) {
            
            if (result.is_success && result.data && result.data.length > 0) {
                
                cart.RenderVoucherList(result.data);
               

            }
            

        })

      
    },

    RenderVoucherList: function (vouchers) {
        
        
        let html = '';
        vouchers.forEach((v, idx) => {
            html += `
                <label class="item flex gap-3 items-center relative w-full">
                    <img src="${v.image || '/assets/images/Voucher.png'}" alt="" class="shrink-0 w-1/4" />
                    <div class="space-y-3 w-full">
                        <div class="item flex gap-3 items-center justify-between relative">
                            <h5>${v.description}</h5>
                            <div class="relative">
                               <input type="radio" name="voucher" class="radio-custom mt-1" data-id="${v.id}" data-code="${v.code}" data-description="${v.description}" data-expire="${v.eDate}" data-discount="${v.price_sales}" />
                            </div>
                        </div>
                        <div class="item flex gap-3 items-center justify-between relative w-full">
                            <p class="text-slate-500">HSD: ${v.eDate}</p>
                             <p class="text-red-500">Giảm: ${global_service.Comma(v.price_sales)} ${v.unit === 'vnd' ? '₫' : '%'}</p>
                            <p class="text-red-500">Điều kiện</p>
                        </div>
                    </div>
                </label>
            `;
        });

        $('.list-voucher').html(html);

        
    },
    ApplyVoucher: function (request) {
        
        $.when(
            global_service.POST(API_URL.ApplyVoucher, request)
        ).done(function (res) {
            
            if (res && res.is_success === true) {
                
                 // Nếu thành công, cập nhật giao diện với thông tin giảm giá
                  cart.UpdateDiscountView(res.data);
                   // Cập nhật voucher đã chọn vào phần ngoài popup
                const selectedVoucher = $('input[name="voucher"]:checked');
                const voucherCode = selectedVoucher.data('code');
                const voucherDescription = selectedVoucher.data('description');
                const voucherDiscount = selectedVoucher.data('discount');
                const voucherExpire = selectedVoucher.data('expire');
                
                // Cập nhật phần hiển thị voucher ngoài popup
                $('.group .font-medium').text(voucherDescription);
              //  $('.group .text-red-500').text(`Giảm: ${voucherDiscount}₫`);
                
               $('#discountCart').removeClass('hidden')  // Loại bỏ class 'hidden' để hiện thị
            }else {
                  // Nếu thất bại, sử dụng SweetAlert2 để hiển thị thông báo thất bại
            Swal.fire({
                icon: 'error',
                title: 'Áp dụng voucher thất bại',
                text: 'Có lỗi xảy ra khi áp dụng voucher. Vui lòng thử lại!',
            });
                }


        })
      
    },

   UpdateDiscountView: function (data) {
       
        $('#voucher-popup').addClass('hidden')
        // Hiển thị phần tử giảm giá sau khi áp dụng voucher thành công
    $('#discountSection').removeClass('hidden')  // Loại bỏ class 'hidden' để hiện thị
    // Cập nhật giao diện với thông tin giảm giá
    $('.total-before-discount').text(global_service.Comma(data.total_order_amount_before) + ' đ');  // Tiền hàng trước khi giảm giá
    $('.total-discount-amount').text('-' + global_service.Comma(data.discount) + ' đ');  // Giảm giá
    $('.total-after-discount').text(global_service.Comma(data.total_order_amount_after) + ' đ');  // Tổng tiền sau khi giảm giá
},
    ReRenderAmount: function (loading_shipping = true) {
        
        var total_amount_cart = 0
        var hasPricedItem = false;
        $('.table-addtocart .product').each(function (index, item) {
            var element = $(this)
            var amount = parseFloat(element.attr('data-amount'))
            var quanity = parseInt(element.find('.quantity').val())
            var total_amount_product = amount * quanity
            element.find('.product-line-price').html(global_service.Comma(total_amount_product) + ' đ')
            if (element.find('.checkbox-cart').is(":checked")) {
                total_amount_cart += total_amount_product
                // 👇 Check đúng chuẩn yêu cầu: giá > 0 và số lượng > 0
                if (amount > 0 && quanity > 0) {
                    hasPricedItem = true;
                }
            }

        })
        $('.total-amount .pr').html(global_service.Comma(total_amount_cart) + ' đ')
        var shipping_fee = $('.total-cart .total-shipping-fee .pr').attr('data-price')
        if (shipping_fee != undefined && shipping_fee.trim() != '') {
            var shipping_fee_number = parseInt(shipping_fee)
            if (!isNaN(shipping_fee_number) && shipping_fee_number > 0) total_amount_cart += shipping_fee_number
        }
        $('.total-final-amount .pr').html(global_service.Comma(total_amount_cart) + ' đ')
        // Nếu có voucher đang được áp dụng → gọi lại API ApplyVoucher
        if (appliedVoucher !== null) {
            const usr = global_service.CheckLogin();
            const token = usr ? usr.token : '';

            const request = {
                voucher_name: appliedVoucher.code,
                token: token,
                total_order_amount_before: total_amount_cart
            };

            cart.ApplyVoucher(request);
        }
        if (total_amount_cart > 0 && hasPricedItem) {
            if (loading_shipping) {
                cart.LoadShippingFee()
            }
            $('.btn-confirm-cart').removeClass('button-disabled')

        } else {
            $('.btn-confirm-cart').addClass('button-disabled')

        }
         return total_amount_cart;  // Trả lại tổng giá trị đơn hàng
    },
    //RemoveCartItem: function (data_id) {
    //    
    //    $("#lightbox-delete-cart").attr("data-cart-id", data_id).removeClass("hidden");

    //},
    ConfirmRemoveCartItem: function () {
        
        var data_id = $('#lightbox-delete-cart').attr('data-cart-id')
        var usr = global_service.CheckLogin();
        $('.table-addtocart .product').each(function (index, item) {
            var element = $(this)
            if (element.attr('data-cart-id') == data_id) {
                element.remove()
                return false
            }
        })
        if ($('.table-addtocart .product').length <= 0) {
            $('#main').html(HTML_CONSTANTS.Cart.Empty)

        }
        if (usr) {
            var request = {
                "id": data_id
            }
            $.when(
                global_service.POST(API_URL.CartDelete, request)
            ).done(function (result) {
                sessionStorage.removeItem(STORAGE_NAME.CartCount)
                global_service.LoadCartCount()
                cart.RenderCartNumberOfProduct()
                cart.ReRenderAmount()

            })
            $('#lightbox-delete-cart').removeClass('overlay-active')

        } else {
            
            // ❌ Nếu chưa login → xoá trong sessionStorage
            let cart2 = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];

            // Lọc lại mảng cart
            cart2 = cart2.filter(function (item) {
                return item.product_id !== data_id;
            });

            sessionStorage.setItem(STORAGE_NAME.Cart, JSON.stringify(cart2));

            // Cập nhật lại số lượng, tổng tiền
            global_service.LoadCartCount();
            cart.RenderCartNumberOfProduct();
            cart.ReRenderAmount();
        }
        



    },

    ConfirmCart: function () {
        
        // ✨ Show loading + disable button
        const $btn = $('.btn-confirm-cart');
        $btn.prop('disabled', true).addClass('opacity-60 cursor-not-allowed');
        const originalText = $btn.text();
        $btn.html('<i class="fas fa-spinner fa-spin mr-2"></i> Đang xử lý...'); // icon font-awesome hoặc bạn dùng loader khác cũng ok
        
        if ($('#address-receivername').attr('data-id') == null || $('#address-receivername').attr('data-id') == undefined || $('#address-receivername').attr('data-id').trim() == '') {
            $('#lightbox-cannot-add-cart .info-order .notification-content').html('Vui lòng thêm/chọn địa chỉ trước khi tiếp tục')
            $('#lightbox-cannot-add-cart .title-box').html('Chưa chọn địa chỉ giao hàng')
            $('#lightbox-cannot-add-cart').addClass('overlay-active')
            cart.HideNotification()
            $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText); // 🔁 Revert button
            //return
            $('.mainheader .client-login').click()
        }
        // ❌ Nếu chưa chọn địa chỉ
        //if (!$('#address-receivername').attr('data-id')?.trim()) {
        //    Swal.fire({
        //        icon: 'warning',
        //        title: 'Chưa chọn địa chỉ giao hàng',
        //        text: 'Vui lòng thêm hoặc chọn địa chỉ trước khi tiếp tục.',
        //        confirmButtonText: 'OK'
        //    }).then(() => {
        //        $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
        //        $('.mainheader .client-login').click();
        //    });
        //    return;
        //}
        var usr = global_service.CheckLogin()
        if (usr) {
            var carts = []
            $('.table-addtocart .product').each(function (index, item) {
                var element = $(this)
                if (element.find('.checkbox-cart').is(':checked')) {

                    var cart = {
                        "id": element.attr('data-cart-id'),
                        "quanity": parseInt(element.find('.quantity').val())
                    }
                    carts.push(cart)
                }
            })
            // ❌ Nếu có sp được chọn nhưng số lượng <= 0
            const invalidItem = carts.find(item => isNaN(item.quanity) || item.quanity <= 0);
            if (invalidItem) {
                Swal.fire({
                    icon: 'error',
                    title: 'Số lượng không hợp lệ',
                    text: 'Sản phẩm được chọn phải có số lượng lớn hơn 0.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
                });
                return;
            }
            // ❌ Nếu chưa chọn gì hết
            if (carts.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Chưa chọn sản phẩm',
                    text: 'Vui lòng chọn ít nhất một sản phẩm để tiếp tục.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
                });
                return;
            }
            var delivery_detail = {

            }
            var default_address_json = sessionStorage.getItem(STORAGE_NAME.CartAddress)
            if (default_address_json) {
                var default_address = JSON.parse(default_address_json)
                var selected = $('#hinhthucgiaohang .active-delivery').first()
                var carrier_id = selected.closest('.item').attr('data-carrier-id')
                var shipping_type = selected.attr('data-shipping-type')

                delivery_detail = {
                    "from_province_id": 1,
                    "to_province_id": default_address.provinceid,
                    "shipping_type": shipping_type,
                    "carrier_id": carrier_id,
                    "carts": []
                }
                $('.shopping-cart .table-addtocart .product').each(function (index, item) {
                    var element_cart = $(this)
                    if (element_cart.find('.checkbox-cart').is(':checked')) {
                        delivery_detail.carts.push({
                            "id": element_cart.attr('data-cart-id'),
                            "product_id": element_cart.attr('data-product-id'),
                            "quanity": parseInt(element_cart.find('.number-input').find('.quantity').val())
                        })
                    }

                })
            }

            if (carts.length > 0) {
                // ✅ Chặn confirm nếu toàn sản phẩm 0đ hoặc quantity = 0
                
               
                var request = {
                    "carts": carts,
                    "token": usr.token,
                    "payment_type": $('input[name="payment_type"]:checked').val(),
                    "address": JSON.parse(sessionStorage.getItem(STORAGE_NAME.CartAddress)),
                    "address_id": $('#address-receivername').attr('data-id'),
                    "delivery_detail": delivery_detail,
                    // 🆕 Thêm dòng này:
                    "voucher_code": appliedVoucher?.code || null
                }
                $.when(
                    global_service.POST(API_URL.CartConfirm, request)
                ).done(function (result) {
                    
                    if (result.is_success && result.data != undefined) {
                        request.result = result.data
                        sessionStorage.setItem(STORAGE_NAME.Order, JSON.stringify(request))
                        sessionStorage.removeItem(STORAGE_NAME.CartCount)
                        global_service.LoadCartCount()

                        window.location.href = '/order/payment/' + result.data.id

                    }
                    else {
                        $('#lightbox-cannot-add-cart .info-order .notification-content').html('Có lỗi xảy ra trong quá trình xác nhận thông tin')
                        $('#lightbox-cannot-add-cart').addClass('overlay-active')
                        $('.btn-confirm-cart').removeClass('button-disabled')
                        cart.HideNotification()
                        // 🔁 Revert button nếu lỗi
                        $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);


                    }

                })
            }


        } else {
            $('.mainheader .client-login').click()
            $('.btn-confirm-cart').removeClass('button-disabled')
            return
        }

    },
    ChangeCartQuanity: function (element) {
        var product_id = element.attr('data-product-id')
        if (!product_id || product_id.trim() === '') return

        var usr = global_service.CheckLogin()
        if (!usr) {
            $('.btn-confirm-cart').removeClass('placeholder')
            return
        }

        var quantityInput = element.find('.product-quantity input')
        var quantity = parseInt(quantityInput.val())

        // ✅ Ép giới hạn về 999 nếu người dùng nhập quá
        if (quantity > 999) {
            quantity = 999
            quantityInput.val(quantity) // Update lại UI cho đúng
        }

        var request = {
            "product_id": product_id,
            "quanity": quantity,
            "token": usr.token
        }

        $.when(global_service.POST(API_URL.CartChangeQuanity, request))
            .done(function (result) {
                $('.btn-confirm-cart').removeClass('placeholder')
            })
    },

    CheckCartProductDetail: function (carts) {
        var request = {
            "carts": carts
        }
        $.when(
            global_service.POST(API_URL.CartChangeQuanity, request)
        ).done(function (result) {

        })
    },
    HideNotification: function () {
        setTimeout(function () {
            $('#lightbox-cannot-add-cart').removeClass('overlay-active')


        }, 3000);
    },
    LoadShippingFee: function () {
        $('#hinhthucgiaohang .item').each(function (index, item) {
            var element = $(this)
            var carrier_id = element.attr('data-carrier-id')
            var default_address = sessionStorage.getItem(STORAGE_NAME.CartAddress)
            if (default_address) {
                var data_address = JSON.parse(default_address)
                element.find('li').each(function (index, item) {
                    var element_li = $(this)
                    var shipping_type = element_li.attr('data-shipping-type')
                    var request = {
                        "from_province_id": 1,
                        "to_province_id": data_address.provinceid,
                        "shipping_type": shipping_type,
                        "carrier_id": carrier_id,
                        "carts": []
                    }
                    $('.shopping-cart .table-addtocart .product').each(function (index, item) {
                        var element_cart = $(this)
                        if (element_cart.find('.checkbox-cart').is(':checked')) {
                            request.carts.push({
                                "id": element_cart.attr('data-cart-id'),
                                "product_id": element_cart.attr('data-product-id'),
                                "quanity": parseInt(element_cart.find('.number-input').find('.quantity').val())
                            })
                        }

                    })
                    var result = global_service.POSTSynchorus(API_URL.CartGetShippingFee, request)
                    if (result.is_success && result.data != undefined && result.data.total_shipping_fee != undefined && result.data.total_shipping_fee >= 0) {
                        element_li.find('.price').html(global_service.Comma(result.data.total_shipping_fee) + 'đ')
                        element_li.attr('data-price', result.data.total_shipping_fee)
                        element_li.removeClass('disabled')
                        element_li.css('color', '')
                        element_li.find('.name').css('color', '')
                        element_li.find('.des').css('color', '')

                    } else {
                        element_li.attr('data-price', '0')
                        if (element_li.attr('data-shipping-type') != undefined && element_li.attr('data-shipping-type').trim() == '2') {
                            element_li.find('.price').html('0 đ')
                        } else {
                            element_li.addClass('disabled')
                            element_li.css('color', 'lightgray')
                            element_li.find('.name').css('color', 'lightgray')
                            element_li.find('.des').css('color', 'lightgray')
                            element_li.find('.price').html('Không khả dụng')
                        }
                    }
                    element_li.find('.price').removeClass('placeholder')

                })

            } else {
                $('#hinhthucgiaohang .item li').each(function (index, item) {
                    var element_li = $(this)
                    element_li.attr('data-price', '0')
                    if (element_li.attr('data-shipping-type') != undefined && element_li.attr('data-shipping-type').trim() == '2') {
                        element_li.find('.price').html('0 đ')
                    } else {
                        element_li.addClass('disabled')
                        element_li.css('color', 'lightgray')
                        element_li.find('.name').css('color', 'lightgray')
                        element_li.find('.des').css('color', 'lightgray')
                        element_li.find('.price').html('Không khả dụng')
                    }

                    element_li.closest('.item').find('h3').removeClass('active')
                    element_li.closest('.item').find('.answer').hide()
                })

            }

        })
        var activated = false
        $('#hinhthucgiaohang li').each(function (index, item) {
            var element_li = $(this)
            if (!element_li.hasClass('disabled') && !activated) {
                activated = true
                element_li.addClass('active-delivery')
                element_li.addClass('active')
                element_li.closest('.item').find('h3').addClass('active')
                element_li.closest('.item').find('.answer').show()

            } else {
                element_li.removeClass('active-delivery')
                element_li.removeClass('active')
                element_li.closest('.item').find('h3').removeClass('active')
                element_li.closest('.item').find('.answer').hide()
            }

        })
        cart.RenderSelectionDelivery()

    },
    RenderSelectionDelivery: function (element) {
        var selected = $('#hinhthucgiaohang .active-delivery').first()
        if (selected == undefined || selected.attr('data-shipping-type') == undefined
            || selected.closest('.item').length <= 0) {
            $('.total-cart .total-shipping-fee .pr').html(global_service.Comma(0) + ' đ')
            $('.total-cart .total-shipping-fee .pr').attr('data-price', 0)
            cart.ReRenderAmount(false)
            return
        }
        if (selected.attr('data-shipping-type').trim() == '2') {
            $('#delivery-carrier').hide()
        }
        else {
            $('#delivery-carrier').show()

        }
        $('#delivery-shippingtype .select-delivery .tt').text(selected.find('.name').html())
        $('#delivery-carrier .select-delivery .tt').text(selected.closest('.item').find('h3').html())
        var total_price = parseInt(selected.attr('data-price'))
        $('.total-cart .total-shipping-fee .pr').attr('data-price', total_price)
        $('.total-cart .total-shipping-fee .pr').html(global_service.Comma(total_price) + ' đ')
        cart.ReRenderAmount(false)

    }
}