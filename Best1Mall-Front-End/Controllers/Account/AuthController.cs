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

public class AuthController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly ClientServices _clientServices;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
        _clientServices = new ClientServices(configuration);
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
    private string GenerateAppToken(object userData)
    {
        // Implement logic tạo token ứng dụng
        return "your_app_token_here";
    }
}