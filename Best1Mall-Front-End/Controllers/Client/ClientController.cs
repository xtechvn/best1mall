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

namespace Best1Mall_Front_End.Controllers.Client
{
    public class ClientController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ClientServices _clientServices;
        private readonly AddressClientServices _addressClientServices;
        private readonly LocationServices _locationServices;
        private readonly IMemoryCache _cache;

        public ClientController(IConfiguration configuration, IMemoryCache cache)
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
            var result = await _addressClientServices.ForgotPassword(request);

            return Ok(new
            {
                is_success = result,
                msg = "Email hướng dẫn đổi mật khẩu sẽ được gửi đến địa chỉ email mà bạn đã nhập. <br /> vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn."
            });
        }
        public async Task<ActionResult> ChangePassword()
        {
            try
            {
                //if (string.IsNullOrEmpty(token) || token.Trim() == "")
                //{
                //    return Redirect("/Home/Notfound");
                //}
                //string forgot = EncodeHelpers.Decode(token.Replace("-", "+").Replace("_", "/"), _configuration["API:SecretKey"]);
                //if (forgot == null || forgot.Trim() == "")
                //{
                //    return Redirect("/Home/Notfound");
                //}
                //var model = JsonConvert.DeserializeObject<ClientForgotPasswordTokenModel>(forgot);
                //if (model == null || model.user_name == null)
                //{
                //    return Redirect("/Home/Notfound");
                //}

                ////var validate = await _addressClientServices.ValidateForgotPassword(new ClientForgotPasswordRequestModel() { name = token });
                ////if (!validate)
                ////{
                ////    return Redirect("/Home/Notfound");

                ////}
                //ViewBag.Token = token;
                ViewBag.type = 2;
                return View();
            }
            catch
            {

            }
            return Redirect("/Home/Notfound");


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
            request.id = model.account_client_id;
            result = await _addressClientServices.ChangePassword(request);
            var msg = "Đổi mật khẩu thành công";
            if (result != true)
            {
                msg= "Đổi mật khẩu không thành công";
            }
            return Ok(new
            {
                is_success = result,
                msg = "Đổi mật khẩu thành công"
            });
        }
    }
}
