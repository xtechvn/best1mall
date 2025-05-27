using Best1Mall_Front_End.Models.Files;
using Best1Mall_Front_End.Utilities;
using Best1Mall_Front_End.Utilities.Contants;
using Newtonsoft.Json;
using System.Text;

namespace Best1Mall_Front_End.Service
{
    public class StaticAPIService
    {
        private string API_IMAGE = "https://static-image.adavigo.com/images/upload";
        private string API_VIDEO = "https://static-image.adavigo.com/Video/upload-video";
        private string STATIC_URL = "https://static-image.adavigo.com";
        private string KEY = "wVALy5t0tXEgId5yMDNg06OwqpElC9I0sxTtri4JAlXluGipo6kKhv2LoeGQnfnyQlC07veTxb7zVqDVKwLXzS7Ngjh1V3SxWz69";
        public StaticAPIService(IConfiguration configuration)
        {
            KEY = configuration["API:UploadImageKey"];
            API_IMAGE = configuration["API:UploadImage"];
            API_VIDEO = configuration["API:UploadVideo"];
            STATIC_URL = configuration["API:StaticURL"];
        }
        public async Task<string> UploadImageBase64(ImageBase64 modelImage)
        {
            try
            {
                var j_param = new Dictionary<string, string> {
                    { "data_file", modelImage.ImageData },
                    { "extend", modelImage.ImageExtension }};
                string tokenData = CommonHelper.Encode(JsonConvert.SerializeObject(j_param), KEY);
                using (HttpClient httpClient = new HttpClient())
                {
                    var contentObj = new { token = tokenData };
                    var content = new StringContent(JsonConvert.SerializeObject(contentObj), Encoding.UTF8, "application/json");
                    var result = await httpClient.PostAsync(API_IMAGE, content);
                    dynamic resultContent = Newtonsoft.Json.Linq.JObject.Parse(result.Content.ReadAsStringAsync().Result);
                    if (resultContent.status == 0)
                    {
                        return resultContent.url_path;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return null;
        }
        public async Task<string> UploadVideoFile(IFormFile videoFile, string additionalToken = null)
        {
            if (videoFile == null || videoFile.Length == 0)
            {
                Console.WriteLine("Error: Video file is null or empty.");
                return null;
            }

            using (HttpClient httpClient = new HttpClient())
            {
                // Tạo MultipartFormDataContent để gửi cả file và các trường dữ liệu khác
                using (var content = new MultipartFormDataContent())
                {
                    // 1. Thêm VideoFile
                    // Chuyển IFormFile thành StreamContent để gửi đi
                    var fileStreamContent = new StreamContent(videoFile.OpenReadStream());
                    fileStreamContent.Headers.Add("Content-Type", videoFile.ContentType); // Thiết lập Content-Type của file
                                                                                          // Tên "VideoFile" phải khớp với tên thuộc tính trong VideoUploadModel của API bạn
                    content.Add(fileStreamContent, "VideoFile", videoFile.FileName);

                    // 2. Xử lý và thêm token (nếu cần)
                    // Giả sử `additionalToken` chứa dữ liệu bạn muốn encode vào trường "token"
                    // Nếu `additionalToken` đã là chuỗi token cuối cùng, bạn có thể truyền trực tiếp.
                    // Nếu bạn cần mã hóa một dictionary thành token như ví dụ của bạn:
                    string tokenToSend = additionalToken; // Khởi tạo với giá trị truyền vào

                    if (string.IsNullOrEmpty(tokenToSend) && !string.IsNullOrEmpty(KEY))
                    {
                        // Ví dụ nếu bạn muốn tạo token từ một dictionary giống như upload ảnh:
                        // Note: Để làm được điều này, bạn cần biết dữ liệu nào cần đưa vào `j_param`
                        // Trong trường hợp upload video, thông thường token sẽ không chứa `data_file` hay `extend`
                        // mà là các thông tin xác thực khác hoặc metadata của video.
                        // Đây là ví dụ dựa trên cấu trúc bạn cung cấp, bạn cần điều chỉnh `j_param` cho phù hợp với video
                        var j_param = new Dictionary<string, string>
                        {
                            // Thêm các thông tin cần thiết vào token cho video, ví dụ:
                            // { "user_id", "123" },
                            // { "video_name", videoFile.FileName }
                        };
                        // Chú ý: CommonHelper.Encode và KEY cần được định nghĩa ở đây hoặc truyền vào
                        // Để đơn giản, tôi sẽ giả sử token được truyền trực tiếp hoặc được tạo từ `additionalToken`
                        // Nếu bạn thực sự cần mã hóa như ví dụ ảnh, bạn phải đảm bảo có `CommonHelper.Encode`
                        // tokenToSend = CommonHelper.Encode(JsonConvert.SerializeObject(j_param), KEY);
                        // Dòng trên là ví dụ, bạn cần đảm bảo logic tạo token phù hợp với yêu cầu của API video.
                    }

                    if (!string.IsNullOrEmpty(tokenToSend))
                    {
                        // Tên "token" phải khớp với tên thuộc tính trong VideoUploadModel của API bạn
                        content.Add(new StringContent(tokenToSend, Encoding.UTF8, "application/json"), "token");
                    }

                    // Thực hiện POST request
                    var result = await httpClient.PostAsync(API_VIDEO, content);

                    // Kiểm tra trạng thái HTTP response
                    result.EnsureSuccessStatusCode(); // Ném exception nếu mã trạng thái không thành công (2xx)

                    // Đọc nội dung phản hồi
                    var responseContent = await result.Content.ReadAsStringAsync();
                    dynamic resultContent = JsonConvert.DeserializeObject(responseContent);

                    if (resultContent.status == ((int)ResponseType.SUCCESS).ToString() || resultContent.status == "success") // Chuyển int sang string để so sánh
                    {
                        return resultContent.url_path;
                    }
                    else
                    {
                        Console.WriteLine($"API Error: {resultContent.message}");
                        return null;
                    }
                }
            }
        }
            
        public ImageBase64 GetImageSrcBase64Object(string imgSrc)
        {
            try
            {
                if (!string.IsNullOrEmpty(imgSrc) && imgSrc.StartsWith("data:image"))
                {
                    var ImageBase64 = new ImageBase64();
                    var base64Data = imgSrc.Split(',')[0];
                    ImageBase64.ImageData = imgSrc.Split(',')[1];
                    ImageBase64.ImageExtension = base64Data.Split(';')[0].Split('/')[1];
                    return ImageBase64;
                }
            }
            catch (FormatException)
            {

            }
            return null;
        }
        public ImageBase64 GetVideoSrcBase64Object(string imgSrc)
        {
            try
            {
                if (!string.IsNullOrEmpty(imgSrc) && imgSrc.StartsWith("data:video"))
                {
                    var ImageBase64 = new ImageBase64();
                    var base64Data = imgSrc.Split(',')[0];
                    ImageBase64.ImageData = imgSrc.Split(',')[1];
                    ImageBase64.ImageExtension = base64Data.Split(';')[0].Split('/')[1];
                    return ImageBase64;
                }
            }
            catch (FormatException)
            {

            }
            return null;
        }
    }
}
