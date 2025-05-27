$(document).ready(function () {
    order_raiting.Initialization()
})

var order_raiting = {
    Data: { //-- Data chứa các data mặc định xài trong object
        Index: 1,
        Size: 10,
       // uploadedImagesTemp: {}, // Stores temporarily uploaded image URLs per product: {productId: ['/uploads/images/user1/image1.jpg', ...]}
       // uploadedVideosTemp: {}  // Stores temporarily uploaded video URLs per product: {productId: ['/uploads/images/user1/video1.mp4', ...]}
    },
    Initialization: function () { //hàm khởi tạo
        order_raiting.DynamicBind();
    },
    DynamicBind: function () { // hàm chứa tất cả các event click, focusin,....
        // Event listener for opening the rating popup
        $(document).on('click', '#order-detail-raiting', function () {
            $('#danhgia-popup').show(); // Show the popup [cite: 84]
        });
        $(document).on('click', '.order-raiting-upload-list-img .del, .order-raiting-upload-list-vid .del', function () {
            var element = $(this)
            element.closest('.order-raiting-upload-list-img').remove()
            element.closest('.order-raiting-upload-list-vid').remove()
        });
        $(document).on('click', '.order-raiting-star-label', function () {
            var element = $(this)
            var star = element.attr('data-star')
            var parent = element.closest('.rating')
            if (star == null || star == undefined) {
                return
            }
            var star_value = parseInt(star)
            if (star_value <= 0) star_value = 5;
            parent.find('.order-raiting-star').each(function () {
                var element_compare = $(this);
                if (parseInt(element_compare.attr('data-star')) == star_value) {
                    element_compare.prop('checked', true)
                } else {
                    element_compare.removeProp('checked')
                }
            });
            var color_text ='text-yellow-500'
            switch (star_value) {
                case 1:
                    ratingText = 'Rất tệ';
                    color_text = 'text-red-500'
                    break;
                case 2:
                    ratingText = 'Tệ';
                    color_text = 'text-red-500'
                    break;
                case 3:
                    ratingText = 'Bình thường';
                    color_text = 'text-gray-500'
                    break;
                case 4:
                    ratingText = 'Tốt';
                    break;
                case 5:
                    ratingText = 'Tuyệt vời';
                    break;
            }
            element.closest('.items-center').find('.order-raiting-star-review-text').html(ratingText);
            element.closest('.items-center').find('.order-raiting-star-review-text').removeClass('text-red-500');
            element.closest('.items-center').find('.order-raiting-star-review-text').removeClass('text-gray-500');
            element.closest('.items-center').find('.order-raiting-star-review-text').removeClass('text-yellow-500');
            element.closest('.items-center').find('.order-raiting-star-review-text').addClass(color_text);
        });

        // Event listener for closing the rating popup
        $(document).on('click', '.closePopup', function () {
            $('#danhgia-popup').hide(); // Hide the popup [cite: 84]
            // Optionally, clear uploaded files data when closing the popup without submitting
            //order_raiting.Data.uploadedImagesTemp = {};
            //order_raiting.Data.uploadedVideosTemp = {};
        });

      
        // Event listener for image upload (.order-raiting-upload-img)
        $(document).on('change', '.order-raiting-upload-img input', function (event) {
            var $this = $(this);
            var $orderRaitingDiv = $this.closest('.order-raiting');
            var productId = $orderRaitingDiv.data('product-id');
            var files = event.target.files;

            //if (!order_raiting.Data.uploadedImagesTemp[productId]) {
            //    order_raiting.Data.uploadedImagesTemp[productId] = [];
            //}

            var currentImagesCount = $this.closest('.order-raiting').find('.order-raiting-upload-list').find('.order-raiting-upload-list-img').length;
            var maxImages = 5;

            // Prepare FormData for immediate upload
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                if (currentImagesCount + i < maxImages) {
                    formData.append('files', files[i]);
                } else {
                   // alert('Bạn chỉ có thể tải lên tối đa ' + maxImages + ' hình ảnh.');
                    break;
                }
            }

            if (formData.has('files')) {
                // Upload files to AttachFileController.Upload [cite: 39]
                $.ajax({
                    url: '/AttachFile/Upload', // URL to your AttachFileController's Upload method [cite: 39]
                    type: 'POST',
                    data: formData,
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a multipart request
                    success: function (response) {
                        if (response.status === 0) { // Assuming SUCCESS = 1 [cite: 49]
                            //response.data.forEach(function (url) {
                            //    order_raiting.Data.uploadedImagesTemp[productId].push(url); // Store temporary URL [cite: 47]
                            //});
                            //$this.siblings('.count').text(order_raiting.Data.uploadedImagesTemp[productId].length); // Update count [cite: 116]
                            // Optionally, add image previews to the UI here
                            // You can clear the input value to allow re-uploading the same file if needed
                            order_raiting.RenderSelectedAttachImage(response.data, $this)
                        }
                        $this.val(null).trigger('change');

                    },
                    error: function (xhr, status, error) {
                        $this.val(null).trigger('change');

                    }
                });
            }
        });

        // Event listener for video upload (.order-raiting-upload-vid)
        $(document).on('change', '.order-raiting-upload-vid input', function (event) {
            var $this = $(this);
            var $orderRaitingDiv = $this.closest('.order-raiting');
            var productId = $orderRaitingDiv.data('product-id');
            var files = event.target.files;

            //if (!order_raiting.Data.uploadedVideosTemp[productId]) {
            //    order_raiting.Data.uploadedVideosTemp[productId] = [];
            //}
            var currentVideosCount = $this.closest('.order-raiting').find('.order-raiting-upload-list').find('.order-raiting-upload-list-vid').length;

           // var currentVideosCount = order_raiting.Data.uploadedVideosTemp[productId].length;
            var maxVideos = 1;

            // Prepare FormData for immediate upload
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                if (currentVideosCount + i < maxVideos) {
                    formData.append('files', files[i]);
                } else {
                    alert('Bạn chỉ có thể tải lên tối đa ' + maxVideos + ' video.');
                    break;
                }
            }

            if (formData.has('files')) {
                // Upload files to AttachFileController.UploadVideo [cite: 11]
                $.ajax({
                    url: '/AttachFile/UploadVideo', // URL to your AttachFileController's UploadVideo method [cite: 11]
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status === 0) { // Assuming SUCCESS = 0 [cite: 31]
                            //response.data.forEach(function (url) {
                            //    order_raiting.Data.uploadedVideosTemp[productId].push(url); // Store temporary URL [cite: 27]
                            //});
                            //$this.siblings('.count').text(order_raiting.Data.uploadedVideosTemp[productId].length); // Update count [cite: 118]
                            // Optionally, add video preview to the UI here
                            // You can clear the input value to allow re-uploading the same file if needed
                            order_raiting.RenderSelectedAttachVideo(response.data, $this)
                            $this.val('');
                        } else {
                           // alert('Tải video lên thất bại: ' + response.msg + (response.errors ? '\n' + response.errors.join('\n') : '')); // Display error message [cite: 33]
                        }
                    },
                    error: function (xhr, status, error) {
                        //console.error("Upload Video Error:", status, error);
                       // alert('Đã xảy ra lỗi khi tải video lên. Vui lòng thử lại.');
                    }
                });
            }
        });

        // Event listener for the "Hoàn thành" (Complete) button [cite: 121]
        $(document).on('click', '.popup-content button:last-child', function () {
            order_raiting.confirmAndSubmitReviews();
        });

        // Event listener for the "Trở lại" (Back) button [cite: 120]
        $(document).on('click', '.popup-content button:first-child', function () {
            $('#danhgia-popup').hide(); // Hide the popup [cite: 84]
            // Clear uploaded files data when closing the popup
            //order_raiting.Data.uploadedImagesTemp = {};
            //order_raiting.Data.uploadedVideosTemp = {};
        });
    },

    confirmAndSubmitReviews: async function () {
        var reviewsToSubmit = [];

        // Iterate through each product review section
        $('.order-raiting').each(function () {
            var $this = $(this);
            var orderId = $this.data('order-id');
            var productId = $this.data('product-id');
            var starRating = 5; // Count checked stars
            var comment = $this.find('.order-raiting-review').val(); // Get comment from textarea [cite: 104]
            //if (comment == null || comment == undefined || comment.trim() == '') return true
            var images=[]
            var videos=[]
            $this.find('.order-raiting-star').each(function () {
                var element = $(this)
                if (element.is(':checked')){
                    starRating = element.attr('data-star')
                    return false
                }
            })
            $this.find('.order-raiting-upload-list').find('.order-raiting-upload-list-img').each(function () {
                var image_element = $(this)
                images.push(image_element.find('img').attr('src'));
            })
            $this.find('.order-raiting-upload-list').find('.order-raiting-upload-list-vid').each(function () {
                var video_element = $(this)
                videos.push(video_element.find('video').find('source').attr('src'));
            })
            const usr = global_service.CheckLogin();

            reviewsToSubmit.push({
                order_id: orderId,
                product_id: productId,
                star: starRating,
                comment: comment,
                img_links: images,
                video_links: videos,
                token:usr.token
            });
            
        });
        $('#danhgia-popup').hide();
        $('#thank-popup').show();
        reviewsToSubmit.each(function (index, item) {
            order_raiting.sendReviews(item)
        })

    },

    sendReviews: function (reviews) {
        console.log("Submitting reviews with confirmed links:", reviews);

        // Send data to the server
        $.ajax({
            url: '/Order/InsertRaiting',
            type: 'POST',
            data: { request: reviews },
            success: function (response) {
              
            }
        });
    },
    RenderSelectedAttachImage: function (urls, $this) {
        var html =` <div class="relative aspect-[1/1] w-13 overflow-hidden rounded-lg shrink-0 order-raiting-upload-list-img">
                                    <img src="{src}" alt="Sản phẩm"
                                         class="absolute inset-0 w-full h-full object-cover">
                                    <div class="del"></div>
                                </div>`
        urls.forEach(function (url) {
            $this.closest('.order-raiting').find('.order-raiting-upload-list').append(html.replaceAll('{src}',url))
        });
        var count = $this.closest('.order-raiting').find('.order-raiting-upload-list').find('.order-raiting-upload-list-img').length
        $this.closest('.items-center').find('.count').html(count)
    },
    RenderSelectedAttachVideo: function (urls, $this) {
        var html = ` <div class="relative aspect-[1/1] w-13 overflow-hidden rounded-lg shrink-0 order-raiting-upload-list-vid">
                                    <video width="320" height="240" controls>
                                      <source src="{src}" type="video/mp4">
                                    </video>
                                    <div class="del"></div>
                                </div>`
        urls.forEach(function (url) {
            $this.closest('.order-raiting').find('.order-raiting-upload-list').append(html.replaceAll('{src}', url))
        });
        var count = $this.closest('.order-raiting').find('.order-raiting-upload-list').find('.order-raiting-upload-list-vid').length
        $this.closest('.items-center').find('.count').html(count)
    },

   
};