using Best1Mall_Front_End.Models.Orders;

namespace Models.MongoDb
{
    public class OrderGeneralRequestModel
    {
        public string id { get; set; }

    }
    public class OrdersVNPAYRequestModel : OrdersGeneralRequestModel
    {
        public string client_ip { get; set; }
        public string country { get; set; }

    }
    public class OrdersVNPAYValidateRequestModel
    {
        public string response_from_vnpay { get; set; }

    }
}
