using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Utilities.Contants;

using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Best1Mall_Front_End.Models.News;
using System.Net.Http;
using static System.Runtime.InteropServices.JavaScript.JSType;

using System.Diagnostics;
using System.Reflection;
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Utilities;
using Best1Mall_Front_End.ViewModels;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities.Lib;

namespace Best1Mall_Front_End.Controllers.News.Business
{
    public class NewsService : APIService
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        public NewsService(IConfiguration _configuration, RedisConn _redisService) : base(_configuration)
        {
            configuration = _configuration;
            redisService = _redisService;
        }

       

        /// <summary>
        /// Chi tiết bài viết
        /// </summary>
        /// <param name="article_id"></param>
        /// <returns></returns>
        public async Task<ArticleDetailModel?> getArticleDetailById(long article_id)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, long>
              {
                  {"article_id",article_id }
              };

                response_api = await connect_api_us.CreateHttpRequest("/api/news/get-article-detail.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    var article = JsonConvert.DeserializeObject<ArticleDetailModel>(JsonParent[0]["data"].ToString());
                    return article;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return null;
            }
        }
        //public async Task<ArticleViewModel?> getArticleByCategoryId(int category_id, int top, int skip)
        //{
        //    try
        //    {
        //        string response_api = string.Empty;
        //        var connect_api_us = new ConnectApi(configuration, redisService);
        //        var input_request = new Dictionary<string, string>
        //        {
        //            {"category_id",category_id.ToString() },
        //             {"skip",skip.ToString() },
        //             {"take", top.ToString()}
        //        };

        //        response_api = await connect_api_us.CreateHttpRequest("/api/news/get-list-by-categoryid.json", input_request);

        //        // Nhan ket qua tra ve                            
        //        var JsonParent = JArray.Parse("[" + response_api + "]");
        //        int status = Convert.ToInt32(JsonParent[0]["status"]);

        //        if (status == ((int)ResponseType.SUCCESS))
        //        {
        //            var _category_detail = JsonConvert.DeserializeObject<CategoryModel>(JsonParent[0]["category_detail"].ToString());
        //            var _list_article = JsonConvert.DeserializeObject<List<CategoryArticleModel>>(JsonParent[0]["data"].ToString());

        //            var model = new ArticleViewModel
        //            {
        //                obj_article_list = _list_article,
        //                category_detail = _category_detail
        //            };
        //            return model;
        //        }
        //        else
        //        {
        //            return null;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
        //        Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
        //        return null;
        //    }
        //}
        /// <summary>
        /// Lấy ra các tin mới nhất trang chủ dc set top của tất cả các chuyên mục
        /// </summary>
        /// <param name="category_id"></param>
        /// <param name="top"></param>ssjujuuj
        /// <param name="skip"></param>
        /// <returns></returns>
        public async Task<ArticleViewModel?> getListNews(int category_id, int skip, int top)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, int>
              {
                   {"skip", skip},
                   {"top", top},
                   {"category_id", category_id}
              };


                // Lấy các tin được đăng gần nhất
                response_api = await connect_api_us.CreateHttpRequest("/api/news/get-list-news.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    var _list_article = JsonConvert.DeserializeObject<List<CategoryArticleModel>>(JsonParent[0]["data"].ToString());
                    var model = new ArticleViewModel
                    {
                        category_id = category_id,
                        obj_article_list = _list_article
                    };
                    return model;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return null;
            }
        }
        /// <summary>
        /// Tổng bài viết của 1 cate để phân trang
        /// </summary>
        /// <param name="category_id"></param>
        /// <returns></returns>
        public async Task<int> getTotalNews(int category_id)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, int>
              {
                   {"category_id",category_id }
              };

                response_api = await connect_api_us.CreateHttpRequest("/api/news/get-total-news.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    int total_items = Convert.ToInt32(JsonParent[0]["data"]);
                    return total_items;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return 0;
            }
        }

        public async Task<List<ArticleResponse>> GetMostViewedArticles()
        {
            try
            {
                var obj = new Dictionary<string, object>
         {
             { "category_id","10" }
         };
                var result = await POST(configuration["API:get_most_viewed_article"], obj);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<ArticleResponse>>(jsonData["data"].ToString());
                }
                else
                {
                    var msg = jsonData["msg"].ToString();
                    Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetMostViewedArticles-NewServices:" + msg);

                }
            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetMostViewedArticles-NewServices:" + ex.ToString());
            }
            return null;
        }

        public async Task<List<ArticleRelationModel>> FindArticleByTitle(FindArticleModel requestObj)
        {
            try
            {
                var result = await POST(configuration["API:find_article"], requestObj);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<ArticleRelationModel>>(jsonData["data_list"].ToString());
                }
                else
                {
                    var msg = int.Parse(jsonData["msg"].ToString());
                    Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsDetail-NewServices:" + msg.ToString());

                }
            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsDetail-NewServices:" + ex.ToString());
            }
            return null;
        }
        public async Task<List<GetCategoryResponse>> GetNewsCategory(GetListByCategoryIdRequest requestObj)
        {
            try
            {
                var obj = new Dictionary<string, object>
                {
                    { "category_id",requestObj.category_id }
                };
                var result = await POST(configuration["API:get_category"], obj);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {

                    var data = JsonConvert.DeserializeObject<List<GetCategoryResponse>>(jsonData["categories"].ToString());

                    return data;
                }
                else
                {
                    var msg = int.Parse(jsonData["msg"].ToString());
                    Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsCategory-NewServices:" + msg.ToString());

                }

            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsCategory-NewServices:" + ex.ToString());
            }
            return null;
        }
        public async Task<GetNewDetailResponse> GetNewsDetail(GetNewDetailRequest requestObj)
        {
            try
            {
                var result = await POST(configuration["API:get_new_detail"], requestObj);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<GetNewDetailResponse>(jsonData["data"].ToString());
                }
                else
                {
                    var msg = int.Parse(jsonData["msg"].ToString());
                    Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsDetail-NewServices:" + msg.ToString());

                }
            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "GetNewsDetail-NewServices:" + ex.ToString());
            }
            return null;
        }
    }
}
