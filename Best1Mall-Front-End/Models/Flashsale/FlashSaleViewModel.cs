namespace Best1Mall_Front_End.Models.Flashsale
{
    public class FlashSaleViewModel
    {
        public long flashsale_id { get; set; }
        
        public string name { get; set; }
        public string banner { get; set; }
        public List<FlashSaleProductResposeModel> Products { get; set; } = new();
    }
}
