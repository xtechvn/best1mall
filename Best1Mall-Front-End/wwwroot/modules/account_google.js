var googleClientId = '231824741925-dr41odfkd6jm8l2oochnt0efvn842t4e.apps.googleusercontent.com'; 

$(document).ready(function () {

    account_google.getGoogleClientIdSync()
    account_google.DynamicBind()
    
});
var account_google = {
    DynamicBind: function () {

        $('.btn-login-gg').on('click', function () {
            var redirectUri = window.location.origin + '/api/Auth/GoogleSignInCallback'
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

                        $('#login-form .user input').closest('.mb-4').find('.err').show()
                        $('#login-form .user input').closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
                    } else {

                        window.location.reload();

                    }
                }
            }, 500);
        });
        $('.btn-register-gg').on('click', function () {
            var redirectUri = window.location.origin + '/api/Auth/GoogleRegisterCallback'
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

                        $('#login-form .user input').closest('.mb-4').find('.err').show()
                        $('#login-form .user input').closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
                    } else {

                        window.location.reload();

                    }
                }
            }, 500);
        });
    },
    getGoogleClientIdSync: function () {
        $.ajax({
            url: '/Home/GetGoogleClientId', // Đảm bảo đường dẫn URL là chính xác
            type: 'GET',
            dataType: 'json',
            async: false, // Quan trọng: Đặt thành false để thực hiện đồng bộ
            success: function (response) {
                if (response.is_success) {
                    googleClientId = response.data;
                } else {
                    console.error('Lỗi khi lấy Google Client ID:', response);
                }
            },
            error: function (xhr, status, error) {
            }
        });
    }
}