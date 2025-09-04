using Best1Mall_Front_End.Utilities.Lib;
using Best1Mall_Front_End.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Utilities.Contants;
using LIB.Models.APIRequest;
using Best1Mall_Front_End.Models.Client;
using ENTITIES.ViewModels.Notify;

namespace Best1Mall_Front_End.Controllers.Client.Business
{
    public class ClientServices :APIService
    {
        private readonly IConfiguration _configuration;
        private readonly AddressClientServices _addressClientServices;
        private const string B2C_KEY = "AAAAB3NzaC1yc2EAAAADAQABAAABAQC+6zVy2tuIFTDWo97E52chdG1QgzTnqEx8tItL+m5x39BzrWMv5RbZZJbB0qU3SMeUgyynrgBdqSsjGk6euV3+97F0dYT62cDP2oBCIKsETmpY3UUs2iNNxDVvpKzPDE4VV4oZXwwr1kxurCiy+8YC2Z0oYdNDlJxd7+80h87ecdYS3olv5huzIDaqxWeEyCvGDCopiMhr+eh8ikwUdTOEYmgQwQcWPCeYcDDZD8afgBMnB6ys2i51BbLAap16R/B83fB78y0N04qXs3rg4tWGhcVhVyWL1q5PmmweesledOWOVFowfO6QIwDSvBwz0n3TstjXWF4JPbdcAQ8VszUj";
        public ClientServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
            _addressClientServices = new AddressClientServices(configuration);
        }
        public async Task<ClientLoginResponseModel> Login(ClientLoginRequestModel request)
        {
            try
            {
                request.password=EncodeHelpers.MD5Hash(request.password);
                var result = await POST(_configuration["API:Login"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ClientLoginResponseModel>(jsonData["data"].ToString());
                }
                else {
                    return new ClientLoginResponseModel()
                    {
                        status=status,
                        msg = jsonData["msg"].ToString()
                    };
                
                }
            }
            catch(Exception e)
            {
            }
            return null;

        }
        public async Task<ClientRegisterResponseModel> Register(ClientRegisterRequestModel request)
        {
            try
            {
                request.password = EncodeHelpers.MD5Hash(request.password);
                request.confirm_password = EncodeHelpers.MD5Hash(request.confirm_password);
                var result = await POST(_configuration["API:Register"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return JsonConvert.DeserializeObject<ClientRegisterResponseModel>(result); ;

            }
            catch
            {
            }
            return null;

        }
        public async Task<int> SendMessage(string user_id_send, string user_receiver_id, string action_type, string Code, string link_redirect)
        {
            try
            {

                //var user = await _userRepository.GetDetailUser(Convert.ToInt32(user_id_send));
                HttpClient httpClient = new HttpClient();
                var j_param = new Dictionary<string, object>
                {
                   {"user_name_send","dang"}, //tên người gửi
                    {"user_id_send", user_id_send}, //id người gửi
                    {"code", Code}, // mã đơn Hàng
                    {"link_redirect", link_redirect}, // Link mà khi người dùng click vào detail item notify sẽ chuyển sang đó
                    //{"module_type", module_type}, // loại module thực thi luồng notify. Ví dụ: Đơn hàng, khách hàng.......
                    {"action_type", action_type} // action thực hiện. Ví dụ: Duyệt, tạo mới, từ chối....
                   // {"role_type", role_type}, // quyền mà sẽ gửi tới
                   /// {"service_code", service_code}// mã dịch vụ
                    ,{"user_receiver_id", user_receiver_id} // id người nhận notify
                };
                var data_product = JsonConvert.SerializeObject(j_param);

                var token = EncodeHelpers.Encode(data_product, B2C_KEY);
                var request = new FormUrlEncodedContent(new[]
                    {
                    new KeyValuePair<string, string>("token",token)
                });
                var url = "http://api.best-mall.vn" + "/api/notify/message/send.json";
                var response = await httpClient.PostAsync(url, request);
                if (response.IsSuccessStatusCode)
                {
                    return 0;
                }

                return 1;
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegram("SendMessage-apisever:" + ex.ToString());
                return 1;
            }
        }

        public async Task<NotifySummeryViewModel> GetListNotify(string user_id, int pageindex, int pagesize)
        {
            try
            {

                HttpClient httpClient = new HttpClient();
                NotifySummeryViewModel result = null;
                var j_param = new Dictionary<string, object>
                {
                       {"user_id", user_id},
                       {"pageindex", pageindex},
                       {"pagesize", pagesize}
                };
                var data_product = JsonConvert.SerializeObject(j_param);

                var token = EncodeHelpers.Encode(data_product, B2C_KEY);
                var request = new FormUrlEncodedContent(new[]
                    {
                    new KeyValuePair<string, string>("token",token)
                });
                var url = "http://api.best-mall.vn" + "/api/notify/get-list.json";
                //var url = ReadFile.LoadConfig().API_ADAVIGO_URL + ReadFile.LoadConfig().Notify_Get_List;
                var response = await httpClient.PostAsync(url, request);
                var stringResult = "";

                if (response.IsSuccessStatusCode)
                {
                    stringResult = response.Content.ReadAsStringAsync().Result;

                    var data = JsonConvert.DeserializeObject<NotifyRedisViewModel>(stringResult);
                    result = data.data;
                    return result;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegram("GetListNotify:" + ex.ToString());
                return null;
            }
        }
        public async Task<int> GetCountNotify(string user_id)
        {
            try
            {
                HttpClient httpClient = new HttpClient();
                int result = 0;

                var j_param = new Dictionary<string, object>
        {
            {"user_id", user_id}
        };

                var data_product = JsonConvert.SerializeObject(j_param);
                var token = EncodeHelpers.Encode(data_product, B2C_KEY);

                var request = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("token", token)
        });

                var url = "http://api.best-mall.vn/api/notify/get-count.json";
                var response = await httpClient.PostAsync(url, request);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();
                    var data = JsonConvert.DeserializeObject<dynamic>(stringResult);

                    if (data != null && data.status == (int)ResponseType.SUCCESS)
                    {
                        result = (int)data.data.total_not_seen;
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegram("GetCountNotify:" + ex.ToString());
                return 0;
            }
        }

        public async Task<int> UpdateNotify(string notify_id, string user_seen_id, string seen_status)
        {
            try
            {
                HttpClient httpClient = new HttpClient();
                var j_param = new Dictionary<string, object>
                {
                  /*  {"notify_id", "A1,A32"}, // 
                    {"user_seen_id", "222"},*/
                     {"notify_id", notify_id}, // 
                    {"user_seen_id", user_seen_id},
                    {"seen_status", seen_status}, // SEEN_ALL = 1: click vao chuông |    SEEN_DETAIL = 2  click vao item notify

                };
                var data = JsonConvert.SerializeObject(j_param);
               
                 var token = EncodeHelpers.Encode(data, B2C_KEY);
                var request = new FormUrlEncodedContent(new[]
                    {
                    new KeyValuePair<string, string>("token",token)
                });
                var url = "http://api.best-mall.vn" + "/api/notify/message/update-status-view.json";
                //var url = ReadFile.LoadConfig().API_URL + ReadFile.LoadConfig().Notify_update_status;
                var response = await httpClient.PostAsync(url, request);


                if (response.IsSuccessStatusCode)
                {

                    return 0;
                }

                return 1;
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegram("apisever:" + ex.ToString());
                return 1;
            }
        }
    }
}
