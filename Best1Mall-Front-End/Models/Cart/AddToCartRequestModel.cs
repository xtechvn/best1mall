using Best1Mall_Front_End.Models.Products;

namespace Best1Mall_Front_End.Models.Cart
{
    public class AddToCartRequestModel
    {
        public string product_id { get; set; }
        public string token { get; set; }
        public int quanity { get; set; }
    }

}
