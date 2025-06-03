namespace Best1Mall_Front_End.Models.Labels
{
    public class LabelRequestModel
    {
        public int top { get; set; }
        public string? view_name { get; set; }
        
    }
    public class ProductListByLabelFERequest
    {
        public int? supplier_id { get; set; }
        public int? label_id { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string Keyword { get; set; } = "";
        public double? PriceFrom { get; set; } = 0;
        public double? PriceTo { get; set; } = double.MaxValue;
        public float? Rating { get; set; } = 0;
        public int GroupId { get; set; } = 0;
    }

}
