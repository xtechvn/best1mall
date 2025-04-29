
using HuloToys_Front_End.Controllers.News.Business;
using HuloToys_Front_End.Models;
using HuloToys_Front_End.Service.Redis;
using HuloToys_Front_End.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Reflection;

namespace WEB.CMS.ViewComponents
{
    /// <summary>
    /// Load các tin ngoài trang chủ news
    /// </summary>
    public class ArticleListHomeViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public ArticleListHomeViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
        }
        /// <summary>               
        /// </summary>
        /// <returns>Load cac bai viet theo chuyen muc</returns>
        public async Task<IViewComponentResult?> InvokeAsync(CategoryConfigModel _zone_info) //(int category_id,int top,int type_view)
        {
            try
            {
                var cacheKey = "CATEGORY_HOME_VIEW" + _zone_info.category_id; //Cache view trang tin home

                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var obj_cate = new NewsService(configuration, redisService);                    

                    // Tin theo chuyên mục
                    cached_view = await obj_cate.getListNews(_zone_info.category_id, _zone_info.take, _zone_info.skip);

                    if (cached_view != null)
                    {
                        _cache.Set(cacheKey, cached_view, new MemoryCacheEntryOptions
                    {
                        SlidingExpiration = TimeSpan.FromMinutes(2)
                    });
                    }
                }
                return cached_view != null ? View(_zone_info.view_name, cached_view) : Content("");

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return Content("");
            }
        }
    }
}
