
// custom select

$('select').each(function () {
    var $this = $(this), numberOfOptions = $(this).children('option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
        'class': 'select-options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
        if ($this.children('option').eq(i).is(':selected')) {
            $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('is-selected')
        }
    }

    var $listItems = $list.children('li');

    $styledSelect.click(function (e) {
        e.stopPropagation();
        $('div.select-styled.active').not(this).each(function () {
            $(this).removeClass('active').next('ul.select-options').hide();
        });
        $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    $listItems.click(function (e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.find('li.is-selected').removeClass('is-selected');
        $list.find('li[rel="' + $(this).attr('rel') + '"]').addClass('is-selected');
        $list.hide();
    });

    $(document).click(function () {
        $styledSelect.removeClass('active');
        $list.hide();
    });
});

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
    $('a').click(function(event) {
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
});
  // popup
$(document).ready(function () {
    $('.toggle').on('click', function () {
        const $panel = $(this).next('.panel');
        $('.panel').not($panel).slideUp(); // Đóng các panel khác
        $panel.stop(true, true).slideToggle(); // Mở/đóng panel hiện tại
    });
});