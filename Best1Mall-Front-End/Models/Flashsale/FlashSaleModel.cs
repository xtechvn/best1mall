namespace Best1Mall_Front_End.Models.Flashsale
{

    public class FlashSaleListResponse
    {
        public List<FlashSaleModel> Items { get; set; }
        public int Count { get; set; }
    }


    public class FlashSaleModel
    {
        public long id { get; set; } // ID ElasticSearch
        public int flashsale_id { get; set; } // ID ElasticSearch
        public DateTime fromdate { get; set; }

        public DateTime todate { get; set; }
        public byte status { get; set; }
        public int? supplierid { get; set; }
        public string name { get; set; }
        public string supplier_name { get; set; }
        public string banner { get; set; }
    }
}
