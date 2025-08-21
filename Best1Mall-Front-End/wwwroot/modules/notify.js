$(document).ready(function () {
    // Click item notify
    $("body").on('click', ".notify-item", function () {
        _noti.UpdateNotify($(this));
    });

    // Toggle dropdown khi click chuông
    $("#toggle-noti").on("click", function (e) {
        e.preventDefault();
        $("#note-tt").toggleClass("hidden");
    });

    // Click ngoài đóng dropdown
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".wrap-notifi").length) {
            $("#note-tt").addClass("hidden");
        }
    });

    _noti.loadNotify();
    _noti.listenSSE();
});

var _menu_html = {
   
        // Notify chưa xem
        html_menu_notify_active: `
      <li class="notify-item bg-purple-50 p-3 hover:bg-gray-100 cursor-pointer transition"
          onclick="_noti.UpdateNotify($(this))" data="{id}">
        <a href="{link}" class="flex items-start gap-3">
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{note}</p>
                <div class="text-xs text-gray-500 mt-1">{date}</div>
            </div>
        </a>
      </li>
    `,
        // Notify đã xem tổng quan (status = 1)
    //    html_menu_notify: `
    //  <li class="notify-item p-3 hover:bg-gray-50 cursor-pointer transition"
    //      onclick="_noti.UpdateNotify($(this))" data="{id}">
    //    <a href="{link}" class="flex items-start gap-3">
    //        <div class="flex-1">
    //            <p class="text-sm text-gray-800">{note}</p>
    //            <div class="text-xs text-gray-500 mt-1">{date}</div>
    //        </div>
    //    </a>
    //  </li>
    //`,
        // Notify đã xem chi tiết (status = 2)
        html_menu_notify_detail: `
      <li class="notify-item bg-gray-100 p-3 hover:bg-gray-200 cursor-pointer transition"
          onclick="_noti.UpdateNotify($(this))" data="{id}">
        <a href="{link}" class="flex items-start gap-3">
            <div class="flex-1">
                <p class="text-sm italic text-gray-600">{note}</p>
                <div class="text-xs text-gray-400 mt-1">{date}</div>
            </div>
        </a>
      </li>
    `,
  

};

let pageindex = 1;
let pagesize = 50;

var _noti = {
    loadNotify: function () {
        var usr = global_service.CheckLogin();
        $.ajax({
            url: "/Client/Notify",
            type: "POST",
            data: { pageindex, pagesize, token: usr.token },
            success: function (result) {
                $("#Notify").empty();

                // Check dữ liệu trả về
                if (result.status == 0 && result.data != null) {

                    // Badge 🔔 hiển thị số notify chưa đọc (status = 0)
                    $("#coutn-noti").text(result.data.total_not_seen > 0
                        ? result.data.total_not_seen
                        : "0");

                    // Nếu list notify trống thật sự (kể cả đã đọc)
                    if (!result.data.lst_not_seen_detail || result.data.lst_not_seen_detail.length === 0) {
                        $("#Notify").html(
                            `<li class="p-4 text-center text-gray-500">Không có thông báo từ hệ thống</li>`
                        );
                        return;
                    }

                    // Render từng notify
                    result.data.lst_not_seen_detail.forEach(function (item) {
                        var date = (item.seen_date && item.seen_date > 0)
                            ? new Date(item.seen_date * 1000)
                            : new Date();

                        // Chọn template dựa theo seen_status
                        var html;
                        if (item.seen_status == 0) {
                            html = _menu_html.html_menu_notify_active; // chưa xem
                        } else{
                            html = _menu_html.html_menu_notify_detail; // đã xem chi tiết
                        }

                        // Append notify vào danh sách
                        $("#Notify").append(
                            html.replace("{link}", item.link_redirect || "#")
                                .replaceAll("{id}", item.notify_id)
                                .replace("{note}", item.content || "")
                                .replace("{date}", _noti.GetDayText(date))
                        );
                    });
                } else {
                    // Ko có dữ liệu hoặc error
                    $("#coutn-noti").text("0");
                    $("#Notify").html(
                        `<li class="p-4 text-center text-gray-500">Không có thông báo từ hệ thống</li>`
                    );
                }
            }
        });
    },


    GetDayText: function (date) {
        
        return ("0" + date.getDate()).slice(-2) + '/' +
            ("0" + (date.getMonth() + 1)).slice(-2) + '/' +
            date.getFullYear() + ' ' +
            ("0" + date.getHours()).slice(-2) + ':' +
            ("0" + date.getMinutes()).slice(-2);
    },

    UpdateNotify: function (li_id) {
        var usr = global_service.CheckLogin()
        var id = li_id.attr("data");
        $.ajax({
            url: "/Client/updateNotify",
            type: "POST",
            data: { id, seen_status: 2, token: usr.token },
            success: function (result) {
                if (result.status == 0) _noti.loadNotify();
            }
        });
    },

    //UpdateNotifyAll: function () {
    //    var usr = global_service.CheckLogin()
    //    var id = $("#lst_id_not_seen").val()
    //    if (id) {
    //        var list_id = id.split(",").slice(0, 20).toString();
    //        $.ajax({
    //            url: "/Client/updateNotify",
    //            type: "POST",
    //            data: { id: list_id, seen_status: 1, token: usr.token },
    //            success: function (result) {
    //                if (result.status == 0) _noti.loadNotify();
    //            }
    //        });
    //    }
    //},

    listenSSE: function () {
        var usr = global_service.CheckLogin()
        var eventSource = new EventSource(`/Sse/GetCommentsStream?Token=${encodeURIComponent(usr.token)}`);

        eventSource.onopen = function () {
            console.log("SSE opened");
        };

        eventSource.onmessage = function (event) {
            
            var data = JSON.parse(event.data);

            $("#Notify").empty();

            // Badge 🔔 chỉ tính số notify chưa đọc
            $("#coutn-noti").text(data.total_not_seen > 0 ? data.total_not_seen : "0");

            // Nếu list notify trống thật sự
            if (!data.lst_not_seen_detail || data.lst_not_seen_detail.length === 0) {
                $("#Notify").html(
                    `<li class="p-4 text-center text-gray-500">Không có thông báo từ hệ thống</li>`
                );
                return;
            }

            // Có notify thì render ra
            data.lst_not_seen_detail.forEach(function (item) {
                var date = (item.seen_date && item.seen_date > 0)
                    ? new Date(item.seen_date * 1000)
                    : new Date();

                // Chọn template dựa theo seen_status
                var html;
                if (item.seen_status == 0) {
                    html = _menu_html.html_menu_notify_active; // chưa xem
                } else { 
                    html = _menu_html.html_menu_notify_detail; // đã xem chi tiết
                }

                // Append notify vào danh sách
                $("#Notify").append(
                    html.replace("{link}", item.link_redirect || "#")
                        .replaceAll("{id}", item.notify_id)
                        .replace("{note}", item.content || "")
                        .replace("{date}", _noti.GetDayText(date))
                );
            });

            // auto play âm thanh
            document.getElementById("myAudio").play();
            // auto scroll lên đầu
            $("#Notify").scrollTop(0);
        };


        eventSource.onerror = function () {
            console.log("SSE closed");
        };
    }
};
