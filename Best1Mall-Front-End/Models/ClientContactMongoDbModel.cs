using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Best1Mall_Front_End.Models
{
    public class ClientContactMongoDbModel
    {
        [BsonElement("_id")]
        public string _id { get; set; }
        public void GenID()
        {
            _id = ObjectId.GenerateNewId(DateTime.Now).ToString();
        }
        public string email { get; set; }
        public string phone { get; set; }
        public string message { get; set; }
        public DateTime created_date { get; set; }
    }
}
