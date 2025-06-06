using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.FlashSale.Business;
using Best1Mall_Front_End.Models.Flashsale;
using Best1Mall_Front_End.Utilities.Contants;
using Microsoft.AspNetCore.Mvc;

namespace Best1Mall_Front_End.Controllers.FlashSale
{
    public class FlashSaleController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly FlashSaleServices _flashsaleServices;

        public FlashSaleController(IConfiguration configuration)
        {

            _configuration = configuration;
            _flashsaleServices = new FlashSaleServices(configuration);

        }
        [Route("flashSale")]
        public async Task<IActionResult> Index()
        {
            var listFlashSales = await _flashsaleServices.GetList();

            var viewModel = new List<FlashSaleViewModel>();
            if (listFlashSales != null)
            {
                foreach (var item in listFlashSales.Items)
                {
                    var products = await _flashsaleServices.GetById(new FlashsaleListingRequestModel { id = item.flashsale_id });

                    viewModel.Add(new FlashSaleViewModel
                    {
                        flashsale_id = item.flashsale_id,
                        fromdate = item.fromdate,
                        todate = item.todate,
                        name = item.name,
                        banner = item.banner,
                        Products = products,
                       // IsSwiperRequired = item.flashsale_id != 1 // Điều kiện kiểm tra (ví dụ, không cho swiper với id=1)
                    });
                }
            }

            return View(viewModel);
        }
        [Route("flashsale/products/{flashsaleId}")]
        public async Task<IActionResult> Products(int flashsaleId)
        {
            // Lấy các sản phẩm theo flashsaleId
            var products = await _flashsaleServices.GetById(new FlashsaleListingRequestModel { id = flashsaleId });

            if (products != null)
            {
                // Lấy thông tin FlashSale từ viewModel (Thông tin như banner, name, thời gian, v.v)
                var flashSaleInfo = await _flashsaleServices.GetList();
                var flashSale = flashSaleInfo?.Items?.FirstOrDefault(f => f.flashsale_id == flashsaleId);

                return View(new FlashSaleProductsViewModel
                {
                    FlashSaleInfo = flashSale,
                    Products = products
                });
            }

            return RedirectToAction("Index", "Home"); // Nếu không tìm thấy sản phẩm, chuyển về trang chủ
        }



        [HttpPost]
        public async Task<IActionResult> GetList()
        {
            var result = await _flashsaleServices.GetList();

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetById(FlashsaleListingRequestModel request)
        {
            var result = await _flashsaleServices.GetById(request);

            if (result != null)
            {
                return Ok(new
                {
                    is_success = true,
                    data = result
                });
            }

            return BadRequest(new { is_success = false, msg = "Không tìm thấy FlashSale hoặc dữ liệu không hợp lệ." });
        }
    }
}
