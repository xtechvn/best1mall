$(document).ready(function () {
    global_service.Initialization();
    global_service.DynamicBind();
    global_service.LoadPolicy();
    global_service.LoadAbouHulotoys();
    global_service.LoadCustomerSupport();
    global_service.LoadCartCount();
   
    // 👉 GỌI THÊM:
    global_service.renderViewedProducts(); // gọi hàm load sản phẩm đã xem
})
var global_service = {
    Initialization: function () {
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                window.location.reload()
            });
        }
        $('#thanhcong').removeClass('overlay-active')
        $('#thatbai').removeClass('overlay-active')
        $('#dangnhap').removeClass('overlay-active')
        $('#dangky').removeClass('overlay-active')
        $('#quenmk').removeClass('overlay-active')
        $('#global-search-loading').hide()
        // 👇 Thêm đoạn này để đảm bảo key tồn tại
        if (!localStorage.getItem('viewedProducts')) {
            localStorage.setItem('viewedProducts', JSON.stringify([]));
        }
    },
    DynamicBind: function () {
        $("body").on('click', ".client-login", function (event) {
            
            var element = $(this)
            event.preventDefault()
            var box_id = element.attr('data-id')
            $('.popup').addClass('hidden')
            $('' + box_id).removeClass('hidden')
            $('' + box_id).show()
        });
        $("body").on('click', ".overlay .close, .overlay .btn-close", function (event) {
            var element = $(this)
            event.preventDefault()
            element.closest('.popup').addClass('hidden')
        });
        $("body").on('keyup', ".global-search", function () {
            if (!$('#global-search-loading').is(':hidden')) {
                return
            }
            $('#global-search-loading').show()
            var element = $(this)
            //global_service.RenderSearchBoxLoading()
            if (element.val() != undefined && element.val().trim() != '') {
                $('.box-search-list').fadeIn()
                global_service.RenderSearchBox()
            } else {
                $('.box-search-list').fadeOut()
                $('#global-search-loading').hide()

            }
        });
        $(document).on('click', function (event) {
            // Kiểm tra nếu click không nằm trong div.form-search
            if (!$(event.target).closest('.form-search').length) {
                $('.form-search .box-search-list').hide();
                $('#global-search-loading').hide()
            }
        });
        // Xử lý click vào item mẫu tìm kiếm
        $("body").on("click", ".search-sample", function (e) {
            e.preventDefault();
            var keyword = $(this).text().trim();
            var $input = $(".global-search");

            $input.val(keyword).trigger("input").trigger("keyup"); // Thêm trigger input ở đây nè
        });

        // Xử lý hiển thị nút clear khi có text
        $("body").on("input", ".global-search", function () {
            let val = $(this).val().trim();
            if (val !== "") {
                $("#clear-search").removeClass("hidden");
            } else {
                $("#clear-search").addClass("hidden");
            }
        });

        // Xử lý click nút clear: xóa input, ẩn nút, ẩn gợi ý
        $("#clear-search").on("click", function () {
            $(".global-search").val("").trigger("input"); // clear và check lại trạng thái
            $(this).addClass("hidden");
            $(".box-search-list").fadeOut();
            $("#global-search-loading").hide();
        });


    },
    LoadPolicy: function () {
        $.ajax({
            url: "/Support/GetListPolicy",
            type: 'post',
            data: { idTypePolicy: 21 },
            success: function (data) {
                data.forEach(item => {
                    let html = `<li><a class="li-Cursor hover:text-red-500" onclick="global_service.PolicyNaviga('/chinh-sach/','${item.id}','${item.name}')">${item.name}</a></li>`;
                    $(".policy-footer").append(html);
                });
            },
        });
    },
    LoadAbouHulotoys: function () {
        $.ajax({
            url: "/Support/GetListAboutHulotoys",
            type: 'post',
            data: { idCate: 25 },
            success: function (data) {
                data.forEach(item => {
                    let html = `<li><a class="li-Cursor hover:text-red-500" onclick="global_service.Naviga('/tin-tuc/','${item.id}','${item.title}-${item.id}')">${item.title}</a></li>`;
                    $(".AboutHulotoy-footer").append(html);
                });
            },
        });
    },
    LoadCustomerSupport: function () {
        $.ajax({
            url: "/Support/GetListCustomerSupport",
            type: 'post',
            data: { idCate: 26 },
            success: function (data) {
                data.forEach(item => {
                    let html = `<li><a class="li-Cursor" onclick="global_service.Naviga('/tin-tuc/','${item.id}','${item.title}-${item.id}')">${item.title}</a></li>`;
                    $(".CustomerSupport-footer").prepend(html);
                });
            },
        });
    },
    LoadLabelList: function () {
       
        $.ajax({
            url: "/Home/loadLabelComponent",
            type: 'POST',
            dataType: 'html',
            data: { top: 6 },
            success: function (data) {
               
                $('.component-label-list').html(data);
            },
        });
    },
    LoadCartCount: function () {
       
        var usr = global_service.CheckLogin()
        if (usr) {
            $.ajax({
                url: API_URL.CartCount,
                type: 'post',
                data: {
                    request: {
                        token: usr.token
                    }
                },
                success: function (result) {
                    
                    if (result.is_success && result.data) {
                        $('#carts .badge').html(result.data);
                    } else {
                        $('#carts .badge').html('0');
                    }
                },
                error: function () {
                    $('#carts .badge').html('0');
                }
            });
        }
        else {
            // 🔴 Nếu chưa login → lấy giỏ hàng từ sessionStorage
            let cart = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];
            let total = cart.reduce((sum, item) => sum + (item.quanity || 0), 0);
            $('#carts .badge').html(total);
        }

    },
    PolicyNaviga: function (url, id, title) {
        window.location.href = url + this.convertVietnameseToUnsign(title) + "-" + id;
        //localStorage.setItem('ChosenIdPolicy', id);
        //localStorage.setItem('ChosenUrlPolicy', title);
    },
    Naviga: function (url, id, title) {
        window.location.href = url + this.convertVietnameseToUnsign(title);
    },
    CheckLogin: function () {
    
        var str = localStorage.getItem(STORAGE_NAME.Login)
        if (str != undefined && str.trim() != '') {
            return JSON.parse(str)
        }
        str = sessionStorage.getItem(STORAGE_NAME.Login)
        if (str != undefined && str.trim() != '') {
            return JSON.parse(str)
        }
        return undefined
    },
    POST: function (url, data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: url,
                data: { request: data },
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },


    GET: function (url) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                processData: false,
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },
    POSTSynchorus: function (url, model) {
        var data = undefined
        $.ajax({
            url: url,
            type: "POST",
            data: model,
            success: function (result) {
                data = result;
            },
            error: function (err) {
                console.log(err)
            },
            async: false
        });
        return data
    },
    POSTFileSynchorus: function (url, model) {
        var data = undefined
        $.ajax({
            url: url,
            type: "POST",
            data: model,
            processData: false,  // Prevent jQuery from processing the data
            contentType: false,  // Prevent jQuery from setting contentType
            success: function (result) {
                data = result;
            },
            error: function (err) {
                console.log(err)
            },
            async: false
        });
        return data
    },
    DecodeGSIToken: function (token) {
        let base64Url = token.split('.')[1]
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload)
    },
    Comma: function (number) { //function to add commas to textboxes
        number = ('' + number).replace(/[^0-9.,]+/g, '');
        number += '';
        number = number.replaceAll(',', '');
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;
    },
    RemoveUnicode: function (text) {
        var arr1 = [
            "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
            "đ",
            "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ",
            "í", "ì", "ỉ", "ĩ", "ị",
            "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ",
            "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự",
            "ý", "ỳ", "ỷ", "ỹ", "ỵ"];
        var arr2 = [
            "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
            "d",
            "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
            "i", "i", "i", "i", "i",
            "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
            "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
            "y", "y", "y", "y", "y"];
        for (var i = 0; i < arr1.length; i++) {
            text = text.replaceAll(arr1[i], arr2[i]);
            text = text.replaceAll(arr1[i].toUpperCase(), arr2[i].toUpperCase());
        }
        return text;
    },
    convertVietnameseToUnsign: function (str) {
        // Bảng chuyển đổi các ký tự có dấu thành không dấu
        const from = "àáạảãâầấậẩẫăắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơớờợởỡùúụủũưừứựửữỳýỵỷỹđ";
        const to = "aaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
        const fromArray = from.split('');
        const toArray = to.split('');

        str = str.toLowerCase();

        for (let i = 0; i < fromArray.length; i++) {
            str = str.replace(new RegExp(fromArray[i], 'g'), toArray[i]);
        }

        str = str.replace(/\s+/g, '-'); // Thay thế nhiều khoảng trắng thành 1 -
        return str.trim();
    },
    LoadHomeProductGrid: function (element, group_id, size) {
       
        element.addClass('placeholder')
        element.addClass('box-placeholder')
        element.css('width', '100%')
        element.css('height', '255px')
        var request = {
            "group_id": group_id,
            "page_index": 1,
            "page_size": size
        }
        $.when(
            global_service.POST(API_URL.ProductList, request)
        ).done(function (result) {
            if (result.is_success) {
                var products = result.data
                
                    var html = global_service.RenderSlideProductItem(products, HTML_CONSTANTS.Home.SlideProductItem)
                element.html(html)
                

            } else {
                element.html('')
            }
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
            element.css('height', 'auto')
        })
    },
   
    LoadGroupProduct: function (element, group_id, size) {
       
        element.addClass('placeholder')
        element.addClass('box-placeholder')
        element.css('width', '100%')
        element.css('height', '255px')
        var request = {
            "group_id": group_id,
            "page_index": 1,
            "page_size": size
        }
        $.when(
            global_service.POST(API_URL.GroupProduct, request)
        ).done(function (result) {
           
            if (result.is_success) {
               
                var products = result.data


                var html = global_service.RenderGroupProductItem(products, HTML_CONSTANTS.Home.GroupProductItem)
                element.html(html)


                //var html = global_service.RenderSlideProductItem(products, HTML_CONSTANTS.Home.SlideProductItem)
                //element.html(html)
            } else {
                element.html('')
            }
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
            element.css('height', 'auto')
        })
    },

    GotoCart: function () {
        
        //var usr = global_service.CheckLogin()
        //if (usr) {
        //    window.location.href = '/cart'

        //}
        //else {
        //    $('.mainheader .client-login').click()
        //    return
        //}
        window.location.href = '/cart';
    },

    DateTimeToString: function (date, has_time = false) {
        var text = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
        if (has_time == true) {
            text += + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2)
        }
        return text
    },
    DateTimeDotNetToString: function (date_string, has_time = false) {
        //"2024-08-28T09:15:09.43Z"
        var date = new Date(date_string)
        var text = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
        if (has_time == true) {
            var time_text = + ' ' + (date.getHours()) + ':' + (("0" + date.getMinutes()).slice(-2))
            return text + ' ' + time_text
        }
        return text
    },
    CorrectImage: function (image) {
        var img_src = image
        if (img_src == null || img_src == undefined) return ''
        if (!img_src.includes(API_URL.StaticDomain)
            && !img_src.includes("data:image")
            && !img_src.includes("http")
            && !img_src.includes("base64,"))
            img_src = API_URL.StaticDomain + image
        return img_src
    },
    Select2WithFixedOptionAndSearch: function (element, placeholder = "Vui lòng chọn...") {

        element.select2({
            placeholder: placeholder,
        });
    },

    RemoveSpecialCharacters: function (value) {
        value = value.replace(/[^a-zA-Z0-9 ]/g, '');
        return value.trim();
    },
    GetGlobalSearchKeyword: function () {
       
        var value = $('.global-search').val()
        // Giữ mọi chữ cái (bao gồm có dấu), số và vài ký tự đặc biệt hợp lệ
        value = value.replace(/[^\p{L}0-9+-_@* ]/gu, '');
        return value.trim();
    },
    RenderSearchBox: function () {
       
        var usr = global_service.CheckLogin()
        var token = ''
        if (usr) {
            token = usr.token

        }
        var request = {
            "keyword": global_service.GetGlobalSearchKeyword(),
            "token": token
        }
        $.when(
            global_service.POST(API_URL.GlobalSearch, request)
        ).done(function (result) {
           
            if (result.is_success && result.data && result.data.items) {
                if (result.data.items.length > 0) {
                    var html = `<ul class="divide-y divide-gray-100">` + global_service.RenderSearchProductItem(result.data.items) + `</ul>`
                    $('.box-search-list').html(html)
                } else {
                    $('.box-search-list').html('Không tìm thấy kết quả')
                }
            } else {
                $('.box-search-list').html('Không tìm thấy kết quả')
            }
            $('#global-search-loading').hide()

        })

    },
    RenderSearchBoxLoading: function () {
        $('.box-search-list').html(HTML_CONSTANTS.Home.GlobalSearchBoxLoading)
        $('.box-search-list .item-product').addClass('placeholder')
        $('.box-search-list .flex-price').addClass('placeholder')
        $('.box-search-list .name-product').addClass('placeholder')
        $('.box-search-list .price-old').addClass('placeholder')
    },

    RenderGroupProductItem: function (list, template) {
       
        var html = '';
        $(list).each(function (index, item) {
            var img_src = item.imagePath;
            if (!img_src.includes(API_URL.StaticDomain)
                && !img_src.includes("data:image")
                && !img_src.includes("http")) {
                img_src = API_URL.StaticDomain + img_src;
            }

            html += template
                .replaceAll('{url}', '/' + item.path)
                .replaceAll('{avt}', img_src)
                .replaceAll('{id}', item.id)
                .replaceAll('{name}', item.name);
        });

        return html;
    },
    RenderSlideProductItem: function (list, template) {

        var html = ''
       
        $(list).each(function (index, item) {
            
            var img_src = item.avatar
            if (!img_src.includes(API_URL.StaticDomain)
                && !img_src.includes("data:image")
                && !img_src.includes("http"))
                img_src = API_URL.StaticDomain + item.avatar
            var amount_html = 'Giá liên hệ'
            var amount_number = 0
            var has_price = false
            if (item.amount_min != null
                && item.amount_min != undefined && item.amount_min > 0) {
                amount_html = global_service.Comma(item.amount_min) + ' đ'
                amount_number = item.amount_min
                has_price = true
            }
            else if (item.amount != undefined
                && item.amount != null && item.amount > 0) {
                amount_html = global_service.Comma(item.amount) + ' đ'
                amount_number = item.amount

                has_price = true
            }
            if (has_price) {
                
                
                let showDiscount = item.old_price != null ;
                html += template
                    .replaceAll('{url}', '/san-pham/' + global_service.RemoveUnicode(global_service.RemoveSpecialCharacters(item.name)).replaceAll(' ', '-') + '--' + item._id)
                    .replaceAll('<a href="', `<a onclick="global_service.saveViewedProduct('${item._id}', '${item.name.replace(/'/g, "\\'")}', '${img_src}',  ${amount_number},
                    ${item.rating || 0},
                    ${item.review_count || 0},
                    ${item.old_price || 0},
                    ${item.discount ||0})" href="`)
                    .replaceAll('{discount_text}', showDiscount ? `-${item.discount}%` : '')
                    .replaceAll('{discount_style}', showDiscount ? '' : 'hidden')


                    .replaceAll('{avt}', img_src)
                    .replaceAll('{name}', item.name)
                    .replaceAll('{amount}', amount_html)
                    .replaceAll('{review_point}', (item.rating == null || item.rating == undefined || item.rating <= 0) ? '' : item.rating.toFixed(1) + '★')
                    //.replaceAll('{review_point}', (item.star == null || item.star == undefined || item.star <= 0) ? '' : item.star.toFixed(1) +'<i class="icon icon-star"></i>')
                    .replaceAll('{review_count}', (item.review_count == null || item.review_count == undefined || item.review_count <= 0) ? '' : '(' + item.review_count.toFixed(0) + ')')
                    //.replaceAll('{review_count}', (item.total_sold == null || item.total_sold == undefined || item.total_sold <= 0) ? '' : '(' + item.total_sold.toFixed(0) + ')')
                    .replaceAll('{old_price_style}', (item.amount_max <= amount_number ? 'display:none;' : ''))
                    //.replaceAll('{price_style}', (item.old_price && item.old_price > 0) ? '' : 'display:none;')
                    .replaceAll('{price}', (item.old_price && item.old_price > 0) ? (global_service.Comma(item.old_price) + ' đ') : '')


            }
        });

        return html
    },

    saveViewedProduct: function (id, name, image, price, rating = 0, review_count = 0, old_price = 0, discount = 0) {
        
        var img_src = image
        if (!img_src.includes(API_URL.StaticDomain)
            && !img_src.includes("data:image")
            && !img_src.includes("http"))
            img_src = API_URL.StaticDomain + image
       
        const key = 'viewedProducts';
        let list = JSON.parse(localStorage.getItem(key)) || [];

        // Xóa nếu trùng ID
        list = list.filter(p => p.id !== id);

        // Thêm vào đầu
        list.unshift({
            id,
            name,
            img_src,
            price,
            rating,
            review_count,
            old_price,
            discount,
            url: `/san-pham/${global_service.toSlug(name)}--${id}`
        });

        // Chỉ giữ lại 10 sản phẩm
        if (list.length > 10) {
            list = list.slice(0, 10);
        }

        localStorage.setItem(key, JSON.stringify(list));
    },

    toSlug: function (str) {
       
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        str = str.replace(/[^a-zA-Z0-9\s-]/g, '');
        return str.replace(/\s+/g, '-').toLowerCase();
    },

    renderViewedProducts: function () {
        
       
        const container = document.getElementById('viewed-products');
        const wrapper = document.getElementById('viewed-products-wrapper'); // 👈 thêm dòng này
        const list = JSON.parse(localStorage.getItem('viewedProducts')) || [];
       
        // Nếu không có sản phẩm đã xem thì ẩn nguyên cái wrapper luôn
        if (!list.length) {
            if (wrapper) wrapper.style.display = 'none';
            return;
        }

        // Nếu có sản phẩm thì hiển thị lại
        if (wrapper) wrapper.style.display = '';

        let html = '';
        list.forEach(p => {
            
           
            const showOldPrice = p.old_price && p.old_price > p.price;
            const showDiscount = p.discount && p.discount > 0;
            const ratingHtml = p.rating > 0 ? `${p.rating.toFixed(1)}★` : '';
            const reviewHtml = p.review_count > 0 ? `(${p.review_count})` : '';
            

            html += `
            <div class="swiper-slide pt-3">
            <div class="bg-white rounded-xl p-2 text-slate-800 relative h-full pb-14">
                <a href="${p.url}">
                   <div class="absolute -top-1 z-10 left-1 bg-[url(assets/images/icon/tag.png)] bg-contain bg-no-repeat text-white text-xs px-2 w-[50px] h-[30px] py-1 ${showDiscount ? '' : 'hidden'}">
                        -${p.discount}%
                    </div>
                    <div class="relative aspect-[1/1] overflow-hidden rounded-lg">
                        <img src="${p.img_src}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <p class="text-sm line-clamp-2 font-medium mt-2">${p.name}</p>
                    <div class="absolute bottom-2 w-full px-2 left-0">
                        <div class="text-rose-600 font-bold mt-1">${p.price.toLocaleString()} đ</div>
                        <div class="flex items-center justify-between">
                            <div class="text-xs line-through text-slate-400" style="${showOldPrice ? '' : 'display:none;'}">${p.old_price.toLocaleString()} đ</div>
                            <div class="text-xs text-yellow-500 mt-1">${ratingHtml} <span class="text-slate-400">${reviewHtml}</span></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>`;
        });

        container.innerHTML = html;

        // Khởi tạo lại Swiper sau khi render
        if (window.mySwiperViewedProducts) {
            window.mySwiperViewedProducts.update();
        } else {
            window.mySwiperViewedProducts = new Swiper(".mySwiper", {
                slidesPerView: 2,
                spaceBetween: 10,
                breakpoints: {
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 }
                }
            });
        }
    },






    RenderSearchProductItem: function (list) {
       

        var html = ''
        var template = HTML_CONSTANTS.Home.GlobalSearchByKeyword
        
        var keyword = global_service.GetGlobalSearchKeyword()
        //html += template
        //    .replaceAll('{url}', '/tim-kiem/' + keyword)
        //    .replaceAll('{name}', 'Tìm kiếm "' + keyword + '"')

        $(list).each(function (index, item) {
            var img_src = item.avatar
            if (!img_src.includes(API_URL.StaticDomain)
                && !img_src.includes("data:image")
                && !img_src.includes("http"))
                img_src = API_URL.StaticDomain + item.avatar
            html += template
                .replaceAll('{url}', '/san-pham/' + global_service.RemoveUnicode(global_service.RemoveSpecialCharacters(item.name)).replaceAll(' ', '-') + '--' + item._id)
                .replaceAll('{name}', item.name)
                .replaceAll('{avatar}', img_src)

        });

        return html
    },
    DelayEventBinding: function (callback, ms) {
        var timer = 0;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    },
    LightBoxFailed: function (title, description, redirect_url = 'javascript:;') {
        $('#thatbai .content h4').html(title)
        $('#thatbai .content p').html(description)
        $('#thatbai .content a').attr('href', redirect_url)
        $('#thatbai').addClass('overlay-active')
    },

}