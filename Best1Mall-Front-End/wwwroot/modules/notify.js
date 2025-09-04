$(document).ready(function () {
    

    // Toggle dropdown khi click chuông
    $("#toggle-noti").on("click", function (e) {
        e.preventDefault();
        $("#note-tt").toggleClass("hidden");

        if (!$("#note-tt").hasClass("hidden") && $("#Notify").children().length === 0) {
            // Chỉ gọi loadNotify lần đầu khi mở dropdown
            pageindex = 1;
            has_more = true;
            _noti.loadNotify();
        }
    });

    // Click ngoài đóng dropdown
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".wrap-notifi").length) {
            $("#note-tt").addClass("hidden");
        }
    });

    // Lazy load khi scroll list notify
    $("#Notify").on("scroll", function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight - 30) {
            _noti.loadMoreNotify();
        }
    });

    // Khi load page: chỉ lấy count nhẹ
    _noti.loadCount();
    _noti.listenSSE();
});

var _menu_html = {

    // Notify chưa xem
    html_menu_notify_active: `
  <li class="notify-item bg-purple-50 p-3 hover:bg-gray-100 cursor-pointer transition"
      onclick="_noti.UpdateNotify($(this))" data="{id}">
    <a href="{link}" class="flex items-start gap-3">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">
            {note} <span class="text-xs text-gray-500 ml-2">({date})</span>
          </p>
        </div>
    </a>
  </li>
`,
    
    html_menu_notify_detail: `
  <li class="notify-item bg-gray-100 p-3 hover:bg-gray-200 cursor-pointer transition"
      onclick="_noti.UpdateNotify($(this))" data="{id}">
    <a href="{link}" class="flex items-start gap-3">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">
            {note} <span class="text-xs text-gray-500 ml-2">({date})</span>
          </p>
        </div>
    </a>
  </li>
`,


};

let pageindex = 1;
let pagesize = 5;
let loading = false;
let has_more = true; // ✅ thêm cờ này

var _noti = {
    // ✅ API count cho badge
    loadCount: function () {
        debugger
        var usr = global_service.CheckLogin();
        $.ajax({
            url: "/Client/NotifyCount",
            type: "POST",
            data: { token: usr.token },
            success: function (result) {
                debugger
                if (result.status == 0 && result.data !== undefined) {
                    $("#coutn-noti").text(result.data > 0 ? result.data : "0");
                }
            },
            error: function () {
                $("#coutn-noti").text("0");
            }
        });
    },
    loadNotify: function () {
        
        if (loading || !has_more) return; // ✅ nếu đang loading hoặc hết data thì không gọi nữa
        loading = true;

        var usr = global_service.CheckLogin();

        if (pageindex === 1) {
            $("#Notify").empty();
        }
        // nhớ lại scroll pos trước khi render
        let oldScroll = $("#Notify").scrollTop();
        $("#Notify").append(`<li id="loading" class="p-4 text-center text-gray-400">Đang tải...</li>`);

        $.ajax({
            url: "/Client/Notify",
            type: "POST",
            data: { pageindex, pagesize, token: usr.token },
            success: function (result) {
                
                $("#loading").remove();
                loading = false;

                if (pageindex === 1) {
                    $("#coutn-noti").text(
                        result.data && result.data.total_not_seen > 0
                            ? result.data.total_not_seen
                            : "0"
                    );
                }

                if (result.status == 0 && result.data != null) {
                    
                    let list = result.data.lst_not_seen_detail;

                    if (!list || list.length === 0) {
                        has_more = false; // ✅ hết dữ liệu
                        if (pageindex === 1) {
                            $("#Notify").html(`<li class="p-4 text-center text-gray-500">Không có thông báo</li>`);
                        } else {
                            $("#Notify").append(`<li class="p-4 text-center text-gray-400">Hết thông báo</li>`);
                        }
                        return;
                    }

                    // Nếu trả về ít hơn pagesize → cũng coi như hết
                    if (list.length < pagesize) {
                        has_more = false; // ✅ đánh dấu hết notify
                    }

                    list.forEach(function (item) {
                        ;
                        if (!item || !item.content || item.content === "null" || item.content.trim() === "") {
                            return; // ❌ bỏ qua notify rỗng hoặc content = "null"
                        }

                        var date = (item.seen_date && item.seen_date > 0)
                            ? new Date(item.seen_date * 1000)
                            : new Date();

                        var html;
                        if (item.seen_status == 0) {
                            html = _menu_html.html_menu_notify_active;
                        } else if (item.seen_status == 1) {
                            html = _menu_html.html_menu_notify_overview; // nếu ông có template status=1
                        } else {
                            html = _menu_html.html_menu_notify_detail;
                        }

                        $("#Notify").append(
                            html.replaceAll("{link}", item.link_redirect || "#")
                                .replaceAll("{id}", item.notify_id)
                                .replaceAll("{note}", item.content || "(Không có nội dung)")
                                .replaceAll("{date}", _noti.GetDayText(date))
                        );
                    });
                    // khôi phục lại scroll pos (chỉ khi loadMore)
                    if (pageindex > 1) {
                        $("#Notify").scrollTop(oldScroll);
                    }


                }
            },
            error: function () {
                $("#loading").remove();
                loading = false;
            }
        });
    },

    loadMoreNotify: function () {
        if (!has_more || loading) return; // ✅ check trước khi gọi
        pageindex++;
        _noti.loadNotify();
    },

    // Format date
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

    // SSE realtime
    listenSSE: function () {
        var usr = global_service.CheckLogin()
        var eventSource = new EventSource(`/Sse/GetCommentsStream?Token=${encodeURIComponent(usr.token)}`);

        eventSource.onopen = function () {
            console.log("SSE opened");
        };

        eventSource.onmessage = function (event) {
            var data = JSON.parse(event.data);

            if (data.total_not_seen !== undefined) {
                $("#coutn-noti").text(data.total_not_seen > 0 ? data.total_not_seen : "0");
            }

            // Notify mới
            if (data.notify_id && !$("#Notify li[data='" + data.notify_id + "']").length) {
                let html = _menu_html.html_menu_notify_active
                    .replace("{link}", data.link_redirect || "#")
                    .replaceAll("{id}", data.notify_id)
                    .replace("{note}", data.content || "")
                    .replace("{date}", _noti.GetDayText(new Date(data.seen_date * 1000 || Date.now())));

                $("#Notify").prepend(html);
            }

            // Notify update (seen_status đổi)
            if (data.notify_id && $("#Notify li[data='" + data.notify_id + "']").length) {
                let li = $("#Notify li[data='" + data.notify_id + "']");
                if (data.seen_status == 1 || data.seen_status == 2) {
                    li.removeClass("bg-purple-50").addClass("bg-gray-100");
                    li.find("p").addClass("italic text-gray-600");
                }
            }

            document.getElementById("myAudio").play();
            //$("#Notify").scrollTop(0);
        };

        eventSource.onerror = function () {
            console.log("SSE closed");
        };
    }
};
