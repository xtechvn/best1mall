namespace Best1Mall_Front_End.Models.Products
{
    public class ProductDetailResponseModel
    {
        public ProductMainResponseModel product_main { get; set; }
        public List<ProductMongoDbModel> product_sub { get; set; }

        // ✅ Thêm cert vào đây
        public ProductCertModel cert { get; set; }
        public FavouriteStatusModel favourite { get; set; } // ✅ Thêm dòng này
    }
    public class FavouriteStatusModel
    {
        public bool is_favourite { get; set; }
        public int count { get; set; }
    }


    public class ProductMainResponseModel : ProductMongoDbModel
    {
        public float star { get; set; }
        public int product_sold_count { get; set; }
        public int reviews_count { get; set; }
    }

    public class ProductCertModel
    {
        public List<string> root_product { get; set; }
        public List<string> product { get; set; }
        public List<string> supply { get; set; }
        public List<string> confirm { get; set; }
    }
}
