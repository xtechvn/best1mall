
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
                string cacheKey;
                int categoryOrGroupId;

                // Kiểm tra loại menu và lấy đúng giá trị từ cấu hình
                if (menuType == "home") // Home menu sử dụng group_id
                {
                    cacheKey = "menu_home";
                    categoryOrGroupId = Convert.ToInt32(configuration["config:group_id"]);
                }
                else if (menuType == "news") // News menu sử dụng category_id
                {
                    cacheKey = "menu_news";
                    categoryOrGroupId = Convert.ToInt32(configuration["config:category_id"]);
                }
                else if (menuType == "listproduct") // ListProduct menu sử dụng listproduct_group_id
                {
                    cacheKey = "menu_listproduct";
                    categoryOrGroupId = Convert.ToInt32(configuration["config:group_id"]);
                }
                else
                {
                    return Content(""); // Nếu menuType không hợp lệ, trả về rỗng
                }

                // Kiểm tra cache
                if (!_cache.TryGetValue(cacheKey, out var cachedView))
                {
                    var objMenu = new MenuService(configuration, _redisService);
                    // Lấy danh sách menu theo category_id hoặc group_id
                    cachedView = await objMenu.getListMenu(categoryOrGroupId);

                    // Lưu vào cache với thời gian hết hạn 30 giây
                    if (cachedView != null)
                    {
                        _cache.Set(cacheKey, cachedView, TimeSpan.FromSeconds(30));
                    }
                }

                // Trả về view tùy theo loại menu (Home, News hoặc ListProduct)
                if (menuType == "home")
                {
                    return View("~/Views/Shared/Components/Home/MenuHome.cshtml", cachedView);
                }
                else if (menuType == "news")
                {
                    return View("~/Views/Shared/Components/News/Menu.cshtml", cachedView);
                }
                else if (menuType == "listproduct")
                {
                    return View("~/Views/Shared/Components/Product/MenuListProduct.cshtml", cachedView);
                }
                else
                {
                    return Content(""); // Nếu menuType không hợp lệ, trả về rỗng
                }
            }
            catch (Exception)
            {
                return Content(""); // Trong trường hợp có lỗi
            }
        }

    }
}
