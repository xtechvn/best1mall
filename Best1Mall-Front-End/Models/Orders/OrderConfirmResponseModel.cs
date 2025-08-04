namespace Best1Mall_Front_End.Models.Orders
{
    public class OrderConfirmResponseModel
    {
        public string id { get; set; }
        public string order_no { get; set; }
        public bool pushed { get; set; }

    }
    public class OrderVnPayResponseModel
    {
        public int amount { get; set; }
        public string order_no { get; set; }
        public string created_date { get; set; }
        public string order_id { get; set; }

    }

}
