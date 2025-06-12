$(document).ready(function () {
    if ($('#address-book').length > 0) {
        address_client.Initialization()

    }
   
   
})
var address_client = {
    Initialization: function () {
        $('#address-receivername').html('')
        $('#address-phone').html('')
        $('#address').html('(Chưa chọn địa chỉ giao hàng)')
        sessionStorage.removeItem(STORAGE_NAME.AddressClient)
        if (!$('#address-book').hasClass('overlay')) {
            $('.menu-left-user .list-tab-menu .client-address').addClass('active')
            $('.menu-left-user .list-tab-menu .client-address').closest('.sub-menu').addClass('active')

        } else {
            $('#address-book .btn-confirm-address').show()

        }
        address_client.Detail()
       

        address_client.RenderProvinces()
        address_client.DynamicBind()
        $('#update-address .err').hide()
    },
    DynamicBind: function () {
        

        $("body").on('click', "#address-book .btn-update-address", function () {
            var element = $(this)
            var id = element.closest('.address-item').attr('data-id')
            address_client.CreateOrUpdateAddress(id)
        });
        $("body").on('click', "#address-book .list-add .item .defauld", function () {
            var element = $(this)
            $('#address-book .item').removeClass('active')
            $('#address-book .defauld').show()
            element.closest('.item').addClass('active')
            element.hide()
        });
        $("body").on('click', "#address-book .btn-add-address", function () {
            var element = $(this)
            address_client.CreateOrUpdateAddress('')

        });
        $("body").on('click', ".update-address-order", function () {
            
            var list = sessionStorage.getItem(STORAGE_NAME.AddressClient)
            const selectedId = $('#address-receivername').attr('data-id'); // Lấy data-id đã gán ở ConfirmCartAddress
            if (list) {
                var data = JSON.parse(list)
                address_client.RenderExistsAddress(data, selectedId); // Truyền vào để active cái đang dùng

            }
            if ($('#address-book').hasClass('overlay')) {
                $('#address-book').addClass('overlay-active')
            }

        });

        $("body").on('click', "#update-address .btn-save", function () {
            
            if (!address_client.ValidateAddressForm()) {
                return; // Dừng nếu không hợp lệ
            }
            address_client.Confirm()
        });
        //$("body").on('click', "#address-book .list-add .item", function () {
        //    var element = $(this)
        //    $('#address-book .list-add .item').removeClass('active')
        //    element.addClass('active')
        //});
        //Chọn Adress
        $("body").on("click", "#address-book .list-add input[type=radio], #address-book .list-add .address-item", function () {
            let target = $(this)

            // Nếu là radio thì tìm tới thằng cha label rồi tìm .address-item bên trong
            if (target.is("input[type=radio]")) {
                target = target.closest("label").find(".address-item")
            }

            // Remove active ở tất cả
            $("#address-book .list-add .address-item").removeClass("active")

            // Add active đúng thằng target
            target.addClass("active")
        });
        $("body").on('select2:select', "#update-address .province select", function () {
            $('#update-address .wards select').val(null).trigger('change')
            address_client.RenderDistrict()

        });
        $("body").on('select2:select', "#update-address .district select", function () {
            address_client.RenderWards()

        });
        $("body").on('click', "#update-address .btn-close", function () {
            if ($('#address-book').hasClass('overlay')) {
                $('#address-book').addClass('overlay-active')
            }

        });

    },
    DynamicConfirmAddress: function (callback) {
        
        //$("body").on('click', "#update-address .btn-save", function () {
        //    var element = $(this)
        //    var selected_item = address_client.GetUpdatedAddress()

        //    callback(selected_item)

        //});
        $("body").on('click', "#address-book .btn-save", function () {
            
            var element = $(this)
            var id=undefined
            $('#address-book .box-address .item').each(function (index, item) {
                var div = $(this)
                if (div.hasClass('active')) {
                    id = div.attr('data-id')
                    return false
                }

            });
            if (id != undefined) {
                var item = address_client.GetSelectedAddress(id)
                callback(item)
            }
            $('#address-book').addClass('hidden')

        });
        $("body").on('click', "#address-book .btn-close", function () {
              $('#address-book').addClass('hidden')

        });
        //$("body").on('click', "#address-book .list-add .item", function () {
        //    var element = $(this)
        //    var id = element.attr('data-id')
        //    var item = address_client.GetSelectedAddress(id)
        //    callback(item)
        //});

    },
    Detail: function (selected_id = undefined) {
        
        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }

        var request = {
            "token": usr.token
        }
        $.when(
            global_service.POST(API_URL.AddressList, request)
        ).done(function (result) {
            
            var html = ''
            if (result.is_success) {
                sessionStorage.setItem(STORAGE_NAME.AddressClient, JSON.stringify(result.data.list))
                address_client.RenderExistsAddress(result.data.list, selected_id)
            }
            
            address_client.RemoveLoading()

        }).fail(function (jqXHR, textStatus) {
            $('#address-book .list-add').html('')
           address_client.RemoveLoading()
        })

    },
    
   

    AddLoading: function () {
        $('#address-book .box-address').addClass('placeholder')
        $('#address-book').addClass('placeholder')
        $('.content-left-user').addClass('placeholder')
    },
    RemoveLoading: function () {
        $('#address-book .box-address').removeClass('placeholder')
        $('#address-book').removeClass('placeholder')
        $('.content-left-user').removeClass('placeholder')
    },
    RenderExistsAddress: function (list, selected_id = undefined) {
        
        var html = ''
        let hasActive = list.some(item => item.isActive === true);
        $(list).each(function (index, item) {
            // Đánh dấu label "Địa chỉ mặc định"
            let defaultLabel = '';
            if (item.isActive === true || (!hasActive && index === 0)) {
                defaultLabel = `<span class="text-[13px] italic leading-[1.5] text-[#773EFA] ">
    Địa chỉ mặc định
</span>
`;
            }

            html += HTML_CONSTANTS.Address.GridItem
                .replaceAll('{active}', (selected_id != undefined && selected_id == item.id) ? 'active' : '')
                .replaceAll('{checked}', (selected_id != undefined && selected_id == item.id) ? 'checked' : '')
                .replaceAll('{id}', item.id)
                .replaceAll('{default-address-style}', item.districtId == true ? 'display:none;' : '')
                .replaceAll('{name}', item.receiverName)
                .replaceAll('{address}', address_client.RenderDetailAddress(item))
                .replaceAll('{tel}', item.phone.trim())
                .replaceAll('{defaultLabel}', defaultLabel);
        });
        $('#address-book .list-add').html(html)
        
    },
    RenderDetailAddress: function (data) {
        var address_select = ''
        if (data.ward_detail != null && data.ward_detail != undefined) {
            address_select += data.ward_detail.name
        }
        if (data.district_detail != null && data.district_detail != undefined) {
            if (address_select.trim() != '') address_select += ', '
            address_select += data.district_detail.name
        }
        if (data.province_detail != null && data.province_detail != undefined) {
            if (address_select.trim() != '') address_select += ', '
            address_select += data.province_detail.name
        }

        return data.address + '<br /> ' + address_select
    },
    CreateOrUpdateAddress: function (id) {
        
        //var overlay_box = false
        //if ($('#address-book').hasClass('overlay')) {
        //    overlay_box = true
        //}
        //if (overlay_box) {
        //    $('#address-book').removeClass('overlay-active')
        //}

        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }
        // Reset popup trước khi thao tác
        address_client.ResetAddressForm();
        $('#update-address').attr('data-id', id)
        if (id != undefined && id.trim() != '') {
            var json = sessionStorage.getItem(STORAGE_NAME.AddressClient)
            if (json) {
                var address_list = JSON.parse(json)
                var selected = address_list.filter(obj => {
                    return obj.id == id
                })
                var item = selected[0]
                $('#update-address').addClass('overlay-active')
                $('#update-address .user input').val(item.receiverName)
                $('#update-address .tel input').val(item.phone)

                $('#update-address .address input').val(item.address)
                address_client.RenderProvinces(item.provinceId)
                address_client.RenderDistrict(item.provinceId, item.districtId)
                address_client.RenderWards(item.districtId, item.wardId)
            } else {
                var request = {
                    "token": usr.token,
                    "id": id
                }
                $.when(
                    global_service.POST(API_URL.AddressDetail, request)
                ).done(function (result) {
                    
                    if (result.is_success) {
                        $('#update-address .err').hide()
                        var item = result.data
                        $('#update-address').addClass('overlay-active')
                        $('#update-address .user input').val(item.receiverName)
                        $('#update-address .tel input').val(item.phone)
                        $('#update-address .address input').val(item.address)
                        address_client.RenderProvinces(item.provinceId)
                        address_client.RenderDistrict(item.provinceId, item.districtId)
                        address_client.RenderWards(item.districtid, item.wardId)
                    }
                })
            }
            $('#update-address .title-popup').html('Cập nhật địa chỉ');
            $('#update-address .btn-save').html('Cập nhật');

        } else {
            $('#update-address').addClass('overlay-active')
            $('#update-address .title-popup').html('Thêm địa chỉ giao hàng mới')
            $('#update-address .btn-save').html('Thêm')
        }
        // 👉 Mở popup theo Tailwind (ẩn class hidden, hiển thị popup)
        $('.popup').addClass('hidden'); // ẩn các popup khác nếu có
        $('#update-address').removeClass('hidden').show();
    },
    ResetAddressForm : function () {
        $('#update-address').attr('data-id', '');
        $('#update-address .user input').val('');
        $('#update-address .tel input').val('');
        $('#update-address .address input').val('');

        // ✅ Fix: đúng class là ".wards" chứ không phải ".ward"
        $('#update-address .province select').val('');
        $('#update-address .district select').html('<option value="">--Chọn quận/huyện--</option>');
        $('#update-address .wards select').html('<option value="">--Chọn phường/xã--</option>');

        $('#update-address .err').hide();
    },
    RenderProvinces: function (selected_value = undefined) {
        var request = {
            "id": '-1'
        }
        $('#update-address .province select').html('')
        $.when(
            global_service.POST(API_URL.AddressProvince, request)
        ).done(function (result) {
            var html = ''
            if (result.is_success) {
                $(result.data).each(function (index, item) {

                    html += HTML_CONSTANTS.Global.SelectOption
                        .replaceAll('{value}', item.provinceId)
                        .replaceAll('{name}', item.name)

                });
            }
            $('#update-address .province select').html(html)

            global_service.Select2WithFixedOptionAndSearch($('#update-address .province select'))
            $('#update-address .province select').val(null).trigger('change')
            if (selected_value != undefined) {
                $('#update-address .province select').val(selected_value).trigger('change')

            }
        })
        global_service.Select2WithFixedOptionAndSearch($('#update-address .district select'))
        global_service.Select2WithFixedOptionAndSearch($('#update-address .wards select'))
        $('#update-address .district select').prop('disabled', true);
        $('#update-address .wards select').prop('disabled', true);
        $('#update-address .district').addClass('select2-disabled-background');
        $('#update-address .wards').addClass('select2-disabled-background')

    },
    RenderDistrict: function (selected_provinced = undefined, selected_value = undefined) {
        var request = {
            "id": $('#update-address .province select').find(':selected').val()
        }
        if (selected_provinced != undefined) {
            request = {
                "id": selected_provinced
            }
        }
        $('#update-address .district select').html('')
        $.when(
            global_service.POST(API_URL.AddressDistrict, request)
        ).done(function (result) {
            var html = ''
            if (result.is_success) {
                $(result.data).each(function (index, item) {

                    html += HTML_CONSTANTS.Global.SelectOption
                        .replaceAll('{value}', item.districtId)
                        .replaceAll('{name}', item.name)

                });
            }
            $('#update-address .district select').html(html)

            global_service.Select2WithFixedOptionAndSearch($('#update-address .district select'))
            $('#update-address .district select').val(null).trigger('change')
            if (selected_value != undefined) {
                $('#update-address .district select').val(selected_value).trigger('change')

            }

        })
        $('#update-address .wards select').prop('disabled', true);
        $('#update-address .wards').addClass('select2-disabled-background')

        $('#update-address .district select').prop('disabled', false);
        $('#update-address .district').removeClass('select2-disabled-background');

    },
    RenderWards: function (selected_district = undefined, selected_value = undefined) {
        var request = {
            "id": $('#update-address .district select').find(':selected').val()
        }
        if (selected_district != undefined) {
            request = {
                "id": selected_district
            }
        }
        $('#update-address .wards select').html('')
        $.when(
            global_service.POST(API_URL.AddressWard, request)
        ).done(function (result) {
            var html = ''
            if (result.is_success) {
                $(result.data).each(function (index, item) {

                    html += HTML_CONSTANTS.Global.SelectOption
                        .replaceAll('{value}', item.wardId)
                        .replaceAll('{name}', item.name)

                });
            }
            $('#update-address .wards select').html(html)
            try {
                $('#update-address .wards select').select2("destroy");

            } catch {

            }
            global_service.Select2WithFixedOptionAndSearch($('#update-address .wards select'))
            $('#update-address .wards select').val(null).trigger('change')
            if (selected_value != undefined) {
                $('#update-address .wards select').val(selected_value).trigger('change')

            }

        })

        $('#update-address .wards select').prop('disabled', false);
        $('#update-address .wards').removeClass('select2-disabled-background');

    },
    Confirm: function () {
        
        // 🚨 Validate form trước
        if (!address_client.ValidateAddressForm()) {
            return; // Dừng không gửi request, không update gì hết
        }
        // 1. Kiểm tra login
        var usr = global_service.CheckLogin();
        if (!usr || !usr.token) {
            return;
        }

        // 2. Lấy ID từ form (nếu có)
        var currentId = $('#update-address').attr('data-id');
        if (!currentId || parseInt(currentId) <= 0) {
            currentId = 0; // Mặc định là 0 để BE hiểu là Create
        }

        // 3. Tạo object request để gửi lên BE
        var request = {
            "Id": currentId,
            "token": usr.token,
            "ReceiverName": $('#update-address .user input').val(),
            "Phone": $('#update-address .tel input').val(),
            "ProvinceId": $('#update-address .province select').val(),
            "DistrictId": $('#update-address .district select').val(),
            "WardId": $('#update-address .wards select').val(),
            "Address": $('#update-address .address input').val(),
            "Status": 0,
            "IsActive": 0
        };

        // 4. Gửi request đến BE
        var result = global_service.POSTSynchorus(API_URL.UpdateAddress, request);
        if (result.is_success) {
            // Gán ID trả về (Create sẽ có ID mới, Update sẽ giữ nguyên)
            request.Id = result.data;
            $('#update-address').attr('data-id', result.data); // ✅ Gán lại ID vào DOM
        } else {
            alert("Cập nhật địa chỉ thất bại!");
            return;
        }

        // 5. Chuẩn bị object lưu vào sessionStorage
        var sessionItem = {
            "id": request.Id,
            "token": usr.token,
            "receiverName": request.ReceiverName,
            "phone": request.Phone,
            "provinceId": request.ProvinceId,
            "districtId": request.DistrictId,
            "wardId": request.WardId,
            "address": request.Address,
            "status": 0,
            "isactive": 0,
            "province_detail": {
                name: $('#update-address .province select option:selected').text()
            },
            "district_detail": {
                name: $('#update-address .district select option:selected').text()
            },
            "ward_detail": {
                name: $('#update-address .wards select option:selected').text()
            }
        };
        
        // 6. Cập nhật vào sessionStorage
        var list = sessionStorage.getItem(STORAGE_NAME.AddressClient);
        var data = list ? JSON.parse(list) : [];

        if (!Array.isArray(data)) data = [];

        var index = data.findIndex(obj => obj.id == sessionItem.id);
        if (index >= 0) {
            data[index] = sessionItem; // Update
        } else {
            data.push(sessionItem); // Create
        }

        sessionStorage.setItem(STORAGE_NAME.AddressClient, JSON.stringify(data));
        // ✅ Chỉ render UI nếu thành công
        cart.ConfirmCartAddress(sessionItem);

        // 7. UI handling
        $('#update-address').addClass('hidden');
        address_client.AddLoading();
        address_client.RenderExistsAddress(data, sessionItem.id);
        address_client.RemoveLoading();
    }, 
    ValidateAddressForm :function () {
        let isValid = true;

        const popup = $('#update-address');

        const receiverName = popup.find('.user input').val().trim();
        const phone = popup.find('.tel input').val().trim();
        const address = popup.find('.address input').val().trim();
        const province = popup.find('.province select').val();
        const district = popup.find('.district select').val();
        const ward = popup.find('.wards select').val();

        // Reset lỗi trước
        popup.find('.err').hide();

        if (!receiverName) {
            popup.find('.user').siblings('.err').show();
            isValid = false;
        }
        if (!phone) {
            popup.find('.tel').siblings('.err').show();
            isValid = false;
        }
        if (!province) {
            popup.find('.province').siblings('.err').show();
            isValid = false;
        }
        if (!district) {
            popup.find('.district').siblings('.err').show();
            isValid = false;
        }
        if (!ward) {
            popup.find('.wards').siblings('.err').show();
            isValid = false;
        }
        if (!address) {
            popup.find('.address').siblings('.err').show();
            isValid = false;
        }

        return isValid;
    },

    GetSelectedAddress: function (id) {
        var list = sessionStorage.getItem(STORAGE_NAME.AddressClient)
        if (list) {
            var data = JSON.parse(list)
            var selected = data.filter(obj => {
                return obj.id == id
            })
            return selected[0]
        }

    },
    GetUpdatedAddress: function () {
        
        var usr = global_service.CheckLogin()
        var request = {
            "id": $('#update-address').attr('data-id'),
            "token": usr.token,
            "receivername": $('#update-address .user input').val(),
            "phone": $('#update-address .tel input').val(),
            "provinceid": $('#update-address .province select').find(':selected').val(),
            "districtid": $('#update-address .district select').find(':selected').val(),
            "wardid": $('#update-address .wards select').find(':selected').val(),
            "address": $('#update-address .address input').val(),
            "status": 0,
            "isactive": 0,
            province_detail: {
                "id": $('#update-address .province select').find(':selected').val(),
                "provinceId": $('#update-address .province select').find(':selected').val(),

                name: $('#update-address .province select').find(':selected').text()
            },
            district_detail: {
                "id": $('#update-address .district select').find(':selected').val(),
                "districtId": $('#update-address .district select').find(':selected').val(),
                name: $('#update-address .district select').find(':selected').text()
            },
            ward_detail: {
                "id": $('#update-address .wards select').find(':selected').val(),
                "wardId": $('#update-address .wards select').find(':selected').val(),

                name: $('#update-address .wards select').find(':selected').text()
            },
        }
        return request
    }
}