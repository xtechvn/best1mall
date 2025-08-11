namespace Best1Mall_Front_End.Models.Voucher
{
    public class ApplyVoucherRequestModel
    {
        public string voucher_name { get; set; }             // mã voucher
        public string token { get; set; }                    // token đăng nhập
        public string product_id { get; set; }               // hotel id
        public string total_order_amount_before { get; set; } // tổng giá trị đơn hàng (chỉ hàng, chưa ship)

        // 🔹 Mới: tổng phí ship trước khi áp dụng voucher
        public decimal total_shipping_fee_before { get; set; }

        // 🔹 Mới: tổng tiền hàng theo từng nhà cung cấp
        public List<AmountBySupplierModel> amount_by_supplier { get; set; } = new();
    }

    // Model con cho từng NCC
    public class AmountBySupplierModel
    {
        public string supplier_id { get; set; }
        public decimal total_amount { get; set; }
    }

}
