using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.FlashSale.Business;

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
        public IActionResult Index()
        {
            return View();
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
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _flashsaleServices.GetById(id);

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
