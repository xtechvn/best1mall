window.favorite = {
    pageIndex: 1,
    pageSize: 10,
    isLoading: false,
    hasMore: true,
    Initialization: function () {
        this.bindScroll();
        this.loadFavouriteList();
        // Gắn sự kiện click để toggle yêu thích
        $('body').on('click', '.btn-favorite-toggle', function () {
            favorite.ToggleFavorite($(this));
        });

    },
    bindScroll: function () {
        const self = this;
        $(window).on("scroll", function () {
            if (self.isLoading || !self.hasMore) return;

            const nearBottom = $(window).scrollTop() + $(window).height() + 100 >= $(document).height();
            if (nearBottom) {
                self.pageIndex++;
                self.loadFavouriteList();
            }
        });
    },
    ToggleFavorite: function ($el) {
        debugger;

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
            debugger;

            if (result.is_success) {
                // Nếu là trang danh sách yêu thích → xóa luôn phần tử
                if ($el.closest('#favourite').length > 0) {
                    $el.closest('.bg-white').remove();

                    if ($('#favourite .bg-white').length === 0) {
                        $('#favourite').html('<p class="text-gray-600 p-4">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>');
                    }
                } else {
                    $el.toggleClass("active");
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

 

    loadFavouriteList: function () {

        const usr = global_service.CheckLogin();
        if (!usr) {
            $('#favourite').html('<p class="text-red-600 p-4">Vui lòng đăng nhập để xem danh sách yêu thích.</p>');
            return;
        }

        this.isLoading = true;

        const request = {
            token: usr.token,
            page_index: 1,
            page_size: 20
        };
        const self = this;

        $.when(global_service.POST(API_URL.FavouriteList, request)).done(function (res) {
            debugger
            if (res.is_success && res.data && res.data.length > 0) {
                const html = res.data.map(item => self.renderFavouriteItem(item.detail)).join('');
                if (self.pageIndex === 1) {
                    $('#favourite').html(html);
                } else {
                    $('#favourite').append(html);
                }

                if (res.total && self.pageIndex * self.pageSize >= res.total) {
                    self.hasMore = false;
                }
            } else {
                if (self.pageIndex === 1) {
                    $('#favourite').html('<p class="text-gray-600 p-4">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>');
                }
                self.hasMore = false;
            }
            self.isLoading = false;
        }).fail(function () {
            self.isLoading = false;
        });
    },

    renderFavouriteItem: function (item) {
        const product = item; // alias

        let img_src = product.avatar || '';
        if (
            !img_src.includes(API_URL.StaticDomain) &&
            !img_src.includes("data:image") &&
            !img_src.includes("http")
        ) {
            img_src = API_URL.StaticDomain + img_src;
        }

        let amount_html = 'Giá liên hệ';
        let amount_number = 0;
        let has_price = false;

        if (product.amount_min && product.amount_min > 0) {
            amount_html = global_service.Comma(product.amount_min) + ' đ';
            amount_number = product.amount_min;
            has_price = true;
        } else if (product.amount && product.amount > 0) {
            amount_html = global_service.Comma(product.amount) + ' đ';
            amount_number = product.amount;
            has_price = true;
        }

        if (!has_price) return '';

        let discountRounded = Math.round(parseFloat(product.discount) || 0);
        let showDiscount = discountRounded > 0;

        const template = `
    <div class="bg-white rounded-xl p-2 text-slate-800 relative h-full pb-14">
        <a href="{url}">
            <div class="absolute -top-1 z-10 left-1 bg-[url(assets/images/icon/tag1.png)] bg-contain bg-no-repeat text-white text-xs px-2 w-[50px] h-[30px] py-1 {discount_style}">
                {discount_text}
            </div>

            <div class="relative aspect-[1/1] overflow-hidden rounded-lg">
                <img src="{avt}" alt="{name}" class="absolute inset-0 w-full h-full object-cover" />
            </div>

            <p class="text-sm line-clamp-2 font-medium mt-2">{name}</p>

            <div class="absolute bottom-2 w-full px-2 left-0">
                <div class="text-rose-600 font-bold mt-1">{amount}</div>
                <div class="flex items-center justify-between">
                    <div class="text-xs line-through text-slate-400" style="{old_price_style}">{price}</div>
                    <div class="text-xs text-yellow-500 mt-1">
                        {review_point} <span class="text-color-base">{review_count}</span>
                    </div>
                </div>
            </div>
        </a>
        <button  class="btn-favorite-toggle absolute top-2 right-2 active cursor-pointer " data-product-id="${product._id}" title="Xóa khỏi yêu thích">❤️</button>
    </div>
    `;

        return template
            .replaceAll('{url}', '/san-pham/' + global_service.RemoveUnicode(global_service.RemoveSpecialCharacters(product.name)).replaceAll(' ', '-') + '--' + product._id)
            .replaceAll('{discount_text}', `-${discountRounded}%`)
            .replaceAll('{discount_style}', showDiscount ? '' : 'hidden')
            .replaceAll('{avt}', img_src)
            .replaceAll('{name}', product.name)
            .replaceAll('{amount}', amount_html)
            .replaceAll('{review_point}', product.rating ? product.rating.toFixed(1) + '★' : '')
            .replaceAll('{review_count}', product.review_count ? `(${product.review_count})` : '')
            .replaceAll('{old_price_style}', product.old_price && product.old_price > 0 ? '' : 'display:none;')
            .replaceAll('{price}', product.old_price ? global_service.Comma(product.old_price) + ' đ' : '');
    }

};

function formatCurrency(num) {
    return Number(num).toLocaleString("vi-VN");
}
