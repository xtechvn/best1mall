$(document).ready(function () {
    var googleClientId = '231824741925-dr41odfkd6jm8l2oochnt0efvn842t4e.apps.googleusercontent.com'; // Thay YOUR_GOOGLE_CLIENT_ID bằng Client ID của bạn
    var redirectUri = window.location.origin+ '/api/Auth/GoogleSignInCallback'

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
});
