﻿using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.News.Business;
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Models.Products;
using Best1Mall_Front_End.Models.Raiting;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities.contants;
using Best1Mall_Front_End.Utilities.Lib;
using Best1Mall_Front_End.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Best1Mall_Front_End.Controllers.Product
{

    public class ProductController : Controller
    {
        private readonly IConfiguration _configuration;

        private readonly ProductServices _productServices;
        private readonly IMemoryCache _cache;

        public ProductController(IConfiguration configuration, IMemoryCache cache, RedisConn _redisService) {

            _configuration= configuration;
            _productServices = new ProductServices(configuration, _redisService);
            _cache = cache;

        }
        // Layout trang chủ news dùng chung với trang Category cấp 2
        [Route("san-pham")]
        [HttpGet]
        public async Task<IActionResult> Index(int group_id, int pageindex = 1, int pageize = 12)
        {

           
           
                // Nếu không có trong cache, truy vấn dữ liệu
                var request = new ProductListRequestModel
                {
                    group_id = group_id,
                    page_index = pageindex,
                    page_size = pageize
                };
                ViewBag.group_id = group_id;

                var result = await _productServices.GetProductList(request);

                if (result != null && result.items != null && result.items.Count > 0)
                {
                    // Lưu vào cache
                    //_cache.Set(cacheKey, result.items, TimeSpan.FromMinutes(10)); // Lưu trong 10 phút
                    return View(result);
                }
                else
                {
                    return View("NoProductsFound");
                }
           
        }
        // Load  sản phẩm 
        [HttpPost]
        public IActionResult loadProductTopComponent(int group_id, int page_index, int page_size, string view_name , double? price_from, double? price_to , float? rating)
        {
            try
            {
                var model = new ProductListRequestModel
                {
                    group_id = group_id,
                    view_name= view_name,
                    page_index = page_index,
                    page_size = page_size,
                    price_from = price_from,
                    price_to = price_to,
                    rating = rating
                };
                // Gọi ViewComponent trực tiếp và trả về kết quả
                return ViewComponent("ProductList", model);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
               
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
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
        public async Task<IActionResult> GetGroupProduct(ProductListRequestModel request)
        {
            GroupProductResponseModel result = await _productServices.GetGroupProduct(request);

            if (result != null && result.items != null && result.items.Count > 0)
            {
                return Ok(new
                {
                    is_success = true,
                    data = result.items,
                    count = result.count
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
