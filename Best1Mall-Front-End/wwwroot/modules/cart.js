$(document).ready(function () {
    cart.Initialization()

    // 🔁 Reload lại trang nếu người dùng quay lại bằng Back/Forward
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || window.performance.navigation.type === 2) {
            // Đây là trạng thái được phục hồi từ bộ nhớ (bfcache)
            location.reload();
        }
    });


})
var appliedVoucher = null; // Lưu voucher đang áp dụng (nếu có)
var activeShippingStyleClass = 'bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-[3px] border-[#00CFE8]';
var cart = {

    Data: {
        cancel_token: false
    },
    Initialization: function () {


        cart.DynamicBind()
        cart.CartItem()
        $('.select-delivery .list-option').fadeOut()
        $('.select-bank .list-option').fadeOut()
        // $('.voucher ').hide()
        cart.OrderAddress()


        /* ================================================================================ */


    },

    DynamicBind: function () {

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
        // Gắn sự kiện chọn shipping option
        // Gắn sự kiện chọn shipping option
        $(document).on('click', '#hinhthucgiaohang .shipping-option', function () {
            const selected = $(this);

            // Kiểm tra xem có phải tùy chọn bị disable không
            if (selected.hasClass('disabled')) {
                return;  // Nếu bị disable, không làm gì
            }

            // ❌ Xoá class active + màu nền khỏi tất cả các option
            $('#hinhthucgiaohang .shipping-option').removeClass('active active-delivery bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-[3px] border-[#00CFE8]');

            // ✅ Gán lại class cho cái được chọn
            selected.addClass('active active-delivery bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-[3px] border-[#00CFE8]');

            // ✅ Mở đúng panel
            $('.group.item .answer').hide();
            $('.group.item .title').removeClass('active');
            selected.closest('.item').find('.answer').show();
            selected.closest('.item').find('.title').addClass('active');

            // ✅ Cập nhật giao diện bên ngoài
            cart.RenderSelectionDelivery();

            // Lưu lại lựa chọn vào sessionStorage
            sessionStorage.setItem("selectedShippingOption", selected.attr('data-shipping-type'));
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
        // Xử lý khi người dùng nhập tay
        $('body').on('input', '.quantity', function () {
            let val = $(this).val();

            // Chặn nhập chữ và ký tự đặc biệt
            val = val.replace(/[^0-9]/g, '');

            // Xóa số 0 ở đầu
            if (val.length > 1 && val.startsWith('0')) {
                val = val.replace(/^0+/, '');
            }

            // Nếu rỗng sau khi xoá → không set gì cả, để người dùng xóa toàn bộ
            if (val === '') {
                $(this).val('');
                return;
            }

            // Giới hạn tối đa 999
            if (parseInt(val) > 999) {
                val = '999';
            }

            $(this).val(val);
        });

        // Khi blur ra ngoài mà rỗng hoặc 0 → set về 1
        $('body').on('blur', '.quantity', function () {
            let val = parseInt($(this).val());
            if (isNaN(val) || val <= 0) {
                $(this).val(1);
            }
        });

        // Khi ấn +
        $('body').on('click', '.btn-quantity-increase', function () {
            const $input = $(this).closest('.number-input').find('.quantity');
            const max = parseInt($input.attr('data-max')) || parseInt($input.attr('max')) || 999;
            let val = parseInt(($input.val() || '').toString().replace(/,/g, '')) || 0;

            if (val >= max) {
                Swal.fire('Thông báo', `Rất tiếc, bạn chỉ có thể mua tối đa ${global_service.Comma(max)} sản phẩm của chương trình giảm giá này.`, 'info');
                return;
            }
            $input.val(val + 1).trigger('change');
        });

        // Khi ấn -
        $('body').on('click', '.btn-quantity-decrease', function () {
            const $input = $(this).closest('.number-input').find('.quantity');
            let val = parseInt(($input.val() || '').toString().replace(/,/g, '')) || 0;

            if (val > 1) {
                $input.val(val - 1).trigger('change');
            }
        });
        // Kiểm tra khi nhập tay (clamp về [1, max] và cảnh báo nếu vượt)
        $('body').on('blur change', 'input.quantity', function () {
            const $input = $(this);
            const max = parseInt($input.attr('data-max')) || 999;

            // Lấy số, loại bỏ ký tự không phải số (nếu bạn format có dấu phẩy)
            let raw = ($input.val() || '').toString();
            let val = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;

            if (val > max) {
                val = max;
                Swal.fire('Thông báo', `Rất tiếc, bạn chỉ có thể mua tối đa ${global_service.Comma(max)} sản phẩm của chương trình giảm giá này.`, 'info');
            } else if (val < 1) {
                val = 1;
            }

            // ❌ KHÔNG trigger('change') ở đây để tránh vòng lặp
            $input.val(val);

            // Nếu bạn cần tính lại tổng, gọi trực tiếp:
            if (typeof cart !== 'undefined' && typeof cart.ReRenderAmount === 'function') {
                cart.ReRenderAmount();
            }
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

            // Chỉ chọn checkbox KHÔNG bị disabled
            $('.table-addtocart .box-checkbox input[type="checkbox"]:not(:disabled)').prop('checked', isChecked);

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
        // ✅ Khi click checkbox, hoặc thay đổi số lượng
        $("body").on('click', ".box-checkbox, .number-input button, .checkbox-cart", function () {
            //const clickedCheckbox = $(this).hasClass('checkbox-cart') ? $(this) : $(this).find('.checkbox-cart');

            //// ✅ Bổ sung VALIDATE: chỉ chọn sản phẩm của 1 NCC
            //if (clickedCheckbox.length > 0 && clickedCheckbox.is(':checked')) {
            //    const selectedSupplier = clickedCheckbox.data('supplier-id');

            //    // Kiểm tra xem có sản phẩm nào của NCC khác đang được chọn không
            //    let conflictFound = false;
            //    $('.checkbox-cart').each(function () {
            //        const otherCheckbox = $(this);
            //        const otherSupplier = otherCheckbox.data('supplier-id');

            //        if (otherCheckbox.prop('checked') && otherSupplier !== selectedSupplier) {
            //            conflictFound = true;
            //            return false;
            //        }
            //    });

            //    if (conflictFound) {
            //        // Bỏ chọn tất cả sản phẩm của NCC khác
            //        $('.checkbox-cart').each(function () {
            //            const otherCheckbox = $(this);
            //            const otherSupplier = otherCheckbox.data('supplier-id');

            //            if (otherSupplier !== selectedSupplier) {
            //                otherCheckbox.prop('checked', false);
            //            }
            //        });
            //    }
            //}

            cart.ReRenderAmount();
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
                //cart.LoadShippingFee()
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

            $("#dieukien-popup").addClass("hidden")
            // Xoá lỗi cũ
            $('#voucher-popup .voucher-error').remove();

            // Lấy chọn theo 2 nhóm
            const selected = cart.GetSelectedVouchers();
            window.appliedVouchers = selected;

            const ctx = cart.BuildVoucherContext();
            if (ctx.total_order_amount_before <= 0) {
                $('#voucher-popup .popup-content').append('<p class="voucher-error text-red-500 mt-4">Vui lòng chọn sản phẩm trước khi áp dụng voucher!</p>');
                $('#voucher-popup').removeClass('hidden');
                return;
            }

            // Preview bằng 2 call apply (tối đa)
            cart.PreviewSelectedVouchers();
        });
        // Gắn toggle bằng cách nhớ trạng thái đã click
        let lastCheckedVoucher = null;
        let lastCheckedShipping = null;
        let lastCheckedGeneral = null;

        // Bỏ TẤT CẢ voucher (cả vận chuyển + khác)
        // Bỏ TẤT CẢ voucher (cả vận chuyển + khác)
        $('.btn-remove-voucher').on('click', function () {
            // 1) Reset biến theo dõi radio & state
            lastCheckedShipping = null;
            lastCheckedGeneral = null;

            $('input[name="voucher_shipping"]:checked').prop('checked', false);
            $('input[name="voucher_general"]:checked').prop('checked', false);

            window.appliedVouchers = [];
            // nếu đang dùng temp khi popup mở:
            if (typeof cart !== 'undefined') { cart.tempVouchers = null; }

            // 2) Ẩn UI giảm giá + reset số hiển thị giảm
            $('#discountSection').addClass('hidden');
            $('#discountCart').addClass('hidden');
            $('.total-discount-amount').text('0 đ');
            $('.total-discount-shipping').text('0 đ');      // nếu bạn có element này
            $('.badge-voucher-count').text('0');            // nếu có badge đếm voucher

            // 3) Reset phí ship về BASE (trước giảm)
            const $ship = $('.total-cart .total-shipping-fee .pr');
            // Lấy base; nếu chưa có thì lấy từ option đang chọn và set làm base
            let baseShip = parseInt($ship.attr('data-base-price'), 10);
            if (!Number.isFinite(baseShip)) {
                const $selected = $('#hinhthucgiaohang .active-delivery').first();
                baseShip = parseInt($selected.attr('data-price'), 10) || 0; // giá của phương án ship hiện tại
                $ship.attr('data-base-price', baseShip);
            }
            // cập nhật lại "giá đang hiển thị" = base
            $ship.attr('data-price', baseShip).text(global_service.Comma(baseShip) + ' đ');

            // 4) Tính lại tổng = tiền hàng (trước giảm) + ship base
            if (typeof cart.BuildVoucherContext === 'function') {
                const ctx = cart.BuildVoucherContext();
                const final_amount = (ctx.total_order_amount_before || 0) + (ctx.total_shipping_fee_before || baseShip);
                $('.total-after-discount').text(global_service.Comma(final_amount) + ' đ');
                $('.total-final-amount .pr').text(global_service.Comma(final_amount) + ' đ')
                    .attr('data-price', final_amount);
            } else {
                // fallback: render lại tổng theo luồng cũ
                cart.ReRenderAmount(false);
            }

            // 5) (Optional) không cần gọi PreviewSelectedVouchers vì đã reset hết về base
            //    nhưng nếu bạn muốn đồng bộ thêm logic khác thì có thể gọi:
            // if (typeof cart.PreviewSelectedVouchers === 'function') cart.PreviewSelectedVouchers();
        });




        $('body').on('click', 'input[name="voucher_shipping"], input[name="voucher_general"]', function (e) {

            const $this = $(this);

            // Nếu click vào chính voucher đang được chọn → uncheck thủ công
            if ($this[0] === lastCheckedVoucher) {
                $this.prop('checked', false);
                lastCheckedVoucher = null;
                appliedVoucher = null;

                // Ẩn UI giảm giá nếu có
                //$('#discountCart').addClass('hidden');
                //$('#discountSection').addClass('hidden');
                //$('.total-discount-amount').text('0 đ');
                //$('.total-after-discount').text(global_service.Comma(cart.ReRenderAmount()) + ' đ');
                // Bắt buộc: trigger change để browser hiểu radio đã reset
                $this.blur(); // trick nhỏ giúp unbind hover/focus
            } else {
                lastCheckedVoucher = $this[0];
            }
        });


        $("body").on("click", ".btn-back-voucher , .closedk", function () {

            $("#dieukien-popup").addClass("hidden");       // ẩn popup điều kiện
            $("#voucher-popup").removeClass("hidden").show(); // hiện lại popup chọn voucher
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
        $('#skeleton-loading').show();
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

        const groupedBySupplier = {};

        // 1. Gom nhóm theo supplier_id
        list.forEach(item => {
            const supplierId = item.product.supplier_id || 'unknown';
            if (!groupedBySupplier[supplierId]) {
                groupedBySupplier[supplierId] = [];
            }
            groupedBySupplier[supplierId].push(item);
        });

        let html = '';
        let total_amount = 0;

        // 2. Lặp từng nhóm NCC
        for (const supplierId in groupedBySupplier) {
            const products = groupedBySupplier[supplierId];
            const supplierNameRaw = products[0]?.product?.supplier_name || supplierId;
            const supplierName = `${supplierNameRaw}`;

            // Header nhóm nhà cung cấp
            let groupHtml = `
            <div class="supplier-box mb-4 p-3 rounded-xl bg-white border border-gray-200 ">
                <div class="font-semibold mb-2 uppercase text-sm text-gray-700">${supplierName}</div>
                <div class="border-b border-[#B7CCD9] mt-2 mb-3"></div> 
                `;


            // 3. Render từng sản phẩm trong nhóm
            products.forEach(item => {
                const product = item.product;

                const isFlashSale = product.amount_after_flashsale != null &&
                    product.amount_after_flashsale > 0 &&
                    product.flash_sale_todate != null &&
                    new Date(product.flash_sale_todate) > new Date();



                // Tồn kho & quantity an toàn
                const stock = Number(product.quanity_of_stock) || 0;
                const maxAllowed = Math.min(999, Math.max(0, stock)); // [0..999]
                const stockOk = stock > 0;

                // Nếu hết hàng, quantity hiển thị 0; còn hàng thì clamp theo tồn kho
                const safeQty = stockOk
                    ? Math.min(item.quanity || 1, maxAllowed)
                    : 0;

                const display_price = isFlashSale ? product.amount_after_flashsale : product.amount;
                const quantity = safeQty;
                const total_price = display_price * quantity;

                const amountOk = display_price > 0;
                const statusOk = product.status === 1;
                const supplierOk = product.supplier_status === 1;
                const isEnabled = amountOk && statusOk && supplierOk && stockOk;

                const disabledClass = isEnabled ? '' : 'disabled-product';
                const checkboxDisabled = isEnabled ? '' : 'disabled';
                const btnDisabled = isEnabled ? '' : 'disabled';
                const inputReadonly = isEnabled ? '' : 'readonly';

                let html_item = HTML_CONSTANTS.Cart.Product
                    .replaceAll('{url}', '/san-pham/' +
                        global_service.RemoveUnicode(global_service.RemoveSpecialCharacters(product.name)).replaceAll(' ', '-') +
                        '--' + (product.parent_product_id || product._id)
                    )
                    .replaceAll('{id}', item._id || product._id)
                    .replaceAll('{supplier_id}', product.supplier_id)
                    .replaceAll('{product_id}', product._id)
                    .replaceAll('{amount}', display_price)
                    .replaceAll('{name}', product.name)
                    .replaceAll('{amount_display}', global_service.Comma(display_price))
                    .replaceAll('{quanity}', global_service.Comma(quantity))
                    .replaceAll('{max_quanity}', maxAllowed || 1)  // 👈 thêm dòng này
                    .replaceAll('{total_amount}', global_service.Comma(total_price))
                    .replaceAll('{disabledClass}', disabledClass)
                    .replaceAll('{checkboxDisabled}', checkboxDisabled)
                    .replaceAll('{btnDisabled}', btnDisabled)
                    .replaceAll('{inputReadonly}', inputReadonly);

                // Thuộc tính sản phẩm (variation)
                let variation_value = '';
                $(product.variation_detail).each(function (index_var, variation_item) {
                    const attribute = product.attributes.find(obj => obj._id === variation_item._id);
                    const attribute_detail = product.attributes_detail.find(obj => obj.name === variation_item.name);
                    if (attribute && attribute_detail) {
                        variation_value += attribute.name + ':' + attribute_detail.name;
                        if (index_var < product.variation_detail.length - 1) {
                            variation_value += ', <br />';
                        }
                    }
                });

                let img_src = product.avatar;
                if (!img_src.includes(API_URL.StaticDomain) &&
                    !img_src.includes("data:image") &&
                    !img_src.includes("http")) {
                    img_src = API_URL.StaticDomain + product.avatar;
                }

                html_item = html_item
                    .replaceAll('{attribute}', variation_value)
                    .replaceAll('{src}', img_src);

                groupHtml += html_item;
                total_amount += total_price;
            });

            groupHtml += `</div>`; // đóng supplier-box
            html += groupHtml;
        }

        $('.section-cart .table-addtocart').html(html);
        $('#skeleton-loading').hide();
        $('.section-cart').removeClass('hidden');

        cart.ReRenderAmount();
        cart.RenderCartNumberOfProduct();
        //cart.setupCheckboxValidation();
    },

    setupCheckboxValidation: function () {
        $('.checkbox-cart').off('change').on('change', function () {
            const currentCheckbox = $(this);
            const selectedSupplier = currentCheckbox.data('supplier-id');

            if (currentCheckbox.prop('checked')) {
                // Kiểm tra xem đã có supplier nào khác được chọn chưa
                let otherSelected = false;

                $('.checkbox-cart').each(function () {
                    const cb = $(this);
                    const cbSupplier = cb.data('supplier-id');

                    if (cb.prop('checked') && cbSupplier !== selectedSupplier) {
                        otherSelected = true;
                    }
                });

                if (otherSelected) {
                    // Bỏ chọn tất cả sản phẩm của NCC khác
                    $('.checkbox-cart').each(function () {
                        const cb = $(this);
                        const cbSupplier = cb.data('supplier-id');

                        if (cbSupplier !== selectedSupplier) {
                            cb.prop('checked', false);
                        }
                    });
                }
            }
        });
    },

    RenderBuyNowSelection: function () {

        var buy_now_item = sessionStorage.getItem(STORAGE_NAME.BuyNowItem);
        if (!buy_now_item) return;

        var buy_now = JSON.parse(buy_now_item);
        var productIds = [];

        // Hỗ trợ cả kiểu cũ (product_id) và kiểu mới (product_ids)
        if (Array.isArray(buy_now.product_ids)) {
            productIds = buy_now.product_ids;
        } else if (buy_now.product_id) {
            productIds = [buy_now.product_id];
        }

        if (productIds.length === 0) return;

        $('.table-addtocart .product').each(function () {
            var element = $(this);
            var checkbox = element.find('.checkbox-cart');
            var isDisabled = checkbox.prop('disabled');
            var pid = element.attr('data-product-id');

            if (productIds.includes(pid) && !isDisabled) {
                checkbox.prop('checked', true);
                element.addClass("highlight-buy-now");

                // Optional: scroll đến sản phẩm đầu tiên được check
                if (!$('html').data('scrolled')) {
                    $('html').data('scrolled', true);
                    $('html, body').animate({
                        scrollTop: element.offset().top - 100
                    }, 100);
                }
            }
        });

        cart.ReRenderAmount();
        sessionStorage.removeItem(STORAGE_NAME.BuyNowItem);
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

        
        const $root = $('.list-voucher');
        if ($root.length === 0) return;

        // 1) Tạo 2 cụm bên trong .list-voucher nếu chưa có
        if ($root.find('.list-voucher-shipping').length === 0 || $root.find('.list-voucher-general').length === 0) {
            $root.html(`
        <div class="voucher-section space-y-4">
          <div class="voucher-group-shipping">
            <h4 class="font-semibold mb-2">Voucher vận chuyển</h4>
            <div class="list-voucher-shipping space-y-3"></div>
          </div>
          <div class="voucher-group-general mt-6">
            <h4 class="font-semibold mb-2">Voucher khác</h4>
            <div class="list-voucher-general space-y-3"></div>
          </div>
        </div>
        `);
        }

        const $ship = $root.find('.list-voucher-shipping');
        const $gen = $root.find('.list-voucher-general');

        // 2) Chuẩn hoá field
        const norm = (v) => ({
            id: typeof v.id !== 'undefined' ? v.id : v.Id,
            code: v.code,
            description: v.description,
            eDate: v.eDate, // "2025-09-15" hoặc ISO string
            price_sales: v.price_sales,
            unit: v.unit,
            rule_type: v.rule_type, // =1: vận chuyển; !=1: khác
            image: v.image,
            name: v.name
        });
        let items = (vouchers || []).map(norm);

        // 3) Lọc voucher còn hạn
        const now = new Date();
        items = items.filter(v => {
            if (!v.eDate) return true; // ko có hạn thì cho qua
            const expire = new Date(v.eDate);
            return expire >= now; // chỉ lấy còn hạn
        });

        // 4) Chia nhóm
        const shipping = items.filter(x => x.rule_type === 1);
        const general = items.filter(x => x.rule_type !== 1);


        // 4) Template item (radio theo nhóm để limit 1 lựa chọn/nhóm)
        const renderItem = (v, groupName) => {
            
            const unitText = v.unit === 'vnd' ? '₫' : '%';
            const imgSrc = v.image || '/assets/images/Voucher.png';
            const expireText = v.eDate ? v.eDate : '';
            return `
            <label class="item flex gap-3 items-center relative w-full p-3 border rounded-lg hover:bg-slate-50">

                


                <div class="space-y-2 w-full">
                    <div class="flex gap-3 items-start justify-between">
                        <h5 class="font-medium leading-5">${v.name || ''}</h5>
                        <div class="relative">
                            <input type="radio" name="${groupName}" class="radio-custom mt-1"
                                   data-id="${v.id}" data-code="${v.code}"
                                   data-description="${v.description || ''}"
                                   data-expire="${expireText}"
                                   data-discount="${v.price_sales || 0}"
                                   data-rule-type="${v.rule_type || ''}" />
                        </div>
                    </div>
                    <div class="flex gap-3 items-center justify-between text-sm text-slate-600">
                        <p>HSD: ${expireText}</p>
                        <p class="text-red-500">Giảm: ${global_service.Comma(v.price_sales || 0)} ${unitText}</p>
                         <a href="" class="all-pop" data-id="#dieukien-popup"  data-json='${JSON.stringify(v)}'>
                            <p class="text-red-500 item flex gap-1 items-center shrink-0">Điều kiện <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                        <path d="M8.51552 6.76552L4.76552 10.5155C4.73068 10.5504 4.68932 10.578 4.64379 10.5969C4.59827 10.6157 4.54948 10.6254 4.50021 10.6254C4.45094 10.6254 4.40214 10.6157 4.35662 10.5969C4.3111 10.578 4.26974 10.5504 4.2349 10.5155C4.20005 10.4807 4.17242 10.4393 4.15356 10.3938C4.1347 10.3483 4.125 10.2995 4.125 10.2502C4.125 10.2009 4.1347 10.1521 4.15356 10.1066C4.17242 10.0611 4.20005 10.0197 4.2349 9.9849L7.72005 6.50021L4.2349 3.01552C4.16453 2.94516 4.125 2.84972 4.125 2.75021C4.125 2.6507 4.16453 2.55526 4.2349 2.4849C4.30526 2.41453 4.4007 2.375 4.50021 2.375C4.59972 2.375 4.69516 2.41453 4.76552 2.4849L8.51552 6.2349C8.55039 6.26972 8.57805 6.31108 8.59692 6.35661C8.61579 6.40213 8.6255 6.45093 8.6255 6.50021C8.6255 6.54949 8.61579 6.59829 8.59692 6.64381C8.57805 6.68934 8.55039 6.73069 8.51552 6.76552Z" fill="#FF4169"></path>
                                    </svg></p>
                        </a>
                       
                    </div>
                </div>
            </label>
        `;
        };
        
        // 6) Render
        $ship.html(shipping.map(v => renderItem(v, 'voucher_shipping')).join(''));
        $gen.html(general.map(v => renderItem(v, 'voucher_general')).join(''));

        // 7) Ẩn tiêu đề nhóm nếu rỗng
        $root.find('.voucher-group-shipping').toggle(shipping.length > 0);
        $root.find('.voucher-group-general').toggle(general.length > 0);

        // 8) Nếu cả 2 đều rỗng thì show text fallback
        if (shipping.length === 0 && general.length === 0) {
            $root.html(`
      <div class="text-center text-slate-500 py-6">
        Không có voucher khả dụng
      </div>
    `);
        }

        // 9) Đồng bộ lựa chọn
        window.appliedVouchers = window.appliedVouchers || [];




    },
    // Lấy voucher đang chọn theo 2 nhóm radio
    GetSelectedVouchers: function () {

        const ship = $('input[name="voucher_shipping"]:checked');
        const gen = $('input[name="voucher_general"]:checked');

        const res = [];
        if (ship.length) {
            res.push({
                id: parseInt(ship.data('id'), 10),
                code: (ship.data('code') || '').trim(),
                rule_type: 1
            });
        }
        if (gen.length) {
            res.push({
                id: parseInt(gen.data('id'), 10),
                code: (gen.data('code') || '').trim(),
                rule_type: 0
            });
        }
        return res;
    },
    BuildVoucherContext: function () {

        let total_product_amount = 0;
        const bySupplier = {};

        // phí ship trước giảm (đang hiển thị)
        const shipStr = $('.total-cart .total-shipping-fee .pr').attr('data-price');
        const total_shipping_fee_before = parseInt(shipStr, 10) || 0;

        // duyệt sản phẩm được tick
        $('.table-addtocart .product').each(function () {

            const $el = $(this);
            if (!$el.find('.checkbox-cart').is(':checked')) return;

            const unit_price = parseFloat($el.attr('data-amount')) || 0;
            const quantity = parseInt($el.find('.quantity').val(), 10) || 0;
            const line_total = unit_price * quantity;

            const supplierId =
                $el.attr('data-supplier-id') ||                           // nếu sau này ta gắn ở div
                $el.find('.checkbox-cart').attr('data-supplier-id') ||    // đọc từ input
                $el.find('.checkbox-cart').data('supplierId') ||          // jQuery data() (camelCase)
                $el.attr('data-supplierid') ||                            // fallback nếu tên khác
                null;


            total_product_amount += line_total;

            const key = supplierId ?? 'unknown';
            bySupplier[key] = (bySupplier[key] || 0) + line_total;
        });

        const amount_by_supplier = Object.keys(bySupplier).map(k => ({
            supplier_id: k === 'unknown' ? null : k,
            total_amount: bySupplier[k]
        }));

        return {
            total_order_amount_before: total_product_amount,
            total_shipping_fee_before,
            amount_by_supplier
        };
    },
    // Preview tổng giảm khi có thể có 2 voucher (ship + general)
    PreviewSelectedVouchers: function () {

        const usr = global_service.CheckLogin();
        const token = usr ? usr.token : '';

        const ctx = cart.BuildVoucherContext();
        const selected = Array.isArray(window.appliedVouchers) ? window.appliedVouchers : [];

        // Không có voucher -> reset hiển thị
        if (selected.length === 0) {
            // tổng = tiền hàng + ship (chưa giảm)
            const final_amount = ctx.total_order_amount_before + ctx.total_shipping_fee_before;
            $('#voucher-popup').addClass('hidden');
            $('#discountSection').addClass('hidden');
            $('.total-final-amount .pr').text(global_service.Comma(final_amount) + ' đ').attr('data-price', final_amount);
            $('.total-shipping-fee .pr').text(global_service.Comma(ctx.total_shipping_fee_before || 0) + ' đ').attr('data-price', ctx.total_shipping_fee_before);
            return;
        }

        // Tách 2 voucher (nếu có)
        const shipVoucher = selected.find(v => v.rule_type === 1);
        const genVoucher = selected.find(v => v.rule_type !== 1);

        // Tạo các promise áp dụng
        const calls = [];
        if (genVoucher) {
            calls.push(cart.ApplyVoucher({
                voucher_name: genVoucher.code,
                token: token,
                total_order_amount_before: ctx.total_order_amount_before,
                total_shipping_fee_before: ctx.total_shipping_fee_before,
                amount_by_supplier: ctx.amount_by_supplier
            }));
        } else {
            calls.push($.Deferred().resolve({ is_success: true, data: { discount: 0, total_order_amount_after: ctx.total_order_amount_before } }).promise());
        }

        if (shipVoucher) {
            if (ctx.total_shipping_fee_before <= 0) {
                // 🚨 Nếu chưa có phí ship => báo lỗi
                $('#voucher-popup .popup-content').append(
                    '<p class="voucher-error text-red-500 mt-4">Chọn hình thức vận chuyển để áp dụng Voucher nha</p>'
                );
                // Hiện lại popup voucher để user fix
                $('#voucher-popup').removeClass('hidden');
                return; // ❌ stop ở đây luôn, không chạy xuống nữa
            }

            calls.push(cart.ApplyVoucher({
                voucher_name: shipVoucher.code,
                token: token,
                total_order_amount_before: ctx.total_order_amount_before,
                total_shipping_fee_before: ctx.total_shipping_fee_before,
                amount_by_supplier: ctx.amount_by_supplier
            }));
        } else {
            calls.push($.Deferred().resolve({
                is_success: true,
                data: { discount: 0, total_order_amount_after: ctx.total_order_amount_before }
            }).promise());
        }


        // Chờ cả hai kết quả
        $.when.apply($, calls).done(function (resGen, resShip) {

            // Nếu chỉ có 1 real call, jQuery sẽ truyền khác dạng — normalize lại:
            const resultGen = Array.isArray(resGen) ? resGen[0] : resGen;
            const resultShip = Array.isArray(resShip) ? resShip[0] : resShip;

            const okGen = resultGen && resultGen.is_success === true;
            const okShip = resultShip && resultShip.is_success === true;

            const discountGen = okGen ? (parseFloat(resultGen.data?.discount) || 0) : 0;
            const discountShip = okShip ? (parseFloat(resultShip.data?.discount) || 0) : 0;

            // tổng giảm = giảm trên hàng + giảm trên ship
            const totalDiscountOnGoods = discountGen;
            const totalDiscountOnShip = discountShip;

            const total_after_goods = Math.max(0, ctx.total_order_amount_before - totalDiscountOnGoods);
            const total_after_ship = Math.max(0, ctx.total_shipping_fee_before - totalDiscountOnShip);

            const final_amount = total_after_goods + total_after_ship;

            // Update UI
            cart.UpdateDiscountViewCombined({
                total_order_amount_before: ctx.total_order_amount_before,
                total_shipping_fee_before: ctx.total_shipping_fee_before,
                discount_goods: totalDiscountOnGoods,
                discount_shipping: total_after_ship,
                final_amount
            });

            // Ghi label
            const names = selected.map(v => v.code).join(', ');
            $('.group .font-medium').text('Đã chọn: ' + names);
            $('#discountCart').removeClass('hidden');

        }).fail(function () {
            Swal.fire({
                icon: 'error',
                title: 'Áp dụng voucher thất bại',
                text: 'Không thể kết nối máy chủ.'
            });
        });
    },
    UpdateDiscountViewCombined: function (data) {

        // Ẩn popup, show section giảm
        $('#voucher-popup').addClass('hidden');
        $('#discountSection').removeClass('hidden');

        // Tiền hàng trước giảm (không gồm ship)
        $('.total-before-discount').text(global_service.Comma(data.total_order_amount_before) + ' đ');

        // Check giảm giá hàng
        if (data.discount_goods && data.discount_goods > 0) {
            $('#discountSection').removeClass('hidden');
            $('.total-discount-amount').text('-' + global_service.Comma(data.discount_goods) + ' đ');
        } else {
            $('#discountSection').addClass('hidden');
        }

        // (Optional) nếu muốn show giảm ship riêng
        $('.total-shipping-fee .pr').text(global_service.Comma(data.discount_shipping || 0) + ' đ').attr('data-price', data.discount_shipping);

        // Tổng cuối
        $('.total-after-discount').text(global_service.Comma(data.final_amount) + ' đ');
        $('.total-final-amount .pr').text(global_service.Comma(data.final_amount) + ' đ')
            .attr('data-price', data.final_amount);
    },


    ApplyVoucher: function (request) {


        return $.when(global_service.POST(API_URL.ApplyVoucher, request));

    },

    //UpdateDiscountView: function (data) {
    //    
    //    $('#voucher-popup').addClass('hidden');
    //    $('#discountSection').removeClass('hidden');

    //    // 1. Giá trị ban đầu (tiền hàng trước giảm)
    //    $('.total-before-discount').text(global_service.Comma(data.total_order_amount_before) + ' đ');

    //    // 2. Số tiền giảm
    //    $('.total-discount-amount').text('-' + global_service.Comma(data.discount) + ' đ');

    //    // 3. Phí ship trước giảm (đang hiện trong DOM)
    //    const shipping_fee_str = $('.total-cart .total-shipping-fee .pr').attr('data-price');
    //    const shipping_fee_before = parseInt(shipping_fee_str) || 0;

    //    // Nếu API trả thêm discount_shipping (giảm ship), xử lý riêng
    //    const discount_shipping = data.discount_shipping ? parseInt(data.discount_shipping) : 0;

    //    // 4. Tính tổng cuối = (tiền hàng sau giảm) + (phí ship sau giảm)
    //    const total_after_goods = Math.max(0, (data.total_order_amount_after ?? 0));
    //    const total_after_ship = Math.max(0, shipping_fee_before - discount_shipping);
    //    const final_amount = total_after_goods + total_after_ship;

    //    // 5. Cập nhật hiển thị
    //    $('.total-after-discount').text(global_service.Comma(final_amount) + ' đ');
    //    $('.total-final-amount .pr').text(global_service.Comma(final_amount) + ' đ')
    //        .attr('data-price', final_amount);
    //},

    // Tính lại tiền hàng, phí ship, hiển thị tổng; nếu có voucher sẽ preview bằng 2 call /voucher/apply
    ReRenderAmount: function (loading_shipping = true) {

        let total_product_amount = 0;
        let hasPricedItem = false;

        $('.table-addtocart .product').each(function () {
            const el = $(this);
            const unit_price = parseFloat(el.attr('data-amount'));
            const quantity = parseInt(el.find('.quantity').val());
            const line_total = unit_price * quantity;

            el.find('.product-line-price, .product-line-price-mobile').html(global_service.Comma(line_total) + ' đ');

            if (el.find('.checkbox-cart').is(":checked")) {
                total_product_amount += line_total;
                if (unit_price > 0 && quantity > 0) {
                    hasPricedItem = true;
                }
            }
        });

        // Hiển thị tiền hàng (chưa giảm)
        $('.total-amount .pr').html(global_service.Comma(total_product_amount) + ' đ');

        // Tính phí ship
        let shipping_fee = $('.total-cart .total-shipping-fee .pr').attr('data-price');
        let shipping_fee_number = parseInt(shipping_fee) || 0;

        // Tạm thời tổng đơn hàng là tiền hàng + phí ship (nếu chưa có giảm giá)
        let total_temp = total_product_amount + shipping_fee_number;

        // Nếu có voucher
        if (appliedVoucher !== null) {
            const usr = global_service.CheckLogin();
            const token = usr ? usr.token : '';

            const request = {
                voucher_name: appliedVoucher.code,
                token: token,
                total_order_amount_before: total_product_amount // 👈 CHỈ TIỀN HÀNG
            };

            cart.ApplyVoucher(request); // nó sẽ gọi UpdateDiscountView
        } else {
            // Nếu chưa có voucher, hiển thị luôn tổng
            $('.total-final-amount .pr').html(global_service.Comma(total_temp) + ' đ');
        }

        // Xử lý nút xác nhận
        if (total_product_amount > 0 && hasPricedItem) {
            //if (loading_shipping) {
            //     cart.LoadShippingFee();
            //}
            $('.btn-confirm-cart').removeClass('button-disabled');
        } else {
            $('.btn-confirm-cart').addClass('button-disabled');
        }

        // return total_temp; ❌ sai vì trả cả tiền ship

        return total_product_amount; // ✅ chỉ trả về tiền hàng để dùng cho ApplyVoucher

    },


    //RemoveCartItem: function (data_id) {
    //    
    //    $("#lightbox-delete-cart").attr("data-cart-id", data_id).removeClass("hidden");

    //},
    ConfirmRemoveCartItem: function () {
        var data_id = $('#lightbox-delete-cart').attr('data-cart-id');
        var usr = global_service.CheckLogin();

        $('.table-addtocart .product').each(function (index, item) {
            var element = $(this);
            if (element.attr('data-cart-id') == data_id) {
                const supplierBox = element.closest('.supplier-box');
                element.remove();

                // ✅ Xoá box nếu rỗng
                if (supplierBox.find('.product').length === 0) {
                    supplierBox.remove();
                }
                return false;
            }
        });

        // ✅ Nếu không còn sản phẩm nào → hiển thị giỏ hàng trống
        if ($('.table-addtocart .product').length <= 0) {
            $('#main').html(HTML_CONSTANTS.Cart.Empty);
        }

        if (usr) {
            var request = {
                "id": data_id
            };
            $.when(
                global_service.POST(API_URL.CartDelete, request)
            ).done(function (result) {
                sessionStorage.removeItem(STORAGE_NAME.CartCount);
                global_service.LoadCartCount();
                cart.RenderCartNumberOfProduct();
                cart.ReRenderAmount();
            });
            $('#lightbox-delete-cart').removeClass('overlay-active');
        } else {
            // ❌ Nếu chưa login → xoá trong sessionStorage
            let cart2 = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];
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
        if (!$('#address-receivername').attr('data-id')?.trim()) {
            address_client.CreateOrUpdateAddress('')
            return;
        }
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
                var shipping_service_code = selected.attr('data-shipping-type')

                // ❌ Nếu =1 => báo lỗi, chặn confirm luôn
                if (shipping_service_code == "1" || !shipping_service_code) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Chưa chọn hình thức giao hàng',
                        text: 'Vui lòng chọn hình thức giao hàng để tiếp tục.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
                    });
                    return; // 🚫 stop ConfirmCart
                }


                delivery_detail = {
                    //"from_province_id": 1,
                    //"to_province_id": default_address.provinceid,
                    "shipping_service_code": shipping_service_code,
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
            // ✅ Voucher: lấy tất cả không giới hạn
            let selectedVouchers = []
            if (Array.isArray(window.appliedVouchers)) {
                selectedVouchers = window.appliedVouchers
            } else if (typeof appliedVoucher !== 'undefined' && appliedVoucher) {
                selectedVouchers = [appliedVoucher]
            }
            // ✅ Affiliate (utm_source + utm_medium)
            var utm_medium = UTILS.getWithExpiry(CONSTANTS.STORAGE.UtmMedium);
            var utm_source = UTILS.getWithExpiry(CONSTANTS.STORAGE.UtmSource);

            // Map sang 2 mảng id & code (lọc null)
            const voucherIds = selectedVouchers
                .map(v => parseInt(v?.id, 10))
                .filter(n => Number.isFinite(n));

            const voucherCodes = selectedVouchers
                .map(v => (v?.code || '').trim())
                .filter(s => s.length > 0);

            if (carts.length > 0) {
                // ✅ Chặn confirm nếu toàn sản phẩm 0đ hoặc quantity = 0


                var request = {
                    "carts": carts,
                    "token": usr.token,
                    "payment_type": $('input[name="payment_type"]:checked').val(),
                    "address": JSON.parse(sessionStorage.getItem(STORAGE_NAME.CartAddress)),
                    "address_id": $('#address-receivername').attr('data-id'),
                    "delivery_detail": delivery_detail,
                    "voucher_code": voucherCodes,
                    "voucher_id": voucherIds,
                    "utm_medium": utm_medium || "",
                    "utm_source": utm_source || ""

                    // 🆕 Thêm dòng này:
                    //"voucher_code": appliedVoucher?.code || null
                }
                $.when(
                    global_service.POST(API_URL.CartConfirm, request)
                ).done(function (result) {

                    if (result.is_success && result.data != undefined) {

                        request.result = result.data
                        sessionStorage.setItem(STORAGE_NAME.Order, JSON.stringify(request))
                        sessionStorage.removeItem(STORAGE_NAME.CartCount)
                        global_service.LoadCartCount()
                        // ✅ Ghi dấu hiệu đã tạo đơn
                        localStorage.setItem('just_created_order', 'true');

                        // 🆕 Bổ sung xử lý với VNPAY (payment_type == 3)
                        const selected_payment_type = parseInt(request.payment_type);
                        if (selected_payment_type === 3) {

                            const redirect_request = {

                                country: "vn",
                                id: result.data.id
                            };
                            $.post('/Order/VNPay', redirect_request).done(function (res) {

                                if (res.is_success && res.data) {
                                    window.location.href = res.data; // redirect sang trang VNPAY
                                } else {
                                    Swal.fire("Lỗi", "Không thể tạo link thanh toán VNPay", "error");
                                    $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
                                }
                            }).fail(function () {
                                Swal.fire("Lỗi", "Giao tiếp với cổng thanh toán thất bại", "error");
                                $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed').text(originalText);
                            });
                        } else {
                            window.location.href = '/order/payment/' + result.data.id; // phương thức khác
                        }

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

    // Hàm LoadShippingFee để tính phí giao hàng và xử lý phương thức vận chuyển
    LoadShippingFee: function () {

        var default_address = sessionStorage.getItem(STORAGE_NAME.CartAddress);

        if (!default_address) {
            cart.DisableAllShippingOptions();
            return;
        }

        var data_address = JSON.parse(default_address);
        var request = {
            "receiver_provinces_id": data_address.provinceId,
            "receiver_district_id": data_address.districtId,
            "carts": []
        };

        $('.shopping-cart .table-addtocart .product').each(function () {
            var cartEl = $(this);
            if (cartEl.find('.checkbox-cart').is(':checked')) {
                request.carts.push({
                    "_id": cartEl.attr('data-cart-id'),
                    "quanity": parseInt(cartEl.find('.number-input .quantity').val())
                });
            }
        });

        var result = global_service.POSTSynchorus(API_URL.CartGetShippingFee, request);
        if (!result.is_success || !Array.isArray(result.data)) {
            cart.DisableAllShippingOptions();
            return;
        }


        // Lặp từng supplier
        result.data.forEach(function (supplier) {

            var panel = $(`#hinhthucgiaohang .item[data-carrier-id="3"]`);
            var ul = panel.find('ul');
            ul.empty(); // Xoá li cũ

            supplier.services.forEach(function (service) {
                var li = $(`
            <li class="shipping-option" data-shipping-type="${service.service_code}" data-price="${service.total_amount}">
                <div class="gap-2 flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition box-select-ship">
                    <div>
                        <p class="font-normal name">${service.name}</p>
                        <p class="text-sm text-gray-500 des">Thời gian: ${service.time}</p>
                    </div>
                    <span class="text-[#FF3D71] whitespace-nowrap price">${global_service.Comma(service.total_amount)}đ</span>
                </div>
            </li>
        `);
                ul.append(li);
            });
        });

        // Kiểm tra có sản phẩm nào không
        var anyProductSelected = $('.shopping-cart .table-addtocart .product .checkbox-cart:checked').length > 0;

        // Nếu không có sản phẩm nào được chọn, chọn lại "Lấy tại cửa hàng"
        if (!anyProductSelected) {
            cart.SelectDefaultDeliveryOption();
            return;
        }

        // Kiểm tra lựa chọn trước đó trong sessionStorage
        var selectedShippingOption = sessionStorage.getItem("selectedShippingOption");

        if (selectedShippingOption) {
            var selectedOption = $(`#hinhthucgiaohang .shipping-option[data-shipping-type="${selectedShippingOption}"]`);

            if (selectedOption.length > 0 && !selectedOption.hasClass('disabled')) {
                // Nếu có lựa chọn hợp lệ, chọn nó
                selectedOption.addClass('active-delivery active bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-[3px] border-[#00CFE8]');
                selectedOption.closest('.item').find('.title').addClass('active');
                selectedOption.closest('.item').find('.answer').show();
                $('#delivery-shippingtype .select-delivery .tt').text(selectedOption.find('.name').text());
            } else {
                // Nếu lựa chọn trước đó không còn khả dụng, chuyển về "Lấy tại cửa hàng"
                cart.SelectDefaultDeliveryOption();
            }
        } else {
            // Nếu không có lựa chọn nào trong sessionStorage, chọn "Lấy tại cửa hàng"
            cart.SelectDefaultDeliveryOption();
        }

        // Xử lý việc vô hiệu hóa các tùy chọn không khả dụng
        $('#hinhthucgiaohang .shipping-option').each(function () {
            var li = $(this);
            if (li.hasClass('disabled')) {
                li.addClass('cursor-not-allowed');
                li.css('pointer-events', 'none');
            }
        });

        cart.RenderSelectionDelivery();
    },

    // Chọn lại mặc định "Lấy tại cửa hàng"
    SelectDefaultDeliveryOption: function () {
        // Đặt lại mặc định về 'Lấy tại cửa hàng'
        var defaultLi = $('#hinhthucgiaohang .item[data-carrier-id="1"] .shipping-option').first();
        defaultLi.addClass('active-delivery active bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-[3px] border-[#00CFE8]');
        $('#hinhthucgiaohang .item[data-carrier-id="1"] .title').addClass('active');
        $('#hinhthucgiaohang .item[data-carrier-id="1"] .answer').show();
        $('#delivery-shippingtype .select-delivery .tt').text(defaultLi.find('.name').text());
    },



    DisableAllShippingOptions: function () {

        let availableShipping = false;  // Kiểm tra xem có tùy chọn giao hàng nào khả dụng không

        $('#hinhthucgiaohang .item').each(function () {
            var el = $(this);
            el.find('li').each(function () {
                var li = $(this);
                li.attr('data-price', '0');
                if (li.attr('data-shipping-type') === '1') {
                    li.find('.price').html('0 đ');
                } else {
                    li.addClass('disabled');
                    li.css('color', 'lightgray');
                    li.find('.name, .des').css('color', 'lightgray');
                    li.find('.price').html('Không khả dụng');
                }
            });

            el.find('.title').removeClass('active');
            el.find('.answer').hide();
        });

        // Nếu không có tùy chọn nào khả dụng, chọn mặc định là "Lấy tại cửa hàng"
        var defaultPanel = $('#hinhthucgiaohang .item[data-carrier-id="1"]');  // Carrier-id = 1 cho "Lấy tại cửa hàng"
        var defaultLi = defaultPanel.find('li').first();
        defaultLi.removeClass('disabled');
        defaultLi.find('.price').html('0 đ');  // Giả sử giao hàng tại cửa hàng miễn phí
        defaultPanel.find('.title').addClass('active');
        defaultPanel.find('.answer').show();
        defaultLi.addClass('active-delivery active');

        cart.RenderSelectionDelivery();
    },

    // Hàm RenderSelectionDelivery để cập nhật giao diện chọn phương thức vận chuyển
    RenderSelectionDelivery: function () {
        var selected = $('#hinhthucgiaohang .active-delivery').first();

        if (!selected || selected.attr('data-shipping-type') == undefined || selected.closest('.item').length <= 0 || selected.hasClass('disabled')) {
            var defaultPanel = $('#hinhthucgiaohang .item[data-carrier-id="1"]');  // “Lấy tại cửa hàng”
            selected = defaultPanel.find('li').first();
            selected.addClass('active-delivery active');
            defaultPanel.find('.title').addClass('active');
            defaultPanel.find('.answer').show();
        }

        if (String(selected.attr('data-shipping-type')).trim() == '1') {
            $('#delivery-carrier').hide();
        } else {
            $('#delivery-carrier').show();
        }

        // UI title
        $('#delivery-shippingtype .select-delivery .tt').text(selected.find('.name').html());
        $('#delivery-carrier .select-delivery .tt').text(selected.closest('.item').find('h3').html());

        // ✅ Giá ship của phương án mới (TRƯỚC giảm)
        var shipPriceBase = parseInt(selected.attr('data-price')) || 0;

        // ✅ Gán cả base & current price (current = base khi vừa chọn)
        const $ship = $('.total-cart .total-shipping-fee .pr');
        $ship.attr('data-base-price', shipPriceBase);   // giữ base để tính voucher
        $ship.attr('data-price', shipPriceBase);        // giá đang hiển thị (sẽ bị giảm sau preview)
        $ship.html(global_service.Comma(shipPriceBase) + ' đ');

        // ❗ Quan trọng: sau khi đổi hãng vận chuyển → áp lại voucher theo base mới
        if (typeof cart.PreviewSelectedVouchers === 'function') {
            cart.PreviewSelectedVouchers();
        } else {
            // fallback nếu chưa có preview
            cart.ReRenderAmount(false);
        }
    },
    BuildVoucherContext: function () {
        let total_product_amount = 0;
        const bySupplier = {};

        // ✅ Luôn ưu tiên base fee (trước giảm)
        const $ship = $('.total-cart .total-shipping-fee .pr');
        const shipBaseStr = $ship.attr('data-base-price');
        const shipCurStr = $ship.attr('data-price');
        const total_shipping_fee_before = parseInt(shipBaseStr, 10) || parseInt(shipCurStr, 10) || 0;

        $('.table-addtocart .product').each(function () {
            const $el = $(this);
            if (!$el.find('.checkbox-cart').is(':checked')) return;

            const unit_price = parseFloat($el.attr('data-amount')) || 0;
            const quantity = parseInt($el.find('.quantity').val(), 10) || 0;
            const line_total = unit_price * quantity;

            const supplierId =
                $el.attr('data-supplier-id') ||
                $el.find('.checkbox-cart').attr('data-supplier-id') ||
                $el.find('.checkbox-cart').data('supplierId') ||
                $el.attr('data-supplierid') ||
                null;

            total_product_amount += line_total;
            const key = supplierId ?? 'unknown';
            bySupplier[key] = (bySupplier[key] || 0) + line_total;
        });

        const amount_by_supplier = Object.keys(bySupplier).map(k => ({
            supplier_id: k === 'unknown' ? null : k,
            total_amount: bySupplier[k]
        }));

        return {
            total_order_amount_before: total_product_amount,
            total_shipping_fee_before,      // <-- luôn là base
            amount_by_supplier
        };
    },





}