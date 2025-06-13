using Best1Mall_Front_End.Models.Flashsale;
using Best1Mall_Front_End.Utilities.Contants;
using Best1Mall_Front_End.Utilities.Lib;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Best1Mall_Front_End.Controllers.FlashSale.Business
{
    public class FlashSaleServices : APIService
    {
        private readonly IConfiguration _configuration;
        public FlashSaleServices(IConfiguration configuration) : base(configuration)
        {
            _configuration = configuration;
        }
        public async Task<FlashSaleListResponse> GetList()
        {
            try
            {
               
                var result = await POST("api/flashsale/get-list", 0);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"]?.ToString() ?? "0");

                if (status == (int)ResponseType.SUCCESS)
                {
                    var dataObj = jsonData["data"]?.ToString();
                    return JsonConvert.DeserializeObject<FlashSaleListResponse>(dataObj);
                }
            }
            catch
            {
            }
            return null;
        }

        public async Task<List<FlashSaleProductResposeModel>> ListingSuperSale()
        {
            try
            {

                var result = await POST("api/flashsale/supersale", 0);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"]?.ToString() ?? "0");

                if (status == (int)ResponseType.SUCCESS)
                {
                    var dataObj = jsonData["data"]?.ToString();
                    return JsonConvert.DeserializeObject<List<FlashSaleProductResposeModel>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;
        }

        public async Task<List<FlashSaleProductResposeModel>> GetById(FlashsaleListingRequestModel request)
        {
            try
            {
               
                var result = await POST("api/flashsale/get-by-id", request);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"]?.ToString() ?? "0");

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<FlashSaleProductResposeModel>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }

            return null;
        }
    }
}
