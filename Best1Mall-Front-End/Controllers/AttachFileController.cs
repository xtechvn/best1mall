using Best1Mall_Front_End.Models;
using Best1Mall_Front_End.Models.Files;
using Best1Mall_Front_End.Service;
using Best1Mall_Front_End.Utilities.Contants;
using Best1Mall_Front_End.Utilities.Lib;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Best1Mall_Front_End.Controllers
{
    public class AttachFileController : Controller
    {
        private readonly IWebHostEnvironment _WebHostEnvironment;
        private readonly StaticAPIService staticAPIService;
        private readonly IConfiguration _configuration;
        private readonly string static_domain = "";
        public AttachFileController(IWebHostEnvironment hostEnvironment, IConfiguration configuration)
        {
            _WebHostEnvironment = hostEnvironment;
            staticAPIService = new StaticAPIService(configuration);
            _configuration = configuration;
            static_domain = configuration["API:StaticURL"];

        }

        public async Task<IActionResult> Upload(IFormFile[] files)
        {
            try
            {
                var _UserLogin = 0;
                if (HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) != null)
                {
                    _UserLogin = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                }

                List<string> urls = new List<string>();
                if (files != null && files.Length > 0)
                {
                    foreach (var file in files)
                    {
                        string _FileName = file.FileName;
                        string _UploadFolder = (@"uploads/images/" + _UserLogin).Replace("/", "\\");
                        string _UploadDirectory = Path.Combine(_WebHostEnvironment.WebRootPath, _UploadFolder);

                        if (!Directory.Exists(_UploadDirectory))
                        {
                            Directory.CreateDirectory(_UploadDirectory);
                        }
                        string filePath = _UploadDirectory + "\\" + _FileName;
                        if (!System.IO.File.Exists(filePath))
                        {
                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream);
                            }
                        }
                        urls.Add("\\" + _UploadFolder + "\\" + _FileName);
                    }
                }

                if (urls != null && urls.Count > 0)
                {
                    return new JsonResult(new
                    {
                        status = (int)ResponseType.SUCCESS,
                        msg = "Thành công",
                        data = urls
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        status = (int)ResponseType.FAILED,
                        msg = "Tải tệp đính kèm thất bại",
                        data = urls
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "Upload-AttachFileController:" + ex.ToString());

            }
            return new JsonResult(new
            {
                status = (int)ResponseType.FAILED,
                msg = "Lỗi trong quá trình tải lên tệp đính kèm, vui lòng liên hệ IT.",
            });
        }
        [HttpPost]

        public async Task<IActionResult> UploadVideo(IFormFile[] files)
        {
            try
            {
                var _UserLogin = 0;
                // Lấy UserLogin từ Claims (nếu có)
                if (HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) != null)
                {
                    _UserLogin = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                }

                List<string> urls = new List<string>();
                List<string> errors = new List<string>(); // Để lưu các lỗi cụ thể cho từng file

                if (files != null && files.Length > 0)
                {
                    foreach (var file in files)
                    {
                        // 1. Validate file extension
                        string fileExtension = Path.GetExtension(file.FileName).ToLower();
                        if (fileExtension != ".mp4")
                        {
                            errors.Add($"File '{file.FileName}' không phải là định dạng .mp4 được hỗ trợ.");
                            continue; // Bỏ qua file này và chuyển sang file tiếp theo
                        }

                        // 2. Validate file size (100MB = 100 * 1024 * 1024 bytes)
                        const long MaxFileSize = 100 * 1024 * 1024; // 100 MB
                        if (file.Length > MaxFileSize)
                        {
                            errors.Add($"File '{file.FileName}' có kích thước quá lớn. Kích thước tối đa cho phép là 100MB.");
                            continue; // Bỏ qua file này và chuyển sang file tiếp theo
                        }

                        // Tạo đường dẫn lưu trữ
                        string _FileName = Path.GetFileName(file.FileName); // Lấy tên file gốc
                                                                            // Có thể thêm Guid vào tên file để tránh trùng lặp
                                                                            // string _FileName = Guid.NewGuid().ToString() + fileExtension;

                        // Thư mục upload sẽ là wwwroot/uploads/videos/{UserLogin}
                        string _UploadFolder = Path.Combine("uploads", "videos", _UserLogin.ToString());
                        // Đảm bảo sử dụng Path.Combine để xử lý đúng dấu phân cách thư mục trên các OS khác nhau
                        string _UploadDirectory = Path.Combine(_WebHostEnvironment.WebRootPath, _UploadFolder);

                        // Kiểm tra và tạo thư mục nếu chưa tồn tại
                        if (!Directory.Exists(_UploadDirectory))
                        {
                            Directory.CreateDirectory(_UploadDirectory);
                        }

                        // Đường dẫn đầy đủ của file trên server
                        string filePath = Path.Combine(_UploadDirectory, _FileName);

                        // Tùy chọn: Xử lý trường hợp file đã tồn tại
                        // Nếu bạn muốn ghi đè, bỏ qua điều kiện `!System.IO.File.Exists(filePath)`
                        // Nếu bạn muốn đổi tên (ví dụ: thêm _copy, _1), bạn cần thêm logic ở đây
                        if (!System.IO.File.Exists(filePath))
                        {
                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream); // Lưu file vào server
                            }
                            // Thêm URL tương đối để trả về cho client
                            
                        }
                        urls.Add($"/{_UploadFolder.Replace("\\", "/")}/{_FileName}"); // Sử dụng '/' cho URL
                    }
                }

                if (urls.Any()) // Nếu có ít nhất một file được upload thành công
                {
                    return new JsonResult(new
                    {
                        status = (int)ResponseType.SUCCESS,
                        msg = "Tải lên video thành công.",
                        data = urls,
                        errors = errors.Any() ? errors : null // Trả về lỗi nếu có file nào đó không thành công
                    });
                }
                else // Không có file nào được upload thành công
                {
                    return new JsonResult(new
                    {
                        status = (int)ResponseType.FAILED,
                        msg = "Tải lên video thất bại. Không có video nào được tải lên hoặc tất cả đều có lỗi.",
                        errors = errors.Any() ? errors : new List<string> { "Không có file nào được chọn để tải lên." }
                    });
                }
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                // Đảm bảo LogHelper và cấu hình BotSetting:bot_token, BotSetting:bot_group_id được thiết lập đúng
                // LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "UploadVideo-VideoController:" + ex.ToString());
                Console.WriteLine($"Error in UploadVideo: {ex.Message}"); // Log ra console để dễ debug
                return new JsonResult(new
                {
                    status = (int)ResponseType.FAILED,
                    msg = "Lỗi trong quá trình tải lên video, vui lòng liên hệ IT.",
                    detailedError = ex.Message // Chỉ nên trả về trong môi trường phát triển
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmAttachFile(List<AttachfileViewModel> files)
        {
            try
            {
                List<AttachfileViewModel> urls = new List<AttachfileViewModel>();
                if (files != null && files.Count > 0)
                {



                    foreach (var file in files)
                    {
                        if (file.id > 0 && file.path.Contains(static_domain)) { continue; }
                        string full_path = Directory.GetCurrentDirectory() + "\\wwwroot\\" + file.path.Replace("/", "\\");
                        try
                        {
                            // Đọc toàn bộ nội dung của file ảnh dưới dạng byte array
                            byte[] imageBytes = System.IO.File.ReadAllBytes(full_path);

                            // Chuyển đổi byte array thành chuỗi Base64
                            string base64String = Convert.ToBase64String(imageBytes);

                            var path = file.path.Split(".");

                            ImageBase64 image = new()
                            {
                                ImageData = base64String,
                                ImageExtension = path[path.Length - 1]
                            };
                            var url = await staticAPIService.UploadImageBase64(image);
                            if (url != null && url.Trim() != "")
                            {
                                file.path = static_domain + url;
                                urls.Add(file);
                            }
                            try { System.IO.File.Delete(full_path); } catch { }


                        }
                        catch
                        {
                            continue;
                        }
                    }

                }

                return Ok(new
                {
                    status = (int)ResponseType.SUCCESS,
                    msg = "Thành công",
                    data = urls
                });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "ConfirmAttachFile-AttachFileController:" + ex.ToString());

            }
            return Ok(new
            {
                status = (int)ResponseType.FAILED,
                msg = "Failed"
            });
        }
        [HttpPost]
        public async Task<IActionResult> ConfirmVideo(List<AttachfileViewModel> files)
        {
            try
            {
                List<AttachfileViewModel> urls = new List<AttachfileViewModel>();
                if (files != null && files.Count > 0)
                {
                    foreach (var file in files)
                    {
                        string full_path = Directory.GetCurrentDirectory() + "\\wwwroot\\" + file.path.Replace("/", "\\");

                        using (var stream = System.IO.File.OpenRead(full_path))
                        {
                            var formFile = new FormFile(stream, 0, stream.Length, "VideoFile", Path.GetFileName(full_path))
                            {
                                Headers = new HeaderDictionary(),
                                ContentType = "video/mp4" // Thay bằng Content-Type phù hợp với video của bạn
                            };

                            string uploadedUrl = await staticAPIService.UploadVideoFile(formFile, "GxQWDx9xJ0lVDR0eHxEWHF4aHh10aF9f");
                            if (uploadedUrl != null)
                            {
                                Console.WriteLine($"Video uploaded successfully! URL: {uploadedUrl}");
                            }
                            else
                            {
                                Console.WriteLine("Video upload failed.");
                            }
                        }
                    }

                }

                return Ok(new
                {
                    status = (int)ResponseType.SUCCESS,
                    msg = "Thành công",
                    data = urls
                });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "ConfirmAttachFile-AttachFileController:" + ex.ToString());

            }
            return Ok(new
            {
                status = (int)ResponseType.FAILED,
                msg = "Failed"
            });
        }
    }
}
