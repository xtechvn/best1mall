$(document).ready(function () {
    order_detail.Initialization()
})
var order_detail = {
    Data: {
        Index: 1,
        Size:10
    },
    Initialization: function () {
        order_detail.DynamicBind()
        var request = {

        }
        $.when(
            global_service.POST(API_URL.AddressPopup, request)
        ).done(function (result) {
            $('body').append(result)

            address_client.Detail()
            address_client.RenderProvinces()
            address_client.DynamicBind()
            address_client.DynamicConfirmAddress(function (data) {
                order_detail.ConfirmCartAddress(data)
            })
        })

    },
    DynamicBind: function () {
        $('body').on('click', '.btn-update-address', function () {

        });
    },
    ConfirmCartAddress: function (data) {

        if (data != undefined && data.id != undefined) {
            $('#address-receivername').attr('data-id', (data.id == null || data.id == undefined || data.id == '' ? '-1' : data.id))
            $('#address-receivername').html(data.receiverName)
            $('#address-phone').html(data.phone)
            $('#address').html(data.address)
            if (data.ward_detail != null && data.ward_detail != undefined) {
                $('#address-ward').html(data.ward_detail.name)

            }
            if (data.district_detail != null && data.district_detail != undefined) {
                $('#address-district').html(data.district_detail.name)

            }
            if (data.province_detail != null && data.province_detail != undefined) {
                $('#address-province').html(data.province_detail.name)

            }
            var usr = global_service.CheckLogin()
            var token = ''
            if (usr) {
                token = usr.token

            }

            var request = {
                "province_id": data.provinceId,
                "district_id": data.districtId,
                "ward_id": data.wardId,
                "token": token,
                "address": data.address,
                "phone": data.phone,
                order_id: $('.update-address-order').attr('data-orderid')
            }
            $.when(
                global_service.POST('/Order/UpdateAddress', request)
            ).done(function (result) {
                if (result && result.is_success) {

                }

            })
           

        }
    },

}