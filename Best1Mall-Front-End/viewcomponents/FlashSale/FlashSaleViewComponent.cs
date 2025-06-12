
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.FlashSale.Business;
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Models.Flashsale;
using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace BIOLIFE.ViewComponents.Product
{
    public class FlashSaleViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        private readonly ILogger<FlashSaleViewComponent> _logger;
        public FlashSaleViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache, ILogger<FlashSaleViewComponent> logger)
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
        public async Task<IViewComponentResult> InvokeAsync(int top = 6)
        {
            try
            {
                var _flashSaleServices = new FlashSaleServices(configuration);

                var listFlashSales = await _flashSaleServices.GetList();

                var viewModel = new List<FlashSaleViewModel>();
                if (listFlashSales != null)
                {
                    foreach (var item in listFlashSales.Items)
                    {
                        var products = await _flashSaleServices.GetById(new FlashsaleListingRequestModel { id = item.flashsale_id });

                        viewModel.Add(new FlashSaleViewModel
                        {
                            flashsale_id = item.flashsale_id,
                            fromdate = item.fromdate,
                            todate = item.todate,
                            name = item.name,
                            banner = item.banner,
                            Products = products
                        });
                    }
                }

                // Chỉ rõ đường dẫn đến PartialView
            return View("~/Views/Shared/Components/FlashSale/FlashSaleViewComponent.cshtml",  viewModel );
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return View(new List<FlashSaleViewModel>());
            }
        }
    }
}
