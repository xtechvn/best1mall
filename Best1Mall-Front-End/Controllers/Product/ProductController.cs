using HuloToys_Front_End.Controllers.Client.Business;
using HuloToys_Front_End.Models.Products;
using HuloToys_Front_End.Models.Raiting;
using HuloToys_Front_End.Utilities.contants;
using HuloToys_Front_End.Utilities.Lib;
using HuloToys_Front_End.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace HuloToys_Front_End.Controllers.Product
{

    public class ProductController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ProductServices _productServices;
        private readonly IMemoryCache _cache;

        public ProductController(IConfiguration configuration, IMemoryCache cache) {

            _configuration= configuration;
            _productServices = new ProductServices(configuration);
            _cache = cache;

        }
        public ActionResult Detail(string product_code, string title)
        {
            ViewBag.ProductCode = product_code;
            return View();

        }
        public ActionResult DetailNew(string product_code, string title)
        {
            ViewBag.ProductCode = product_code;
            return View();

        }
      
        public async Task<IActionResult> ProductDetail(ProductDetailRequestModel request)
        {
            ProductDetailResponseModel result = await _productServices.GetProductDetail(request);
           

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
       
        public async Task<IActionResult> GetList(ProductListRequestModel request)
        {
            ProductListResponseModel result = await _productServices.GetProductList(request);

            if (result != null && result.items != null && result.items.Count > 0)
            {
                return Ok(new
                {
                    is_success = true,
                    data = result.items,
                    count=result.count
                });
            }
            else
            {
                return Ok(new
                {
                    is_success = false
                });
            }

        }
        public async Task<IActionResult> Search(ProductGlobalSearchRequestModel request)
        {
            var result = await _productServices.Search(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> RaitingPaging(PagingFeViewModel request)
        {

            return View("~/Views/Shared/Components/Paging/Default.cshtml", request);
        }
        public async Task<IActionResult> RaitingCount(ProductRaitingRequestModel request)
        {
            //-- memory_cache:
            ProductRaitingResponseModel result = null;
            try
            {
                //-- memory_cache:
                var cacheKey = CacheKeys.ProductGetList + EncodeHelpers.MD5Hash(JsonConvert.SerializeObject(request)); // Đặt khóa cho cache
                if (!_cache.TryGetValue(cacheKey, out result)) // Kiểm tra xem có trong cache không
                {
                    result = await _productServices.RaitingCount(request);
                    if (result != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 
                        _cache.Set(cacheKey, result, TimeSpan.FromSeconds(300));
                    }
                }
            }
            catch
            {
                result = await _productServices.RaitingCount(request);
            }

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> ReviewComment(ProductRaitingRequestModel request)
        {
            var result = await _productServices.Raiting(request);
            return View(result);

        }
        public async Task<ActionResult> SearchListing(string keyword)
        {
            ViewBag.Keyword = keyword;
            var request = new ProductGlobalSearchRequestModel()
            {
                keyword = keyword
            };
            var model = await _productServices.GlobalSearchFilter(request);
            ViewBag.Static = _configuration["API:StaticURL"];
            return View(model);

        }
        public async Task<ActionResult> SearchListingPaging(ProductGlobalSearchRequestModel request)
        {
            var model = await _productServices.GlobalSearch(request);
            ViewBag.Keyword = request.keyword;
            ViewBag.Static = _configuration["API:StaticURL"];

            return View(model);
        }
    }
}
