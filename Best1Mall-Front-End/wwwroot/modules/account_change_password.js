$(document).ready(function () {
    account_change_password.Initialization()
})
var account_change_password = {
    Initialization: function () {
        account_change_password.DynamicBind()
    },
    DynamicBind: function () {
        $("body").on('keyup', "#forgot-changepassword-form input", function () {

            if (account_change_password.Validate() == true) {
                $('#forgot-changepassword-confirm').removeAttr('disabled')
                $('#forgot-changepassword-confirm').removeProp('disabled')
                $('#forgot-changepassword-confirm').css('background-color', '');
            } else {
                $('#forgot-changepassword-confirm').attr('disabled', 'disabled')
                $('#forgot-changepassword-confirm').prop('disabled', true)
                $('#forgot-changepassword-confirm').css('background-color', 'lightgray');
            }
        });
        $("body").on('click', "#forgot-changepassword-confirm", function (e) {
            var element=$(this)
            e.preventDefault()
            account_change_password.ConfirmChangePassword(element)
        });
    },
    Validate: function () {
        var success=true
        var password_length = 6
        var element = $('#forgot-changepassword-pwd')
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
        }
        if (!success) return success
        element = $('#forgot-changepassword-pwd-confirm')
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
        }
        if (!success) return success
        var pwd = $('#forgot-changepassword-pwd').val()
        var pwd_confirm = $('#forgot-changepassword-pwd-confirm').val()
        if (pwd != pwd_confirm) {
            success = false
            element.closest('.mb-4').find('.err').html('Mật khẩu và xác nhận mật khẩu phải giống nhau')
        } else {
            element.closest('.mb-4').find('.err').hide()
        }
        return success
    },
    ConfirmChangePassword: function (element) {
        if (account_change_password.Validate() == true) {
            element.html('Vui lòng chờ ....')
            element.prop("disabled", true);
            element.css('background-color', 'lightgray');
            var request = {
                "token_forgot_password": $('#forgot-changepassword-form').attr('data-token'),
                "password": $('#forgot-changepassword-pwd').val(),
                "confirm_password": $('#forgot-changepassword-pwd-confirm').val()
            }
            $.when(
                global_service.POST('/client/ClientForgotChangePasswordRequestModel', request)
            ).done(function (res) {
                if (res.is_success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Đổi mật khẩu thành công!',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    setTimeout(() => {
                        window.location.href='/'
                    }, 2000);
                }
                else {
                    $('#forgot-changepassword-pwd').closest('.mb-4').find('.err').html(res.msg)
                    element.html('Đổi mật khẩu')
                    element.prop("disabled", false);
                    element.css('background-color', '');
                }

            })

        }
    }
}