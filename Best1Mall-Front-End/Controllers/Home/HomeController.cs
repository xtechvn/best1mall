using Microsoft.AspNetCore.Mvc;

namespace HuloToys_Front_End.Controllers.Home
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        } 
        public IActionResult NotFound()
        {
            return View();
        }
    }
}
