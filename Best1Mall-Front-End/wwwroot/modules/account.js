$(document).ready(function () {
    account.Initialization()
})
function SyncSessionCartToServer() {
    
    var usr = global_service.CheckLogin();
    if (!usr) return;

    let cart = JSON.parse(sessionStorage.getItem(STORAGE_NAME.Cart)) || [];
    if (cart.length === 0) return;

    let syncCount = 0;

    cart.forEach(item => {
        
        let request = {
            product_id: item.product_id,
            quanity: item.quanity,
            token: usr.token
        };
        $.when(global_service.POST(API_URL.AddToCart, request)).done(function (result) {
            
            if (result.is_success && result.data) {
                syncCount++;
                if (syncCount === cart.length) {
                    sessionStorage.removeItem(STORAGE_NAME.Cart);
                    global_service.LoadCartCount();
                    resolve(); // ✅ báo hiệu xong
                }
            }
        });
        
    });
}


var account = {
    Data: {
        SendCodeTimeout: false,
        PasswordLength: 6,
    },
    Initialization: function () {
        if ($('#forgot-password-change').length > 0) {
            account.DynamicBindChangePassword()
            if ($('#forgot-password-change').attr('data-type')==2) {
                account.RenderHTML()
                account.DynamicBind()
            }
        }
        else {
            account.RenderHTML()
            account.DynamicBind()
        }
     
    },
    DynamicBindChangePassword: function () {
        var notification_empty ='Vui lòng không để trống'
        var notification_diffirent = 'Mật khẩu và Xác nhận mật khẩu phải giống nhau'
        var usr = global_service.CheckLogin()
        var token = ''
        if (usr) {
            token = usr.token

        }
        $("body").on('click', "#change-password-confirm", function () {
            $('#forgot-password-change .content .err-form').hide()
            var request = {
                "token": token,
                "password": $('#forgot-password-change .new-password input').val(),
                "confirm_password": $('#forgot-password-change .confirm-new-password input').val()
            }
            if (request.password == null || request.password.trim() == '') {
                $('.new-password .err').html(notification_empty)
                $('.new-password .err').show()
                return
            } else {
                $('.new-password .err').hide()
            }
            if (request.confirm_password == null || request.confirm_password.trim() == '') {
                $('.confirm-new-password .err').html(notification_empty)
                $('.confirm-new-password .err').show()
                return
            }
            else {
                $('.confirm-new-password .err').hide()
            }
            if (request.password != request.confirm_password) {
                $('.confirm-new-password .err').html(notification_diffirent)
                $('.confirm-new-password .err').show()
                return
            }
            else {
                $('.confirm-new-password .err').hide()
            }
            $.when(
                global_service.POST(API_URL.ChangePassword, request)
            ).done(function (res) {
                if (res.is_success == true) {
                    $('#forgot-password-change .content .err-form').html(res.msg)
                    $('#forgot-password-change .content .err-form').show()
                    $('#change-password-confirm input').val('')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                }
                else {
                    $('#forgot-password-change .content .err-form').html(res.msg)
                    $('#forgot-password-change .content .err-form').show()
                }
            })
        });
        $("body").on('keyup', "#change-password-confirm input", function () {
            $('.confirm-new-password .err').hide()
            $('.new-password .err').hide()
        });
    },
    RenderHTML: function () {
       
        $('.err').hide()
        var usr = global_service.CheckLogin()
        const $wrapper = $('#accountButton');
        if (usr) {
            if (usr.token == null || usr.token == undefined) {
                account.Logout()
            }
            $('#client-account-name').html('Xin chào, '+usr.name )
            $('#client-account-name').closest('a').attr('href', '/order')
            $('#client-account-name').closest('a').removeAttr('data-id')
            $('#client-account-name').closest('a').addClass('client-logged')
            $('#client-account-name').closest('a').removeClass('client-login')
            // Thêm dropdown vào DOM
            const dropdownHTML = `
             <div id="accountDropdown "
                         class=" absolute top-full right-0  w-56 bg-white text-slate-900 shadow-lg border border-gray-200 rounded-xl p-4 z-50  hidden md:group-hover:block">
                        <a href="/Client/Profile" class="flex items-center gap-2 text-sm py-1 hover:text-purple-600">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.6484 19.875C20.2206 17.4066 18.0203 15.6366 15.4525 14.7975C16.7226 14.0414 17.7094 12.8892 18.2614 11.5179C18.8134 10.1467 18.8999 8.63213 18.5078 7.2069C18.1157 5.78167 17.2666 4.52456 16.0909 3.62862C14.9151 2.73268 13.4778 2.24745 11.9996 2.24745C10.5215 2.24745 9.08414 2.73268 7.90842 3.62862C6.73269 4.52456 5.88358 5.78167 5.49146 7.2069C5.09935 8.63213 5.18592 10.1467 5.73788 11.5179C6.28984 12.8892 7.27668 14.0414 8.54683 14.7975C5.97902 15.6356 3.77871 17.4056 2.35089 19.875C2.29853 19.9604 2.2638 20.0554 2.24875 20.1544C2.2337 20.2534 2.23863 20.3544 2.26326 20.4515C2.28789 20.5486 2.33171 20.6398 2.39214 20.7196C2.45257 20.7995 2.52838 20.8665 2.6151 20.9165C2.70183 20.9666 2.79771 20.9989 2.89709 21.0113C2.99647 21.0237 3.09733 21.0161 3.19373 20.989C3.29012 20.9618 3.3801 20.9156 3.45835 20.8531C3.5366 20.7906 3.60154 20.713 3.64933 20.625C5.41558 17.5725 8.53746 15.75 11.9996 15.75C15.4618 15.75 18.5837 17.5725 20.35 20.625C20.3977 20.713 20.4627 20.7906 20.5409 20.8531C20.6192 20.9156 20.7092 20.9618 20.8056 20.989C20.902 21.0161 21.0028 21.0237 21.1022 21.0113C21.2016 20.9989 21.2975 20.9666 21.3842 20.9165C21.4709 20.8665 21.5467 20.7995 21.6072 20.7196C21.6676 20.6398 21.7114 20.5486 21.736 20.4515C21.7607 20.3544 21.7656 20.2534 21.7505 20.1544C21.7355 20.0554 21.7008 19.9604 21.6484 19.875ZM6.74964 9C6.74964 7.96165 7.05755 6.94662 7.63443 6.08326C8.21131 5.2199 9.03124 4.54699 9.99056 4.14963C10.9499 3.75227 12.0055 3.64831 13.0239 3.85088C14.0423 4.05345 14.9777 4.55347 15.712 5.28769C16.4462 6.02192 16.9462 6.95738 17.1488 7.97578C17.3513 8.99418 17.2474 10.0498 16.85 11.0091C16.4527 11.9684 15.7797 12.7883 14.9164 13.3652C14.053 13.9421 13.038 14.25 11.9996 14.25C10.6077 14.2485 9.27322 13.6949 8.28898 12.7107C7.30473 11.7264 6.75113 10.3919 6.74964 9Z"
                                      fill="#773EFA" />
                            </svg>
                            Thông tin tài khoản
                        </a>
                        <a href="/order" class="flex items-center gap-2 text-sm py-1 hover:text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <path d="M20.0306 7.71938L14.7806 2.46938C14.7109 2.39975 14.6282 2.34454 14.5371 2.3069C14.4461 2.26926 14.3485 2.24992 14.25 2.25H5.25C4.85218 2.25 4.47064 2.40804 4.18934 2.68934C3.90804 2.97064 3.75 3.35218 3.75 3.75V20.25C3.75 20.6478 3.90804 21.0294 4.18934 21.3107C4.47064 21.592 4.85218 21.75 5.25 21.75H18.75C19.1478 21.75 19.5294 21.592 19.8107 21.3107C20.092 21.0294 20.25 20.6478 20.25 20.25V8.25C20.2501 8.15148 20.2307 8.05391 20.1931 7.96286C20.1555 7.87182 20.1003 7.78908 20.0306 7.71938ZM15 4.81031L17.6897 7.5H15V4.81031ZM18.75 20.25H5.25V3.75H13.5V8.25C13.5 8.44891 13.579 8.63968 13.7197 8.78033C13.8603 8.92098 14.0511 9 14.25 9H18.75V20.25ZM15.75 12.75C15.75 12.9489 15.671 13.1397 15.5303 13.2803C15.3897 13.421 15.1989 13.5 15 13.5H9C8.80109 13.5 8.61032 13.421 8.46967 13.2803C8.32902 13.1397 8.25 12.9489 8.25 12.75C8.25 12.5511 8.32902 12.3603 8.46967 12.2197C8.61032 12.079 8.80109 12 9 12H15C15.1989 12 15.3897 12.079 15.5303 12.2197C15.671 12.3603 15.75 12.5511 15.75 12.75ZM15.75 15.75C15.75 15.9489 15.671 16.1397 15.5303 16.2803C15.3897 16.421 15.1989 16.5 15 16.5H9C8.80109 16.5 8.61032 16.421 8.46967 16.2803C8.32902 16.1397 8.25 15.9489 8.25 15.75C8.25 15.5511 8.32902 15.3603 8.46967 15.2197C8.61032 15.079 8.80109 15 9 15H15C15.1989 15 15.3897 15.079 15.5303 15.2197C15.671 15.3603 15.75 15.5511 15.75 15.75Z"
                                      fill="#773EFA" />
                            </svg> Đơn hàng của tôi
                        </a>
                        <a href="/favourite" class="flex items-center gap-2 text-sm py-1 hover:text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <path d="M16.6875 3.75C14.7516 3.75 13.0566 4.5825 12 5.98969C10.9434 4.5825 9.24844 3.75 7.3125 3.75C5.77146 3.75174 4.29404 4.36468 3.20436 5.45436C2.11468 6.54404 1.50174 8.02146 1.5 9.5625C1.5 16.125 11.2303 21.4369 11.6447 21.6562C11.7539 21.715 11.876 21.7458 12 21.7458C12.124 21.7458 12.2461 21.715 12.3553 21.6562C12.7697 21.4369 22.5 16.125 22.5 9.5625C22.4983 8.02146 21.8853 6.54404 20.7956 5.45436C19.706 4.36468 18.2285 3.75174 16.6875 3.75ZM12 20.1375C10.2881 19.14 3 14.5959 3 9.5625C3.00149 8.41921 3.45632 7.32317 4.26475 6.51475C5.07317 5.70632 6.16921 5.25149 7.3125 5.25C9.13594 5.25 10.6669 6.22125 11.3062 7.78125C11.3628 7.91881 11.4589 8.03646 11.5824 8.11926C11.7059 8.20207 11.8513 8.24627 12 8.24627C12.1487 8.24627 12.2941 8.20207 12.4176 8.11926C12.5411 8.03646 12.6372 7.91881 12.6937 7.78125C13.3331 6.21844 14.8641 5.25 16.6875 5.25C17.8308 5.25149 18.9268 5.70632 19.7353 6.51475C20.5437 7.32317 20.9985 8.41921 21 9.5625C21 14.5884 13.71 19.1391 12 20.1375Z"
                                      fill="#773EFA" />
                            </svg> Sản phẩm yêu thích
                        </a>
                        <button type="button" id="account-logout" class="w-full mt-3 text-purple-600 border border-purple-600 rounded-full py-1 hover:bg-purple-50">
                            Đăng xuất
                        </button>
                    </div>
        `;
            $wrapper.append(dropdownHTML);
        }
    },
    DynamicBind: function () {
        //$("body").on('change', "#login-form input, #register-form input", function () {
        //    var element = $(this)
        //    account.ValidateInput(element)
        //});
        $("body").on('keyup', "#login-form input, #register-form input", function () {
            var element = $(this)
            account.ValidateInput(element)

        });
        $("body").on('focusout', "#login-form input, #register-form input", function () {
            var element = $(this)
            account.ValidateInput(element)

        });
        $("body").on('keyup', "#register-form input", function () {
           
            if (account.ValidateRegisterNoNotify() == true && !$('#register-form').hasClass('hidden')) {
                $('#btn-client-register').removeAttr('disabled')
                $('#btn-client-register').removeProp('disabled')
                $('#btn-client-register').css('background-color', '');

            } else {
                $('#btn-client-register').attr('disabled', 'disabled')
                $('#btn-client-register').prop('disabled',true)
                $('#btn-client-register').css('background-color', 'lightgray');
            }
        });
        $("body").on('keyup', "#login-form input", function () {

            if (account.ValidateLoginNoNotify() == true && !$('#login-form').hasClass('hidden')) {
                $('#btn-client-login').removeAttr('disabled')
                $('#btn-client-login').removeProp('disabled')
                $('#btn-client-login').css('background-color', '');

            } else {
                $('#btn-client-login').attr('disabled', 'disabled')
                $('#btn-client-login').prop('disabled', true)
                $('#btn-client-login').css('background-color', 'lightgray');
            }
        });
        $("body").on('focusin', "#login-form input, #register-form input", function () {
            var element = $(this)
            $('#register-general-err .err').hide()
            $('#register-general-err .err').html(NOTIFICATION_MESSAGE.EmptyField)
            $('#login-general-err .err').hide()
            $('#login-general-err .err').html(NOTIFICATION_MESSAGE.EmptyField)
            element.closest('.mb-4').find('.err').hide()
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmptyField)
        });
        $("body").on('click', "#btn-client-login", function (e) {
            e.preventDefault()
            account.Login()
        });
        $("body").on('click', "#account-logout", function (e) {
            account.Logout()
        });
        $("body").on('click', "#logout-action", function () {
            $('#dangxuat').addClass('overlay-active')
        });
        $("body").on('click', "#btn-client-register", function (e) {
            e.preventDefault()

            account.Register()
        });
        $("body").on('click', ".ghinho", function () {
            var element = $(this)
            if (element.find('input').is(':checked')) {
                element.find('input').prop('checked', false);
            } else {
                element.find('input').prop('checked', true);
            }
        });
        $("body").on('click', "#logout-action", function () {
            $('#dangxuat').addClass('overlay-active')
        });
        //$("body").on('click', ".btn-login-fb", function () {
        //    FB.getLoginStatus(function (response) {
        //        FacebookLogin();

        //    });
        //});
        $("body").on('keyup', "#forgot-password-email", function () {
            $("#forgot-password-email").closest('.box-email').find('.err').hide()

        });
        $("body").on('click', ".forgot-pass", function () {
            $('#quenmk').addClass('overlay-active')
        });
        $("body").on('click', "#forgot-password-btn", function () {
            account.ConfirmForgotPassword()

        });
        $("body").on('click', "#tab-login", function () {
            $('#tab-login').addClass('text-purple-500')
            $('#tab-login').addClass('border-b-3')
            $('#tab-login').addClass('border-purple-500')
            $('#tab-register').removeClass('text-purple-500')
            $('#tab-register').removeClass('border-b-3')
            $('#tab-register').removeClass('border-purple-500')
            $('#login-form').removeClass('hidden')
            $('#register-form').addClass('hidden')

        });
        $("body").on('click', "#tab-register", function () {
            $('#tab-login').removeClass('text-purple-500')
            $('#tab-login').removeClass('border-b-3')
            $('#tab-login').removeClass('border-purple-500')
            $('#tab-register').addClass('text-purple-500')
            $('#tab-register').addClass('border-b-3')
            $('#tab-register').addClass('border-purple-500')
            $('#login-form').addClass('hidden')
            $('#register-form').removeClass('hidden')

        });
        $("body").on('click', "#register-send-code", function (e) {
            e.preventDefault()

            account.RegisterEmailSendCode()

        });
    },
    Login: function () {
        
        var element = $('#btn-client-login')
        if (account.ValidateLogin()) {
            $(':input[type="submit"]').prop('disabled', true);
            element.html('Vui lòng chờ ....')
            element.prop("disabled", true);
            var request = {
                "user_name": $('#login-usr').val(),
                "password": $('#login-pwd').val(),
                "remember_me": $('#login-remember').is(":checked"),
                "token": '',
                "type": 1
            }
            $.when(
                global_service.POST(API_URL.Login, request)
            ).done(function (res) {
                
                if (res.is_success) {
                    if ($('#login-remember').is(":checked")) {
                        localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                    } else {
                        sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                    }
                    // 👉 Sau khi login thành công → Đồng bộ giỏ hàng
                    SyncSessionCartToServer();
                    window.location.reload()
                }
                else {
                    $('#login-general-err .err').show()
                    $('#login-general-err .err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
                    
                    element.html('Đăng nhập')
                    element.prop("disabled", false);

                }

            })
          
        }
    },
    Logout: function () {
        localStorage.removeItem(STORAGE_NAME.Login)
        sessionStorage.removeItem(STORAGE_NAME.Login)
        sessionStorage.removeItem(STORAGE_NAME.Cart);
        window.location.href='/'
    },
    Register: function () {
        var element = $('#btn-client-register')
        if (account.ValidateRegister()) {
            element.html('Vui lòng chờ ....')
            $(':input[type="submit"]').prop('disabled', true);
            $('.err-gg-account').hide()
            var token = $('#register-detail').attr('data-token') == undefined ? '' : $('#register-detail').attr('data-token')
            var request = {
                "user_name": $('#register-form .user input').val(),
                "email": $('#register-form .email input').val(),
                "phone": $('#register-form .tel input').val(),
                "password": $('#register-form .register-password input').val(),
                "confirm_password": $('#register-form .confirm-password input').val(),
                "is_receive_email": $('#register-form .checkbox').is(":checked"),
                "token": token,
                "type": parseInt($('#register-detail').attr('data-type')),
                otp_code: $('#register-form .otp-code input').val()
            }
            $.when(
                global_service.POST(API_URL.Register, request)
            ).done(function (res) {
                if (res.is_success) {
                    //$('.client-login-popup').removeClass('overlay-active')
                    //$('#success').addClass('overlay-active')
                    setTimeout(() => {
                        if ($('#login-form .checkbox').is(":checked")) {
                            localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data.data))
                        } else {
                            sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data.data))
                        }
                        window.location.reload()
                    }, 2000);
                }
                else {
                    if (res.data != null && res.data.code != undefined) {
                        switch (res.data.code) {

                            case RESPONSE_CODE.EmailInvalid:
                            case RESPONSE_CODE.OTPNotCorrect:
                                {
                                    $('#register-form .email input').closest('.mb-4').find('.err').show()
                                    $('#register-form .email input').closest('.mb-4').find('.err').html(res.data.msg)
                                } break;
                            default: {
                                $('#register-general-err .err').show()
                                $('#register-general-err .err').html(res.data.msg)
                            } break;
                        }
                    }
                    else {
                        $('#register-general-err .err').show()
                        $('#register-general-err .err').html(res.msg)
                    }
                   
                    element.html('Đăng ký')

                }

            })
        }
    },
    ValidateLogin: function () {
        var password_length = account.Data.PasswordLength

        var success = false
        var element = $('#login-usr')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            return success

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmailInCorrect)
                element.closest('.mb-4').find('.err').show()
                return success
            }
        }
        //if (!success) return success
        element = $('#login-pwd')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        else if (element.val().length < password_length) {
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.PasswordTooShort.replace('{count}', password_length))
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        //if (!success) return success

        return true
    },
    ValidateRegister: function () {
        var success = true
        var password_length = account.Data.PasswordLength
        var element = $('#register-form .user input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false

        }
        //if (!success) return success
        element = $('#register-form .email input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmailInCorrect)
                element.closest('.mb-4').find('.err').show()
                success = false
            }
        }
        //if (!success) return success

        //element = $('#register-form .tel input')
        //if (element.val() == undefined || element.val().trim() == '') {
        //    element.closest('.mb-4').find('.err').show()
        //    success = false

        //}
        //else if (element.val() != undefined && element.val().trim() != '') {
        //    var pattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
        //    if (!pattern.test(element.val())) {
        //        element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.PhoneNotCorrect)
        //        element.closest('.mb-4').find('.err').show()
        //        success = false
        //    }
        //}
        //if (!success) return success

        element = $('#register-form .register-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        else if (element.val().length < password_length) {
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.PasswordTooShort.replace('{count}', password_length))
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        //if (!success) return success

        element = $('#register-form .confirm-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        else if (element.val() != $('#register-form .register-password input').val()) {
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.PasswordConfirmNotEqual)
            element.closest('.mb-4').find('.err').show()
            success = false
        }
        //if (!success) return success
        element = $('#register-form .otp-code input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false

        }
        return success
    },
    ValidateRegisterNoNotify: function () {
        var success = false
        var password_length = account.Data.PasswordLength
        var element = $('#register-form .user input')
        if (element.val() == undefined || element.val().trim() == '') {
            return success
        }
        //if (!success) return success
        element = $('#register-form .email input')
        if (element.val() == undefined || element.val().trim() == '') {
            return success

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                return success
            }
        }
        //if (!success) return success

        //element = $('#register-form .tel input')
        //if (element.val() == undefined || element.val().trim() == '') {
        //    return success

        //}
        //else if (element.val() != undefined && element.val().trim() != '') {
        //    var pattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
        //    if (!pattern.test(element.val())) {
        //        return success
        //    }
        //}
        //if (!success) return success

        element = $('#register-form .register-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            return success
        }
        else if (element.val().length < password_length) {
            return success
        }
        //if (!success) return success

        element = $('#register-form .confirm-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            return success
        }
        element = $('#register-form .otp-code input')
        if (element.val() == undefined || element.val().trim() == '') {

            return success

        }
        return true
    },
    ValidateLoginNoNotify: function () {
        var password_length = account.Data.PasswordLength

        var success = false
        var element = $('#login-usr')
        if (element.val() == undefined || element.val().trim() == '') {
            return success

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                return success
            }
        }
        //if (!success) return success
        element = $('#login-pwd')
        if (element.val() == undefined || element.val().trim() == '') {
            return success
        }
        else if (element.val().length < password_length) {
            return success

        }
        //if (!success) return success

        return true
    },
    
    //ThirdPartyRegister: function (email, password, token, name, type) {
    //    $('.client-login-popup').removeClass('overlay-active')
    //    $('#register-form').addClass('overlay-active')
    //    $('#register-form .user input').val(name)
    //    $('#register-form .email input').val(email)
    //    $('#register-form .register-password input').val('')
    //    $('#register-form .confirm-password input').val('')
    //    $('#register-detail').attr('data-type', type)
    //    $('#register-detail').attr('data-token', token)

    //    $('#register-form .scroll-form').prepend(HTML_CONSTANTS.GoogleAccountNotRegistered)
    //},
    //ThirdPartyLogin: function (email, password, token,name,type) {
    //    var request = {
    //        "user_name": email,
    //        "password": password,
    //        "remember_me": true,
    //        "token":token,
    //        "type": type
    //    }
    //    $.when(
    //        global_service.POST(API_URL.Login, request)
    //    ).done(function (res) {
    //        if (res.is_success) {
    //            if ($('#login-form .checkbox').is(":checked")) {
    //                localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
    //            } else {
    //                sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
    //            }
    //            window.location.reload()
    //        }
    //        else  {
    //            account.ThirdPartyRegister(email, password, token, name, type)
    //        }

    //    })
    //},
    ConfirmForgotPassword: function () {
        var validate = account.ValidateForgotPassword()
        if (validate) {
            var request = {
                "name": $("#forgot-password-email").val()
            }
            $.when(
                global_service.POST(API_URL.ClientForgotPassword, request)
            ).done(function (res) {
                $('#quenmk').removeClass('overlay-active')
                $('#login-form').removeClass('overlay-active')
                $('#success h4').html(res.msg)
                $('#success').addClass('overlay-active')
                $('#forgot-password-email').val('')

            })
        }
    },
    ValidateForgotPassword: function () {
        var validate=true
        var email = $("#forgot-password-email").val();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        validate = emailPattern.test(email)
        if (!validate) {
            $("#forgot-password-email").closest('.box-email').find('.err').show()
        }
        return validate
    },
    RegisterEmailSendCode: function () {
        var $thisButton = $('#register-send-code');
        $thisButton.prop('disabled', true)
        $thisButton.attr('disabled', 'disabled')
        $thisButton.css('background-color', 'lightgray');
        var element = $('#register-form .email input')

        if (account.ValidateEmailInput(element) && account.Data.SendCodeTimeout == false) {
            account.DisableSendButtonBySecond()
            var model = {
                email: element.val()
            }
            $.ajax({
                url: "/api/Auth/RegisterEmailCode",
                type: 'post',
                data: model,
                success: function (data) {

                },
            });
        }
        else {
            $thisButton.removeProp('disabled')
            $thisButton.removeAttr('disabled', 'disabled')
            $thisButton.css('background-color', '');
        }
    },
    DisableSendButtonBySecond: function (second=120) {
        var $thisButton = $('#register-send-code');
        var countdownTime = second; // Thời gian chờ (giây)
        var originalText = $thisButton.text();

        // Vô hiệu hóa nút và đổi text
        $thisButton.prop('disabled', true).text('Đang gửi...');
        $thisButton.attr('disabled', 'disabled')
        $thisButton.css('background-color', 'lightgray');
        account.Data.SendCodeTimeout = true;
        // Cập nhật bộ đếm thời gian mỗi giây
        var countdownInterval = setInterval(function () {
            countdownTime--;
            $thisButton.text('Vui lòng đợi (' + countdownTime + 's)');

            // Khi bộ đếm thời gian về 0, kích hoạt lại nút
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                $thisButton.removeProp('disabled').text(originalText);
                $thisButton.removeAttr('disabled', 'disabled')
                $thisButton.css('background-color', '');
                account.Data.SendCodeTimeout = false;
            }
        }, 1000); // Cập nhật mỗi 1000ms (1 giây)
    },
    ValidateInput: function (element) {
        if (element.hasClass('no-requirement')) {
            return;
        }
        switch (element.attr('type')) {
            case 'email': {
                account.ValidateEmailInput(element)
            } break;
            case 'password': {
                account.ValidatePasswordInput(element)
            } break;
            default: {
                if ((element.val() == undefined || element.val().trim() == '')) {
                    element.closest('.mb-4').find('.err').show()
                    return
                } else {
                    element.closest('.mb-4').find('.err').hide()
                    element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmptyField)
                    return
                }
            }
        }
    },
    ValidateEmailInput: function (element) {
        var success = true
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false
            return success

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmailInCorrect)
                element.closest('.mb-4').find('.err').show()
                success = false
                return success

            }
        }
        element.closest('.mb-4').find('.err').hide()
        element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmptyField)
        return success
    },
    ValidatePasswordInput: function (element) {
        var success = true
        var password_length = account.Data.PasswordLength

        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.mb-4').find('.err').show()
            success = false

        }
        else if (element.val().length < password_length) {
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.PasswordTooShort.replace('{count}', password_length))
            element.closest('.mb-4').find('.err').show()
            success = false
        } else {
            element.closest('.mb-4').find('.err').hide()
            element.closest('.mb-4').find('.err').html(NOTIFICATION_MESSAGE.EmptyField)
        }
        return success
    },

}

