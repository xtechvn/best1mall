using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Utilities.Lib;
using Best1Mall_Front_End.Models.Address;
using Best1Mall_Front_End.Models.Location;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Caching.Memory;
using Best1Mall_Front_End.Utilities.contants;
using LIB.Models.APIRequest;
using Utilities.Contants;
using System.Reflection.Emit;
using Best1Mall_Front_End.Models.Profile;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using HuloToys_Service.Models.Client;
using Best1Mall_Front_End.Service.Redis;
using Best1Mall_Front_End.Utilities.Contants;
using System.Security.Claims;
using ENTITIES.ViewModels.Notify;
using System.Reflection;

namespace Best1Mall_Front_End.Controllers.Client
{
    public class ClientController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ClientServices _clientServices;
        private readonly RedisConn redisService;
        private readonly AddressClientServices _addressClientServices;
        private readonly LocationServices _locationServices;
        private readonly IMemoryCache _cache;

        public ClientController(IConfiguration configuration, IMemoryCache cache, RedisConn _redisService)
        {

            _configuration = configuration;
            _clientServices = new ClientServices(configuration);
            _addressClientServices = new AddressClientServices(configuration);
            _locationServices = new LocationServices(configuration);
            _cache = cache;

        }
        [HttpGet]
        [Route("token")]
        public async Task<IActionResult> Token()
        {
            var result = await _clientServices.GetToken();
            return new JsonResult(new
            {
                data = result
            });
        }
        public async Task<IActionResult> Login(ClientLoginRequestModel request)
        {
            var result = await _clientServices.Login(request);
            if (result != null)
            {
                result.ip = HttpContext.Connection.RemoteIpAddress == null ? "Unknown" : HttpContext.Connection.RemoteIpAddress.ToString();
            }
            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }

        public async Task<IActionResult> Register(ClientRegisterRequestModel request)
        {
            var cacheKey = CacheKeys.RegisterEmailConfirm + EncodeHelpers.MD5Hash(request.email);
            if (!_cache.TryGetValue(cacheKey, out string confirm_code)) // Kiểm tra xem có trong cache không
            {
                return Ok(new
                {
                    is_success = false,
                    data = new ClientRegisterResponseModel()
                    {
                        code = ResponseCode.OTPNotCorrect,
                        msg = "Email chưa được xác nhận, vui lòng nhấn [Gửi mã xác thực] và thử lại"
                    }
                });
            }
            int otp_code_input = -1;
            int correct_otp = -1;
            if (!int.TryParse(confirm_code, out correct_otp))
            {
                return Ok(new
                {
                    is_success = false,
                    data = new ClientRegisterResponseModel()
                    {
                        code = ResponseCode.OTPNotCorrect,
                        msg = "Email chưa được xác nhận, vui lòng nhấn [Gửi mã xác thực] và thử lại"
                    }
                });
            }
            if (request.otp_code == null || request.otp_code.Trim() == null
                || !int.TryParse(request.otp_code, out otp_code_input) || otp_code_input < 10000000 || otp_code_input != correct_otp)
            {

                return Ok(new
                {
                    is_success = false,
                    data = new ClientRegisterResponseModel()
                    {
                        code = ResponseCode.OTPNotCorrect,
                        msg = "Mã xác thực không khớp, vui lòng kiểm tra lại Email"
                    }
                });
            }
            request.user_name = StringHelpers.CleanName(request.user_name);
            var result = await _clientServices.Register(request);
            try { _cache.Remove(cacheKey); } catch { }
            return Ok(new
            {
                is_success = (result != null && result.data != null),
                data = result
            });
        }

