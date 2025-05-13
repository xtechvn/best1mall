
using HuloToys_Front_End.Controllers.Home.Business;
using HuloToys_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;


namespace WEB.CMS.ViewComponents
{
    public class MenuNewsViewComponent: ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public MenuNewsViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            _redisService = redisService;
            _cache = cache;
        }

        /// <summary>
        // Nhóm san pham vị trí giữa trang
        /// </summary>
        /// <returns></returns>
        public async Task<IViewComponentResult> InvokeAsync(string menuType)
        {
            try
            {
                // Mapping các loại menu
                var menuMap = new Dictionary<string, (string cacheKey, string configKey, string viewPath)>
        {
            { "home", ("menu_home", "config:group_id", "~/Views/Shared/Components/Home/MenuHome.cshtml") },
            { "news", ("menu_news", "config:category_id", "~/Views/Shared/Components/News/Menu.cshtml") },
            { "listproduct", ("menu_listproduct", "config:group_id", "~/Views/Shared/Components/Product/MenuListProduct.cshtml") },
            { "header_menu", ("menu_header", "config:group_id", "~/Views/Shared/Components/Home/MenuHeader.cshtml") }
        };

                // Check nếu không map được menuType thì trả về rỗng
                if (!menuMap.TryGetValue(menuType, out var menuInfo))
                {
                    return Content("");
                }

                int categoryOrGroupId = Convert.ToInt32(configuration[menuInfo.configKey]);

                // Lấy từ cache nếu có
                if (!_cache.TryGetValue(menuInfo.cacheKey, out var cachedView))
                {
                    var objMenu = new MenuService(configuration, _redisService);
                    cachedView = await objMenu.getListMenu(categoryOrGroupId);

                    if (cachedView != null)
                    {
                        _cache.Set(menuInfo.cacheKey, cachedView, TimeSpan.FromSeconds(30));
                    }
                }
                if (cachedView == null)
                {
                    return Content("");
                }

                return View(menuInfo.viewPath, cachedView);
            }
            catch (Exception ex)
            {
                // Gợi ý: log lỗi nếu có logger, để dễ debug
                // _logger.LogError(ex, "MenuComponent Error: {MenuType}", menuType);
                return Content("");
            }
        }


    }
}
