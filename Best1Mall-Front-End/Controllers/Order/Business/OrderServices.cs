using HuloToys_Front_End.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using HuloToys_Front_End.Utilities.Contants;
using Models.MongoDb;
using Models.APIRequest;
using HuloToys_Front_End.Models.Orders;
using HuloToys_Front_End.Models.Raiting;

namespace HuloToys_Front_End.Controllers.Client.Business
{
    public class OrderServices :APIService
    {
        private readonly IConfiguration _configuration;
        public OrderServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }


        public async Task<OrderDetailMongoDbModel> GetDetail(OrdersGeneralRequestModel request)
        {
            try
            {

                var result = await POST(_configuration["API:order_detail"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderDetailMongoDbModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<OrderHistoryDetailResponseModel> GetHistoryDetail(OrderHistoryDetailRequestModel request)
        {
            try
            {

                var result = await POST(_configuration["API:order_history_detail"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderHistoryDetailResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<OrderConfirmResponseModel> Confirm(CartConfirmRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_confirm"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderConfirmResponseModel>(jsonData["data"].ToString());

                }

            }
            catch
            {
            }
            return null;

        } 
        public async Task<string> QRCode(OrderGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:qr_code"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return jsonData["data"].ToString();

                }

            }
            catch
            {
            }
            return null;

        }
        public async Task<OrderHistoryResponseModel> Listing(OrderHistoryRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_history"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderHistoryResponseModel>(jsonData["data"].ToString());

                }

            }
            catch
            {
            }
            return new OrderHistoryResponseModel()
            {
                data=new List<OrderESModel>(),
               data_order=new List<OrderDetailMongoDbModel>(),
               page_index=1,
               page_size=10,
               total=0
            };

        }
        public async Task<bool> InsertRaiting(ProductInsertRaitingRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_insert_raiting"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return true;

                }

            }
            catch
            {
            }
            return false;

        }
    }
}
