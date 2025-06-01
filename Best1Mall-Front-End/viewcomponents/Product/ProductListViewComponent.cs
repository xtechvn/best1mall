
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
                // Lấy type từ ViewData nếu có
                string contentType = (ViewData["type"]?.ToString() ?? "product").ToLower();
                // 2. Check xem có chỉ định View cụ thể không?
                string customViewName = ViewData["view_name"]?.ToString();

                if (contentType == "news")
                {
                    request.group_id = 15;
                    request.page_index = 1;
                    request.page_size = 5;
                }

                bool useCache = (request.price_from == 0 || request.price_from == null)
                             && (request.price_to == 0 || request.price_to == null)
                             && (request.rating == null || request.rating == 0);

                object? cached_view = null;
                var cacheKey = $"{contentType}_list_{request.group_id}_{request.page_index}_{request.page_size}";

                if (useCache)
                {
                    if (!_cache.TryGetValue(cacheKey, out cached_view))
                    {
                        var productService = new ProductServices(configuration, redisService);
                        cached_view = await productService.GetProductList(request);
                        if (cached_view != null)
                        {
                            _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(30));
                        }
                    }
                }
                else
                {
                    var productService = new ProductServices(configuration, redisService);
                    cached_view = await productService.GetProductList(request);
                }

                if (cached_view == null)
                {
                    return Content("");
                }
                // 5. Quyết định ViewPath
                string viewPath;

                if (!string.IsNullOrEmpty(customViewName))
                {
                    // Ưu tiên view custom nếu có
                    viewPath = $"~/Views/Shared/Components/Home/ProductMenuViewComponent.cshtml";
                }
                else if (contentType == "news")
                {
                    viewPath = "~/Views/Shared/Components/News/ProductSaleViewComponent.cshtml";
                }
                else
                {
                    viewPath = "~/Views/Shared/Components/Product/ProductListViewComponent.cshtml";
                }

                return View(viewPath, cached_view);
            }
            catch (Exception)
            {
                return Content("");
            }
        }


    }
}
