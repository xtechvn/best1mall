
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
                bool useCache = (request.price_from == 0 || request.price_from == null)
                             && (request.price_to == 0 || request.price_to == null)
                             && (request.rating == null || request.rating == 0);

                object? cached_view = null;
                if (useCache)
                {
                    var cacheKey = $"product_list_{request.group_id}_{request.page_index}_{request.page_size}";
                    if (!_cache.TryGetValue(cacheKey, out cached_view))
                    {
                        var obj_cate = new ProductServices(configuration, redisService);
                        cached_view = await obj_cate.GetProductList(request);
                        if (cached_view != null)
                        {
                            _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
                        }
                    }
                }
                else
                {
                    var obj_cate = new ProductServices(configuration, redisService);
                    cached_view = await obj_cate.GetProductList(request);
                }

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
