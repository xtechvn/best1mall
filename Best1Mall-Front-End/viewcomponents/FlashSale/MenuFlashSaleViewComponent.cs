
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;


namespace WEB.CMS.ViewComponents
{
    public class MenuFlashSaleViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public MenuFlashSaleViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            _redisService = redisService;
            _cache = cache;
        }
        public async Task<IViewComponentResult> InvokeAsync(string menuType)
        {
            try
            {
                // Mapping các loại menu:
                // - Những cái dùng configKey vẫn giữ nguyên kiểu string
                // - Những cái truyền số thẳng thì dùng groupId = -1 để xử lý riêng
                var menuMap = new Dictionary<string, (string cacheKey, string configKeyOrId, string viewPath, bool isDirectId)>
        {
           

            // 👉 Hai menu dùng ID truyền trực tiếp:
            { "type_menu", ("menu_type", "109", "~/Views/Shared/Components/FlashSale/MenuType.cshtml", true) },
          
            { "groupflash_menu", ("menu_groupflash", "188", "~/Views/Shared/Components/FlashSale/MenuGroup.cshtml", true) }
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
                    cachedView = await objMenu.getListMenuSale(categoryOrGroupId);

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