        public ActionResult Address()
        {
            return View();

        }
        public ActionResult Profile()
        {
            return View();

        }
        public async Task<IActionResult> ProfileList(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.ProfileList(request);

            return Ok(new
            {
                is_success = (result),
                data = result
            });
        }
        [HttpPost]
        public async Task<IActionResult> Notify(int pageindex, int pagesize ,string token)
        {
            try
            {
                var request = new ClientAddressGeneralRequestModel
                {
                    token = token
                };

                var profile = await _addressClientServices.ProfileList(request);
                var _UserId = profile?.Id; // Lấy RequestId từ kết quả hoặc sử dụng giá trị mặc định

                int db_index = Convert.ToInt32(_configuration["Redis:Database:db_common"]);

                var lst_Notify = new NotifySummeryViewModel();

                //lấy từ api
                var ListNotify = await _clientServices.GetListNotify(_UserId.ToString(), pageindex, pagesize);
                lst_Notify = ListNotify;
                return Ok(new
                {
                    status = (int)ResponseType.SUCCESS,
                    data = lst_Notify != null ? lst_Notify : null
                });
            }
            catch (Exception ex)
            {
                //string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                //Utilities.LogHelper.InsertLogTelegramByUrl(_configuration["log_telegram:token"], _configuration["log_telegram:group_id"], error_msg);
                //return null;

            }
            return Ok(new
            {
                status = (int)ResponseType.ERROR,
                data = new List<NotifySummeryViewModel>()
            });
        }
        [HttpPost]
        public async Task<IActionResult> updateNotify(string id, string seen_status,string token)
        {
            try
            {
                var request = new ClientAddressGeneralRequestModel
                {
                    token = token
                };
                var profile = await _addressClientServices.ProfileList(request);
                var _UserId = profile?.Id; // Lấy RequestId từ kết quả hoặc sử dụng giá trị mặc định

               

                var UpdateNotify = await _clientServices.UpdateNotify(id, _UserId.ToString(), seen_status);
                if (UpdateNotify == 0)
                    return Ok(new
                    {
                        status = (int)ResponseType.SUCCESS,

                    });

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(_configuration["log_telegram:token"], _configuration["log_telegram:group_id"], error_msg);
                return null;

            }
            return Ok(new
            {
                status = (int)ResponseType.ERROR,

            });
        }
        public async Task<IActionResult> UpdateProfile(ProfileUpdateRequestModel request)
        {
            var result = await _addressClientServices.UpdateProfile(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public ActionResult AddressPopup()
        {
            return View();
        }
        public async Task<IActionResult> AddressList(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.Listing(request);

            return Ok(new
            {
                is_success = (result != null && result.list != null && result.list.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> AddressDetail(ClientAddressDetailRequestModel request)
        {
            var result = await _addressClientServices.Detail(request);

            return Ok(new
            {
                is_success = (result != null && result.Id > 0),
                data = result
            });
        }
        public async Task<IActionResult> Province(LocationRequestModel request)
        {
            var result = await _locationServices.Province(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> District(LocationRequestModel request)
        {
            var result = await _locationServices.District(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> Ward(LocationRequestModel request)
        {
            var result = await _locationServices.Ward(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> SubmitAddress(AddressUpdateRequestModel request)
        {
            var result = await _addressClientServices.CreateOrUpdate(request);

            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }
        public async Task<IActionResult> DefaultAddress(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.DefaultAddress(request);

            return Ok(new
            {
                is_success = (result != null),
                data = result
            });
        }
        public async Task<IActionResult> ForgotPassword(ClientForgotPasswordRequestModel request)
        {
           
            var result =  _addressClientServices.ForgotPassword(request);

            return Ok(new
            {
                is_success = result,
                msg = "Email hướng dẫn đổi mật khẩu sẽ được gửi đến địa chỉ email mà bạn đã nhập. <br /> vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn."
            });
        }
        public async Task<IActionResult> SendChangePassword(CientSendGmailRequestModel request)
        {
            var result = await _addressClientServices.SendChangePassword(request);

            return Ok(new
            {
                is_success = result,
                msg = "Email hướng dẫn đổi mật khẩu đã được gửi đến địa chỉ email"
            });
        }
        public async Task<ActionResult> ChangePassword()
        {
            try
            {
               
                ViewBag.type = 2;
                ViewBag.Uuid = Guid.NewGuid().ToString();
                return View();
            }
            catch
            {

            }
            return Redirect("/Home/Notfound");


        }
        [HttpGet("/account/change-password/{token}")]
        public IActionResult ChangePasswordConfirm(string token)
        {
            ViewBag.Token = token;
            return View("ChangePasswordConfirm");
        }
        public async Task<IActionResult> ValidateChangePasswordToken(ValidateChangePasswordTokenRequest request)
        {
            var result = await _addressClientServices.ValidateChangePasswordToken(request);

            return Ok(new
            {
                is_success = result,
                msg = "Xác thực người dùng không đúng !!!"
            });
        }
        public async Task<IActionResult> ConfirmChangePassword(ClientChangePasswordRequestModel request)
        {
            bool result = false;
            if (string.IsNullOrEmpty(request.token) || request.token.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            string forgot = EncodeHelpers.Decode(request.token.Replace("-", "+").Replace("_", "/"), _configuration["API:SecretKey"]);
            if (forgot == null || forgot.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            var model = JsonConvert.DeserializeObject<ClientForgotPasswordTokenModel>(forgot);
            if (model == null || model.user_name == null )
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            //var validate = await _addressClientServices.ValidateForgotPassword(new ClientForgotPasswordRequestModel() { name = request.token });
            //if (!validate)
            //{
            //    return Ok(new
            //    {
            //        is_success = result,
            //        msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

            //    });

            //}
            result = await _addressClientServices.ChangePassword(request);
            var msg = "Đổi mật khẩu thành công";
            if (result != true)
            {
                msg= "Đổi mật khẩu không thành công";
            }
            return Ok(new
            {
                is_success = result,
                msg = msg
            });
        }
        [HttpGet]
        [Route("/doi-mat-khau/{token}")]

        public async Task<ActionResult> ForgotPasswordChangePassword(string token)
        {
            ViewBag.Token = token;
            try
            {
                if(token==null || token.Trim() == "")
                {
                    return Redirect("/Home/Notfound");

                }
                var result = await _addressClientServices.ValidateForgotPassword(new ClientForgotPasswordRequestModel()
                {
                    name=token
                });
                if (result==null ||result.Trim()=="")
                {
                    return Redirect("/Home/Notfound");
                }
                ViewBag.Token = result;
                return View();
            }
            catch
            {

            }
            return Redirect("/Home/Notfound");


        }
        public async Task<IActionResult> ClientForgotChangePasswordRequestModel(ClientForgotChangePasswordRequestModel request)
        {
            bool result = false;
            if (string.IsNullOrEmpty(request.token_forgot_password) || request.token_forgot_password.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            string forgot = EncodeHelpers.Decode(request.token_forgot_password.Replace("-", "+").Replace("_", "/"), _configuration["API:SecretKey"]);
            if (forgot == null || forgot.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            if (request.password == null ||request.password.Trim() == ""
                || request.confirm_password == null || request.confirm_password.Trim() == ""
                || request.confirm_password != request.password
                )
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Mật khẩu và xác nhận mật khẩu không được để trống và phải giống nhau"

                });
            }
            var model = JsonConvert.DeserializeObject<ClientForgotPasswordTokenModel>(forgot);
            if (model == null || model.user_name == null)
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            ClientForgotChangePasswordRequestModel model_change_password = new ClientForgotChangePasswordRequestModel()
            {
                confirm_password=request.confirm_password,
                password=request.password,
                account_client_id=model.account_client_id,
                client_id=model.client_id,
                token_forgot_password= request.token_forgot_password.Replace("-", "+").Replace("_", "/")
            };
            result = await _addressClientServices.ForgotChangePassword(model_change_password);
            var msg = "Đổi mật khẩu thành công";
            if (result != true)
            {
                msg = "Đổi mật khẩu không thành công";
            }
            return Ok(new
            {
                is_success = result,
                msg = msg
            });
        }
    }
}
