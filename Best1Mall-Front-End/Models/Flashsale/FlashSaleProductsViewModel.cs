namespace Best1Mall_Front_End.Models.Flashsale
{
    public class FlashSaleProductsViewModel
    {
        // Thông tin Flash Sale
        public FlashSaleModel FlashSaleInfo { get; set; }

        // Danh sách các sản phẩm thuộc Flash Sale
        public List<FlashSaleProductResposeModel> Products { get; set; }
    }
}
