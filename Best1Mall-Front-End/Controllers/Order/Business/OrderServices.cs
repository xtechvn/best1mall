using Best1Mall_Front_End.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Best1Mall_Front_End.Utilities.Contants;
using Models.MongoDb;
using Models.APIRequest;
using Best1Mall_Front_End.Models.Orders;
using Best1Mall_Front_End.Models.Raiting;
using Best1Mall_Front_End.Models.Cart;
using HuloToys_Service.Models.Orders;

namespace Best1Mall_Front_End.Controllers.Client.Business
{
    public class OrderServices :APIService
    {
        private readonly IConfiguration _configuration;
        public OrderServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }


        public async Task<OrderDetailResponseFEModel> GetDetail(OrdersGeneralRequestModel request)
        {
            try
            {

                var result = await POST(_configuration["API:order_detail"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderDetailResponseFEModel>(result);
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
        public async Task<string> VNPay(OrdersVNPAYRequestModel request)
        {
            try
            {
                var result = await POST("api/payment/vnpay/redirect", request);
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
        public async Task<OrderVnPayResponseModel> VNPayValidate(OrdersVNPAYValidateRequestModel request)
        {
            try
            {
                var result = await POST("api/payment/vnpay/validate", request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderVnPayResponseModel>(jsonData["data"].ToString());

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
        public async Task<OrderHistoryCountResponseModel> Count(CartGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_history_count"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<OrderHistoryCountResponseModel>(jsonData["data"].ToString());

                }

            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"],
                    "Count - OrderServices " +(_configuration["API:order_history_count"] ?? "NULL")+" ["+JsonConvert.SerializeObject(request) +"] : " + ex.ToString());

            }
            return new OrderHistoryCountResponseModel()
            {
                all=0,
                cancel=0,
                on_delivery=0,
               success=0,
               waiting_payment = 0,
               processing=0,
               refund=0

            };

        }
        public async Task<bool> UpdateAddress(OrdersUpdateAddressRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_update_address"], request);
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
        public async Task<bool> Refund(OrdersRefundRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_refund"], request);
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
        public async Task<bool> ReceivedOrder(OrdersReceivedPackageRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_receiver"], request);
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
        public async Task<bool> Cancel(OrdersRefundRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_cancel"], request);
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
