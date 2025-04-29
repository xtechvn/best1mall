using Models.MongoDb;

namespace HuloToys_Front_End.Models.Orders
{
    public class OrderHistoryResponseModel
    {
        public List<OrderESModel> data { get; set; }
        public List<OrderDetailMongoDbModel> data_order { get; set; }

        public int page_index { get; set; }
        public int page_size { get; set; }
        public long total { get; set; }
    }
}
