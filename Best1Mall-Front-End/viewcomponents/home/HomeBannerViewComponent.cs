
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Controllers.News.Business;
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Reflection;


namespace WEB.CMS.ViewComponents
{
    public class HomeBannerViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public HomeBannerViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            _redisService = redisService;
            _cache = cache;
        }


        public async Task<IViewComponentResult?> InvokeAsync() //(int category_id,int top,int type_view)
        {
            try
            {
                var cacheKey = "Banner_HOME" + 1; //Cache view trang tin home

                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var objMenu = new MenuService(configuration, _redisService);

                    // Tin theo chuyên mục
                    cached_view = await objMenu.getBannerHome(1);

                    if (cached_view != null)
                    {
                        _cache.Set(cacheKey, cached_view, new MemoryCacheEntryOptions
                        {
                            SlidingExpiration = TimeSpan.FromMinutes(2)
                        });
                    }
                }
                return cached_view != null ? View("~/Views/Shared/Components/Home/BannerHeader.cshtml", cached_view) : Content("");

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
