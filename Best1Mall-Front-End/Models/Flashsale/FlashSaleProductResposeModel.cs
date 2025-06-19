namespace Best1Mall_Front_End.Models.Flashsale
{

    public class SuperSaleResultModel
    {
        public List<FlashSaleProductResposeModel> Data { get; set; }
        public int TotalCount { get; set; }
    }

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
        public float? rating { get; set; }
        public double? review_count { get; set; }
        public long? total_sold { get; set; }
        public bool? super_sale { get; set; }
    }
}
