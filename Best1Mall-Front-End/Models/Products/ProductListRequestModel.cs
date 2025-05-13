namespace HuloToys_Front_End.Models.Products
{
    public class ProductListRequestModel
    {
        public int group_id { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
        public string? view_name { get; set; }
        public double? price_from { get; set; }  // Giá bắt đầu
        public double? price_to { get; set; }    // Giá kết thúc
        public float? rating { get; set; } // Đánh giá
    }
}
