
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Models.Labels;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities;
using Best1Mall_Front_End.Utilities.Contants;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Best1Mall_Front_End.Controllers.Home.Business
{
    public class MenuService
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        public MenuService(IConfiguration _configuration, RedisConn _redisService)
        {
            configuration = _configuration;
            redisService = _redisService;
        }

        /// <summary>
        /// Load danh sách menu, category, ngành hàng
        /// </summary>
        /// <param name="parent_id"></param>
        /// <returns>//{"status":0,"msg":"Success","categories":[{"id":32,"name":"Giới thiệu","image_path":"/images/icons/noimage.png","url_path":"gioi-thieu-32","order_no":0}]}</returns>
        public async Task<List<CategoryModel>?> getListMenu(int parent_id)
        {
            try
            {
                var connect_api_us = new ConnectApi(configuration,redisService);
                var input_request = new Dictionary<string, string>
                {
                    {"category_id",parent_id.ToString() }
                };
                var response_api = await connect_api_us.CreateHttpRequest("/api/news/get-category.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {                    
                    string data = JsonParent[0]["data"].ToString();
                    return JsonConvert.DeserializeObject<List<CategoryModel>>(data);
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["telegram_log_error_fe:Token"], configuration["telegram_log_error_fe:GroupId"], "getListMenuHelp " + ex.Message);
                return null;
            }
        }
        public async Task<List<LabelListingModel>?> GetLabelList(int top)
        {
            try
            {
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, string>
                {
                    {"top",top.ToString() }
                };
                var response_api = await connect_api_us.CreateHttpRequest("/api/label/list", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    string data = JsonParent[0]["data"].ToString();
                    return JsonConvert.DeserializeObject<List<LabelListingModel>>(data);
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["telegram_log_error_fe:Token"], configuration["telegram_log_error_fe:GroupId"], "getListMenuHelp " + ex.Message);
                return null;
            }
        }



    }
}
