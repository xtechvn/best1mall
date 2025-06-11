using Best1Mall_Front_End.Models.Labels;

namespace Best1Mall_Front_End.Models.Products
{
    public class ProductDetailResponseModel
    {
        public ProductMainResponseModel product_main { get; set; }
        public List<ProductMongoDbModel> product_sub { get; set; }

        // ✅ Thêm cert vào đây
        public ProductCertModel cert { get; set; }
        public FavouriteStatusModel favourite { get; set; } // ✅ Thêm dòng này
                                                            // ✅ Thêm buywith vào đây
        public List<ProductDetailResponseModelProductBuyWith> product_buy_with_output { get; set; }
        public Label label_detail { get; set; }
        public List<GroupProductESModel> groups { get; set; }


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
    // ✅ Model cho buywith item
    public class ProductDetailResponseModelProductBuyWith
    {
        public string _id { get; set; }
        public string code { get; set; }

        public double amount { get; set; }

        public string name { get; set; }

        public string avatar { get; set; }
        public string variation_detail { get; set; }
        public int? exists_flashsale_id { get; set; }
        public string exists_flashsale_name { get; set; }
        public double? amount_after_flashsale { get; set; }
        public DateTime? flash_sale_fromdate { get; set; }
        public DateTime? flash_sale_todate { get; set; }
    }
}
