using HuloToys_Front_End.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using HuloToys_Front_End.Utilities.Contants;
using HuloToys_Front_End.Models.Products;
using HuloToys_Front_End.Models.Raiting;
using System.Reflection;
using HuloToys_Front_End.Utilities.Lib;

namespace HuloToys_Front_End.Controllers.Client.Business
{
    public class ProductServices :APIService
    {
        private readonly IConfiguration _configuration;
        public ProductServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
        public async Task<ProductDetailResponseModel> GetProductDetail(ProductDetailRequestModel request)
        {
            try
            {

                var result = await POST(_configuration["API:get_product_detail"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductDetailResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<ProductListResponseModel> GetProductList(ProductListRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:get_product_list"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductListResponseModel>(jsonData["data"].ToString());
                }
            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(_configuration["telegram:log_try_catch:bot_token"], _configuration["telegram:log_try_catch:group_id"], error_msg);
            }
            return null;

        }
        public async Task<ProductListResponseModel> Search(ProductGlobalSearchRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:product_search"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductListResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<ProductRaitingResponseModel> RaitingCount(ProductRaitingRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:product_raiting_count"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductRaitingResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<List<RatingESResponseModel>> Raiting(ProductRaitingRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:product_raiting"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<RatingESResponseModel>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<ProductGlobalSearchResponseModel> GlobalSearch(ProductGlobalSearchRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:product_global_search"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductGlobalSearchResponseModel>(jsonData.ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<ProductGlobalSearchResponseModel> GlobalSearchFilter(ProductGlobalSearchRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:product_global_search_filter"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductGlobalSearchResponseModel>(jsonData.ToString());
                }
            }
            catch
            {
            }
            return null;

        }
    }
}
