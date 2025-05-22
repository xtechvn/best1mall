using Best1Mall_Front_End.Models.Products;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models.MongoDb
{
    public class FavouriteItemMongoDbModel
    {
        [BsonElement("_id")]
        public string _id { get; set; }

        [BsonElement("account_client_id")]
        public long account_client_id { get; set; }

        [BsonElement("product_id")]
        public string product_id { get; set; }

        [BsonElement("updated_last")]
        public DateTime updated_last { get; set; }

        [BsonElement("detail")]
        public ProductMongoDbModel detail { get; set; }

        public void GenID()
        {
            _id = ObjectId.GenerateNewId(DateTime.Now).ToString();
        }

    }
}
