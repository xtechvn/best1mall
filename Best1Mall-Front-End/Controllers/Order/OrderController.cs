using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Models.Cart;
using Best1Mall_Front_End.Models.Raiting;
using Best1Mall_Front_End.Models.Orders;
using Microsoft.AspNetCore.Mvc;
using Models.APIRequest;
using Models.MongoDb;
using Best1Mall_Front_End.Utilities.contants;

namespace Best1Mall_Front_End.Controllers.Product
{

    public class OrderController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly OrderServices _orderServices;

        public OrderController(IConfiguration configuration) {

            _configuration= configuration;
            _orderServices = new OrderServices(configuration);

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
        public async Task<IActionResult> InsertRaiting(ProductInsertRaitingRequestModel request)
        {
            var result = await _orderServices.InsertRaiting(request);

            return Ok(new
            {
                is_success = result,
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
