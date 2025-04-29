namespace HuloToys_Front_End.Models.News
{
    public class ArticleResponse
    {
        public int id { get; set; }
        public string category_name { get; set; }
        public string title { get; set; }
        public string lead { get; set; }
        public string image_169 { get; set; }
        public string image_43 { get; set; }
        public string image_11 { get; set; }
        public string body { get; set; }
        public string image { get; set; }
        public DateTime publish_date { get; set; }
        public int? position { get; set; }
        public int? total_item { get; set; }
        public int? total_page{ get; set; }

    }
}
