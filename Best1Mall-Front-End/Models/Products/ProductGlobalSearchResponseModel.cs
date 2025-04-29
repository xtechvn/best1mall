namespace HuloToys_Front_End.Models.Products
{
    public class ProductGlobalSearchResponseModel
    {
        public ProductListResponseModel data { get; set; }
        public List<ProductSpecificationDetailMongoDbModel> brands { get; set; }
        public List<GroupProductESModel> groups { get; set; }
    }
}
