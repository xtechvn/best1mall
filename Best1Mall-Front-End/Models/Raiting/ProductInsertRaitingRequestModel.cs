using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Best1Mall_Front_End.Models.Raiting
{
    public class ProductInsertRaitingRequestModel
    {
        public long order_id { get; set; }
        public string product_id { get; set; }
        public string token { get; set; }
        public float star { get; set; }
        public string comment { get; set; }
        public string img_link { get; set; }
        public string video_link { get; set; } 
        public List<string> img_links { get; set; }
        public List<string> video_links { get; set; }
    }
}
