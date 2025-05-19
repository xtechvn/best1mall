$(document).ready(function () {
    if ($('#profile').length > 0) {
        address_client.Initialization()

    }
    
    //Update Pròile
   
})
var address_client = {
    Initialization: function () {
        address_client.GetProfile();
        $("#btnUpdate").click(function (e) {
            debugger
            e.preventDefault();

            const usr = global_service.CheckLogin();
            if (!usr || !usr.token) {
                alert("Bạn chưa đăng nhập!");
                return;
            }

            const gender = $("input[name='gender']:checked").val() || null;
            const year = $("#year").val();
            const month = $("#month").val();
            const day = $("#day").val();
            let birthday = null;

            if (year && month && day) {
                birthday = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }

            

            // Gửi dạng {"token": "...", "data": "{...jsonstring...}"}
            const request = {
                token: usr.token,
                ClientName: $("#fullName").val(),
                Email: $("#email").val(),
                Phone: $("#phone").val(),
            };

            $.when(
                global_service.POST(API_URL.UpdateProfile, request)
            ).done(function (result) {
                debugger;
                if (result && result.is_success && result.data) {
                    const data = result.data;

                    $("#fullName").val(data.clientName || "");
                    $("#email").val(data.email || "");
                    $("#phone").val(data.phone || "");

                    // Giới tính (check nếu có)
                    if (data.gender) {
                        $("input[name='gender'][value='" + data.gender + "']").prop("checked", true);
                    }

                    // Ngày sinh (check nếu có)
                    if (data.birthday) {
                        const birthDate = new Date(data.birthday);
                        $("#day").val(birthDate.getDate());
                        $("#month").val(birthDate.getMonth() + 1);
                        $("#year").val(birthDate.getFullYear());
                    }
                } else {
                    alert("Không lấy được thông tin người dùng");
                }
            })
                .fail(function () {
                    alert("Lỗi kết nối server khi gọi API hồ sơ");
                });
        });
    },
    GetProfile: function () {
        debugger
        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }

        var request = {
            "token": usr.token
        }
        $.when(
            global_service.POST(API_URL.ProfileList, request)
        ).done(function (result) {
            debugger;
            if (result && result.is_success && result.data) {
                const data = result.data;
                sessionStorage.setItem(STORAGE_NAME.Profile, JSON.stringify(data))

                $("#fullName").val(data.clientName || "");
                $("#email").val(data.email || "");
                $("#phone").val(data.phone || "");

                // Giới tính (check nếu có)
                if (data.gender) {
                    $("input[name='gender'][value='" + data.gender + "']").prop("checked", true);
                }

                // Ngày sinh (check nếu có)
                if (data.birthday) {
                    const birthDate = new Date(data.birthday);
                    $("#day").val(birthDate.getDate());
                    $("#month").val(birthDate.getMonth() + 1);
                    $("#year").val(birthDate.getFullYear());
                }
            } else {
                alert("Không lấy được thông tin người dùng");
            }
        })
            .fail(function () {
                alert("Lỗi kết nối server khi gọi API hồ sơ");
            });

    },
}