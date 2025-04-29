namespace HuloToys_Front_End.Models.News
{
    public class GetListByTagRequest : BasePaginate
    {
        public string tag { get; set; }
    }
}
