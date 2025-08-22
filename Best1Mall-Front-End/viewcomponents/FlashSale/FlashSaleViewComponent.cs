
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.FlashSale.Business;
using Best1Mall_Front_End.Controllers.Home.Business;
using Best1Mall_Front_End.Models.Flashsale;
using Best1Mall_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
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
                if (!_cache.TryGetValue("flashsale_home", out List<FlashSaleViewModel>? viewModel))
                {
                    var flashSaleService = new FlashSaleServices(configuration);
                    var listFlashSales = await flashSaleService.GetList();

                    viewModel = new List<FlashSaleViewModel>();

                    if (listFlashSales?.Items != null && listFlashSales.Items.Any())
                    {
                        // Song song API call để lấy product list
                        var tasks = listFlashSales.Items.Select(async item =>
                        {
                            var products = await flashSaleService.GetById(new FlashsaleListingRequestModel
                            {
                                id = item.flashsale_id
                            });

                            if (products != null && products.Any())
                            {
                                return new FlashSaleViewModel
                                {
                                    flashsale_id = item.flashsale_id,
                                    fromdate = item.fromdate,
                                    todate = item.todate,
                                    name = item.name,
                                    banner = item.banner,
                                    Products = products
                                };
                            }
                            return null;
                        });

                        var results = await Task.WhenAll(tasks);
                        viewModel = results.Where(x => x != null).ToList()!;
                    }

                    // Cache 2 phút
                    _cache.Set("flashsale_home", viewModel, TimeSpan.FromMinutes(2));
                }

                // Nếu không có flash sale thì render partial rỗng (ẩn section)
                if (viewModel == null || !viewModel.Any())
                {
                    _logger.LogInformation("⚠️ FlashSaleViewComponent: Không có flash sale nào.");
                    return View(new List<FlashSaleViewModel>());
                }

                return View("~/Views/Shared/Components/FlashSale/FlashSaleViewComponent.cshtml", viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi khi load FlashSaleViewComponent");
                return View(new List<FlashSaleViewModel>()); // render rỗng, không crash
            }
        }

    }
}
