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
        public string keyword { get; set; } = "";
        public int group_id { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
        public double? price_from { get; set; } = 0;  // Giá bắt đầu
        public double? price_to { get; set; } = double.MaxValue;  // Giá kết thúc
        public float? rating { get; set; } = 0;     // Sắp xếp
       
    }

}
