using Best1Mall_Front_End.Utilities.Helper;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace ENTITIES.ViewModels.Notify
{    
   public class ReceiverMessageViewModel
    {
        [JsonConverter(typeof(ObjectIdJsonConverter))]
        public string _id { get; set; }


        [BsonElement]
        public int seen_status { get; set; } // trạng thái xem notify 0: chua xem, 1: da xem tong quan, 2 da xem detail
        [BsonElement]
        public string notify_id { get; set; } // Thông tin notify
        [BsonElement]
        public double seen_date { get; set; } // Ngày mà user đó vào xem notify
        [BsonElement]
        public int user_receiver_id { get; set; } // user sẽ nhận notify
        [BsonElement]
        public string link_redirect { get; set; } // link se gắn vào item noti khi click vào để chuyển hướng
        [BsonElement]
        public string content { get; set; }

    }
}
