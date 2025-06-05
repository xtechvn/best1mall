using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.Favourite.Business;
using Best1Mall_Front_End.Models.Cart;
using Best1Mall_Front_End.Models.Voucher;
using Best1Mall_Front_End.Utilities.Contants;
using Microsoft.AspNetCore.Mvc;

namespace Best1Mall_Front_End.Controllers.Vourcher
{
    public class VourcherController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly VourcherServices _vourcheServices;

        public VourcherController(IConfiguration configuration)
        {

            _configuration = configuration;
            _vourcheServices = new VourcherServices(configuration);

        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> GetList(AddToCartRequestModel request)
        {
            var result = await _vourcheServices.GetList(request);

            return Ok(new
            {
                is_success = result != null,
                data = result,
              
            });
        }
        public async Task<IActionResult> ApplyVoucher(ApplyVoucherRequestModel request)
        {
            var result = await _vourcheServices.ApplyVoucher(request);

            if (result != null)
            {
                return Ok(new
                {
                    is_success = result != null,
                    data = result,

                });
            }

            return BadRequest(new { status = ResponseType.FAILED, msg = "Áp dụng voucher thất bại!" });
        }
    }
}
