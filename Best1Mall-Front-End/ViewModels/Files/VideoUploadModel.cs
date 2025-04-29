using Microsoft.AspNetCore.Http;

namespace HuloToys_Front_End.ViewModels.Files
{
    public class VideoUploadModel
    {
        public IFormFile VideoFile { get; set; }
        public string token { get; set; }
    }
}
