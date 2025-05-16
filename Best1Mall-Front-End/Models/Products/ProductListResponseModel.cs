using Best1Mall_Front_End.Models.Products;

namespace Best1Mall_Front_End.Models.Products
{
    public class ProductListResponseModel
    {
        public List<ProductMongoDbModel> items { get; set; }
        public long count { get; set; }
    }
}
