$(document).ready(function () {
    if ($('#profile').length > 0) {
        profile_client.Initialization()

    }
    
    //Update Pròile
   
})
var profile_client = {
    Initialization: function () {
        profile_client.GetProfile();
        $("#btnUpdate").click(function (e) {
            debugger
            e.preventDefault();

            const usr = global_service.CheckLogin();
            if (!usr || !usr.token) {
                alert("Bạn chưa đăng nhập!");
                return;
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
                debugger
                if (result && result.is_success && result.data) {
                    

                    // ✅ Thông báo thành công với SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: 'Cập nhật thành công!',
                        text: 'Thông tin của bạn đã được cập nhật rồi đó 💖',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end'
                    });

                    
                  
                    // ✅ Cập nhật session
                    usr.name = request.ClientName;


                    sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(usr))
                    // ✅ Cập nhật UI trực tiếp
                    //$("#fullName").val(request.ClientName || "");
                    //$("#email").val(request.Email || "");
                    //$("#phone").val(request.Phone || "");
                    // 🔄 Gọi lại API lấy profile để chắc chắn đồng bộ UI
                    profile_client.GetProfile();
                    
                    

                   
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cập nhật thất bại',
                        text: 'Vui lòng thử lại sau 😥'
                    });
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
            debugger
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

    },
}