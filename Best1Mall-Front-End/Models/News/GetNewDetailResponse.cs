namespace HuloToys_Front_End.Models.News
{
    public class GetNewDetailResponse: ArticleResponse
    {
        public int status { get; set; }
        public int articleType { get; set; }
        public List<string> tags { get; set; }
        public List<int> categories { get; set; }
        public List<int> relatedArticleIds { get; set; }
        public List<ArticleResponse> relatedArticleList { get; set; }
        public int authorId { get; set; }
        public string authorName { get; set; }
        public int mainCategory { get; set; }
        public string categoryName { get; set; }
        public int category_id { get; set; }
        public DateTime downTime { get; set; }
    }
}
