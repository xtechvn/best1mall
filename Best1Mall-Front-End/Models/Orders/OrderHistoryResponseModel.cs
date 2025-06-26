using Models.MongoDb;

namespace Best1Mall_Front_End.Models.Orders
{
    public class OrderHistoryResponseModel
    {
        public List<OrderESModel> data { get; set; }
        public List<OrderDetailMongoDbModel> data_order { get; set; }

        public int page_index { get; set; }
        public int page_size { get; set; }
        public long total { get; set; }
    }
    public class OrderHistoryCountResponseModel
    {
     public long all { get; set; }
     public long waiting_payment { get; set; }
     public long on_delivery { get; set; }
     public long success { get; set; }
     public long cancel { get; set; }
    }
}
