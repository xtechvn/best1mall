
const UTILS = {
    showLoading: function () {
        $('body').addClass('h-100vh');
        $('.wrap-loading').removeClass('d-none');
    },

    removeLoading: function () {
        $('body').removeClass('h-100vh');
        $('.wrap-loading').addClass('d-none');
    },

    sliceIntoChunksArray: function (arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    },

    renderPagination: function (arr) {
        if (arr.length > 1) {
            var btnPrev =
                `<li class="page-item prev-page">
            <a class="page-link" href="javascript:void(0)" aria-label="Previous">
                <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#prev"></use>
                    </svg>
                </span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`;
            var btnNext =
                `<li class="page-item next-page">
            <a class="page-link" href="javascript:void(0)" aria-label="Next">
                <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#next"></use>
                    </svg>
                </span>
                <span class="sr-only">Next</span>
            </a>
        </li>`
            var btnNumber = '';
            arr.forEach(function (item, index) {
                btnNumber +=
                    `<li class="page-item page-number ${index == 0 ? 'active' : ''}" data-page="${index + 1}">
                <a class="page-link" href="javascript:void(0)">${index + 1}</a>
            </li>`
            });
            $('.pagination').html(btnPrev + btnNumber + btnNext);
            $('.pagination').removeClass('d-none');
        }
        else {
            $('.pagination').addClass("d-none")
        }
    },

    renderPaginationByTotalPage: function (totalPage) {
        if (totalPage > 1) {
            var btnPrev =
                `<li class="page-item prev-page">
            <a class="page-link" href="javascript:void(0)" aria-label="Previous">
                <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#prev"></use>
                    </svg>
                </span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`;
            var btnNext =
                `<li class="page-item next-page">
            <a class="page-link" href="javascript:void(0)" aria-label="Next">
                <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#next"></use>
                    </svg>
                </span>
                <span class="sr-only">Next</span>
            </a>
        </li>`
            var btnNumber = '';
            for (var i = 0; i < totalPage; i++) {
                btnNumber +=
                    `<li class="page-item page-number ${i == 0 ? 'active' : ''}" data-page="${i + 1}">
                <a class="page-link" href="javascript:void(0)">${i + 1}</a>
            </li>`
            }

            $('.pagination').html(btnPrev + btnNumber + btnNext);
            $('.pagination').removeClass('d-none');
        }
        else {
            $('.pagination').addClass("d-none")
        }
    },


    groupClassFare: function (strGroupClass) {
        if (strGroupClass.toUpperCase().indexOf('ECONOMY') != -1) {
            return '0';
        } else {
            return '1';
        }
    },

    formatViCurrency: function (number) {
        return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },

    validateEmail: function (email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    },

    filterGender: function (gender) {
        return gender == "male" ? "Ông" : "Bà";
    },

    getGender: function (gender) {
        return gender == "male" ? true : false;
    },

    // get first and last from name
    getFristAndLastName: function (name) {
        name = name.trim();
        var nameArray = name.split(" ");
        var firstName = nameArray[0].trim();
        var lastName = name.replace(firstName, "").trim();

        return {
            firstName: firstName.toUpperCase(),
            lastName: lastName.toUpperCase()
        }
    },

    removeSession: function () {
        sessionStorage.removeItem(CONSTANTS.STORAGE.COUNTER_KEY);
        sessionStorage.removeItem(CONSTANTS.STORAGE.Info);
        sessionStorage.removeItem(CONSTANTS.STORAGE.Search);
    },

    checkEndTimeBooking: function () {
        var endTime = sessionStorage.getItem(CONSTANTS.STORAGE.COUNTER_KEY);
        if (endTime) {
            var timeObj = TIME_UTILS.makeTimer(endTime);
            if (timeObj) {
                if (timeObj.days >= 0) {
                    return false;
                }
                else
                    return true;
            }
        }
    },

    saveFlightData: function () {
        var dataFlight = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
        var info = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));

        return {
            dataFlight: dataFlight,
            infoContact: info
        }
    },

    authenObj: function () {
        return {
            "HeaderUser": "datacom",
            "HeaderPass": "dtc@19860312",
            "AgentAccount": "DC12508",
            "AgentPassword": "3fdhyswe",
            "ProductKey": "jl8rhr7dlqjn8et",
            "Currency": "VND",
            "Language": "vi",
            "IpRequest": ""
        }
    },

    toggleModal: function (id) {
        $('#' + id).modal('toggle');
    },


    hideModal: function (id) {
        $('#' + id).modal('hide');
    },

    setTitleAndMessageModal: function (type, title, message) {
        if (type == CONSTANTS.MODAL_TYPES.success) {
            $("#successModal-title").html(title);
            $("#successModal-message").html(message)
        }
        else {
            $("#errorModal-title").html(title);
            $("#errorModal-message").html(message)
        }
    },


    getUserLogged: function () {
        try {
            var user = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.User));
            return user;
        }
        catch (error) {
            return null;
        }
    },

    showNotiModal: function (type, title, message) {
        if (title)
            $("#" + type + "-title").text(title);
        if (message)
            $("#" + type + "-message").text(message);
        this.toggleModal(type);
    },

    removeUnicodeUTF8: function (input) {
        if (input == undefined || input == '')
            return '';
        //Đổi chữ hoa thành chữ thường
        var slug = input.toLowerCase();

        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        //slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');

        return slug;
    },

    getSlug: function (input) {
        if (input == undefined || input == '')
            return '';
        //Đổi chữ hoa thành chữ thường
        var slug = input.toLowerCase();

        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\“|\”|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');

        return slug;
    },

    calculateProfitFare: function (fare) {
        var profit = 0;
        var searchObj = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
        if (searchObj) {
            profit = fare.AdavigoPrice.profit * searchObj.search.Adt;
            if (fare.FareChd > 0) {
                profit += fare.AdavigoPrice.profit * searchObj.search.Child;
            }
            if (fare.FeeInf > 0) {
                profit += fare.AdavigoPrice.profit * searchObj.search.Baby;
            }
        }
        return profit;
    },

    calculateFinalPriceObj: function (fare, leg) {
        var profit = 0;
        var baggageFee = 0;
        var total = 0;

        var searchObj = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));

        if (searchObj) {
            profit = fare.AdavigoPrice.profit * searchObj.search.Adt;
            if (fare.FareChd > 0) {
                profit += fare.AdavigoPrice.profit * searchObj.search.Child;
            }
            if (fare.FeeInf > 0) {
                profit += fare.AdavigoPrice.profit * searchObj.search.Baby;
            }
        }

        // baggage fee
        var twoWayFee = this.calculateBaggageFee();
        baggageFee = leg == 0 ? twoWayFee.goFee : twoWayFee.backFee;

        total = fare.TotalPrice + profit + baggageFee;

        return {
            total,
            profit,
            baggageFee
        };
    },

    renderStar: function (starNum) {
        var stars = "";
        for (var i = 0; i < starNum; i++) {
            stars += ` <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>`
        }
        var star = ` <div class="star">
                                   ${stars}
                                   
                                </div>`

        return star;
    },

    // get url params
    getUrlParam: function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);

        return (results !== null) ? results[1] || "" : "";
    },

    findById: function (id, array) {
        var result;
        for (var i in array) {
            if (array[i].id == id) {
                result = array[i];
                break;
            }
        }

        return result;
    },

    findByProp: function (prop, val, array) {
        var result;
        for (var i in array) {
            if (array[i][prop] == val) {
                result = array[i];
                break;
            }
        }

        return result;
    },

    sortByKeyDesc: function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    },

    sortByKeyAsc: function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    shortenGroupClass: function (gClass) {
        var array = gClass.split(' ');
        if (array.length > 2)
            return array[0] + " " + array[1];
        else
            return gClass;
    },

    setStartDate: function (startDate) {
        $("#date-start").val(startDate);
        $("#date-start-value").text(startDate);
    },

    setEndDate: function (endDate) {
        $("#date-end").val(endDate == CONSTANTS.TEXT.noEndDate ? "" : endDate);
        $("#date-end-value").text(endDate);
        if (endDate == CONSTANTS.TEXT.noEndDate)
            $("#date-end-value").addClass("no-date");
        else
            $("#date-end-value").removeClass("no-date");
    },

    calculateBaggageFee: function () {
        var info = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));
        var goFee = 0;
        var backFee = 0;
        var goTotalWeight = 0;
        var backTotalWeight = 0;
        if (info) {
            if (info.baggageGo && info.baggageGo.length > 0) {
                for (var go of info.baggageGo) {
                    goFee += go.Price;
                    goTotalWeight += Number(go.Code.match(/\d+/));
                }
            }

            if (info.baggageBack && info.baggageBack.length > 0) {
                for (var back of info.baggageBack) {
                    backFee += back.Price;
                    backTotalWeight += Number(back.Code.match(/\d+/));
                }
            }
        }

        return {
            goFee,
            backFee,
            goTotalWeight,
            backTotalWeight
        }
    },

    renderBaggageListVNAirline: function (operating) {
        var searchObj = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));

        if (operating == "BL") {
            return [
                {
                    "Airline": "VN",
                    "Value": "10",
                    "Code": "10",
                    "Name": "Gói 10kg",
                    "Price": 129600,
                    "Currency": "VND",
                    "Leg": 0,
                    "Route": null,
                    "StartPoint": searchObj.search.StartPoint,
                    "EndPoint": searchObj.search.EndPoint,
                    "Confirmed": false
                },

                {
                    "Airline": "VN",
                    "Value": "10",
                    "Code": "10",
                    "Name": "Gói 10kg",
                    "Price": 129600,
                    "Currency": "VND",
                    "Leg": 1,
                    "Route": null,
                    "StartPoint": searchObj.search.EndPoint,
                    "EndPoint": searchObj.search.StartPoint,
                    "Confirmed": false
                },
                {
                    "Airline": "VN",
                    "Value": "23",
                    "Code": "23",
                    "Name": "Gói 23kg",
                    "Price": 248400,
                    "Currency": "VND",
                    "Leg": 0,
                    "Route": null,
                    "StartPoint": searchObj.search.StartPoint,
                    "EndPoint": searchObj.search.EndPoint,
                    "Confirmed": false
                },
                {
                    "Airline": "VN",
                    "Value": "23",
                    "Code": "23",
                    "Name": "Gói 23kg",
                    "Price": 248400,
                    "Currency": "VND",
                    "Leg": 1,
                    "Route": null,
                    "StartPoint": searchObj.search.EndPoint,
                    "EndPoint": searchObj.search.StartPoint,
                    "Confirmed": false
                }
            ]
        }
        else {
            return [
                {
                    "Airline": "VN",
                    "Value": "10",
                    "Code": "10",
                    "Name": "Gói 10kg",
                    "Price": 183600,
                    "Currency": "VND",
                    "Leg": 0,
                    "Route": null,
                    "StartPoint": searchObj.search.StartPoint,
                    "EndPoint": searchObj.search.EndPoint,
                    "Confirmed": false
                },

                {
                    "Airline": "VN",
                    "Value": "10",
                    "Code": "10",
                    "Name": "Gói 10kg",
                    "Price": 183600,
                    "Currency": "VND",
                    "Leg": 1,
                    "Route": null,
                    "StartPoint": searchObj.search.EndPoint,
                    "EndPoint": searchObj.search.StartPoint,
                    "Confirmed": false
                },
                {
                    "Airline": "VN",
                    "Value": "23",
                    "Code": "23",
                    "Name": "Gói 23kg",
                    "Price": 302400,
                    "Currency": "VND",
                    "Leg": 0,
                    "Route": null,
                    "StartPoint": searchObj.search.StartPoint,
                    "EndPoint": searchObj.search.EndPoint,
                    "Confirmed": false
                },

                {
                    "Airline": "VN",
                    "Value": "23",
                    "Code": "23",
                    "Name": "Gói 23kg",
                    "Price": 302400,
                    "Currency": "VND",
                    "Leg": 1,
                    "Route": null,
                    "StartPoint": searchObj.search.EndPoint,
                    "EndPoint": searchObj.search.StartPoint,
                    "Confirmed": false
                }
            ]

        }
    },

    showHideCountdown: function () {
        var booked = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Booked));
        $("#bookflight-fail").hide();
        // bookflight dc fail
        if (booked && !booked.Status) {
            $("#bookflight-fail").show();
            $("#bookflight-success").hide();
        }
        else
            $("#bookflight-success").show();
    },

    get404Box: function () {
        return `<div class="box-404">
    <div class="mb20"><img src="/images/graphics/icon-search.png" alt=""></div>
    <div class="medium txt_24 mb10">Không tìm thấy kết quả</div>
        </div>`;
    },

    // group array by prop
    groupBy: function (collection, property) {
        var i = 0, val, index,
            values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);

            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
    },

    renderHtmlStop: function (find) {
        var stopHtml = "";
        if (find) {
            var name = find.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.name : find.AirlineObj.nameVi;
            var path = find.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.path : find.AirlineObj.logo;
            if (find.ListFlight[0].ListSegment.length == 1) {
                var item = find.ListFlight[0].ListSegment[0];
                var startName = this.findByProp("code", item.StartPoint, CONSTANTS.FLIGHTS.PLACES) ? this.findByProp("code", item.StartPoint, CONSTANTS.FLIGHTS.PLACES).name : "";
                var endName = this.findByProp("code", item.EndPoint, CONSTANTS.FLIGHTS.PLACES) ? this.findByProp("code", item.EndPoint, CONSTANTS.FLIGHTS.PLACES).name : "";

                stopHtml += `  <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly1.png" alt="">
                            </span>
                            <div class="name"><strong>${startName} (${item.StartPoint})</strong></div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                   <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/address.png" alt="">
                            </span>
                            <div class="name"><strong>${endName} (${item.EndPoint})</strong></div>
                        </div>
                    </div>`
            }
            else {
                for (var i in find.ListFlight[0].ListSegment) {
                    var item = find.ListFlight[0].ListSegment[i];
                    var startName = this.findByProp("code", item.StartPoint, CONSTANTS.FLIGHTS.PLACES) ? this.findByProp("code", item.StartPoint, CONSTANTS.FLIGHTS.PLACES).name : "";
                    var endName = this.findByProp("code", item.EndPoint, CONSTANTS.FLIGHTS.PLACES) ? this.findByProp("code", item.EndPoint, CONSTANTS.FLIGHTS.PLACES).name : "";

                    if (i == 0) {
                        stopHtml += `  <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly1.png" alt="">
                            </span>
                            <div class="name"><strong>${startName} (${item.StartPoint})</strong></div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item transit">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/dotted.png" alt="">
                            </span>
                            <div class="name">${endName} (${item.EndPoint})</div>
                            <div class="note">Quá cảnh tại ${endName} ${TIME_UTILS.timeConvert(item.StopTime)}</div>
                        </div>
                    </div>`
                    }
                    else {
                        if (i == find.ListFlight[0].ListSegment.length - 1) {
                            stopHtml += `  <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly2.png" alt="">
                            </span>
                            <div class="name">${startName} (${item.StartPoint}) </div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/address.png" alt="">
                            </span>
                            <div class="name"><strong>${endName} (${item.EndPoint})</strong></div>
                        </div>
                    </div>`
                        }
                        else {
                            stopHtml += `<div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly2.png" alt="">
                            </span>
                            <div class="name">${startName} (${item.StartPoint}) </div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item transit">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/dotted.png" alt="">
                            </span>
                            <div class="name">${endName} (${item.EndPoint})</div>
                            <div class="note">Quá cảnh tại ${endName} ${TIME_UTILS.timeConvert(item.StopTime)}</div>
                        </div>
                    </div>`
                        }
                    }
                }
            }
        }

        return `<div class="flying-stop">${stopHtml}</div>`;
    },
    showStop: function (find) {
        var stopHtml = "";
        if (find) {
            var name = find.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.name : find.AirlineObj.nameVi;
            var path = find.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.path : find.AirlineObj.logo;
            for (var i in find.ListFlight[0].ListSegment) {
                var item = find.ListFlight[0].ListSegment[i];
                var startName = this.findByProp("code", item.StartPoint, CONSTANTS.FLIGHTS.PLACES).name;
                var endName = this.findByProp("code", item.EndPoint, CONSTANTS.FLIGHTS.PLACES).name;

                if (i == 0) {
                    stopHtml += `  <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly1.png" alt="">
                            </span>
                            <div class="name"><strong>${startName} (${item.StartPoint})</strong></div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item transit">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/dotted.png" alt="">
                            </span>
                            <div class="name">${endName} (${item.EndPoint})</div>
                            <div class="note">Quá cảnh tại ${endName} ${TIME_UTILS.timeConvert(item.StopTime)}</div>
                        </div>
                    </div>`
                }
                else {
                    if (i == find.ListFlight[0].ListSegment.length - 1) {
                        stopHtml += `  <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly2.png" alt="">
                            </span>
                            <div class="name">${startName} (${item.StartPoint}) </div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/address.png" alt="">
                            </span>
                            <div class="name"><strong>${endName} (${item.EndPoint})</strong></div>
                        </div>
                    </div>`
                    }
                    else {
                        stopHtml += `<div class="item">
                        <div class="time">${TIME_UTILS.getFlightTime(item.StartTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/fly2.png" alt="">
                            </span>
                            <div class="name">${startName} (${item.StartPoint}) </div>
                            <div class="airline">
                                <img src="${path}" alt="">${name}
                            </div>
                        </div>
                    </div>
                    <div class="item transit">
                        <div class="time">${TIME_UTILS.getFlightTime(item.EndTime)}</div>
                        <div class="info">
                            <span class="icon">
                                <img src="/images/icons/dotted.png" alt="">
                            </span>
                            <div class="name">${endName} (${item.EndPoint})</div>
                            <div class="note">Quá cảnh tại ${endName} ${TIME_UTILS.timeConvert(item.StopTime)}</div>
                        </div>
                    </div>`
                    }
                }
            }

        }

        $("#flying-stop").html(stopHtml);

        this.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalStop);
    },

    // debounce call function
    callOnce: function (func, within = 300, timerId = null) {
        window.callOnceTimers = window.callOnceTimers || {};
        if (timerId == null)
            timerId = func;
        var timer = window.callOnceTimers[timerId];
        clearTimeout(timer);
        timer = setTimeout(() => func(), within);
        window.callOnceTimers[timerId] = timer;
    },

    // local storage in a time
    setWithExpiry: function (key, value, ttl) {
        const now = new Date()

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        }
        localStorage.setItem(key, JSON.stringify(item))
    },

    setExpiryDate: function (key, value, days) {
        const now = new Date()

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: now.getTime() + days * 24 * 60 * 60 * 1000,
        }
        localStorage.setItem(key, JSON.stringify(item))
    },

    getWithExpiry: function (key) {
        const itemStr = localStorage.getItem(key)
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key)
            return null
        }
        return item.value
    },

    handleSearchHistory: function (newSearch) {
        var history = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.SearchHistory));
        if (history) {
            if (history.length >= 4) {
                history.splice(0, 1);
            }
        }
        else {
            history = [];
        }
        history.push(newSearch);

        localStorage.setItem(CONSTANTS.STORAGE.SearchHistory, JSON.stringify(history))
    },

    passObjectAsArgumentInsideString: function (obj) {
        return encodeURIComponent(JSON.stringify(obj))
    },

    decodeObjectAsArgumentInsideString: function (stringObj) {
        return JSON.parse(decodeURIComponent(stringObj))
    },

    removeVinCart: function () {
        var cart = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.VIN.Cart));
        var paymentCart = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.VIN.PaymentCart));

        var notPayCart = [];
        if (cart && paymentCart) {
            for (var cartItem of cart) {
                // find payment cart item
                var find = false;
                for (var payCart of paymentCart) {
                    
                    if (cartItem.Key == payCart.Key && cartItem.PeopleString == payCart.PeopleString) {
                        find = cartItem;
                        break;
                    }      
                }
                if (!find)
                    notPayCart.push(cartItem)
            }
        }

        //sessionStorage.removeItem(CONSTANTS.STORAGE.VIN.PaymentCart);
        sessionStorage.removeItem(CONSTANTS.STORAGE.VIN.BookingId);

        localStorage.setItem(CONSTANTS.STORAGE.VIN.Cart, JSON.stringify(notPayCart));
    },

    rerenderSelectArrival: function (data) {
        $("#select-arrival").empty().select2({
            data: data,
            escapeMarkup: function (markup) {
                return markup;
            },
            language: {
                noResults: function () {
                    return "Không tìm thấy!"
                },
            },
            dropdownCssClass: "select-address-custom select-arrival-custom",
            templateResult: function (data) {
                return `<div data-code="${data.code}" class="item-address"><svg class="icon-svg">
                <use xlink:href="../images/icons/icon.svg#address"></use>
            </svg>
            <div class="address">
                <div class="address-name name">${data.name}</div>
                <div class="address-code">(${data.code})</div>
            </div>
             </div>
                `;
            },
            templateSelection: function (data) {
                return ` <span class="select-arrival-code">${data.code}</span>&nbsp;(<span class="select-arrival-name">${data.name}</span>)`;
            },

        });
    },

    rerenderSelectGo: function (data) {
        $("#select-go").empty().select2({
            data: data,
            escapeMarkup: function (markup) {
                return markup;
            },
            language: {
                noResults: function () {
                    return "Không tìm thấy!"
                },
            },
            dropdownCssClass: "select-address-custom select-arrival-custom",
            templateResult: function (data) {
                return `<div data-code="${data.code}" class="item-address"><svg class="icon-svg">
                <use xlink:href="../images/icons/icon.svg#address"></use>
            </svg>
            <div class="address">
                <div class="address-name name">${data.name}</div>
                <div class="address-code">(${data.code})</div>
            </div>
             </div>
                `;
            },
            templateSelection: function (data) {
                return ` <span class="select-arrival-code">${data.code}</span>&nbsp;(<span class="select-arrival-name">${data.name}</span>)`;
            },

        });
    }
}