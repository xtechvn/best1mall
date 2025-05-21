using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Best1Mall_Front_End.Controllers.Client.Business;
using Best1Mall_Front_End.Models.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Best1Mall_Front_End.Utilities.Lib;
using Best1Mall_Front_End.Controllers.Account.Business;
using Best1Mall_Front_End.Utilities.contants;
using Azure.Core;
using Microsoft.Extensions.Caching.Memory;

public class AuthController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly ClientServices _clientServices;
    private readonly AuthenticationService _authenticationService;
    private readonly IMemoryCache _cache;

    public AuthController(IConfiguration configuration, IMemoryCache cache)
    {
        _configuration = configuration;
        _clientServices = new ClientServices(configuration);
        _authenticationService = new AuthenticationService(configuration);
        _cache = cache;

    }

    [HttpGet("api/Auth/GoogleSignInCallback")]
    public async Task<IActionResult> GoogleSignInCallback(string code)
    {
        if (string.IsNullOrEmpty(code))
        {
            return BadRequest("Mã ủy quyền (code) không hợp lệ.");
        }

        try
        {
            string clientId = _configuration["Authentication:Google:ClientId"];
            string clientSecret = _configuration["Authentication:Google:ClientSecret"];
            string redirectUri = _configuration["Authentication:Google:RedirectUri"];
            HttpContext.Response.Headers.Add("Cross-Origin-Opener-Policy", "same-origin");

            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = clientId,
                    ClientSecret = clientSecret
                },
                Scopes = new[] { "openid", "profile", "email" } // Các scope bạn đã yêu cầu
            });
            string domain = Request.Host.Host;
            string scheme = Request.Scheme; // Lấy giao thức (http hoặc https)
            string host = Request.Host.Value; // Lấy tên miền và cổng (ví dụ: localhost:2335)
            string fullDomain = $"{scheme}://{domain}{redirectUri}";
           // LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], 
            //    "GoogleSignInCallback - Authentication:" + fullDomain+"\nCode: "+code+ "\nClientId: " + clientId + "\nclientSecret: " + clientSecret);

            var tokenResponse = await flow.ExchangeCodeForTokenAsync("me", code, fullDomain, CancellationToken.None);

            if (string.IsNullOrEmpty(tokenResponse.IdToken))
            {
                return BadRequest("Không nhận được ID Token từ Google.");
            }

            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(tokenResponse.IdToken, settings);

            if (payload != null)
            {
                string email = payload.Email;
                string googleId = payload.Subject;

                var request = new ClientLoginRequestModel()
                {
                    user_name = email,
                    password=googleId,
                    token = googleId,
                    remember_me = true,
                    type = 2
                };

                var result = await _clientServices.Login(request);
                ViewBag.Data = Newtonsoft.Json.JsonConvert.SerializeObject(result);
                return View();
            }
            else
            {
                return BadRequest("ID Token Google không hợp lệ.");
            }
        }
        catch (InvalidJwtException ex)
        {
            return BadRequest($"ID Token Google không hợp lệ: {ex.Message}");
        }
        catch (Exception ex)
        {
            LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "GoogleSignInCallback - Authentication:" + ex.ToString());
            // Log lỗi
            return StatusCode(500, "Đã xảy ra lỗi trong quá trình đăng nhập bằng Google.");
        }
    }
    [HttpGet("api/Auth/GoogleRegisterCallback")]
    public async Task<IActionResult> GoogleRegisterCallback(string code)
    {
        if (string.IsNullOrEmpty(code))
        {
            return BadRequest("Mã ủy quyền (code) không hợp lệ.");
        }

        try
        {
            string clientId = _configuration["Authentication:Google:ClientId"];
            string clientSecret = _configuration["Authentication:Google:ClientSecret"];
            string redirectUri = _configuration["Authentication:Google:RedirectUriRegister"];
            HttpContext.Response.Headers.Add("Cross-Origin-Opener-Policy", "same-origin");
            ViewBag.Data = "";
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = clientId,
                    ClientSecret = clientSecret
                },
                Scopes = new[] { "openid", "profile", "email" } // Các scope bạn đã yêu cầu
            });
            string domain = Request.Host.Host;
            string scheme = Request.Scheme; // Lấy giao thức (http hoặc https)
            string host = Request.Host.Value; // Lấy tên miền và cổng (ví dụ: localhost:2335)
            string fullDomain = $"{scheme}://{domain}{redirectUri}";
            var tokenResponse = await flow.ExchangeCodeForTokenAsync("me", code, fullDomain, CancellationToken.None);

            if (string.IsNullOrEmpty(tokenResponse.IdToken))
            {
                return BadRequest("Không nhận được ID Token từ Google.");
            }

            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(tokenResponse.IdToken, settings);

            if (payload != null)
            {
                string email = payload.Email;
                string googleId = payload.Subject;

                var request = new ClientRegisterRequestModel()
                {
                    user_name = email,
                    password = googleId,
                    token = googleId,
                    confirm_password = googleId,
                    email = email,
                    is_receive_email = true,
                    phone=""
                };

                var result = await _clientServices.Register(request);
                if(result!=null && result.data != null)
                {
                    ViewBag.Data = Newtonsoft.Json.JsonConvert.SerializeObject(result.data);

                }
                
                return View();
            }
            else
            {
                return BadRequest("ID Token Google không hợp lệ.");
            }
        }
        catch (InvalidJwtException ex)
        {
            return BadRequest($"ID Token Google không hợp lệ: {ex.Message}");
        }
        catch (Exception ex)
        {
            LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "GoogleRegisterCallback - Authentication:" + ex.ToString());
            // Log lỗi
            return StatusCode(500, "Đã xảy ra lỗi trong quá trình đăng nhập bằng Google.");
        }
    }
    [HttpPost("api/Auth/RegisterEmailCode")]
    public async Task<IActionResult> RegisterEmailCode(string email)
    {
        try
        {
            if (string.IsNullOrEmpty(email) || !_authenticationService.IsValidEmail(email))
            {
                return BadRequest(new
                {
                    is_success = false,
                    msg = "Địa chỉ Email không chính xác, vui lòng thử lại"
                });
            }
            string code = new Random().Next(10000000, 99999999).ToString();
            var cacheKey = CacheKeys.RegisterEmailConfirm + EncodeHelpers.MD5Hash(email); // Đặt khóa cho cache
            _cache.Set(cacheKey, code, TimeSpan.FromMinutes(15));
            var success= _authenticationService.SendVerificationEmailAsync(email, code);
            return Ok(new
            {
                is_success=success,
                msg=email
            });
        }
        catch (Exception ex)
        {
            LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "RegisterEmailCode - Authentication:" + ex.ToString());
            // Log lỗi
            return StatusCode(500, "Đã xảy ra lỗi trong quá trình đăng nhập bằng Google.");
        }
    }
}