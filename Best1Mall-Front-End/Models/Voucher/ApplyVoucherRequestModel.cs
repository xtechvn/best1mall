namespace Best1Mall_Front_End.Models.Voucher
{
    public class ApplyVoucherRequestModel
    {
        public string voucher_name { get; set; }           // mã voucher
        public string token { get; set; }                 // token đăng nhập
        public string product_id { get; set; }             // hotel id
        public string total_order_amount_before { get; set; } // tổng giá trị đơn hàng
    }
}
