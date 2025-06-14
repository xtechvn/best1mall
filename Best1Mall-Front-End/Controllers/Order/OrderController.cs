using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Models.Cart;
using Best1Mall_Front_End.Models.Raiting;
using Best1Mall_Front_End.Models.Orders;
using Microsoft.AspNetCore.Mvc;
using Models.APIRequest;
using Models.MongoDb;
using Best1Mall_Front_End.Utilities.contants;
using Best1Mall_Front_End.Models.Files;
using Best1Mall_Front_End.Service;
using System;

namespace Best1Mall_Front_End.Controllers
{

    public class OrderController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly OrderServices _orderServices;
        private readonly StaticAPIService staticAPIService;
        private readonly string static_domain = "";

        public OrderController(IConfiguration configuration) {

            _configuration= configuration;
            _orderServices = new OrderServices(configuration);
            staticAPIService = new StaticAPIService(configuration);
            static_domain = configuration["API:StaticURL"];

        }
        public ActionResult Index()
        {
            return View();

        }
        public async Task<ActionResult> Payment(string id)
        {
            ViewBag.Id = id;
            return View();

        }
        [HttpPost]
        public async Task<IActionResult> Search(OrderHistoryRequestModel request)
        {
            ViewBag.Data = new OrderHistoryResponseModel();
            ViewBag.StaticDomain = _configuration["API:StaticURL"];
            try
            {
                ViewBag.Data = await _orderServices.Listing(request);
            }
            catch (Exception ex) { 
            
            }
            return View();
        }
        public async Task<IActionResult> Detail(string id)
        {
            ViewBag.StaticDomain = _configuration["API:StaticURL"];
            ViewBag.OrderStatusName = "Tạo mới";

            var data = await _orderServices.GetDetail(new OrdersGeneralRequestModel()
            {
                id=id
            });
            if (data == null || data.data == null || data.data_order == null) {
                return Redirect("/home/error");
            }
            switch (data.data_order.OrderStatus)
            {
                case (int)OrderStatusConstants.NEW:
                    {
                        ViewBag.OrderStatusName = "Tạo mới";
                    }
                    break;
                case (int)OrderStatusConstants.PAID:
                    {
                        ViewBag.OrderStatusName = "Đã thanh toán";
                    }
                    break;
                case (int)OrderStatusConstants.PROCESS:
                    {
                        ViewBag.OrderStatusName = "Đang xử lý";
                    }
                    break;
                case (int)OrderStatusConstants.ON_DELIVERY:
                    {
                        ViewBag.OrderStatusName = "Đang vận chuyển";
                    }
                    break;
                case (int)OrderStatusConstants.DELIVERED:
                    {
                        ViewBag.OrderStatusName = "Giao hàng thành công";
                    }
                    break;
                case (int)OrderStatusConstants.DONE:
                    {
                        ViewBag.OrderStatusName = "Hoàn thành";
                    }
                    break;
                case (int)OrderStatusConstants.CANCELED:
                    {
                        ViewBag.OrderStatusName = "Trả hàng/Hoàn tiền";
                    }
                    break;
            }
            ViewBag.Id = id;
            ViewBag.Data = data;
            return View();
        }  
        public async Task<IActionResult> GetHistoryDetail(OrderHistoryDetailRequestModel request)
        {
            var result = await _orderServices.GetHistoryDetail(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> Confirm(CartConfirmRequestModel request)
        {
            var result = await _orderServices.Confirm(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> QRCode(OrderGeneralRequestModel request)
        {
            var result = await _orderServices.QRCode(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        [HttpPost]
        public async Task<IActionResult> InsertRaiting(ProductInsertRaitingRequestModel request)
        {
            try
            {
                if (request.img_links != null && request.img_links.Count > 0)
                {
                    foreach (var file in request.img_links)
                    {
                        if (file.Contains(static_domain)) { continue; }
                        string full_path = Directory.GetCurrentDirectory() + "\\wwwroot\\" + file.Replace(@"\\", @"\").Replace("/", "\\");
                        try
                        {
                            // Đọc toàn bộ nội dung của file ảnh dưới dạng byte array
                            byte[] imageBytes = System.IO.File.ReadAllBytes(full_path);

                            // Chuyển đổi byte array thành chuỗi Base64
                            string base64String = Convert.ToBase64String(imageBytes);

                            var path = file.Split(".");

                            ImageBase64 image = new()
                            {
                                ImageData = base64String,
                                ImageExtension = path[path.Length - 1]
                            };
                            var url = await staticAPIService.UploadImageBase64(image);
                            if (url != null && url.Trim() != "")
                            {
                                request.img_link = (request.img_link == null || request.img_link.Trim() == "") ? url : (request.img_link + "," + url);
                            }
                            try { System.IO.File.Delete(full_path); } catch { }


                        }
                        catch
                        {
                            continue;
                        }
                    }
                }
               
            }
            catch { }
            try
            {
                if (request.video_links != null && request.video_links.Count > 0)
                {
                    foreach (var file in request.video_links)
                    {
                        string full_path = Directory.GetCurrentDirectory() + "\\wwwroot\\" + file.Replace(@"\\", @"\").Replace("/", "\\");

                        using (var stream = System.IO.File.OpenRead(full_path))
                        {
                            var formFile = new FormFile(stream, 0, stream.Length, "VideoFile", Path.GetFileName(full_path))
                            {
                                Headers = new HeaderDictionary(),
                                ContentType = "video/mp4" // Thay bằng Content-Type phù hợp với video của bạn
                            };

                            string uploadedUrl = await staticAPIService.UploadVideoFile(formFile, "GxQWDx9xJ0lVDR0eHxEWHF4aHh10aF9f");
                            if (uploadedUrl != null)
                            {
                                request.video_link = uploadedUrl;
                            }
                        }
                    }
                }
            }
            catch { }
            await _orderServices.InsertRaiting(request);


            return Ok(new
            {
                is_success = true,
            });
        }
        public async Task<IActionResult> GetDetail(OrdersGeneralRequestModel request)
        {
            var result = await _orderServices.GetDetail(request);


            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
    }
}
