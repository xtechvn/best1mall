namespace Best1Mall_Front_End.Models.Cart
{
    public class CartGeneralRequestModel
    {
        public string token { get; set; }

    }
    public class ListorderRequestModel
    {
        public string token { get; set; }
        public string order_status { get; set; }

        public DateTime? fromdate { get; set; }
        public DateTime? todate { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }

    }
    public class ListPaymentRequestModel
    {
        public string token { get; set; }
       
        public int page_index { get; set; }
        public int page_size { get; set; }

    }
}
