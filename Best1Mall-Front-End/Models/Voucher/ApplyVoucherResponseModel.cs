namespace Best1Mall_Front_End.Models.Voucher
{
    public class ApplyVoucherResponseModel
    {
        public string status { get; set; }
        public string msg { get; set; }
        public int voucher_id { get; set; }
        public double percent_decrease { get; set; }
        public string expire_date { get; set; }
        public string voucher_name { get; set; }
        public double total_order_amount_before { get; set; }
        public double discount { get; set; }
        public double total_order_amount_after { get; set; }
        public double value { get; set; }
        public int type { get; set; }
    }
}
