
using HuloToys_Front_End.Controllers.Client.Business;
using HuloToys_Front_End.Controllers.Home.Business;
using HuloToys_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace BIOLIFE.ViewComponents.Product
{
    public class LabelListViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public LabelListViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
        }

        /// <summary>
        // load ra data sản phẩm theo nhóm
        /// </summary>
        /// <returns>group_product_id: id của nhóm</returns>
        public async Task<IViewComponentResult> InvokeAsync(string labeltype)
        {
            
            try
            {

                string cacheKey;
                int top;

                // Kiểm tra loại menu và lấy đúng giá trị từ cấu hình
                if (labeltype == "home") // Home menu sử dụng group_id
                {
                    cacheKey = "label_home";
                    top = 6;
                }
                else if (labeltype == "product") // News menu sử dụng category_id
                {
                    cacheKey = "label_product";
                    top = 6;
                }
                else
                {
                    return Content(""); // Nếu menuType không hợp lệ, trả về rỗng
                }

                
                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var obj_cate = new MenuService(configuration, redisService);
                    cached_view = await obj_cate.GetLabelList(top);
                    if (cached_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 
                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
                    }
                }

                // Trả về view tùy theo loại menu (Home, News hoặc ListProduct)
                if (labeltype == "home")
                {
                    return View("~/Views/Shared/Components/Label/LabelListViewComponent.cshtml", cached_view);
                }
                else if (labeltype == "product")
                {
                    return View("~/Views/Shared/Components/Label/LabelProductViewComponent.cshtml", cached_view);
                }
                else
                {
                    return Content(""); // Nếu menuType không hợp lệ, trả về rỗng
                }

            }
            
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
