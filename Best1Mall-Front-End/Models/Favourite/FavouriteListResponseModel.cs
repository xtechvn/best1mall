using Models.MongoDb;

namespace Best1Mall_Front_End.Models.Favourite
{
    public class FavouriteListResponseModel
    {
        public List<FavouriteItemMongoDbModel> items { get; set; }
        public int total { get; set; }
    }
}
