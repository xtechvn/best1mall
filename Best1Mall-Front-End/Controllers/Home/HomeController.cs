using HuloToys_Front_End.Controllers.News.Business;
using HuloToys_Front_End.Service.Redis;
using Microsoft.AspNetCore.Mvc;

namespace HuloToys_Front_End.Controllers.Home
{
    public class HomeController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly NewsService _newServices;
        public HomeController(IConfiguration _configuration, RedisConn _redisService)
        {
            configuration = _configuration;
            redisService = _redisService;
            _newServices = new NewsService(_configuration, _redisService);
        }
        public async Task<IActionResult> Index(string path, int category_id, int page = 1, string category_path_child = "")
        {
            // Khởi tạo các param phân vào các ViewComponent
            var article_sv = new NewsService(configuration, redisService);

            ViewBag.category_id = 22;// Convert.ToInt32(configuration["menu:news_parent_id"]);
            ViewBag.page = page;
            ViewBag.page_size = Convert.ToInt32(configuration["blognews:page_size"]);
            ViewBag.total_items = await article_sv.getTotalNews(-1); // Lấy ra tổng toàn bộ bản ghi theo chuyên mục
            return View();
        }
        public IActionResult NotFound()
        {
            return View();
        }
    }
}
