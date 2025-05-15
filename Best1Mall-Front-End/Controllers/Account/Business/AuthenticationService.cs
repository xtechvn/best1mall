using System.Net.Mail;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Best1Mall_Front_End.Utilities.Lib;

namespace Best1Mall_Front_End.Controllers.Account.Business
{
    public class AuthenticationService
    {
        private readonly IConfiguration _configuration;
        public AuthenticationService(IConfiguration configuration) {

            _configuration=configuration;
        }
        public string GenerateAppToken(object userData)
        {
            // Implement logic tạo token ứng dụng
            return "YMvOhfBFKLUjB4yjqR5C0GDxqtzHCKAUtad2UjxQ8ZWWJ2wiLYvynV40uWXeWgFoWv5sNKCQ4klcmIcPlqn5Fb2KbeecIZ6Od0EC";
        }
        public bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }
            string emailRegex = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

            return Regex.IsMatch(email, emailRegex);
        }
        /// <summary>
        /// Gửi email xác thực đăng ký qua Gmail.
        /// </summary>
        /// <param name="recipientEmail">Địa chỉ email của người nhận.</param>
        /// <param name="verificationCode">Mã xác thực đăng ký (8 số).</param>
        /// <returns>Trả về true nếu email được gửi thành công, false nếu không.</returns>
        public async Task<bool> SendVerificationEmailAsync(string recipientEmail, string verificationCode)
        {
            // Lấy thông tin tài khoản Gmail và mật khẩu ứng dụng từ configuration.
            string gmailAccount = _configuration["Authentication:Gmail:Email"]; // Đọc từ appsettings.json
            string gmailAppPassword = _configuration["Authentication:Gmail:Password"]; // Đọc từ appsettings.json
            try
            {
                // Tạo đối tượng MailMessage để đại diện cho email.
                MailMessage message = new MailMessage();
                message.From = new MailAddress(gmailAccount, "BestMall"); // Tên hệ thống là BestMall
                message.To.Add(recipientEmail);
                message.Subject = "Xác nhận đăng ký tài khoản BestMall";
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true; // Cho phép sử dụng HTML trong nội dung email.

                // Sử dụng StringBuilder để xây dựng nội dung email một cách hiệu quả.
                StringBuilder body = new StringBuilder();
                body.AppendLine("<html><body>");
                body.AppendLine("<p>Cảm ơn bạn đã đăng ký tài khoản tại BestMall!</p>");
                body.AppendLine("<p>Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực sau:</p>");
                body.AppendLine($"<p><strong>{verificationCode}</strong></p>"); // In đậm mã xác thực.
                body.AppendLine("<p>Mã này có hiệu lực trong vòng 15 phút.</p>"); //Thêm thời gian hết hạn của mã xác thực
                body.AppendLine("<p>Trân trọng,<br>Đội ngũ BestMall</p>");
                body.AppendLine("</body></html>");
                message.Body = body.ToString();

                // Tạo đối tượng SmtpClient để gửi email qua máy chủ SMTP của Gmail.
                using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587)) // Sử dụng cổng 587 cho TLS
                {
                    smtpClient.EnableSsl = true; // Bật mã hóa SSL.
                    smtpClient.UseDefaultCredentials = false; // Không sử dụng thông tin xác thực mặc định.
                    smtpClient.Credentials = new NetworkCredential(gmailAccount, gmailAppPassword); // Cung cấp thông tin xác thực Gmail.
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network; // Chỉ định phương thức gửi email.
                                                                            // Gửi email không đồng bộ.
                    await smtpClient.SendMailAsync(message);
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "SendVerificationEmailAsync - AuthenticationService:" + ex.ToString());

                return false; // Trả về false nếu có lỗi xảy ra.
            }
        }
    }
}
