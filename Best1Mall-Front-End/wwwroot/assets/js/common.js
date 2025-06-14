
// custom select

$(function () {
    $("#datepicker").datepicker();
});
function scrollTop() {
    if ($(window).scrollTop() > 500) {
        $(".backToTopBtn").addClass("active");
    } else {
        $(".backToTopBtn").removeClass("active");
    }
}
$(function () {
    scrollTop();
    $(window).on("scroll", scrollTop);

    $(".backToTopBtn").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1);
        return false;
    });
});

// hỗ trợ
$(document).ready(function () {
    $(".list-faq-v2 .item > .title-faq").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this)
                .siblings(".answer")
                .slideUp(300);
        } else {
            $(".list-faq-v2 .item > .title-faq").removeClass("active");
            $(this).addClass("active");
            $(".answer").slideUp(300);
            $(this)
                .siblings(".answer")
                .slideDown(300);
        }
    });
    $("select").select2({
        placeholder: "Vui lòng chọn...",
        // dropdownParent: $('.form-group')
    });

    // lightgallery
    // $("#lightgallery").lightGallery({
    //     speed: 500,
    //     videojs: true,
    //     plugins: [lgVideo]
    // });
    lightGallery(document.getElementById('lightgallery'), {
        plugins: [lgVideo],
        videojs: true,
        speed: 500,
        thumbnail: true,
    });
});
$(document).ready(function() {
    $('.open-popup').click(function(event) {
        var targetId = $(this).attr('href'); 
        var targetPopup = $(targetId); 
        targetPopup.fadeIn(200); 
        $('body').addClass('overflow-hidden'); // Ngăn cuộn
        event.preventDefault();
    });

    $('.closePopup').click(function() {
        $(this).closest('.popup').fadeOut(200);
        $('body').removeClass('overflow-hidden'); // Cho phép cuộn lại
    });
    // Đóng popup khi click ra ngoài nội dung chính
    $(document).mousedown(function (event) {
        $('.popup:visible').each(function () {
            const popupBox = $(this).find('.popup-content'); // nội dung chính của popup
            if (!popupBox.is(event.target) && popupBox.has(event.target).length === 0) {
                $(this).fadeOut(200);
                $('body').removeClass('overflow-hidden');
            }
        });
    });
});
  // popup
$(document).ready(function () {
    $('.toggle').on('click', function () {
        const $panel = $(this).next('.panel');
        $('.panel').not($panel).slideUp(); // Đóng các panel khác
        $panel.stop(true, true).slideToggle(); // Mở/đóng panel hiện tại
    });
    $('.list-tab-menu .sub-menu').on('click', function () {
        $(this).toggleClass('active');
    });
});

// js tài khoản
$(document).ready(function () {
    function isMobile() {
        return window.innerWidth < 768;
    }
    // Toggle dropdown khi bấm vào #accountButton trên mobile
    $('#accountButton').on('click', function (e) {
        
        if (isMobile()) {
            const $dropdown = $('#accountDropdown');

            // Ngăn sự kiện lan ra gây lỗi
            e.stopPropagation();

            // Nếu chưa render dropdown thì không làm gì hết
            if (!$dropdown.length) return;

            // Nếu click vào bên trong link/dropdown thì bỏ qua toggle
            const isInnerClick = $(e.target).closest('#accountDropdown a, #accountDropdown button').length;
            if (!isInnerClick) {
                e.preventDefault();
                $dropdown.toggleClass('hidden');
            }
        }
    });

    




    // Ẩn dropdown khi click ngoài (chỉ mobile)
    $(document).on('click touchstart', function (e) {
        if (
            isMobile() &&
            !$(e.target).closest('#accountButton').length &&
            !$(e.target).closest('#accountDropdown').length
        ) {
            $('#accountDropdown').addClass('hidden');
        }
    });

    // Khi resize về PC, đảm bảo dropdown bị ẩn đi (vì hover sẽ lo hiển thị)
    $(window).on('resize', function () {
        if (!isMobile()) {
            $('#accountDropdown').addClass('hidden');
        }
    });
    // Auto đóng dropdown khi bấm link hoặc logout trong menu
    $(document).on('click', '#accountDropdown a, #accountDropdown button', function () {
        if (isMobile()) {
            $('#accountDropdown').addClass('hidden');
        }
    });
});
