using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Models.Authentication;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities.Contants;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using Utilities.Contants;

namespace Best1Mall_Front_End.Utilities
{
    public class ConnectApi
    {
        private readonly IConfiguration configuration;
        private HttpClient _HttpClient;
        private const string CONST_TOKEN_PARAM = "token";
        private readonly string _ApiSecretKey;
        private readonly RedisConn redisService;
        private int cache_db_index = 8;
        private string USER_NAME = "test";
        private string PASSWORD = "password";
        private string API_GET_TOKEN = "/api/auth/login";
        private string TOKEN = "";


        public ConnectApi(IConfiguration _configuration, RedisConn _redisService)
        {
            redisService = _redisService;
            configuration = _configuration;
            _HttpClient = new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
            })
            {
                BaseAddress = new Uri(configuration["api_data:domain"])
            };
            _ApiSecretKey = configuration["API:SecretKey"];
            API_GET_TOKEN = configuration["API:GetToken"];
            USER_NAME = configuration["API:username"];
            PASSWORD = configuration["API:password"];
            cache_db_index = Convert.ToInt32(configuration["Redis:Database:db_common"]);
            _redisService = new RedisConn(configuration);
            _redisService.Connect();
        }
        /// <summary>
        /// <param name="endpoint">url tới api</param>
        /// <param name="input_request">Là các param input truyền vào các endpoint được mã  hóa token</param>
        /// <returns></returns>
        public async Task<string> CreateHttpRequest(string endpoint, object input_request)
        {
            try
            {
                string access_token = string.Empty;
                //  string token_bearer = await getToken();
                string key_user_name_cache = configuration["api_data:username"];
                // Lấy access token từ cache
                var data_access_token = await redisService.GetAsync(key_user_name_cache, Convert.ToInt32(configuration["Redis:Database:db_common"]));

                if (!string.IsNullOrEmpty(data_access_token))
                {
                    // kiểm tra còn hạn hay không
                    var token_handler = new JwtSecurityTokenHandler();
                    var jwt_token = token_handler.ReadToken(data_access_token.ToString()) as JwtSecurityToken;
                    if (jwt_token != null)
                    {
                        var expirationTime = jwt_token.ValidTo; // Thời gian hết hạn của token (UTC)
                        if (expirationTime < DateTime.UtcNow)
                        {
                            // Token đã hết hạn. Refresh token                        
                            access_token = await GetToken();
                            // set cache
                            redisService.Set(key_user_name_cache, access_token, Convert.ToInt32(configuration["Redis:Database:db_common"]));
                        }
                        else
                        {
                            access_token = data_access_token;
                        }
                    }
                }
                else
                {
                    // Chưa được khởi tạo. hoặc redis ko có
                    access_token = await GetToken();
                    // set cache
                    redisService.Set(key_user_name_cache, access_token, Convert.ToInt32(configuration["Redis:Database:db_common"]));
                }

                if (access_token != string.Empty)
                {
                    string token = CommonHelper.Encode(JsonConvert.SerializeObject(input_request), configuration["api_data:secret_key"]);
                    var request_message = new HttpRequestMessage(HttpMethod.Post, endpoint);
                    request_message.Headers.Add("Authorization", "Bearer " + access_token);
                    var content = new StringContent("{\"token\":\"" + token + "\"}", Encoding.UTF8, "application/json");
                    request_message.Content = content;
                    var response = await _HttpClient.SendAsync(request_message);
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], "token_bearer Empty");
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return string.Empty;
            }
        }

        public async Task<string> GetToken()
        {
            try
            {
                var cache_name = CacheType.FE_TOKEN;
                try
                {
                    var j_data = await redisService.GetAsync(cache_name, cache_db_index);
                    if (j_data != null && j_data.Trim() != "")
                    {
                        APITokenCacheModel result = JsonConvert.DeserializeObject<APITokenCacheModel>(j_data);
                        if (result != null && result.token != null && result.token.Trim() != "" && result.expires > DateTime.Now)
                        {
                            return result.token.Trim();
                        }
                    }
                }
                catch
                {

                }

                var request = new UserLoginModel()
                {
                    Username = USER_NAME,
                    Password = PASSWORD
                };
                var request_message = new HttpRequestMessage(HttpMethod.Post, API_GET_TOKEN);
                var content = new StringContent(JsonConvert.SerializeObject(request), null, "application/json");
                request_message.Content = content;
                var response = await _HttpClient.SendAsync(request_message);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var json = JObject.Parse(await response.Content.ReadAsStringAsync());
                    var status = int.Parse(json["status"].ToString());
                    if (status != (int)ResponseType.SUCCESS)
                    {
                        LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetToken - APIService:" + json["msg"].ToString());
                        return null;
                    }
                    string token = json["token"].ToString();
                    try
                    {
                        if (token != null && token.Trim() != "")
                        {
                            APITokenCacheModel result = new APITokenCacheModel()
                            {
                                token = token,
                                expires = DateTime.Now.AddHours(23)
                            };
                            redisService.Set(cache_name, JsonConvert.SerializeObject(result), cache_db_index);
                        }
                    }
                    catch
                    {

                    }
                    return token;

                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetToken - APIService:" + ex.ToString());

            }
            return null;

        }
    }
}
