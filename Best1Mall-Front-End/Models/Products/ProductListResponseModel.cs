using Best1Mall_Front_End.Models.Products;

namespace Best1Mall_Front_End.Models.Products
{
    public class ProductListResponseModel
    {
        public List<ProductMongoDbModel> items { get; set; }
        public long count { get; set; }
        public LabelDetail? label_detail { get; set; }
    }
    public class LabelDetail
    {
        public int id { get; set; }
        public string labelName { get; set; }
        public string labelCode { get; set; }
        public string icon { get; set; }
        public string banner { get; set; }
    }
}
