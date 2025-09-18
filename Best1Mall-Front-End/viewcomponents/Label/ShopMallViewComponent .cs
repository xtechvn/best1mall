
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace BIOLIFE.ViewComponents.Product
{
    public class ShopMallViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        private readonly ILogger<ShopMallViewComponent > _logger;
        public ShopMallViewComponent (IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache, ILogger<ShopMallViewComponent> logger)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
            _logger = logger; // 👈 Logger này chưa được inject, nên null
        }

        /// <summary>
        // load ra data sản phẩm theo nhóm
        /// </summary>
        /// <returns>group_product_id: id của nhóm</returns>
        public async Task<IViewComponentResult> InvokeAsync(string labeltype)
        {
            try
            {
                var labelMap = new Dictionary<string, (string cacheKey, int top, string viewPath)>
            {
                { "shopmall", ("shopmall_home", 3, "~/Views/Shared/Components/Label/ShopMallViewComponent.cshtml") },
                

            };

                if (!labelMap.TryGetValue(labeltype, out var config))
                {
                    _logger.LogWarning("shopmall ViewComponent: shopmalltype không hợp lệ ({shopmallType})", labeltype);
                    return Content(""); // labeltype sai thì return rỗng
                }

                if (!_cache.TryGetValue(config.cacheKey, out var cachedView))
                {
                    var objCate = new MenuService(configuration, redisService);
                    cachedView = await objCate.GetShopMall(config.top);

                    if (cachedView != null)
                    {
                        //_cache.Set(config.cacheKey, cachedView, TimeSpan.FromSeconds(20));
                        _cache.Set(config.cacheKey, cachedView, TimeSpan.FromMinutes(1));

                    }
                }
                // ✅ Nếu không có dữ liệu → không render gì cả
                if (cachedView == null)
                {
                    _logger.LogWarning("Label ViewComponent: Không có dữ liệu label cho {LabelType}", labeltype);
                    return Content("");
                }

                return View(config.viewPath, cachedView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thực hiện Label ViewComponent với labeltype = {LabelType}", labeltype);
                return Content(""); // fallback nếu lỗi
            }
        }
    }
}
