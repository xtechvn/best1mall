namespace Best1Mall_Front_End.Models.Products
{
    public class ProductListPageViewModel
    {
        public ProductListResponseModel Products { get; set; }
        public List<CategoryModel> ChildCategories { get; set; }
        public int SelectedGroupId { get; set; }
    }
}
