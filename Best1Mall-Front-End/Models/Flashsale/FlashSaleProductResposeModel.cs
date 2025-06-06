namespace Best1Mall_Front_End.Models.Flashsale
{
    public class FlashSaleProductResposeModel
    {
        public string _id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string avatar { get; set; }
        public double amount { get; set; }
        public double? discountvalue { get; set; }
        public int? valuetype { get; set; }
        public int? position { get; set; }
        public double? total_discount { get; set; }
        public double? amount_after_flashsale { get; set; }
    }
}
