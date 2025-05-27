
using Best1Mall_Front_End.Controllers.News.Business;
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities;
using Best1Mall_Front_End.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Reflection;

namespace WEB.CMS.ViewComponents
{
    public class ArticleListViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public ArticleListViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
        }

        /// <summary>       
        /// type_view = 0 : box footer trang chủ | 1: box news
        /// zone_info: là 1 chuỗi json dựa vào đây để hiển thị tin theo cấu hình
        /// </summary>
        /// <returns>Load cac bai viet theo chuyen muc</returns>
        public async Task<IViewComponentResult?> InvokeAsync(CategoryConfigModel _zone_info)
        {
            try
            {
                var cacheKey = "CATEGORY_BOX_VIEW" + _zone_info.category_id + _zone_info.skip + _zone_info.take;
                ArticleViewModel? model = null;

                if (!_cache.TryGetValue(cacheKey, out var cached_view))
                {
                    var obj_cate = new NewsService(configuration, redisService);

                    // 🧠 GỌI API getListNews LẤY ARTICLE + TOTAL
                    model = await obj_cate.getListNews(_zone_info.category_id, _zone_info.skip, _zone_info.take);
                    if (model != null)
                    {
                        _cache.Set(cacheKey, model, TimeSpan.FromSeconds(
                            Convert.ToInt32(configuration["redis:cate_time_view:second_list_box_news"])
                        ));
                    }
                }
                else
                {
                    model = cached_view as ArticleViewModel;
                }

                // ✅ LUÔN truyền ViewBag để phân trang dùng được
                ViewBag.total_items = model?.total_items ?? 0;
                ViewBag.total_page = model?.total_page ?? 0;
                ViewBag.category_id = _zone_info.category_id;
                ViewBag.page = _zone_info.page;
                ViewBag.page_size = _zone_info.take;

                if (model == null)
                    return Content("");

                if (_zone_info.isPaging)
                {
                    // Trả partial view nhận nguyên model, partial xử lý phần remainingArticles
                    return View("_RemainingArticlesPartial", model);
                }
                else
                {
                    // Trả về view đầy đủ (main + side + remaining)
                    return View(_zone_info.view_name, model);
                }
            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return Content("");
            }
        }

    }
}
