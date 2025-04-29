namespace HuloToys_Front_End.Models.News
{
    public class BaseObjectResponse<T>
    {
        public int status { get; set; }
        public string msg { get; set; }
        public T data { get; set; }
    }
}
