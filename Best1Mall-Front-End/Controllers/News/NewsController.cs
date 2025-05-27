﻿using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Controllers.News.Business;
using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Models.News;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities;
using Best1Mall_Front_End.Utilities.Contants;

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Best1Mall_Front_End.Controllers.News
{
    public class NewsController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly NewsService _newServices;
        public NewsController(IConfiguration _configuration, RedisConn _redisService)
        {
            configuration = _configuration;
            redisService = _redisService;
            _newServices = new NewsService(_configuration , _redisService);
        }
        // Layout trang chủ news dùng chung với trang Category cấp 2
        [Route("tin-tuc")]
        [HttpGet]
        public async Task<IActionResult> Index(string path, int category_id, int page = 1, string category_path_child = "")
        {
            // Khởi tạo các param phân vào các ViewComponent
            var article_sv = new NewsService(configuration, redisService);

            ViewBag.category_id = 22;// Convert.ToInt32(configuration["menu:news_parent_id"]);
            ViewBag.page = page;
            ViewBag.page_size = Convert.ToInt32(configuration["blognews:page_size"]);
            ViewBag.total_items = await article_sv.getTotalNews(11); // Lấy ra tổng toàn bộ bản ghi theo chuyên mục
            return View();
        }

        [Route("tin-tuc/{category_path_child}/{category_id}")]
        [HttpGet]
        public async Task<IActionResult> Category(string path, string category_path_child, int category_id, int page = 1)
        {
            var article_sv = new NewsService(configuration, redisService);
            ViewBag.category_id = category_id;
            ViewBag.page_size = Convert.ToInt32(configuration["blognews:page_size"]);
            ViewBag.total_items = await article_sv.getTotalNews(category_id); // Lấy ra tổng toàn bộ bản ghi theo chuyên mục
            ViewBag.page = page;

            // Chung view với trang chủ news
            return View("~/Views/News/Index.cshtml");
        }

        [Route("{title}-{article_id}.html")]
        [HttpGet]
        public async Task<IActionResult> ArticleDetail(string title, long article_id)
        {
            var article_sv = new NewsService(configuration, redisService);
            var article = await article_sv.getArticleDetailById(article_id);
            return View("~/Views/News/ArticleDetail.cshtml", article);
        }


        /// <summary>
        /// Lấy ra các bài viết mới nhất của các chuyên mục
        /// </summary>
        /// <param name="category_id">-1 là quét all các bài viết của các mục, >0 lấy theo chuyên mục</param>
        /// <param name="position_name">Vị trí cần bind data</param>
        /// <returns></returns>
        [Route("news/home/get-article-list.json")]
        [HttpPost]
        public async Task<IActionResult> getArticleListByCategoryIdComponent(int category_id, string view_name, int page, bool isPaging = false)
        {
            try
            {
                // Tính phân trang load tin
                int page_size = Convert.ToInt32(configuration["blognews:page_size"]);
                page = page == 0 ? 1 : page;
                int skip = (page - 1) * page_size;

                var model = new CategoryConfigModel
                {
                    page = page,
                    category_id = category_id,
                    view_name = view_name,
                    skip = skip,
                    take = page_size,
                    isPaging = isPaging
                };
                return ViewComponent("ArticleList", model);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                //_logger.LogError(ex, "Error loading header component");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }
        public async Task<IActionResult> GetFindArticleByTitle(FindArticleModel requestObj)
        {
            try
            {
                var data = await _newServices.FindArticleByTitle(requestObj);
                return PartialView(data);

            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "FindArticleByTitle-NewsController:" + ex.ToString());

                return PartialView();
            }


        }

        public async Task<IActionResult> NewsMostViewedArticle(GetListByCategoryIdRequest requestObj)
        {
            try
            {
                var data = await _newServices.GetMostViewedArticles();
                return PartialView(data);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(configuration["BotSetting:bot_token"], configuration["BotSetting:bot_group_id"], "NewsMostViewedArticle-NewsController:" + ex.ToString());

                return PartialView();
            }

        }
    }
}
