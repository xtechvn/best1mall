
using Azure.Core;
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities.Lib;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Concurrent;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Utilities;
using static Best1Mall_Front_End.Utilities.Lib.LogHelper;


namespace WEB.Adavigo.CMS.Controllers.Notify
{
    //[CustomAuthorize]
    public class SseController : Controller
    {
        private readonly ISubscriber _subscriber;
        private readonly RedisConn redisService;
        private readonly IConfiguration _Configuration;
        private readonly AddressClientServices _addressClientServices;
        public SseController(RedisConn _redisService, IConfiguration configuration)
        {
            redisService = _redisService;
            _Configuration = configuration;
            var host = configuration["Redis:Host"];
            var port = configuration["Redis:Port"];
            var connection = ConnectionMultiplexer.Connect($"{host}:{port}");
            _subscriber = connection.GetSubscriber();
            _addressClientServices = new AddressClientServices(configuration);
        }

        //Subscriber
        //Sử dụng Server-Sent Events(SSE) để gửi dữ liệu từ máy chủ tới trình duyệt một cách không đồng bộ
        //[HttpGet]
        // public async Task getNotify()
        // {
        //     try
        //     {
        //         var user_id = -1;
        //         var dataQueue = new ConcurrentQueue<string>();
        //         if (HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) != null)
        //         {
        //             user_id = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        //             Response.Headers.Add("Content-Type", "text/event-stream");
        //             _subscriber.Subscribe("NOTIFY_" + user_id, (channel, message) =>
        //             {
        //                 dataQueue.Enqueue(message);
        //             });

        //             while (!HttpContext.RequestAborted.IsCancellationRequested)
        //             {
        //                 while (dataQueue.TryDequeue(out var message))
        //                 {
        //                     var data = $"data: {message}\n\n";
        //                     byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
        //                     await Response.Body.WriteAsync(buffer, 0, buffer.Length);
        //                     await Response.Body.FlushAsync();
        //                 }

        //                 await Task.Delay(100);
        //             }
        //         }                
        //     }
        //     catch (Exception ex)
        //     {
        //         LogHelper.InsertLogTelegram("SseController - Subscriber" + ex.ToString());               
        //     }
        // }
        // cuonglv update kiểm tra khi nào cần thoát vòng lặp. Điều này giúp tránh việc truy cập một đối tượng đã bị giải phóng khi response đã được gửi.
        [HttpGet]
        public async Task getNotify()
        {
            try
            {
                var user_id = -1;
                var dataQueue = new ConcurrentQueue<string>();
                if (HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) != null)
                {
                    var _company_type="";
                    AppSettings _appconfig = new AppSettings();
                    using (StreamReader r = new StreamReader("appsettings.json"))
                    {
                        string json = r.ReadToEnd();
                        _appconfig = JsonConvert.DeserializeObject<AppSettings>(json);
                        _company_type = _appconfig.CompanyType;
                    }
                    user_id = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                    Response.Headers.Add("Content-Type", "text/event-stream");
                    _subscriber.Subscribe("NOTIFY_" + user_id +(_company_type.Trim() == "0" ? "" : "_" + _company_type.Trim()), (channel, message) =>
                    {
                        dataQueue.Enqueue(message);
                    });

                    while (true)
                    {
                        if (HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            break;
                        }

                        while (dataQueue.TryDequeue(out var message))
                        {
                            var data = $"data: {message}\n\n";
                            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
                            await Response.Body.WriteAsync(buffer, 0, buffer.Length);
                            await Response.Body.FlushAsync();
                        }

                        await Task.Delay(20);
                    }
                }
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegramByUrl("SseController - Subscriber: " + ex.ToString());
            }
        }
        [HttpGet]
        public async Task GetCommentsStream(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.ProfileList(request);
            var requestId = result?.Id; // Lấy RequestId từ kết quả hoặc sử dụng giá trị mặc định
            Response.Headers.Add("Content-Type", "text/event-stream");
            Response.Headers.Add("X-Accel-Buffering", "no"); // nếu chạy qua nginx/reverse proxy

            var dataQueue = new ConcurrentQueue<string>();

            Console.WriteLine($"[SSE] Subscribed channel NOTIFY_{requestId}");
            _subscriber.Subscribe($"NOTIFY_{requestId}", (channel, message) =>
            {
                Console.WriteLine($"[SSE] Received from Redis: {message}");
                dataQueue.Enqueue(message);
            });


            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                while (dataQueue.TryDequeue(out var message))
                {
                    var data = $"data: {message}\n\n";
                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
                    await Response.Body.WriteAsync(buffer, 0, buffer.Length);
                    await Response.Body.FlushAsync();
                }

                await Task.Delay(100); // Giảm tải CPU
            }
        }


        [HttpGet]
        public async Task<IActionResult> TestPublishMessage()
        {
            _subscriber.Publish("NOTIFY_65", "cuonglv test ");
            return Content("DONE");

        }
    }
}
