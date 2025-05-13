$(document).ready(function () {
    var googleClientId = '231824741925-dr41odfkd6jm8l2oochnt0efvn842t4e.apps.googleusercontent.com'; // Thay YOUR_GOOGLE_CLIENT_ID bằng Client ID của bạn
    var redirectUri = 'http://qc-fe-hulotoy.x-tech.vn/api/Auth/GoogleSignInCallback'
    //google.accounts.id.initialize({
    //    client_id: googleClientId,
    //    callback: handleCredentialResponse
    //});
    //$('.btn-login-gg').on('click', function () {
    //    google.accounts.id.prompt(); // Hiển thị popup đăng nhập Google
    //});
    //var googleAuthClient;

    //function initializeGoogleSignIn() {
    //    googleAuthClient = google.accounts.oauth2.initCodeClient({
    //        client_id: googleClientId,
    //        scope: 'openid email profile', // Các scope bạn muốn yêu cầu
    //        redirect_uri: '', // Để trống vì chúng ta xử lý bằng callback
    //        response_type: 'code' // Sử dụng code flow
    //    });
    //}


    //function handleCredentialResponse(response) {
    //    // response.credential chứa ID token
    //    console.log("Encoded JWT ID token: " + response.credential);
    //    // Gửi ID token này lên backend để xác thực và lấy thông tin người dùng
    //    $.ajax({
    //        url: '/client/GoogleLogin', // Endpoint API backend của bạn để xử lý đăng nhập Google
    //        type: 'POST',
    //        contentType: 'application/json',
    //        data: JSON.stringify({ idToken: response.credential }),
    //        success: function (res) {
    //            if (res.is_success) {
    //                if ($('#dangnhap .checkbox').is(":checked")) {
    //                    localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
    //                } else {
    //                    sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
    //                }
    //                window.location.reload()
    //            }
    //            else {
    //                $(':input[type="submit"]').prop('disabled', false);

    //                $('#dangnhap .user input').closest('.form-group').find('.err').show()
    //                $('#dangnhap .user input').closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
    //                element.html('Đăng nhập')
    //                element.prop("disabled", false);

    //            }
    //        },
    //        error: function (error) {
    //            console.error('Lỗi khi gửi ID token lên backend:', error);
    //            // Xử lý lỗi đăng nhập
    //        }
    //    });
    //}
    $('.btn-login-gg').on('click', function () {
        // Xác định URL ủy quyền của Google
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + googleClientId + '&redirect_uri=' + redirectUri + '&response_type=code&scope=openid%20profile%20email&prompt=select_account';

        // Mở popup
        const popupWindow = window.open(googleAuthUrl, 'google_login', 'width=600,height=500');
        // Theo dõi cửa sổ popup và xử lý khi nó đóng
        const popupInterval = setInterval(() => {
            if (popupWindow && popupWindow.closed) {
                clearInterval(popupInterval);
                // Kiểm tra xem dữ liệu đã được truyền từ popup chưa
                var token_local = localStorage.getItem(STORAGE_NAME.Login);
                if (token_local == null || token_local == undefined || token_local.trim() == '' || token_local.trim() == 'null'
                    || token_local.trim() == 'undefined') {
                    $(':input[type="submit"]').prop('disabled', false);

                    $('#dangnhap .user input').closest('.form-group').find('.err').show()
                    $('#dangnhap .user input').closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
                } else {
                   
                    window.location.reload();

                }
            }
        }, 500);
    });

    // Hàm để xử lý mã ủy quyền (code) trả về từ Google sau khi redirect
    //function handleGoogleSignInCallback() {
    //    const urlParams = new URLSearchParams(window.location.search);
    //    const code = urlParams.get('code');

    //    if (code) {
    //        // Gửi mã ủy quyền (code) đến backend của bạn để trao đổi lấy access token và thông tin người dùng
    //        $.ajax({
    //            url: '/api/Auth/GoogleSignInCallback', // Endpoint trên server để xử lý callback
    //            type: 'POST',
    //            data: { code: code },
    //            success: function (result) {
    //                // Xử lý kết quả đăng nhập từ server (ví dụ: lưu token vào localStorage, chuyển hướng trang)
    //                localStorage.setItem('authToken', result.token);
    //                window.location.href = '/dashboard'; // Chuyển hướng sau khi đăng nhập thành công
    //            },
    //            error: function (error) {
    //                console.error('Lỗi trong callback đăng nhập Google:', error);
    //                // Hiển thị thông báo lỗi cho người dùng
    //            }
    //        });
    //    } else if (urlParams.get('error')) {
    //        // Xử lý lỗi trả về từ Google
    //        console.error('Lỗi từ Google:', urlParams.get('error'));
    //        // Hiển thị thông báo lỗi cho người dùng
    //    }
    //}

    //// Kiểm tra xem có mã ủy quyền (code) hoặc lỗi trong URL hay không khi trang được tải
    //handleGoogleSignInCallback();
});
