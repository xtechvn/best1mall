
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Service.Redis;
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
        //public async Task<IViewComponentResult> InvokeAsync(string menuType)
        //{
        //    try
        //    {
        //        // Mapping các loại menu
        //        var menuMap = new Dictionary<string, (string cacheKey, string configKey, string viewPath)>
        //{
        //    { "home", ("menu_home", "config:group_id", "~/Views/Shared/Components/Home/MenuHome.cshtml") },
        //    { "news", ("menu_news", "config:category_id", "~/Views/Shared/Components/News/Menu.cshtml") },
        //    { "newsdetail", ("menu_newdetails", "config:category_id", "~/Views/Shared/Components/News/MenuNewDetail.cshtml") },

        //    { "listproduct", ("menu_listproduct", "config:group_id", "~/Views/Shared/Components/Product/MenuListProduct.cshtml") },
        //    { "header_menu", ("menu_header", "config:group_id", "~/Views/Shared/Components/Home/MenuHeader.cshtml") },
        //    { "trend_menu", ("menu_trend", "config:trend", "~/Views/Shared/Components/Home/MenuTrend.cshtml") }

        //};

        //        // Check nếu không map được menuType thì trả về rỗng
        //        if (!menuMap.TryGetValue(menuType, out var menuInfo))
        //        {
        //            return Content("");
        //        }

        //        int categoryOrGroupId = Convert.ToInt32(configuration[menuInfo.configKey]);

        //        // Lấy từ cache nếu có
        //        if (!_cache.TryGetValue(menuInfo.cacheKey, out var cachedView))
        //        {
        //            var objMenu = new MenuService(configuration, _redisService);
        //            cachedView = await objMenu.getListMenu(categoryOrGroupId);

        //            if (cachedView != null)
        //            {
        //                _cache.Set(menuInfo.cacheKey, cachedView, TimeSpan.FromSeconds(30));
        //            }
        //        }
        //        if (cachedView == null)
        //        {
        //            return Content("");
        //        }

        //        return View(menuInfo.viewPath, cachedView);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Gợi ý: log lỗi nếu có logger, để dễ debug
        //        // _logger.LogError(ex, "MenuComponent Error: {MenuType}", menuType);
        //        return Content("");
        //    }
        //}
        public async Task<IViewComponentResult> InvokeAsync(string menuType)
        {
            try
            {
                // Mapping các loại menu:
                // - Những cái dùng configKey vẫn giữ nguyên kiểu string
                // - Những cái truyền số thẳng thì dùng groupId = -1 để xử lý riêng
                var menuMap = new Dictionary<string, (string cacheKey, string configKeyOrId, string viewPath, bool isDirectId)>
        {
            { "home", ("menu_home", "config:group_id", "~/Views/Shared/Components/Home/MenuHome.cshtml", false) },
            { "news", ("menu_news", "config:category_id", "~/Views/Shared/Components/News/Menu.cshtml", false) },
            { "newsdetail", ("menu_newdetails", "config:category_id", "~/Views/Shared/Components/News/MenuNewDetail.cshtml", false) },
            { "listproduct", ("menu_listproduct", "config:group_id", "~/Views/Shared/Components/Product/MenuListProduct.cshtml", false) },
            { "header_menu", ("menu_header", "188", "~/Views/Shared/Components/Home/MenuHeader.cshtml", true) },

            // 👉 Hai menu dùng ID truyền trực tiếp:
            { "trend_menu", ("menu_trend", "120", "~/Views/Shared/Components/Home/MenuTrend.cshtml", true) },
             { "headertrend_menu", ("menu_headertrend", "120", "~/Views/Shared/Components/Home/HeaderMenuTrend.cshtml", true) },
            { "bestchoice_menu", ("menu_bestchoice", "114", "~/Views/Shared/Components/Home/MenuBestchoice.cshtml", true) },
            // 👉 Hai Banner dùng ID truyền trực tiếp:
            { "banner1_menu", ("menu_banner1", "237", "~/Views/Shared/Components/Home/Banner1.cshtml", true) },
            { "banner2_menu", ("menu_banner2", "238", "~/Views/Shared/Components/Home/Banner2.cshtml", true) }
        };

                // Check không có trong map
                if (!menuMap.TryGetValue(menuType, out var menuInfo))
                {
                    return Content("");
                }

                // Lấy ID từ config hay từ số trực tiếp
                int categoryOrGroupId;
                if (menuInfo.isDirectId)
                {
                    // Trường hợp truyền thẳng ID như "120", "114"
                    categoryOrGroupId = Convert.ToInt32(menuInfo.configKeyOrId);
                }
                else
                {
                    // Đọc từ cấu hình
                    var configValue = configuration[menuInfo.configKeyOrId];
                    if (!int.TryParse(configValue, out categoryOrGroupId))
                    {
                        return Content(""); // Không hợp lệ
                    }
                }

                // Lấy cache
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
                // _logger.LogError(ex, "MenuComponent Error: {MenuType}", menuType);
                return Content("");
            }
        }


    }
}
