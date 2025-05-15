var STORAGE_NAME = {
    Cart: "user_cart_items",
    Login: 'account',
    ProductDetail: 'ProductDetail',
    CartCount: 'CartCount',
    BuyNowItem: 'BuyNowItem',
    SubProduct: 'SubProduct',
    Order: 'Order',
    AddressClient: 'AddressClient',
    CartAddress: 'CartAddress',
    ProductDetailSelected: 'ProductDetailSelected',
    ProductCommentCount: 'ProductCommentCount',
    OrderDetail: 'OrderDetail',
    AddressClientLocal: 'AddressClientLocal',

}
var API_URL = {
    Login: '/Client/Login',
    ChangePassword: '/Client/ConfirmChangePassword',
    Register: '/Client/Register',
    ProductDetail: '/Product/ProductDetail',
    ProductList: '/Product/GetList',
    GroupProduct: '/Product/GetGroupProduct',

    AddToCart: '/Cart/AddToCart',
    CartCount: '/Cart/CartCount',
    CartList: '/Cart/GetList',
    CartDelete: '/Cart/Delete',
    CartDeleteByOrder: '/Cart/DeleteByOrder',
    CartConfirm: '/Order/Confirm',
    OrderDetail: '/Order/GetDetail',
    OrderHistoryDetail: '/Order/GetHistoryDetail',
    QRCode: '/Order/QRCode',
    StaticDomain: 'https://static-image.adavigo.com',
    OrderListing: '/Order/Listing',
    AddressList: '/Client/AddressList',
    AddressDetail: '/Client/AddressDetail',
    AddressPopup: '/Client/AddressPopup',
    AddressProvince: '/Client/Province',
    AddressDistrict: '/Client/District',
    AddressWard: '/Client/Ward',
    UpdateAddress: '/Client/SubmitAddress',
    DefaultAddress: '/Client/DefaultAddress',
    CartChangeQuanity: '/Cart/ChangeQuanity',
    CartCheckProductDetail: '/Cart/CheckProduct',
    GlobalSearch: '/Product/Search',
    ProductReviewComment: '/Product/ReviewComment',
    ProductRaitingCount: '/Product/RaitingCount',
    ProductRaitingPaging: '/Product/RaitingPaging',
    OrderRaitingUploadImage: '/Files/SummitImages',
    OrderRaitingUploadVideo: '/Files/SummitVideo',
    OrderRaitingSubmmit: '/Order/InsertRaiting',
    ClientForgotPassword: '/Client/ForgotPassword',
    ProductSearchListingPaging: '/Product/SearchListingPaging',
    CartGetShippingFee: '/Cart/GetShippingFee',


}
var NOTIFICATION_MESSAGE = {
    LoginIncorrect: 'Tài khoản / Mật khẩu không chính xác, vui lòng thử lại',
    RegisterIncorrect: 'Thông tin đăng ký không chính xác, vui lòng thử lại hoặc liên hệ bộ phận chăm sóc',
    EmailInCorrect: 'Vui lòng nhập đúng địa chỉ Email',
    PhoneNotCorrect: 'Vui lòng nhập đúng số điện thoại',
    PasswordTooShort: 'Vui lòng nhập mật khẩu trên {count} ký tự',
    PasswordConfirmNotEqual: 'Xác nhận mật khẩu và mật khẩu không khớp',
    EmptyField: 'Vui lòng không để trống'
}
var THIRDPARTY_CONSTANTS = {
    Facebook: {
        AppId: '406702408540759',
        Version: 'v20.0'
    },
    GSI: {
        ClientID: '65575993345-u9qk911fs77lls8tgmn2c3gjk04lg78c.apps.googleusercontent.com'
    }
}
var GLOBAL_CONSTANTS = {
    Size: 6,
    GridSize: 10,
    ProductSize: 12,
    GroupProduct: {
        FlashSale: 15,
        Discount: 16,
        BEAR_COLLECTION: 17,
        INTELLECTUAL_DEVELOPMENT: 18,
        GROUP_PRODUCT: 1
    },
    PaymentType: [
        { id: 1, name: 'Thanh toán khi nhận hàng(COD)' },
        { id: 2, name: 'Chuyển khoản qua ngân hàng' },
        { id: 3, name: 'Thanh toán QR-PAY' },
        { id: 4, name: 'Thẻ Visa - Master Card' },
    ],
    OrderStatus: [
        { id: 0, name: 'Chờ thanh toán' },
        { id: 1, name: 'Đang xử lý ' },
        { id: 2, name: 'Đang giao hàng' },
        { id: 3, name: 'Hoàn thành' },
        { id: 4, name: 'Đã hủy' },
    ],
    RaitingPageSize: 5,
    OrderReviewCreate: {
        MaxImage: 5,
        MaxVideo: 1,
        ImageExtension: ['jpeg', 'jpg', 'png', 'bmp'],
        VideoExtension: ['mp4'],
        MaxImageSize: 1572864,
        MaxVideoSize: 52428800
    }
}
var HTML_CONSTANTS = {
    GoogleAccountNotRegistered: '<span class="err err-gg-account" style=" width: 100%; text-align: -webkit-center; ">Tài khoản Google chưa được đăng ký, vui lòng điền đầy đủ thông tin và nhấn tạo tài khoản</span>',
    Global: {
        SelectOption: `<option value="{value}">{name}</option>`
    },
    Home: {
        SlideProductItem: ` 

                         <div class="swiper-slide pt-3">
                                        <div class="bg-white rounded-xl p-2 text-slate-800 relative h-full pb-14">
                                            <!-- Sale badge -->
                                            <a href="{url}">
                                               <div class="absolute -top-1 z-10 left-1 bg-[url(assets/images/icon/tag.png)] bg-contain bg-no-repeat text-white text-xs px-2 w-[50px] h-[30px] py-1 {discount_style}">
                                                    {discount_text}
                                                </div>

                                                <div class="relative aspect-[1/1] overflow-hidden rounded-lg">
                                                    <img src="{avt}" alt="Sản phẩm"
                                                         class="absolute inset-0 w-full h-full object-cover" />

                                                </div>
                                                <p class="text-sm line-clamp-2 font-medium mt-2">
                                                   {name}
                                                </p>
                                                <div class="absolute bottom-2 w-full px-2 left-0">
                                                    <div class="text-rose-600 font-bold mt-1">{amount}</div>
                                                    <div class="flex items-center justify-between">
                                                        <div class="text-xs line-through text-slate-400 " style="{old_price_style}">{price}</div>
                                                        <div class="text-xs text-yellow-500 mt-1">
                                                            {review_point} <span class="text-color-base">{review_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                        
                        `,

        GroupProductItem: ` 
      <div class="flex-shrink-0 w-27 text-center p-2 rounded-xl border border-blue-100">
                        <div class="rounded-xl bg-blue-50 mb-2 p-2 h-22 w-22 flex items-center justify-center">
                            <img src="{avt}" alt="{name}" class="mx-auto h-15">
                        </div>
                        <a href="/san-pham?group_id={id}" class="text-[13px] text-slate-700 ">{name}</a>
                    </div>

    `,
        GlobalSearchProductItem: ` <div class="item-product">
            <a href="{url}">
                <div class="box-thumb">
                    <div class="thumb-product">
                        <img src="{avt}" width="100px" height="100px" alt="">
                    </div>
                </div>
                <div class="box-info">
                    <h3 class="name-product">{name}</h3>
                    <div class="flex-price">
                    <div class="price-sale">{amount}</div>
                     <div class="review">{review_point}<i class="icon icon-star"></i><span class="total-review">{review_count}</span></div>
                    </div>
                    <div class="price-old">
                     <nw style="display:none;">So với giá cũ {price} <i class="icon icon-info"></i></nw>
                        <div class="info-detail">
                            Giá sản phẩm <b>rẻ nhất</b> của đơn vị khác
                            được Hulo Toys nghiên cứu trên <b>mọi nền tảng</b>
                        </div>
                    </div>
                </div>
            </a>
        </div>`,
        GlobalSearchByKeyword: ` 
        <li class="p-2 hover:bg-red-50 hover:text-red-500 cursor-pointer flex items-center gap-2 text-xs">
            <img src="/assets/images/product1.jpg" alt="Sản phẩm" class="w-14 h-14 object-cover rounded">
            <div>
                <a href="{url}">{name}</a>
                <div class="text-red-400 mt-1">185.000 đ</div>
            </div>
        </li>

        `,
        GlobalSearchBoxLoading: ` <div class="list-product-recomment">
        <div class="item-product">
            <a href="">
                <div class="box-thumb">
                    <div class="thumb-product">
                        <img src="/assets/images/product.jpg" alt="">
                    </div>
                </div>
                <div class="box-info">
                    <h3 class="name-product">Đồ Chơi Lắp Ráp Tàu Vũ Trụ Lele Brother, Xếp Hình Cho Bé Từ 6 Tuổi</h3>
                    <div class="flex-price">
                        <div class="price-sale">689,098đ</div>
                        <div class="review">4.8<i class="icon icon-star"></i><span class="total-review">(322)</span></div>
                    </div>
                    <div class="price-old">
                        So với giá cũ 767,009đ <i class="icon icon-info"></i>
                        <div class="info-detail">
                            Giá sản phẩm <b>rẻ nhất</b> của đơn vị khác
                            được Hulo Toys nghiên cứu trên <b>mọi nền tảng</b>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="item-product">
            <a href="">
                <div class="box-thumb">
                    <div class="thumb-product">
                        <img src="/assets/images/product.jpg" alt="">
                    </div>
                </div>
                <div class="box-info">
                    <h3 class="name-product">Đồ Chơi Lắp Ráp Tàu Vũ Trụ Lele Brother, Xếp Hình Cho Bé Từ 6 Tuổi</h3>
                    <div class="flex-price">
                        <div class="price-sale">689,098đ</div>
                        <div class="review">4.8<i class="icon icon-star"></i><span class="total-review">(322)</span></div>
                    </div>
                    <div class="price-old">
                        So với giá cũ 767,009đ <i class="icon icon-info"></i>
                        <div class="info-detail">
                            Giá sản phẩm <b>rẻ nhất</b> của đơn vị khác
                            được Hulo Toys nghiên cứu trên <b>mọi nền tảng</b>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="item-product">
            <a href="">
                <div class="box-thumb">
                    <div class="thumb-product">
                        <img src="/assets/images/product.jpg" alt="">
                    </div>
                </div>
                <div class="box-info">
                    <h3 class="name-product">Đồ Chơi Lắp Ráp Tàu Vũ Trụ Lele Brother, Xếp Hình Cho Bé Từ 6 Tuổi</h3>
                    <div class="flex-price">
                        <div class="price-sale">689,098đ</div>
                        <div class="review">4.8<i class="icon icon-star"></i><span class="total-review">(322)</span></div>
                    </div>
                    <div class="price-old">
                        So với giá cũ 767,009đ <i class="icon icon-info"></i>
                        <div class="info-detail">
                            Giá sản phẩm <b>rẻ nhất</b> của đơn vị khác
                            được Hulo Toys nghiên cứu trên <b>mọi nền tảng</b>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>`,
        GridProductItem: `<div class="item-product">
                        <a href="">
                            <div class="box-thumb">
                                <div class="thumb-product">
                                    <img src="{avt}" alt="" />
                                </div>
                            </div>
                            <div class="box-info">
                                <h3 class="name-product">{name}</h3>
                                <div class="flex-price">
                                    <div class="price-sale">{amount}</div>
                                    <div class="review">{review_point}<i class="icon icon-star"></i><span class="total-review">{review_count}</span></div>
                                </div>
                                <div class="price-old" style="{old_price_style}">
                                    <nw style="display:none;">So với giá cũ {price} <i class="icon icon-info"></i></nw>
                                    <div class="info-detail">
                                        Giá sản phẩm <b>rẻ nhất</b> của đơn vị khác
                                        được Hulo Toys nghiên cứu trên <b>mọi nền tảng</b>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`
    },
    Detail: {
        Images: `
                              <a  class="swiper-slide" href="{src}" data-lg-id="3e1fbec2-9c35-461a-b9cc-79fd1d885438">
                                <img src="{src}" width="500" height="300">
                            </a>

                            `,
        Videos: `
                            <a class="swiper-slide" data-video='{"source": [{"src":"{src}", "type":"video/mp4"}],"attributes": {"preload": false, "controls": false}}'
                               data-poster="/assets/images/product.jpg">
                                <i class="icon-video"></i>
                                  <video>
                                      <source src="{src}" type="video/mp4">
                                      Your browser does not support the video tag.
                                    </video>
                            </a>


                            `,
        ThumbnailImages: `<div class="swiper-slide">
                            <img src="{src}" alt="" />
                            </div > `,
        ThumbnailVideos: `<div class="swiper-slide">
                                <video>
                                      <source src="{src}" type="video/mp4">
                                      Your browser does not support the video tag.
                                    </video>
                            </div >`,

        Star: ` <svg width="18" height="19" viewBox="0 0 18 19"
                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 7.83382C18 8.00017 17.9063 8.18165 17.7188 8.37825L13.7921 12.3934L14.7224 18.0644C14.7296 18.1174 14.7332 18.193 14.7332 18.2913C14.7332 18.4501 14.6935 18.5824 14.6142 18.6883C14.5421 18.8017 14.4339 18.8584 14.2897 18.8584C14.1526 18.8584 14.0084 18.813 13.857 18.7223L9 16.0455L4.14303 18.7223C3.98437 18.813 3.84014 18.8584 3.71034 18.8584C3.55889 18.8584 3.44351 18.8017 3.36418 18.6883C3.29207 18.5824 3.25601 18.4501 3.25601 18.2913C3.25601 18.2459 3.26322 18.1703 3.27764 18.0644L4.20793 12.3934L0.270434 8.37825C0.090145 8.17409 0 7.99261 0 7.83382C0 7.55405 0.201923 7.38014 0.605769 7.31208L6.03606 6.48411L8.46995 1.32343C8.60697 1.01341 8.78365 0.858398 9 0.858398C9.21635 0.858398 9.39303 1.01341 9.53005 1.32343L11.9639 6.48411L17.3942 7.31208C17.7981 7.38014 18 7.55405 18 7.83382Z"
                                              fill="#FFAA00"></path>
                                    </svg>`,
        Half_Star: `<i class="icon half-star"></i>`,
        Empty_Star: `<i class="icon empty-star"></i>`,
        Tr_Voucher: ` <tr>
                                 <td>Mã giảm giá</td>
                                <td>
                                   {span}
                                </td> 
                            </tr>`,
        Tr_Voucher_Td_span: `<span class="coupon" data-id="{id}">{name}</span>`,
        Tr_Combo: ` <tr>
                                <td>Combo khuyến mại</td>
                                <td> {span} </td>
                            </tr>`,
        Tr_Combo_Td_span: ` <span class="combo" data-id="{id}">{name}</span>`,

        Tr_Shipping: ` <tr class="text-slate-500">
                                <td>Vận chuyển</td>
                                <td>Miễn phí vận chuyển</td>
                            </tr>`,
        Tr_Attributes: `<tr class="attributes" data-level="{level}">
                    <td class="text-slate-500">{name}:</td>
                    <td>
                        <span class="flex flex-wrap gap-2 items-center box-tag">
                            {li}
                        </span>
                    </td>
                </tr>`,
        Tr_Attributes_Td_li: `
            <span class=" attribute-detail rounded border border-gray-200 hover:border-red-500 hover:bg-red-100 p-2 text-sm cursor-pointer {active}" data-id="{name}">
    {src}{name}
</span>

        `,
        Tr_Quanity: `<tr class="box-detail-stock">
    <td class="text-slate-500">Số lượng:</td>
    <td>
        <span class="flex gap-2 items-center">
            <div class="flex items-center number-input">
                <button type="button"
                        class="h-8 w-8 border border-gray-100 text-gray-700 rounded-tl rounded-bl hover:bg-gray-100 cursor-pointer"
                        onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                    -
                </button>
                <input id="quantity" name="quantity" type="number" value="1" min="1"
                       class="h-8 w-16 text-center border-t border-b border-gray-100 quantity" />
                <button type="button"
                        class="h-8 w-8 border border-gray-100 text-gray-700 rounded-tr rounded-br hover:bg-gray-100 border-gray-100 cursor-pointer"
                        onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                    +
                </button>
            </div>

            <span class="text-slate-500 font-light soluong">{stock} sản phẩm có sẵn</span>
        </span>
    </td>
</tr>
`
    },
    Cart: {
        Product: `<div class="flex md:items-center gap-3 py-2 bg-gray-50 p-2 rounded-xl w-full product"
     data-cart-id="{id}" data-product-id="{product_id}" data-amount="{amount}">
  
                          <!-- Checkbox -->
                            <div class="product-checkall">
                                <div class="box-checkbox">
                                    
                                    <input type="checkbox"  class="w-5 h-5 shrink-0 md:mt-0 mt-4 checkbox-cart" />
                                    <label class="box-checkbox-label"></label>
                                </div>
                            </div>
                         

                          <!-- Product Info -->
                          <div class="md:grid grid-cols-12 w-full items-center relative">

                            <!-- Image + Name -->
                            <div class="col-span-5">
                              <div class="flex gap-2 items-center">
                                <div class="relative aspect-[1/1] w-16 overflow-hidden rounded-lg shrink-0">
                                  <img src="{src}" alt="{name}" class="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p class="font-medium line-clamp-2 md:text-base text-sm">{name}</p>
                                  <div class="text-sm text-slate-500">{attribute}</div>
                                </div>
                              </div>
                            </div>

                            <!-- Price & Discount -->
                            <div class="col-span-2 md:text-center md:pl-0 pl-17">
                              <div class="flex flex-wrap md:flex-col gap-x-2 items-center">
                                <div class="font-medium md:text-base text-sm">{amount_display}</div>
                                <div class="text-sm text-slate-500">
                                  <span class="line-through">199.000 ₫</span> | -27%
                                </div>
                                <div class="discount-badge relative inline-block overflow-hidden">
                                  <span>Giảm 50k</span>
                            </div>
                          </div>
                          <span class="md:hidden block text-red-400 font-semibold">{total_amount} ₫</span>
                        </div>

                        <!-- Quantity -->
                        <div class="col-span-2 md:text-center md:pl-0 pl-17 product-quantity">
                          <div class="flex items-center number-input">
                            <button type="button"
                                    class="h-8 w-8 border border-gray-100 text-gray-700 rounded-tl rounded-bl hover:bg-gray-100 cursor-pointer"
                                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                              -
                            </button>
                           
                            <input type="number" value="{quanity}" min="1" name="quantity"
                                   class="h-8 w-10 text-center border-t border-b border-gray-100  text-sm quantity" />
                            <button type="button"
                                    class="h-8 w-8 border border-gray-100 text-gray-700 rounded-tr rounded-br hover:bg-gray-100 cursor-pointer"
                                   onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
                                            class="plus">
                              +
                            </button>
                          </div>
                        </div>

                        <!-- Total (PC only) -->
                        <div class="col-span-2 md:text-center md:pl-0 pl-17 hidden md:block">
                          <span class=" product-line-price text-red-400 font-semibold">{total_amount} ₫</span>
                        </div>

                        <!-- Remove -->
                        <div class="col-span-1 text-right md:relative absolute right-0 bottom-0 product-removal">
                          <button class="text-sm text-blue-500 hover:underline cursor-pointer all-pop" data-id="#lightbox-delete-cart" data-cart-id="{id}">
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    `,
        Empty: `<section class="product-cart-section">
    <div class="max-w-[1230px] mx-auto px-[15px]">
        <div class="breadcrumb my-4 ">
            <ul class="flex items-center gap-3 font-normal">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="" class="text-color-base">Giỏ hàng / Thanh toán</a></li>
            </ul>
        </div>
        <div class="flex flex-col text-center items-center justify-center gap-5 bg-white md:rounded-3xl rounded-xl md:p-5 p-3">
            <img src="assets/images/empty.jpg" alt="Sản phẩm"
            class="mx-auto max-w-[400px] w-full" />
            <h3 class="text-2xl font-semibold">Giỏ hàng trống</h3>
            <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
            <a href="/" class="bg-blue-500 text-sm text-white px-6 py-3 rounded-full">Tiếp tục mua sắm</a>
        </div>



        
    </div>
</section>`
    },
    OrderHistory: {
        Item: ` <div class="box-order-detail" data-id="{order_id}">
                            <div class="head-box">
                                <span class="code">Mã đơn hàng: <b>{order_no}</b></span>
                                <span class="status">Tình trạng: <span class="high">{status}</span></span>
                                <span class="code">Ngày đặt hàng: <b>{create_date}</b></span>
                                <a href="/order/detail/{order_id}" class="btn-seemore">Xem chi tiết</a>
                            </div>
                            <div class="list-product-order">
                               {product_detail}
                            </div>
                            <div class="bottom-box">
                                <div class="action">
                                    <a href="javascript:;" class="btn btn-base btn-confirm-received {confirm_display}" style="">Đã nhận được hàng</a>
                                    <a href="javascript:;" class="btn btn-line btn-cancel-order {confirm_cancel}" >Hủy đơn hàng</a>
                                </div>
                                <div class="total-price">Tổng tiền: <span class="number-price">{total_amount}</span> </div>
                            </div>
                        </div>`,
        ItemProduct: ` <div class="item">
                                    <div class="img">
                                        <img src="{src}" alt="">
                                    </div>
                                    <div class="info">
                                        <h3 class="name-product">
                                          {name}
                                        </h3>
                                        <div class="cat">{attributes}</div>
                                        <div class="flex-quantity">
                                            <span>Giá: {price} &nbsp; &nbsp; &nbsp;</span>
                                            <span>Số lượng:{quanity}</span>
                                        </div>
                                        <p class="price amount">{amount}</p>
                                    </div>
                                </div>`
    },
    Address: {
        GridItem: ` <div class="item address-item {active}" data-id="{id}">
                            <span class="defauld" style="{default-address-style}">Đặt làm mặc định</span>
                            <h3 class="name">{name}</h3>
                            <p class="add">
                               {address}
                            </p>
                            <p class="tel">Điện thoại: {tel}</p>
                            <a href="javascript:;" class="btn btn-update btn-update-address">Cập nhật</a>
                        </div>`
    },

    OrderDetailRaiting: {
        ReviewImage: `<div class="item review-img">
                                <img src="{src}" alt="">
                                <div class="del"></div>
                            </div>`,
        ReviewVideo: `<div class="item review-video">
                                  <video  width="64" height="64">
                                      <source src="{src}" type="video/mp4">
                                      Your browser does not support the video tag.
                                    </video>
                                <div class="del"></div>
                            </div>`,
        Item: ` <div class="item review-item" data-product-id="{product_id}">
                    <div class="box-product">
                        <div class="img">
                            <img src="{img}" alt="" />
                        </div>
                        <div class="info">
                            <h3 class="name-product">
                                {name}
                            </h3>
                            <div class="cat">{variation_detail}</div>
                        </div>
                    </div>
                    <div class="star" data-value="5">
                        <span>Chất lượng sản phẩm</span>
                        <span class="rate five">
                            <i class="star-number" data-class="one">★</i>
                            <i class="star-number" data-class="two">★</i>
                            <i class="star-number" data-class="three">★</i>
                            <i class="star-number" data-class="four">★</i>
                            <i class="star-number" data-class="five">★</i> 
                            <nw class="star-label">Tuyệt vời</nw>
                        </span>
                    </div>
                    <textarea rows="4" class="form-control"
                              placeholder="Hãy chia sẽ điều bạn thích về sản phẩm với những người mua khác nhé."></textarea>
                   
                    <div class="upload-file">
                        <div class="uploadIMG ">
                            <input type="file" class="upload image_input" data-type="images" multiple />
                            <span>Thêm hình ảnh</span>
                        </div>
                        <div class="uploadVIDEO ">
                            <input type="file" class="upload image_input" data-type="videos" />
                            <span>Thêm video</span>
                        </div>
                    </div>
                     <p class="error" style="display:none; color:red;"></p>
                    <div class="wrap-img-upload" style="display:none;">
                        <div class="uploadIMG " >
                            <input type="file" class="upload image_input" data-type="images" multiple/>
                            <span><nw class="count">0</nw>/5</span>
                        </div>
                        <div class="uploadVIDEO ">
                            <input type="file" class="upload image_input" data-type="videos" />
                            <span><nw class="count">0</nw>/1</span>
                        </div>
                    </div>
                </div>`,


    }

}