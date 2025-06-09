$(document).ready(function () {

    product_detail.Initialization()
   


})
var product_detail = {
    Initialization: function () {
        //--Init:
        $('.coupon-list').remove()
        $('.write-review').remove()
        $('#product-alike').remove()


        $('#thanhcong').removeClass('overlay-active')
        product_detail.ShowLoading()
        sessionStorage.removeItem(STORAGE_NAME.ProductDetail)

        sessionStorage.removeItem(STORAGE_NAME.SubProduct)
        product_detail.Detail()


        product_detail.DynamicBind()
        global_service.LoadHomeProductGrid($('#combo-discount .list-product'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
        $('#thanhcong .lightbox-description').html('Thêm sản phẩm vào giỏ hàng thành công')
        $('#thanhcong .btn-close').addClass('btn-go-to-cart')
        $('#thanhcong .btn-close').removeClass('btn-close')
        $('#thanhcong .btn-go-to-cart').html('Xem giỏ hàng')
        $('#thanhcong .btn-go-to-cart').hide()
        $('#thanhcong .popup').css('width', '500px')
        $('#thanhcong .popup').css('margin-top', '15%')
        $('#thanhcong .popup').css('text-align', '-webkit-center')

    },
    DynamicBind: function () {
        $("body").on('click', ".attribute-detail", function () {

            var element = $(this);
            if (element.hasClass('disabled')) return;

            var wrapper = element.closest('.box-info-details');
            var selectedId = element.data('id');
            var attrLevel = element.closest('.attributes').data('level');

            // Bỏ active trong block hiện tại
            wrapper.find('.attribute-detail').removeClass('active');
            element.addClass('active');

            // 🔄 Đồng bộ sang các block khác
            $('.box-info-details').not(wrapper).each(function () {
                var otherWrapper = $(this);
                var sameAttr = otherWrapper.find('.attributes[data-level="' + attrLevel + '"] .attribute-detail');
                sameAttr.removeClass('active');
                sameAttr.filter('[data-id="' + selectedId + '"]').addClass('active');
            });

            var product = product_detail.GetProductDetailSession();
            if (product) {
                product_detail.RenderChangedAttributeSelected(product, element);
                product_detail.RenderBuyNowButton(false);
            } else {
                window.location.reload();
            }
        });

        //$("body").on('click', ".attribute-detail", function () {
        //    product_detail.RenderBuyNowButton()
        //});
        $("body").on('click', ".add-cart", function () {

            product_detail.AddToCart()

        });
        $("body").on('click', ".btn-favorite-toggle", function () {
           
            product_detail.ToggleFavorite($(this));

        });
        $("body").on('click', ".buy-now", function () {

            product_detail.BuyNow()

        });
        $("body").on('click', ".btn-go-to-cart", function () {
            window.location.href = '/cart'

        });
    },
    ToggleFavorite: function ($el) {
       

        let productId = $el.data("product-id");

        // Nếu không có data-product-id, giả định đang ở trang chi tiết sản phẩm
        if (!productId) {
            var product = product_detail.GetSubProductSessionByAttributeSelected();

            if (product == undefined) {
                var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail);
                if (json && json.trim() !== '') {
                    product = JSON.parse(json).product_main;
                }
            }

            if (!product) {
                window.location.reload(); // reload nếu không tìm thấy
                return;
            }

            productId = product._id;
        }

        const usr = global_service.CheckLogin(); // kiểm tra đăng nhập
        if (!usr) {
            $('.mainheader .client-login').click();
            return;
        }

        const isFavourite = $el.hasClass("active");

        const request = {
            product_id: productId,
            token: usr.token
        };

        const apiUrl = isFavourite ? API_URL.FavouriteDelete : API_URL.AddToFavourite;

        $.when(global_service.POST(apiUrl, request)).done(function (result) {
            if (result.is_success) {
                const isInFavouriteListPage = $el.closest('#favourite').length > 0;

                if (isInFavouriteListPage) {
                    // ✅ Nếu ở danh sách yêu thích → xóa DOM
                    $el.closest('.bg-white').remove();

                    if ($('#favourite .bg-white').length === 0) {
                        $('#favourite').html('<p class="text-gray-600 p-4">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>');
                    }
                } else {
                    // ✅ Toggle trái tim
                    $el.toggleClass("active");

                    // ✅ Nếu có khối hiển thị số lượt thích → cập nhật
                    const $countText = $('.section-details-product .favourite-count');
                    if ($countText.length > 0) {
                        let current = parseInt(($countText.text().match(/\d+/) || [0])[0]);

                        if (isFavourite) {
                            current = Math.max(0, current - 1);
                        } else {
                            current += 1;
                        }

                        $countText.text(current > 0 ? `Đã thích (${global_service.Comma(current)})` : 'Đã thích');
                    }
                }

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: isFavourite ? 'info' : 'success',
                    title: isFavourite ? 'Đã xóa khỏi Yêu Thích' : 'Đã thêm vào Yêu Thích!',
                    showConfirmButton: false,
                    timer: 1000
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Thao tác không thành công, vui lòng thử lại sau!',
                });
            }
        });
    },
    Detail: function () {
        debugger
        const usr = global_service.CheckLogin(); // kiểm tra đăng nhập
        $('#skeleton-loading').show();
        $('.product-details-section').hide();

        var code = $('.section-details-product').attr('data-code')
        if (code == undefined || code.trim() == '')
            window.location.href = '/error'
        var request = {
            "id": code,
            "token": usr?.token || null // 👈 xử lý an toàn
        }
        $.when(
            global_service.POST(API_URL.ProductDetail, request)
        ).done(function (result) {
            debugger
            if (result.is_success && result.data && result.data.product_main) {
                sessionStorage.setItem(STORAGE_NAME.ProductDetail, JSON.stringify(result.data))
                sessionStorage.setItem(STORAGE_NAME.SubProduct, JSON.stringify(result.data.product_sub))
                product_detail.RenderDetail(result.data.product_main, result.data.product_sub, result.cert, result.favourite, result.buywith)
            }
            else {
                window.location.href = '/Home/NotFound'
            }
        })
    },
    RenderDetail: function (product, product_sub, cert, favourite, buywith) {
        debugger
        this.RenderGallery(product);
        this.RenderTitle(product);
        this.RenderRating(product);
        this.RenderPrice(product, product_sub);
        this.RenderSpecification(product);
        this.RenderAttributes(product, product_sub);
        this.RenderBuyWithProducts(buywith);

        // ✅ Tự động chọn thuộc tính đầu tiên nếu có
        setTimeout(function () {
            var product = product_detail.GetProductDetailSession();
            if (!product) return;

            var autoTriggered = false;

            $('.box-info-details .attributes').each(function () {
                var $group = $(this);
                var $firstAttr = $group.find('.attribute-detail:not(.disabled)').first();

                if ($firstAttr.length > 0 && !$firstAttr.hasClass('active')) {
                    $firstAttr.trigger('click'); // ✨ Giả lập người dùng click
                    autoTriggered = true;
                }
            });

            // Nếu không có gì được trigger click, gọi thủ công
            if (!autoTriggered) {
                product_detail.RenderChangedAttributeSelected(product, $('.attribute-detail.active').last());
                product_detail.RenderBuyNowButton(false);
            }
        }, 100);
        // ✅ Hiển thị trái tim yêu thích
        if (favourite?.is_favourite) {
            $('.btn-favorite-toggle').addClass('active');
        } else {
            $('.btn-favorite-toggle').removeClass('active');
        }
        // ✅ Cập nhật số lượt thích (nếu có)
        const count = favourite?.count || 0;
        $('.section-details-product .favourite-count').text(
            count > 0 ? `Đã thích (${global_service.Comma(count)})` : 'Đã thích'
        );

        this.RenderCertImages(cert);
        this.RenderDescriptions(product);
        this.RenderBuyNowButton(true);

        this.RenderSavedProductDetailAttributeSelected();
        this.RemoveLoading();

        $('#skeleton-loading').hide();
        $('.product-details-section').show();
    },
    RenderAttributes: function (product, product_sub) {
        let html = '', html2 = '';
        let total_stock = product.quanity_of_stock || 0;

        if (product_sub?.length > 0) {
            $(product.attributes).each((_, attribute) => {
                const attr_detail = product.attributes_detail.filter(obj => obj.attribute_id === attribute._id);
                let html_item = '';

                attr_detail.forEach(attribute_detail => {
                    const img_src = global_service.CorrectImage(attribute_detail.img);
                    html_item += HTML_CONSTANTS.Detail.Tr_Attributes_Td_li
                        .replaceAll('{active}', '')
                        .replaceAll('{src}', attribute_detail.img ? `<img src="${img_src}" />` : '')
                        .replaceAll('{name}', attribute_detail.name);
                });

                const block = HTML_CONSTANTS.Detail.Tr_Attributes
                    .replaceAll('{level}', attribute._id)
                    .replaceAll('{name}', attribute.name)
                    .replaceAll('{li}', html_item);

                html += block;
                html2 += block;
            });

            total_stock = product_sub.reduce((n, { amount }) => n + amount, 0);
        }

        html += HTML_CONSTANTS.Detail.Tr_Quanity.replaceAll('{stock}', global_service.Comma(total_stock));
        $('.box-info-details tbody').html(html);
        $('.box-attribute').html(html2);
    },
    RenderBuyWithProducts: function (buywith) {
        debugger
        const $container = $('.product-buywith-container');
        const $section = $('.buywidth');
        $container.html('');

        // Nếu dữ liệu trống → ẩn luôn section
        if (!buywith || !Array.isArray(buywith) || buywith.length === 0) {
            $section.hide(); // Ẩn nguyên khối
            return;
        }
        $section.show(); // Có dữ liệu → show khối

        buywith.slice(0, 4).forEach((item, index) => {
            const plusIcon = (index !== 0)
                ? `<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                   <path d="M21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H12.75V20.25C12.75 20.4489 12.671 20.6397 12.5303 20.7803C12.3897 20.921 12.1989 21 12 21C11.8011 21 11.6103 20.921 11.4697 20.7803C11.329 20.6397 11.25 20.4489 11.25 20.25V12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H11.25V3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3C12.1989 3 12.3897 3.07902 12.5303 3.21967C12.671 3.36032 12.75 3.55109 12.75 3.75V11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12Z"
                       fill="#033256" />
               </svg>`
                : '';

            const html = `
            ${plusIcon}
          <div class="w-full md:w-[200px] bg-white rounded p-2 flex flex-col justify-between min-h-[330px]">

                <div class="relative aspect-[1/1] overflow-hidden rounded-lg">
                    <img src="${global_service.CorrectImage(item.avatar)}" alt="${item.name}"
                         class="absolute inset-0 w-full h-full object-cover" />
                </div>
                <label class="inline-flex items-center cursor-pointer mt-2">
                    <input type="checkbox" class="sr-only peer sp-muacung-checkbox"
                           data-id="${item._id}" data-name="${item.name}" data-price="${item.amount}" />
                    <div class="w-5 h-5 shrink-0 rounded-full bg-purple-200 peer-checked:bg-purple-600 relative transition-colors">
                        <span class="absolute inset-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                         <path d="M14.2806 8.2806L9.0306 13.5306C8.961 13.6004 8.8783 13.6557 8.7872 13.6934C8.6962 13.7312 8.5986 13.7506 8.5 13.7506C8.4014 13.7506 8.3038 13.7312 8.2128 13.6934C8.1218 13.6557 8.039 13.6004 7.96938 13.5306L5.71938 11.2806C5.57865 11.1399 5.49959 10.949 5.49959 10.75C5.49959 10.551 5.57865 10.3601 5.71938 10.2194C5.86011 10.0786 6.05098 9.9996 6.25 9.9996C6.44903 9.9996 6.6399 10.0786 6.78063 10.2194L8.5 11.9397L13.2194 7.21937C13.2891 7.14969 13.3718 7.09442 13.4628 7.0567C13.5539 7.01899 13.6515 6.99958 13.75 6.99958C13.8486 6.99958 13.9461 7.01899 14.0372 7.0567C14.1282 7.09442 14.2109 7.14969 14.2806 7.21937C14.3503 7.28906 14.4056 7.37178 14.4433 7.46283C14.481 7.55387 14.5004 7.65145 14.5004 7.75C14.5004 7.84855 14.481 7.94613 14.4433 8.0372C14.4056 8.1282 14.3503 8.2109 14.2806 8.2806Z"
                               fill="white" />
                     </svg>

                        </span>
                    </div>
                    <span class="ml-2 text-sm text-gray-700">${item.name}</span>
                </label>
                <p class="text-red-600 font-semibold mt-1 text-center">${global_service.Comma(item.amount)} đ</p>
            </div>
        `;

            $container.append(html);
        });

        $('.section-buywith-products').fadeIn();

        // ✅ Xử lý checkbox và tổng tiền sau khi render
        buyTogether.selectedItems = [];
        buyTogether.total = 0;
        const $btnBuy = $('.btn-buy-together');
        $container.find('.sp-muacung-checkbox').on('change', function () {
            const id = $(this).data('id');
            const price = parseInt($(this).data('price'));
            const name = $(this).data('name');

            if (this.checked) {
                buyTogether.selectedItems.push({ id, name, price });
            } else {
                buyTogether.selectedItems = buyTogether.selectedItems.filter(p => p.id !== id);
            }

            buyTogether.total = buyTogether.selectedItems.reduce((sum, p) => sum + p.price, 0);
            buyTogether.updateTotal();
            // 👉 Enable nút nếu có ít nhất 1 sản phẩm được chọn
            if (buyTogether.selectedItems.length > 0) {
                $btnBuy.prop('disabled', false);
            } else {
                $btnBuy.prop('disabled', true);
            }
        });

        // ✅ Nút chọn mua
        $('.btn-buy-together').off('click').on('click', function () {
            debugger
            buyTogether.submit();
        });
    },
    RenderPrice: function (product, product_sub) {
        debugger
        let priceHtml = '';
        let isFlashSale = product.amount_after_flashsale != null &&
            product.amount_after_flashsale > 0 &&
            product.flash_sale_todate != null &&
            new Date(product.flash_sale_todate) > new Date();

        let finalPrice = product.amount; // default fallback

        // ⚡ Nếu có Flash Sale → hiển thị giá Flash Sale
        if (isFlashSale) {
            finalPrice = product.amount_after_flashsale;
            priceHtml = `<span class="text-red-600 font-bold">${global_service.Comma(finalPrice)} đ</span>`;
            $('#price-old').html(global_service.Comma(product.amount)).closest('.price-old').show(); // show giá cũ gạch ngang
        }
        // 👕 Nếu có product_sub (nhiều phân loại) → hiển thị khoảng giá
        else if (product_sub?.length > 0) {
            const [minAmount, maxAmount] = product_sub.reduce(([min, max], p) => [
                Math.min(min, p.amount),
                Math.max(max, p.amount)
            ], [Infinity, -Infinity]);

            finalPrice = minAmount;
            priceHtml = (minAmount === maxAmount)
                ? global_service.Comma(minAmount) + ' đ'
                : `${global_service.Comma(minAmount)} đ - ${global_service.Comma(maxAmount)} đ`;

            $('#price-old').closest('.price-old').hide(); // không hiển thị giá cũ
        }
        // ✅ Không Flash Sale, không phân loại → giá đơn
        else {
            finalPrice = product.amount;
            priceHtml = global_service.Comma(finalPrice) + ' đ';

            if (product.discount > 0) {
                $('#price-old').html(global_service.Comma(product.amount + product.discount)).closest('.price-old').show();
            } else {
                $('#price-old').closest('.price-old').hide();
            }
        }

        $('.section-details-product .price').html(priceHtml);
    },


    RenderGallery: function (product) {
        let html = '', html_thumb = '';

        (product.videos || []).forEach(item => {
            const img_src = global_service.CorrectImage(item);
            html += HTML_CONSTANTS.Detail.Videos.replaceAll('{src}', img_src);
            html_thumb += HTML_CONSTANTS.Detail.ThumbnailVideos.replaceAll('{src}', img_src);
        });

        const avatar = global_service.CorrectImage(product.avatar);
        html += HTML_CONSTANTS.Detail.Images.replaceAll('{src}', avatar);
        html_thumb += HTML_CONSTANTS.Detail.ThumbnailImages.replaceAll('{src}', avatar);

        (product.images || []).forEach(item => {
            const img_src = global_service.CorrectImage(item);
            html += HTML_CONSTANTS.Detail.Images.replaceAll('{src}', img_src);
            html_thumb += HTML_CONSTANTS.Detail.ThumbnailImages.replaceAll('{src}', img_src);
        });

        $('.thumb-big .swiper-wrapper').html(html);
        $('.thumb-small .swiper-wrapper').html(html_thumb);

        const swiperSmallThumb = new Swiper(".thumb-small", {
            spaceBetween: 8,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });

        new Swiper(".thumb-big", {
            spaceBetween: 15,
            navigation: false,
            thumbs: {
                swiper: swiperSmallThumb,
            },
        });

        lightGallery($('.thumb-big .swiper-wrapper')[0], {
            plugins: [lgVideo],
            videojs: true,
            speed: 500,
            thumbnail: true,
        });
    },

    RenderTitle: function (product) {
        $('.section-details-product .name-product').html(product.name);
    },

    RenderRating: function (product) {
        const rating = product.rating || 0;
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const maxStars = 5;
        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) starsHtml += HTML_CONSTANTS.Detail.Star2.Full;
        if (halfStar) starsHtml += HTML_CONSTANTS.Detail.Star2.Half;
        for (let i = fullStars + (halfStar ? 1 : 0); i < maxStars; i++) starsHtml += HTML_CONSTANTS.Detail.Star2.Empty;

        starsHtml += `<span class="text-red-500">${rating}</span>`;
        $('.box-review .review').html(starsHtml);
        $('.box-review .total-review').text(`${product.review_count || 0} đánh giá`);
        $('.box-review .total-sold').text(`${product.total_sold || 0} đã bán`);
    },

   

    RenderSpecification: function (product) {
        if (product.detail_specification?.length > 0) {
            const rows = product.detail_specification.map(item =>
                `<tr><td>${item.key}</td><td>${item.value}</td></tr>`
            ).join('');
            $('#thong-tin-san-pham tbody').html(rows);
        } else {
            $('#thong-tin-san-pham').remove();
        }
    },

    

    RenderCertImages: function (cert) {
        const render = (list) => {
            if (!list || list.length === 0) return '<p class="text-slate-500 text-sm">Chưa có dữ liệu chứng nhận</p>';
            return list.map(src => `<img src="${global_service.CorrectImage(src)}" alt="Chứng nhận" class="mt-2 object-contain max-w-2/3 w-full h-auto m-auto" />`).join('');
        };

        $('#cert-root-product').html(render(cert?.root_product));
        $('#cert-product').html(render(cert?.product));
        $('#cert-supply').html(render(cert?.supply));
        $('#cert-confirm').html(render(cert?.confirm));
    },

    RenderDescriptions: function (product) {
        if (product.description) {
            $('.section-description-product .box-des p').html(product.description.replaceAll('\n', '<br />'));
            $('.mo-ta').show();
        } else {
            $('#mo-ta').remove();
            $('.mo-ta').hide();
        }

        if (product.description_ingredients) {
            $('#thanh-phan ul').html(product.description_ingredients);
            $('.thanh-phan').show();
        } else {
            $('#thanh-phan').remove();
            $('.thanh-phan').hide();
        }

        if (product.description_effect) {
            $('#cong-dung').append(`<p class="text-gray-700">${product.description_effect}</p>`);
            $('.cong-dung').show();
        } else {
            $('#cong-dung').remove();
            $('.cong-dung').hide();
        }

        if (product.description_usepolicy) {
            $('#cach-dung').append(`<p class="text-gray-700">${product.description_usepolicy}</p>`);
            $('.cach-dung').show();
        } else {
            $('#cach-dung').remove();
            $('.cach-dung').hide();
        }
    },
    GetProductDetailSession: function () {
        var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
        if (json != undefined && json.trim() != '') {
            return JSON.parse(json)
        }
        return undefined
    },
    GetSubProductSessionByAttributeSelected: function () {
       debugger

        var json = sessionStorage.getItem(STORAGE_NAME.SubProduct)
        if (json != undefined && json.trim() != '') {
            var list = JSON.parse(json)
            var sub_list = list
            var options = []
            $('.box-info-details tbody .attributes').each(function (index, item) {
                var element = $(this)
                var value = element.find('.box-tag').find('.active').attr('data-id')
                var level = element.attr('data-level')
                options.push({
                    _id: level,
                    name: value
                })

            })
            $(options).each(function (index, item) {

                sub_list = sub_list.filter(({ variation_detail }) =>
                    variation_detail.some(v => v._id == item._id && v.name == item.name)
                )


            })
            return sub_list[0]
        }
        return undefined
    },
    RenderChangedAttributeSelected: function (product, clickedElement) {
        var options = [];

        var wrapper = clickedElement.closest('.box-info-details');

        wrapper.find('.attributes').each(function () {
            var element = $(this);
            var active = element.find('.box-tag .active');
            var value = active.data('id');
            var level = element.data('level');

            if (value) {
                options.push({ _id: level, name: value });
            }
        });

        var json = sessionStorage.getItem("SubProduct");
        if (json && json.trim() !== '') {
            var list = JSON.parse(json);
            var variation = list.filter(obj =>
                product_detail.Compare2Array(obj.variation_detail, options)
            );

            if (variation && variation.length > 0) {
                const selected = variation[0];

                // ✅ Flash Sale check
                const now = new Date();
                const flashSaleToDate = selected.flash_sale_todate ? new Date(selected.flash_sale_todate) : null;
                const isFlashSale = selected.amount_after_flashsale &&
                    selected.amount_after_flashsale > 0 &&
                    flashSaleToDate &&
                    flashSaleToDate > now;

                const displayPrice = isFlashSale ? selected.amount_after_flashsale : selected.amount;

                // ✅ Cập nhật UI
                $('.box-info-details').each(function () {
                    $('.section-details-product .price').html(global_service.Comma(displayPrice));
                    $('.box-info-details .box-detail-stock .soluong').html(global_service.Comma(selected.quanity_of_stock) + ' sản phẩm có sẵn');

                    // ✅ Gạch giá cũ nếu Flash Sale
                    if (isFlashSale) {
                        $('#price-old').html(global_service.Comma(selected.amount));
                        $('#price-old').closest('.price-old').show();
                    } else {
                        $('#price-old').closest('.price-old').hide();
                    }
                });
            }
        }
    },


    RenderBuyNowButton: function () {

        var no_select_all = false
        if ($('.box-info-details tbody .attributes').length <= 0) {

        }
        else {
            $('.box-info-details tbody .attributes').each(function (index, item) {
                var element = $(this)
                var li_active = element.find('.box-tag').find('.active')
                if (li_active.length <= 0) {
                    no_select_all = true
                    return false
                }
            })
        }
        if (no_select_all) {
            $('.add-cart').prop('disabled', true)
            $('.buy-now').prop('disabled', true)
            $('.add-cart').addClass('button-disabled')
            $('.buy-now').addClass('button-disabled')

        } else {
            $('.add-cart').prop('disabled', false)
            $('.buy-now').prop('disabled', false)
            $('.add-cart').removeClass('button-disabled')
            $('.buy-now').removeClass('button-disabled')
        }
    },

    AddToCart: function (buy_now = false) {
        debugger

        var product = product_detail.GetSubProductSessionByAttributeSelected();

        if (product == undefined) {
            var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail);
            if (json && json.trim() !== '') {
                product = JSON.parse(json).product_main;
            }
        }

       

        var quantity = parseInt($('.box-detail-stock .quantity').val()) || 1;
        quantity = Math.max(1, Math.min(999, quantity)); // Chặn từ JS
        if (!product) {
            window.location.reload(); // reload để tránh lỗi không có dữ liệu
        }
        var usr = global_service.CheckLogin(); // kiểm tra đăng nhập

        var cartItem = {
            product_id: product._id,
            quanity: quantity
        };

        if (usr) {
            // Nếu đã login → gọi API lưu giỏ hàng
            var request = {
                ...cartItem,
                token: usr.token
            };

            $.when(global_service.POST(API_URL.AddToCart, request)).done(function (result) {
                if (result.is_success && result.data) {
                    debugger
                    sessionStorage.removeItem(STORAGE_NAME.BuyNowItem);
                    global_service.LoadCartCount();
                    //product_detail.SuccessAddToCart();
                    // 💥 Show toast thành công
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Đã thêm vào giỏ hàng!',
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
        }
        else {
            // ✅ Nếu chưa login → lưu thêm dữ liệu sản phẩm
            cartItem.product = {
                _id: product._id,
                name: product.name,
                amount: product.amount,
                status: product.status,
                supplier_status: product.supplier_status,
                avatar: product.avatar,
                variation_detail: product.variation_detail || [],
                attributes: product.attributes || [],
                attributes_detail: product.attributes_detail || []
            };
            product_detail.SaveProductDetailAttributeSelected()
            //$('.mainheader .client-login').click()
            //return
            product_detail.SaveCartItemToSession(cartItem);
            global_service.LoadCartCount();
            // 💥 Show toast thành công
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Đã thêm vào giỏ hàng!',
                showConfirmButton: false,
                timer: 1000
            });
        }

    },
    SaveCartItemToSession: function (cartItem) {
        debugger
        let cart = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];
        let index = cart.findIndex(x => x.product_id === cartItem.product_id);

        if (index >= 0) {
            cart[index].quanity += cartItem.quanity;
        } else {
            cart.push(cartItem);
        }
       
        sessionStorage.setItem(STORAGE_NAME.Cart, JSON.stringify(cart));
    },




    BuyNow: function () {
       debugger
        var product = product_detail.GetSubProductSessionByAttributeSelected()
        if (product == undefined) {
            var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
            if (json != undefined && json.trim() != '') {
                product = JSON.parse(json).product_main

            }
        }
        if (product == undefined) {
            window.location.reload()
        }
        var usr = global_service.CheckLogin()
        var token = ''
        var quantity = parseInt($('.box-detail-stock .quantity').val()) || 1;
        quantity = Math.max(1, Math.min(999, quantity)); // Cũng chặn ở đây luôn
        if (usr) {
            token = usr.token
            var request = {
                "product_id": product._id,
                "quanity": quantity,
                "token": token
            }
            $.when(
                global_service.POST(API_URL.AddToCart, request)
            ).done(function (result) {
                debugger
                if (result.is_success && result.data) {

                    sessionStorage.setItem(STORAGE_NAME.BuyNowItem, JSON.stringify(request))
                    window.location.href = '/cart'
                }
            })
        }
        else {
            $('.mainheader .client-login').click()
            product_detail.SaveProductDetailAttributeSelected()
            return
        }

    },
    SaveProductDetailAttributeSelected: function () {

        var selected = {
            attributes: [],
            quanity: 1
        }
        $('.box-info-details .attributes').each(function (index_detail, attribute_detail) {
            var tr_attributes = $(this)
            if (tr_attributes.find('.active').length > 0) {
                selected.attributes.push({
                    "level": tr_attributes.attr('data-level'),
                    "data": tr_attributes.find('.active').attr('data-id')
                })
            }
        })
        selected.quanity = $('.quantity').val()
        sessionStorage.setItem(STORAGE_NAME.ProductDetailSelected, JSON.stringify(selected))

    },
    RenderSavedProductDetailAttributeSelected: function () {
        var selected = sessionStorage.getItem(STORAGE_NAME.ProductDetailSelected)
        if (selected) {
            var data = JSON.parse(selected)
            if (data != undefined) {
                if (data.attributes != undefined && data.attributes.length > 0) {
                    $('.box-info-details .attributes').each(function (index_detail, attribute_detail) {
                        var tr_attributes = $(this)
                        var level = tr_attributes.attr('data-level')
                        var selected_value = data.attributes.filter(obj => {
                            return obj.level == level
                        })
                        if (selected_value.length > 0) {
                            tr_attributes.find('li').each(function (index_detail, attribute_detail) {
                                var li_attribute = $(this)
                                if (li_attribute.attr('data-id') == selected_value[0].data) {
                                    li_attribute.trigger('click')
                                    return false
                                }

                            })
                        }

                    })
                }
                if (data.quanity != undefined && data.quanity.trim() != '') {
                    $('.quantity').val(data.quanity)
                }
            }
            sessionStorage.removeItem(STORAGE_NAME.ProductDetailSelected)
        }


    },
    Compare2Array: function (arr1, arr2) {
        if (arr1.length !== arr2.length) return false;

        return arr1.every(item1 =>
            arr2.some(item2 =>
                String(item1._id) === String(item2._id) &&
                String(item1.name).toLowerCase().trim() === String(item2.name).toLowerCase().trim()
            )
        );
    },

    ShowLoading: function () {
        $('.section-details-product').addClass('placeholder')
        $('.Icon').addClass('placeholder')
        $('.check').addClass('placeholder')
        $('.box-price').addClass('placeholder')


        $('.section-description-product').addClass('placeholder')
        $('.section-category').addClass('placeholder')
        $('.gallery-product .swiper-wrapper').addClass('placeholder')
        $('.gallery-product swiper-slide').addClass('placeholder')
        $('.box-name-product').addClass('placeholder')
        $('.price').addClass('placeholder')
        $('.box-info-details').addClass('placeholder')
        $('.box-action').addClass('placeholder')
        $('.total-sold').html('')
        $('.total-review').html('')
        $('.review').html('')
        $('.total-sold').addClass('placeholder')
        $('.total-review').addClass('placeholder')
        $('.review').addClass('placeholder')

        $('.info-product .box-price .price-old').hide()

    },
    RemoveLoading: function () {
        $('.Icon').removeClass('placeholder')
        $('.check').removeClass('placeholder')
        $('.box-price').removeClass('placeholder')

        $('.section-details-product').removeClass('placeholder')
        $('.section-description-product').removeClass('placeholder')
        $('.section-category').removeClass('placeholder')
        $('.gallery-product .swiper-wrapper').removeClass('placeholder')
        $('.gallery-product swiper-slide').removeClass('placeholder')
        $('.box-name-product').removeClass('placeholder')
        $('.price').removeClass('placeholder')
        $('.box-info-details').removeClass('placeholder')
        $('.box-action').removeClass('placeholder')
        $('.total-sold').removeClass('placeholder')
        $('.total-review').removeClass('placeholder')
        $('.review').removeClass('placeholder')
    }
}

