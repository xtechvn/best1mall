namespace HuloToys_Front_End.Models.News
{
    public class GetNewDetailObjectResponse
    {
        public GetNewDetailResponse Details { get; set; }
        public List<ArticleResponse> MostViewedArticles { get; set; }
    }
}
