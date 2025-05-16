using Best1Mall_Front_End.Models.Products;

namespace Best1Mall_Front_End.Models.Products
{
    public class GroupProductResponseModel
    {
        public List<GroupProductModel> items { get; set; }
        public long count { get; set; }
    }
}