var buyTogether = {
    selectedItems: [],
    total: 0,

   

    updateTotal: function () {
        debugger
        // Lấy giá của sản phẩm chính từ phần tử .price
        const mainProductPrice = parseInt($('.info-product .box-price .price').text().replace(/[^0-9]/g, '')) || 0; // Lấy giá và loại bỏ ký tự không phải số

        // Cộng giá sản phẩm chính vào tổng
        buyTogether.total = mainProductPrice;

        // Cộng giá của các sản phẩm mua cùng vào tổng
        buyTogether.total += buyTogether.selectedItems.reduce((sum, p) => sum + p.price, 0);

        // Cập nhật tổng giá vào UI
        $('.sp-muacung-total').text(buyTogether.total.toLocaleString('vi-VN') + ' đ');
    },


    submit: function () {
        debugger
        var product = product_detail.GetSubProductSessionByAttributeSelected()
        if (product == undefined) {
            var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
            if (json != undefined && json.trim() != '') {
                product = JSON.parse(json).product_main

            }
        }
        if (product == undefined) {
            window.location.reload()
        }

        const usr = global_service.CheckLogin();
        if (!usr) {
            // Nếu chưa đăng nhập → mở form login + lưu trạng thái
            $('.mainheader .client-login').click();
            product_detail.SaveProductDetailAttributeSelected();
            return;
        }

        const token = usr.token;
        const quantity = parseInt($('.box-detail-stock .quantity').val()) || 1;

        const requests = [];

        // Gọi API thêm sản phẩm chính
        requests.push(global_service.POST(API_URL.AddToCart, {
            product_id: product._id,
            quanity: quantity,
            token: token
        }));

        // Gọi API thêm sản phẩm phụ
        buyTogether.selectedItems.forEach(item => {
            requests.push(global_service.POST(API_URL.AddToCart, {
                product_id: item.id,
                quanity: 1,
                token: token
            }));
        });

       // Khi gọi xong hết thì chuyển sang /cart
        $.when(...requests).done(function () {
            window.location.href = '/cart';
        }).fail(function () {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        });
    }
};


