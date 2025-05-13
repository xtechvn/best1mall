using Microsoft.AspNetCore.Mvc;

namespace Best1Mall_Front_End.Controllers.Accounts
{
    public class AccountClientController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult ListOrder()
        {
            return PartialView();
        }
        public IActionResult OrderDetail(long Id)
        {
            return PartialView();
        }
        public IActionResult UpdateOrderStatus(long Id, long Status)
        {
            return PartialView();
        }
    }
}
