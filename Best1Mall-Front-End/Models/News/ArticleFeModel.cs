namespace HuloToys_Front_End.Models.News
{
    public class ArticleFeModel
    {
        public long id { get; set; }
        public string category_name { get; set; }
        public string title { get; set; }
        public string lead { get; set; }
        public string image_169 { get; set; }
        public string image_43 { get; set; }
        public string image_11 { get; set; }
        public string body { get; set; }
        public DateTime publish_date { get; set; }
        public DateTime update_last { get; set; }
        public int article_type { get; set; }
        public short? position { get; set; }
        public int status { get; set; }
        public string category_id { get; set; }
    }
}
