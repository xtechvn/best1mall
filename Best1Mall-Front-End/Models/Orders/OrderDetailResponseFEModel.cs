using Best1Mall_Front_End.Models.Location;

namespace Best1Mall_Front_End.Models.Orders
{
    public class OrderDetailResponseFEModel
    {
        public OrderDetailMongoDbModel data { get; set; }
        public OrderESModel data_order { get; set; }
        public Province province { get; set; }
        public District district { get; set; }
        public Ward ward { get; set; }
    }
}
