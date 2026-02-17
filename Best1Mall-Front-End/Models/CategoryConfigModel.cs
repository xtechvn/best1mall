namespace Best1Mall_Front_End.Models
{
    public class CategoryConfigModel
    {
        public int category_id { get; set; }
        public int skip { get; set; }
        public int take { get; set; }
        public int page { get; set; }
        public int total_items { get; set; }
        public string view_name { get; set; }
        public string position_name { get; set; }
        public bool isPaging { get; set; }
    }
}
