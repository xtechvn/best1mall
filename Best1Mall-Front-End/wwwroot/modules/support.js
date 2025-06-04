$(document).ready(function () {
    var Path = window.location.href;
    var GetUrl = _support.extractValues(Path);
    var IdPath = (GetUrl != null && GetUrl.length == 2) ? _support.extractValues(Path)[1] : null;

    if (/^\d+$/.test(IdPath) && Path.match('/chinh-sach/')) {
        $.ajax({
            url: "/Support/GetCategoryById",
            type: 'post',
            data: { id: IdPath },
            success: function (data) {
                NamePath = data.name;
                if (NamePath != null) {
                    _support.GetBodyArticle(IdPath, NamePath);
                }
            }
        })
    }
    else if ((Path.match('/chinh-sach/') || Path.match('/cham-soc-khach-hang'))) {
        _support.GetMenuPolicy().then(() => {
            var IdDefault = $('#IDdefaultOption').text();
            var UrlDefault = $('#NamedefaultOption').text();
            _support.GetBodyArticle(IdDefault, UrlDefault);
        });
    }
    else if (Path.match('/questions/')) {
        _support.GetBodyQuestion(IdPath);
    }


    $("#search-input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            _support.SearchQuestion();
        }
    });

    var lst_IdCate = "";
    $.ajax({
        url: "/Support/GetCategories",
        type: 'post',
        data: null,
        success: function (rs) {
            rs.forEach(item => {
                if (lst_IdCate) {
                    lst_IdCate = lst_IdCate + "," + item.id;
                }
                else {
                    lst_IdCate = lst_IdCate + item.id;
                }
            });
            lst_IdCate = lst_IdCate + ",28";//Add id of Common Question to ListId
            sessionStorage.setItem("list_idCate", lst_IdCate);
        },

    });


    window.onpopstate = function (event) {
        var currentPath = window.location.href;
        IdPath = _support.extractValues(currentPath)[1];
        if (/^\d+$/.test(IdPath) && IdPath != null) {


            if (currentPath.match('/chinh-sach/')) {
                $.ajax({
                    url: "/Support/GetCategoryById",
                    type: 'post',
                    data: { id: IdPath },
                    success: function (data) {
                        var NamePath = !data ? null : data.name;
                        _support.GetMenuPolicy().then(() => {
                            _support.GetBodyArticle(IdPath, NamePath);
                        });

                    }
                })

            }
            else if (currentPath.match('/questions/')) {
                _support.GetBodyQuestion(IdPath);
            }

        }
    };


})

