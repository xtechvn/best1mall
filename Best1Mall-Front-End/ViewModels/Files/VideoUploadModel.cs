using Microsoft.AspNetCore.Http;

namespace Best1Mall_Front_End.ViewModels.Files
{
    public class VideoUploadModel
    {
        public IFormFile VideoFile { get; set; }
        public string token { get; set; }
    }
}
