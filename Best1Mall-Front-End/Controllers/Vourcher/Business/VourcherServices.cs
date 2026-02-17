using Best1Mall_Front_End.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Best1Mall_Front_End.Utilities.Contants;
using Best1Mall_Front_End.Models.Cart;
using Models.MongoDb;
using Models.APIRequest;
using Best1Mall_Front_End.Models.NinjaVan;
using Best1Mall_Front_End.Models.News;
using Best1Mall_Front_End.Models.Voucher;

namespace Best1Mall_Front_End.Controllers.Client.Business
{
    public class VourcherServices : APIService
    {
        private readonly IConfiguration _configuration;
        public VourcherServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
        public async Task<List<VoucherFEModel>> GetList(AddToCartRequestModel request)
        {
            try
            {
                var result = await POST("api/voucher/get-list", request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<VoucherFEModel>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<ApplyVoucherResponseModel> ApplyVoucher(ApplyVoucherRequestModel request)
        {
            try
            {
                var result = await POST("api/voucher/apply.json", request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    // deserialize toàn bộ object response (có thể dùng jsonData.ToString())
                    return JsonConvert.DeserializeObject<ApplyVoucherResponseModel>(jsonData.ToString());
                }
            }
            catch
            {
            }
            return null;

        }



    }
}
