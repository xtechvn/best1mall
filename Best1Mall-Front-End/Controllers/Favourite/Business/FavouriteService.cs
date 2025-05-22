using Best1Mall_Front_End.Models.Cart;
using Best1Mall_Front_End.Models.Favourite;
using Best1Mall_Front_End.Utilities.Contants;
using Best1Mall_Front_End.Utilities.Lib;
using Models.APIRequest;
using Models.MongoDb;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Best1Mall_Front_End.Controllers.Favourite.Business
{
    public class FavouriteService : APIService
    {
        private readonly IConfiguration _configuration;
        public FavouriteService(IConfiguration configuration) : base(configuration)
        {
            _configuration = configuration;
        }
        public async Task<int> AddToFavourite(FavouriteRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:add_to_favourite"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return Convert.ToInt32(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return -1;

        }
        public async Task<FavouriteListResponseModel> GetList(FavouriteGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:favourite_get_list"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    var responseModel = new FavouriteListResponseModel
                    {
                        items = JsonConvert.DeserializeObject<List<FavouriteItemMongoDbModel>>(jsonData["data"].ToString()),
                        total = jsonData["total"] != null ? Convert.ToInt32(jsonData["total"].ToString()) : 0
                    };
                    return responseModel;
                }
            }
            catch
            {
            }
            return null;
        }

        public async Task<int> Delete(FavouriteRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:favourite_delete"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return status;

            }
            catch
            {
            }
            return -1;

        }
    }
}
