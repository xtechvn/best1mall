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
                // Lọc các Flash Sale hợp lệ
                var validFlashSales = res.data.items.filter(function (flashsale) {
                    var now = new Date();
                    var fromDate = new Date(flashsale.fromdate);
                    var toDate = new Date(flashsale.todate);
                    return fromDate <= now && toDate >= now; // Flash Sale hợp lệ
                });

                // Nếu có Flash Sale hợp lệ
                if (validFlashSales.length > 0) {
                    // Lấy cái đầu tiên hợp lệ
                    var firstValidFlashSale = validFlashSales[0];

                    // Tải sản phẩm và bắt đầu đếm ngược cho cái Flash Sale hợp lệ đầu tiên
                    flashsale.LoadProducts(firstValidFlashSale.flashsale_id, firstValidFlashSale.name);
                    flashsale.StartCountdown(firstValidFlashSale.fromdate, firstValidFlashSale.todate);
                } else {
                    console.warn("Không có Flash Sale hợp lệ 😢");
                }
            } else {
                console.warn("Không có Flash Sale items 😢");
            }
        }).fail(function (err) {
            console.error("Lỗi khi tải danh sách Flash Sale:", err);
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
        // Xử lý Rating và Review Count
        let ratingDisplay = (p.rating && p.rating > 0) ? p.rating.toFixed(1) + "★" : "";
        let reviewCountDisplay = (p.review_count && p.review_count > 0) ? `(${p.review_count})` : "";

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
                            <div class="text-xs text-yellow-500 mt-1">
                            ${ratingDisplay} <span class="text-slate-400">${reviewCountDisplay}</span>
                        </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        `;
    },

    //RenderViewAllSlide: function () {
    //    return `
    //    <div class="swiper-slide pt-3">
    //        <div class="flex items-center justify-center w-full h-full">
    //            <a href="#" class="flex items-center gap-2 text-blue-500 justify-center">
    //                Xem tất cả
    //                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    //                    <path d="M12.773 9.39804L7.14804 15.023C7.09578 15.0753 7.03373 15.1168 6.96545 15.145C6.89716 15.1733 6.82398 15.1879 6.75007 15.1879C6.67616 15.1879 6.60297 15.1733 6.53469 15.145C6.46641 15.1168 6.40436 15.0753 6.3521 15.023C6.29984 14.9708 6.25838 14.9087 6.2301 14.8404C6.20181 14.7722 6.18726 14.699 6.18726 14.6251C6.18726 14.5512 6.20181 14.478 6.2301 14.4097C6.25838 14.3414 6.29984 14.2794 6.3521 14.2271L11.5798 9.00007L6.3521 3.77304C6.24655 3.66749 6.18726 3.52434 6.18726 3.37507C6.18726 3.2258 6.24655 3.08265 6.3521 2.9771C6.45765 2.87155 6.6008 2.81226 6.75007 2.81226C6.89934 2.81226 7.04249 2.87155 7.14804 2.9771L12.773 8.6021C12.8253 8.65434 12.8668 8.71638 12.8951 8.78466C12.9234 8.85295 12.938 8.92615 12.938 9.00007C12.938 9.07399 12.9234 9.14719 12.8951 9.21547C12.8668 9.28376 12.8253 9.3458 12.773 9.39804Z"
    //                        fill="#773EFA" />
    //                </svg>
    //            </a>
    //        </div>
    //    </div>
    //    `;
    //},

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

        var now = new Date(); // Thời gian hiện tại

        // Nếu chưa tới thời gian bắt đầu
        if (now < fromDate) {
            document.getElementById("countdown").innerHTML = `<span class="text-sm  italic">Chưa bắt đầu</span>`;
            return;
        }

        // Nếu thời gian hiện tại đã hết
        if (now >= toDate) {
            document.getElementById("countdown").innerHTML = `<span class="text-sm  italic">Flash Sale đã kết thúc!</span>`;
            return;
        }

        // Bắt đầu đếm ngược
        this.UpdateCountdown(toDate);
    },

    UpdateCountdown: function (toDate) {
        
        let previousHours = -1, previousMinutes = -1, previousSeconds = -1;

        const countdown = setInterval(function () {
            const now = new Date().getTime();
            const distance = toDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(countdown);
                document.getElementById("countdown").innerHTML = "Flash Sale đã kết thúc!";
                return;
            }

            // ✅ Tính chính xác
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (previousHours !== hours) {
                document.getElementById("hours").innerText = String(hours).padStart(2, '0');
                previousHours = hours;
            }
            if (previousMinutes !== minutes) {
                document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
                previousMinutes = minutes;
            }
            if (previousSeconds !== seconds) {
                document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
                previousSeconds = seconds;
            }
        }, 1000);
    }





};