var _support =
{
    GetMenuPolicy: function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/Support/GetCategories",
                type: 'post',
                data: null,
                success: function (data) {
                    if (data != null) {
                        // Tạo HTML bằng template literals
                        const html = data.map(item => `
                        <li class="Option-load p-3 md:px-6 hover:bg-gray-50 cursor-pointer" id="Selected-${item.id}" onclick="_support.GetBodyArticle('${item.id}','${item.name}')">
                            ${item.name}
                        </li>
                    `).join('');

                        // Cập nhật DOM
                        $(".list-faq").html(`
                        <div id="IDdefaultOption" style="display:none">${data[0].id}</div>
                        <div id="NamedefaultOption" style="display:none">${data[0].name}</div>
                        ${html}
                    `);

                        resolve();
                    } else {
                        reject('Data is null');
                    }
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    },
    GetMenuByID: function (id) {
        $.ajax({
            url: "/Support/GetCategoryById",
            type: 'post',
            data: { id: id },
            success: function (data) {
                return data;
            }
        })
    }
    ,
    GetBodyArticle: function (id, urlname) {
        var SelectedElement = document.getElementById("Selected-" + id);

        // Bỏ class active và SVG ở tất cả các item trước
        $(".Option-load").removeClass('active bg-[#F2E5FD] text-[#6C2BD9] font-medium flex justify-between items-center');
        $(".Option-load").each(function () {
            // Xóa SVG nếu có
            $(this).find('svg').remove();
        });

        // Thêm class active và style mới
        $(SelectedElement).addClass('active bg-[#F2E5FD] text-[#6C2BD9] font-medium flex justify-between items-center');

        // Thêm SVG vào item được chọn
        $(SelectedElement).append(`
        <svg class="w-4 h-4 ml-2 text-[#6C2BD9]" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    `);

        // AJAX phần bên dưới vẫn giữ nguyên
        $.ajax({
            url: "/Support/GetListByCategoryID",
            type: 'post',
            data: { id: id },
            success: function (data) {
                var currentPath = window.location.href;
                var PathNext = "/chinh-sach/" + global_service.convertVietnameseToUnsign(urlname) + "-" + id;
                if (!currentPath.includes(PathNext)) {
                    window.history.pushState('string', '', PathNext);
                }

                $(".content-policy").html('');
                if (data.length > 0) {
                    $(".content-policy").append(`<h2 class="text-lg font-normal mb-4">${urlname}</h2>`);
                    data.forEach(item => {
                        $(".content-policy").append(`
                        <div class="accordion-ship space-y-3" id="accordion">
                            <div class="group item">
                                                        <div class="title-faq title font-normal cursor-pointer toggle text-md flex gap-2 items-center title${item.id}" 
                             onclick="_support.DisplayHiddenContent('${item.id}')">
                            <svg class="w-4 h-4 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            ${item.title}
                        </div>
                        <div class="panel mt-2 pl-5 space-y-3 text-gray-500 answer content${item.id}" style="display:none">
                            ${item.body}
                        </div>

                            </div>
                        </div>
                    `);
                    });
                } else {
                    $(".content-policy").append(`<h3 style="color:#3B56B4">Chưa có nội dung !</h3>`);
                }
            }
        });
    },

    DisplayHiddenContent: function (id) {
        $('.title').removeAttr('style')
        let content = $('.content' + id);       // Nội dung cần đóng/mở
        let title = $('.title' + id);           // Tiêu đề được click
        let svgIcon = title.find('svg');        // Mũi tên bên trong tiêu đề
        $('.title' + id).attr('style','color: #773EFA;')
        // Toggle nội dung mượt bằng jQuery slide
        content.stop(true, true).slideToggle(200);

        // Toggle class active
        title.toggleClass('active');

        // Xoay icon 180 độ nếu đang mở
        svgIcon.toggleClass('rotate-180');
    },


    GetBodyQuestion: function (id) {
        
        $.ajax({
            url: "/Support/GetBodyArticle",
            type: 'post',
            data: { id: id },
            success: function (data) {
                debugger
                var currentPath = window.location.href;
                var PathNext = '/questions/' + global_service.convertVietnameseToUnsign(data.title) + '-' + id;
                if (!currentPath.includes(PathNext)) {
                    window.history.pushState('string', '', PathNext);
                }

                if (data != null) {
                    // Ẩn phần kết quả tìm kiếm
                    $('.result-search').addClass('hidden');

                    // Hiện lại phần layout nếu bị ẩn
                    $(".content-policy").removeClass('hidden').html('');
                    $(".left-content").removeClass('hidden').html('');

                    // Reset tất cả item Option-load trước đó
                    $(".Option-load").removeClass('active bg-[#F2E5FD] text-[#6C2BD9] font-medium flex justify-between items-center');
                    $(".Option-load").each(function () {
                        $(this).find('svg').remove();
                    });

                    // Thêm lại item được chọn bên trái (có highlight + icon)
                    $(".left-content").append(`
                    <ul class="list-faq">
                        <li class="Option-load active bg-[#F2E5FD] text-[#6C2BD9] font-medium cursor-pointer flex justify-between items-center p-3 md:px-6">
                            ${data.title}
                            <svg class="w-4 h-4 ml-2 text-[#6C2BD9]" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                    </ul>
                `);

                    // Nội dung bên phải
                    $(".content-policy").append(`
                        <div class="accordion-ship space-y-3" id="accordion">
                            <div class="group item">
                                <div class="title-faq title font-normal toggle text-md flex gap-2 items-center cursor-pointer"
                                    onclick="$(this).siblings('.panel').slideToggle(); $(this).find('svg').toggleClass('rotate-180')">
                                    <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    ${data.title}
                                </div>
                               
                                    <div class="panel mt-2 pl-5 text-gray-500 hidden">${data.lead}</div>
                                 
                                <div class="panel mt-2 pl-5 space-y-3 text-gray-500 hidden">${data.body}</div>
                            </div>
                        </div>
`);

                }
            }
        });
    },


    SearchQuestion: function () {
        debugger
        // Reset kết quả hiển thị ban đầu
        $('.result-search').removeClass('hidden').html('<h2>Đang tìm kiếm...</h2>');
        var lst_Id = sessionStorage.getItem("list_idCate");
        var title = $('#search-input').val();
        var obj =
        {
            "title": title,
            "parent_cate_faq_id": lst_Id
        }
        $('.content-policy').addClass('hidden');
        $('.left-content').addClass('hidden');

        if (title == '') {
            window.location.href = '/cham-soc-khach-hang';
        }
        else {
            $.ajax({
                url: "/Support/FindAllArticleByTitle",
                type: 'post',
                data: { requestObj: obj },
                success: function (data) {
                    debugger
                    // Reset kết quả tìm kiếm
                    $('.result-search').removeClass('hidden').html('');
                    // 👇 CHỖ NÀY NÈ: Hiện lại result section
                    $('.content-policy').addClass('hidden');
                    $('.left-content').addClass('hidden');
                   
                    let count = 0;
                    //dem ban ghi
                    if (data) {
                        data.forEach(item => {
                            count++;
                        });
                    }
                    if (count > 0) {
                        let notif = `<h2 class="text-2xl">có "${count} kết quả" tìm kiếm</h2>`;
                        $('.result-search').html(notif);
                        let list = $('<ul class="space-y-2 mt-4"></ul>');

                        data.forEach(item => {
                            let li = $(`
                            <li>
                                <a href="javascript:void(0);" class="Option-load text-blue-600 hover:underline" onclick="_support.GetBodyQuestion('${item.id}')">
                                    ${item.title}
                                </a>
                            </li>
                        `);
                            list.append(li);
                        });
                        $('.result-search').append(list);
                    }
                    else {
                        $('.result-search').html(`<h2>Không tìm thấy kết quả tìm kiếm</h2>`);
                    }
                },

            });
        }
    },
    extractValues: function (str) {
        // Loại bỏ tất cả các ký tự đặc biệt ngoại trừ dấu gạch nối
        const cleanedStr = str.replace(/[^a-zA-Z0-9-]/g, '');

        // Tìm vị trí của dấu gạch ngang cuối cùng
        const lastDashIndex = cleanedStr.lastIndexOf('-');

        // Nếu không tìm thấy dấu gạch ngang, trả về null
        if (lastDashIndex === -1) {
            return null;
        }

        // Lấy phần chuỗi trước và sau dấu gạch ngang cuối cùng
        const part1 = cleanedStr.substring(0, lastDashIndex);
        const part2 = cleanedStr.substring(lastDashIndex + 1);

        return [part1, part2];
    },
    GotoSearchBox: function () {
        localStorage.setItem("focus", "aaa");
        window.location.href = '/cham-soc-khach-hang';
    },

    FocusOnSearch: function () {
        if (localStorage.getItem("focus")) {
            $("#search-input").focus();
            localStorage.removeItem("focus");
        }
    },
}


