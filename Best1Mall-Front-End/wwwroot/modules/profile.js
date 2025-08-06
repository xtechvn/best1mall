let originalProfileData = null;
$(document).ready(function () {
    if ($('#profile').length > 0) {
        profile_client.Initialization()

    }
    $("#fullName, #email, #phone, input[name='gender'], #dob").on("input change", function () {
        if (hasProfileChanged()) {
            enableUpdateButton(true);
        } else {
            enableUpdateButton(false);
        }
    });

    //Update Pròile

});
function hasProfileChanged() {
    const fullName = $("#fullName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const gender = $('input[name="gender"]:checked').val();
    const dob = $("#dob").val();

    return (
        fullName !== originalProfileData.fullName ||
        email !== originalProfileData.email ||
        phone !== originalProfileData.phone ||
        gender !== originalProfileData.gender ||
        dob !== originalProfileData.birth_day
    );
}

// ✅ Bật / tắt nút cập nhật
function enableUpdateButton(enable) {
    const btn = $("#btnUpdate");
    if (enable) {
        btn.prop("disabled", false)
            .removeClass("bg-gray-300 text-white cursor-not-allowed opacity-70")
            .addClass("bg-blue-500 text-white cursor-pointer");
    } else {
        btn.prop("disabled", true)
            .removeClass("bg-blue-500 text-white cursor-pointer")
            .addClass("bg-gray-300 text-white cursor-not-allowed opacity-70");
    }
}


var profile_client = {
    Initialization: function () {
        profile_client.GetProfile();
        $("#btnUpdate").click(function (e) {
            
            e.preventDefault();

            // Clear tất cả lỗi cũ
            $(".error-message").text("");

            const fullName = $("#fullName").val().trim();
            const email = $("#email").val().trim();
            const phone = $("#phone").val().trim();
            const gender = $('input[name="gender"]:checked').val();
            const dob = $("#dob").val();


            let isValid = true;

            // Validate Họ và tên
            // Validate Họ và tên
            const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s]+$/; // Cho phép chữ, số, dấu tiếng Việt, khoảng trắng

            if (fullName === "") {
                $("#error-fullName").text("Vui lòng nhập họ và tên");
                isValid = false;
            } else if (!nameRegex.test(fullName)) {
                $("#error-fullName").text("Họ và tên không được chứa ký tự đặc biệt");
                isValid = false;
            }


            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === "") {
                $("#error-email").text("Vui lòng nhập email");
                isValid = false;
            } else if (!emailRegex.test(email)) {
                $("#error-email").text("Email không hợp lệ");
                isValid = false;
            }

            // Validate Số điện thoại
            const phoneRegex = /^(0[1-9])+([0-9]{8,9})$/;
            if (phone === "") {
                $("#error-phone").text("Vui lòng nhập số điện thoại");
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                $("#error-phone").text("Số điện thoại không hợp lệ");
                isValid = false;
            }
            // Validate giới tính
            if (!gender) {
                $("#error-gender").text("Vui lòng chọn giới tính");
                isValid = false;
            }

            // Validate ngày sinh
            if (!dob) {
                $("#error-dob").text("Vui lòng chọn ngày sinh");
                isValid = false;
            }


            // Nếu có lỗi thì dừng lại
            if (!isValid) return;

            // Gửi lên server
            const usr = global_service.CheckLogin();
            if (!usr || !usr.token) {
                alert("Bạn chưa đăng nhập!");
                return;
            }

            const request = {
                token: usr.token,
                ClientName: fullName,
                Email: email,
                Phone: phone,
                Gender: gender,
                BirthDay: dob
            };

            $.when(global_service.POST(API_URL.UpdateProfile, request))
                .done(function (result) {
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
                        // Có thể hiện toast nhỏ nếu cần
                        usr.name = request.ClientName;
                        sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(usr));
                        originalProfileData = {
                            fullName: fullName,
                            email: email,
                            phone: phone,
                            gender: gender,
                            birth_day: dob
                        };

                        enableUpdateButton(false);
                        profile_client.GetProfile();

                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật thất bại',
                            text: 'Vui lòng thử lại sau '
                        });
                    }
                })
                .fail(function () {
                    alert("Lỗi kết nối server khi gọi API hồ sơ");
                });
        });

    },
    GetProfile: function () {
        
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
            
            if (result && result.is_success && result.data) {
                const data = result.data;
                originalProfileData = {
                    fullName: data.clientName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    gender: data.gender || "",
                    birth_day: data.birthday ? data.birthday.substring(0, 10) : ""
                };

                $("#fullName").val(originalProfileData.fullName);
                $("#email").val(originalProfileData.email);
                $("#phone").val(originalProfileData.phone);
                $("#dob").val(originalProfileData.birth_day);
                if (originalProfileData.gender) {
                    $(`input[name='gender'][value='${originalProfileData.gender}']`).prop("checked", true);
                }
                enableUpdateButton(false);

                
            } else {
                alert("Không lấy được thông tin người dùng");
            }
        })
            .fail(function () {
                alert("Lỗi kết nối server khi gọi API hồ sơ");
            });

    },
}