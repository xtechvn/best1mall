
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.News.Business;
using Best1Mall_Front_End.Models.Products;
using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace BIOLIFE.ViewComponents.Product
{
    public class ProductListViewComponent: ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public ProductListViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
        }

        /// <summary>
        // load ra data sản phẩm theo nhóm
        /// </summary>
        /// <returns>group_product_id: id của nhóm</returns>
        public async Task<IViewComponentResult?> InvokeAsync(ProductListRequestModel request)
        {
            ViewBag.Static = configuration["common:link_static_img"];

            try
            {
                // Nếu không có trong cache, gọi dịch vụ
                var cacheKey = "product_list_" + request.group_id + "_" + request.page_index + request.page_size; // Đặt khóa cho cache
                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var obj_cate = new ProductServices(configuration, redisService);
                    cached_view = await obj_cate.GetProductList(request);
                    if (cached_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 
                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
                    }
                }
                // ✅ Nếu vẫn null → đừng render
                if (cached_view == null)
                {
                    return Content("");
                }
                return View("~/Views/Shared/Components/Product/ProductListViewComponent.cshtml", cached_view);
            }
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
