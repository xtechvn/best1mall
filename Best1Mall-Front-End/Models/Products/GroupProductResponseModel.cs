using HuloToys_Front_End.Models.Products;

namespace HuloToys_Front_End.Models.Products
{
    public class GroupProductResponseModel
    {
        public List<GroupProductModel> items { get; set; }
        public long count { get; set; }
    }
}
