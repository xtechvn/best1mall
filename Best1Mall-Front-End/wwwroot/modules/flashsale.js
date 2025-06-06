$(document).ready(function () {
    flashsale.Initialization();
});

var flashsale = {
    Initialization: function () {
        flashsale.DynamicBind();
        flashsale.GetList();  // Gọi GetList để tải dữ liệu của tất cả các FlashSale
        flashsale.SetFirstActive();  // Gọi hàm để set active cho phần tử đầu tiên
    },

    DynamicBind: function () {
        $(".supplier-filter").click(function () {
            $(".supplier-filter").removeClass("bg-blue-500 text-white border-blue-500");
            $(this).addClass("bg-blue-500 text-white border-blue-500");
            var flashsale_id = $(this).data("flashsale-id");
            var supplierName = $(this).text();
            flashsale.LoadProducts(flashsale_id, supplierName);
        });
    },

    SetFirstActive: function () {
        var firstElement = $(".supplier-filter").first();
        firstElement.addClass("bg-blue-500 text-white border-blue-500");
        var flashsale_id = firstElement.data("flashsale-id");
        flashsale.LoadProducts(flashsale_id);
    },

    GetList: function () {
        var request = {};

        $.when(global_service.POST(API_URL.FlashSaleGetList, request)).done(function (res) {
            if (res && res.is_success && res.data && res.data.items && res.data.items.length > 0) {
                flashsale.LoadProducts(res.data.items[0].flashsale_id, res.data.items[0].name);
                flashsale.StartCountdown(res.data.items[0].fromdate, res.data.items[0].todate);  // Start countdown for the first FlashSale
            } else {
                console.warn("No flash sale items found 😢");
            }
        }).fail(function (err) {
            console.error("Failed to load flash sale list:", err);
        });
    },

    LoadProducts: function (flashsale_id, supplierName) {
        var request = {
            id: flashsale_id
        };

        $.when(global_service.POST(API_URL.FlashSaleGetById, request)).done(function (res) {
            const container = $('#swiper-wrapper');
            container.empty();
            if (res.is_success && res.data && res.data.length > 0) {
                res.data.forEach(p => {
                    container.append(flashsale.RenderProductItem(p));
                });

                //container.append(flashsale.RenderViewAllSlide());
                flashsale.InitializeSwiper();
            } else {
                container.html('<div class="swiper-slide text-center text-gray-400">Không có sản phẩm.</div>');
            }
        }).fail(function (err) {
            console.error("Failed to load products:", err);
        });
    },

    RenderProductItem: function (p) {
        // Xây dựng seoUrl cho sản phẩm
        let seoUrl = `/san-pham/${encodeURIComponent(p.name.replace(/\s+/g, '-').toLowerCase())}--${p._id}`;
        return `
        <div class="swiper-slide pt-3">
            <div class="bg-white rounded-xl p-2 text-slate-800 relative border border-gray-100 h-full pb-14">
                <a href="${seoUrl}">
                   <div class="absolute -top-1 z-10 left-1 bg-[url('assets/images/icon/tag1.png')] bg-contain bg-no-repeat text-white text-xs px-2 w-[50px] h-[30px] py-1">
                    -${p.discountvalue}%
                </div>
                    <div class="relative aspect-[1/1] overflow-hidden rounded-lg">
                        <img src="${p.avatar}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <p class="text-sm line-clamp-2 font-medium mt-2">${p.name}</p>
                    <div class="absolute bottom-2 w-full px-2 left-0">
                        <div class="text-rose-600 font-bold mt-1">${p.amount_after_flashsale?.toLocaleString()} đ</div>
                        <div class="flex items-center justify-between">
                            <div class="text-xs line-through text-slate-400">${p.amount?.toLocaleString()} đ</div>
                            <div class="text-xs text-yellow-500 mt-1">★ 4.9 <span class="text-color-base">(100)</span></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        `;
    },

    RenderViewAllSlide: function () {
        return `
        <div class="swiper-slide pt-3">
            <div class="flex items-center justify-center w-full h-full">
                <a href="#" class="flex items-center gap-2 text-blue-500 justify-center">
                    Xem tất cả
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M12.773 9.39804L7.14804 15.023C7.09578 15.0753 7.03373 15.1168 6.96545 15.145C6.89716 15.1733 6.82398 15.1879 6.75007 15.1879C6.67616 15.1879 6.60297 15.1733 6.53469 15.145C6.46641 15.1168 6.40436 15.0753 6.3521 15.023C6.29984 14.9708 6.25838 14.9087 6.2301 14.8404C6.20181 14.7722 6.18726 14.699 6.18726 14.6251C6.18726 14.5512 6.20181 14.478 6.2301 14.4097C6.25838 14.3414 6.29984 14.2794 6.3521 14.2271L11.5798 9.00007L6.3521 3.77304C6.24655 3.66749 6.18726 3.52434 6.18726 3.37507C6.18726 3.2258 6.24655 3.08265 6.3521 2.9771C6.45765 2.87155 6.6008 2.81226 6.75007 2.81226C6.89934 2.81226 7.04249 2.87155 7.14804 2.9771L12.773 8.6021C12.8253 8.65434 12.8668 8.71638 12.8951 8.78466C12.9234 8.85295 12.938 8.92615 12.938 9.00007C12.938 9.07399 12.9234 9.14719 12.8951 9.21547C12.8668 9.28376 12.8253 9.3458 12.773 9.39804Z"
                            fill="#773EFA" />
                    </svg>
                </a>
            </div>
        </div>
        `;
    },

    InitializeSwiper: function () {
        var swiper = new Swiper('.swiper', {
            slidesPerView: 5,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    },

    // Countdown logic
    StartCountdown: function (fromdate, todate) {
        var fromDate = new Date(fromdate); // Thời gian bắt đầu
        var toDate = new Date(todate); // Thời gian kết thúc

        // Nếu thời gian hiện tại nhỏ hơn từ thời gian bắt đầu và chưa đến ngày kết thúc
        if (new Date() < toDate) {
            this.UpdateCountdown(toDate); // Cập nhật thời gian còn lại
        }
    },

    // Update countdown
    UpdateCountdown: function (toDate) {
        var previousHours = -1, previousMinutes = -1, previousSeconds = -1; // Lưu trữ giá trị trước để tránh cập nhật khi không thay đổi.

        var countdown = setInterval(function () {
            var now = new Date().getTime();
            var distance = toDate - now;

            // Calculate time left (Ensure no floating-point errors)
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Only update if the value has changed
            if (previousHours !== hours) {
                document.getElementById("hours").innerHTML = ("0" + hours).slice(-2);
                previousHours = hours;
            }

            if (previousMinutes !== minutes) {
                document.getElementById("minutes").innerHTML = ("0" + minutes).slice(-2);
                previousMinutes = minutes;
            }

            if (previousSeconds !== seconds) {
                document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);
                previousSeconds = seconds;
            }

            // If the countdown is over
            if (distance < 0) {
                clearInterval(countdown);
                document.getElementById("countdown").innerHTML = "Flash Sale đã kết thúc!";
            }
        }, 1000);
    }


};
